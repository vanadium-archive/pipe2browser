// Copyright 2015 The Vanadium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { exists } from 'libs/utils/exists'
import { View } from 'libs/mvc/view'

/*
 * View representing the help page
 * @class
 * @extends {View}
 */
export class HelpView extends View {
	constructor(serviceState) {
		var el = document.createElement('p2b-help');
    el.serviceState = serviceState;
		super(el);
	}
}
