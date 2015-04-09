// Copyright 2015 The Vanadium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/*
 * dev/null simply consumes the stream without taking any action on the data
 * or keeping it in memory
 * @tutorial echo "To the black hole!" | p2b users/jane@google.com/chorme/p2b/[name]/dev/null
 * @fileoverview
 */

import { View } from 'view';
import { PipeViewer } from 'pipe-viewer';

class DevNullPipeViewer extends PipeViewer {
  get name() {
    return 'dev/null';
  }

  play(stream) {

    var blackhole = document.createElement('p2b-blackhole');
    blackhole.start();

    stream.on('data', () => {
      // consume the stream
    });

    stream.on('end', () => {
      blackhole.stop();
    });

    return new View(blackhole);
  }
}

export default DevNullPipeViewer;
