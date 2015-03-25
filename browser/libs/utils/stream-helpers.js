// Copyright 2015 The Vanadium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { default as es } from "npm:event-stream"

export var streamUtil = {
  split: es.split,
  map: es.map,
  writeArray: es.writeArray
};
