/*
 * Implements a veyron client that can talk to a P2B service.
 * @fileoverview
 */
import { Logger } from 'libs/logs/logger'
import veyron from 'veyronjs'

var log = new Logger('services/p2b-client');

/*
 * Pipes a stream of data to the P2B service identified
 * by the given veyron name.
 * @param {string} name Veyron name of the destination service
 * @param {Stream} Stream of data to pipe to it.
 * @return {Promise} Promise indicating if piping was successful or not
 */
export function pipe(name, stream) {
  return veyron.init().then((runtime) => {
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
