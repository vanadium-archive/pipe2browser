// Copyright 2015 The Vanadium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { View } from 'libs/mvc/view'

/*
 * View displaying a list of currently published Pipe2Browsers instances
 * @class
 * @extends {View}
 */
export class NeighborhoodView extends View {
	constructor() {
		var el = document.createElement('p2b-neighborhood');
		super(el);
	}

 /*
  * List of existing names to show
  * @type {Array<string>}
  */
  set existingNames(val)  {
    this.element.existingNames = val;
  }
}
