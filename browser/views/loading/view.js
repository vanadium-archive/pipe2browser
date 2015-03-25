// Copyright 2015 The Vanadium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { View } from 'libs/mvc/view'

/*
 * View representing a loading indicator
 * @class
 * @extends {View}
 */
export class LoadingView extends View {
  constructor() {
    var el = document.createElement('p2b-loading');
    super(el);
  }
}
