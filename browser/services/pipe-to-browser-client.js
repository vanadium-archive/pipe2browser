// Copyright 2015 The Vanadium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/*
 * Implements a vanadium client that can talk to a P2B service.
 * @fileoverview
 */
import { Logger } from 'libs/logs/logger'
import vanadium from 'vanadium'

var log = new Logger('services/p2b-client');

/*
 * Pipes a stream of data to the P2B service identified
 * by the given vanadium name.
 * @param {string} name Veyron name of the destination service
 * @param {Stream} Stream of data to pipe to it.
 * @return {Promise} Promise indicating if piping was successful or not
 */
export function pipe(name, stream) {
  return vanadium.init().then((runtime) => {
    var client = runtime.newClient();
    var ctx = runtime.getContext().withTimeout(5000);
    ctx.waitUntilDone(function(){});
    return client.bindTo(ctx, name).then((remote) => {
      var remoteStream = remote.pipe(ctx).stream;
      stream.pipe(remoteStream);
      return Promise.resolve();
    });
  });
}
