// Copyright 2015 The Vanadium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/*
 * Implements and publishes a Vanadium service which accepts streaming RPC
 * requests and delegates the stream back to the provided pipeRequestHandler.
 * It also exposes the state of the service.
 * @fileoverview
 */
import { Logger } from 'libs/logs/logger'
import { ByteObjectStreamAdapter } from 'libs/utils/byte-object-stream-adapter'
import { StreamByteCounter } from 'libs/utils/stream-byte-counter'
import { StreamCopy } from 'libs/utils/stream-copy'
import { get as getPipeViewer } from 'pipe-viewers/manager'
import vanadium from 'vanadium'
import vdl from 'services/v.io/x/p2b/vdl/index'

var log = new Logger('services/p2b-server');
var server;

// State of p2b service
export var state = {
  init() {
    this.published = false;
    this.publishing = false;
    this.stopping = false;
    this.fullServiceName = null;
    this.date = null;
    this.numPipes = 0;
    this.numBytes = 0;
  },
  reset() {
    state.init();
  }
};
state.init();

/*
 * Publishes the p2b service under users/jane@google.com/chrome/p2b/{name} e.g. If
 * name is "john-tablet", p2b service will be accessible under name:
 * 'users/jane@google.com/chrome/p2b/john-tablet'
 *
 * pipe() method can be invoked on any
 * 'users/jane@google.com/chrome/p2b/{name}/suffix' name where suffix identifies the
 * viewer that can format and display the stream data e.g.
 * 'users/jane@google.com/chrome/p2b/john-tablet/console'.pipe() will display the
 * incoming data in a data table. See /app/viewer/ for a list of available
 * viewers.
 * @param {string} name Name to publish the service under
 * @param {function} pipeRequestHandler A function that will be called when
 * a request to handle a pipe stream comes in.
 * @return {Promise} Promise that will resolve or reject when publish completes
 */
export function publish(name, pipeRequestHandler) {
  log.debug('publishing under name:', name);

  /*
   * Vanadium pipe to browser service implementation.
   * Implements the p2b VDL.
   */
  class Service extends vdl.Viewer {
    constructor() {
      super();
    }

    pipe(ctx, serverCall, $stream) {
      var secCall = serverCall.securityCall;
      // Since p2b's suffixes can be an arbitrary string representing a plugin name or address,
      // we expect them to come in encoded so we can handle / in the plugin names as well.
      var plugin = vanadium.naming.decodeAsNameElement(secCall.suffix);
      return new Promise(function(resolve, reject) {
        log.debug('received pipe request for:', plugin);
        var numBytesForThisCall = 0;

        var bufferStream = new ByteObjectStreamAdapter();
        var streamByteCounter = new StreamByteCounter((numBytesRead) => {
          // increment total number of bytes received and total for this call
          numBytesForThisCall += numBytesRead;
          state.numBytes += numBytesRead;
        });

        var streamCopier = $stream.pipe(new StreamCopy());
        var stream = streamCopier.pipe(bufferStream).pipe(streamByteCounter);
        stream.copier = streamCopier;

        streamByteCounter.on('end', () => {
          log.debug('end of stream');
          // send total number of bytes received for this call as final result
          resolve();
        });

        stream.on('error', (e) => {
          log.debug('stream error', e);
          // TODO(aghassemi) envyor issue #50
          // we want to reject but because of #50 we can't
          // reject('Browser P2B threw an exception. Please see browser console for details.');
          // reject(e);
          resolve();
        });

        state.numPipes++;
        try {
          pipeRequestHandler(plugin, stream);
        } catch(e) {
          // TODO(aghassemi) envyor issue #50
          // we want to reject but because of #50 we can't
          // reject('Browser P2B threw an exception. Please see browser console for details.');
          log.debug('pipeRequestHandler error', e);
          resolve();
        }
      });
    }
  }

  var p2b = new Service();
  var dispatcher = function(suffix) {
    // Since p2b's suffixes can be an arbitrary string representing a plugin name or address,
    // we expect them to come in encoded so we can handle / in the plugin names as well.
    suffix = vanadium.naming.decodeAsNameElement(suffix);

    // Ensure we can handle the suffix
    return getPipeViewer(suffix).then(() => {
      var defaultAuthorizer = null;
      return {
        service: p2b,
        // TODO(aghassemi) For now we only allow p2b to talk to instances running
        // under the default authorizer
        authorizer: defaultAuthorizer
      };
    }).catch(() => {
      return Promise.reject(
        new Error(suffix + " plugin does not exist.")
      );
    });
  }

  state.publishing = true;

  return vanadium.init().then((runtime) => {
    server = runtime.newServer();
    // the blessing name for the account is dev.v.io.io/u/<email>/<something>.
    // the object name we want to publish under is users/<email>/<something>/p2b/<name>.
    // So, replace "dev.v.io/u/" with "users/".
    var nsPrefix = runtime.accountName.replace('dev.v.io/u/', 'users/');
    var serviceName = vanadium.naming.join(nsPrefix, 'p2b', name);

    return server.serveDispatcher(serviceName, dispatcher).then(() => {
      log.debug('published!');

      state.published = true;
      state.publishing = false;
      state.fullServiceName = serviceName;
      state.date = new Date();

      return;
    });
  }).catch(function(err) {
    if (err instanceof vanadium.verror.ExtensionNotInstalledError) {
      vanadium.extension.promptUserToInstallExtension();
      return;
    } else {
      state.reset();
      throw err;
    }
  });
}

/*
 * Stops the service and unpublishes it, effectively destroying the service.
 * @return {Promise} Promise that will resolve or reject when stopping completes
 */
export function stopPublishing() {
  log.debug('stopping service');
  state.stopping = true;
  return server.stop().then(function() {
    log.debug('service stopped');
    state.reset();
    return;
  });
}
