// Copyright 2015 The Vanadium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { View } from 'libs/mvc/view'

/*
 * View representing the state and interaction for publishing the p2b service.
 * @class
 * @extends {View}
 */
export class StatusView extends View {
	constructor(serviceState) {
		var el = document.createElement('p2b-status');
		el.serviceState = serviceState;
		super(el);
	}

/*
 * Event representing user's intention to stop the published service
 * @event
 */
  onStopAction(eventHandler) {
    this.element.addEventListener('stop', () => {
      eventHandler();
    });
  }
}
