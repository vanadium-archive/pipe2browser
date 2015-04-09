// Copyright 2015 The Vanadium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/*
 * Image is a Pipe Viewer that displays an image
 * @tutorial cat image.jpg | p2b users/jane@google.com/chrome/p2b/[name]/image
 * @fileoverview
 */

import { View } from 'view';
import { PipeViewer } from 'pipe-viewer';

class ImagePipeViewer extends PipeViewer {
  get name() {
    return 'image';
  }

  play(stream) {
    var viewPromise = new Promise(function(resolve,reject) {
      var blobParts = [];
      stream.on('data', (chunk) => {
        blobParts.push(new Uint8Array(chunk));
      });

      stream.on('end', () => {
        var image = document.createElement('img');
        image.style.width = '100%';
        var url = URL.createObjectURL(new Blob(blobParts));
        image.src = url;
        resolve(new View(image));
      });
    });

    return viewPromise;
  }
}

export default ImagePipeViewer;
