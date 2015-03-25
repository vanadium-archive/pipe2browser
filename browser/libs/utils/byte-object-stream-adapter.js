// Copyright 2015 The Vanadium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { default as Stream } from "stream"
import { default as buffer } from "buffer"

var Transform = Stream.Transform;
var Buffer = buffer.Buffer;

/*
 * Adapts a stream of byte arrays in object mode to a regular stream of Buffer
 * @class
 */
export class ByteObjectStreamAdapter extends Transform {
  constructor() {
    super();
    this._writableState.objectMode = true;
    this._readableState.objectMode = false;
  }

  _transform(bytesArr, encoding, cb) {
    var buf = new Buffer(new Uint8Array(bytesArr));
    this.push(buf);

    cb();
  }
}
