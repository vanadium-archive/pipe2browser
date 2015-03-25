// Copyright 2015 The Vanadium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/*
 * Navigates to help page
 * @fileoverview
 */
import { Logger } from 'libs/logs/logger'
import { register, trigger } from 'libs/mvc/actions'

import { state as publishState } from 'services/pipe-to-browser-server'

import { page } from 'runtime/context'

import { HelpView } from 'views/help/view'

var log = new Logger('actions/navigate-help');
var ACTION_NAME = 'help';

/*
 * Registers the action
 */
export function registerHelpAction() {
  register(ACTION_NAME, actionHandler);
}

/*
 * Triggers the action
 */
export function navigateHelp() {
  return trigger(ACTION_NAME);
}

/*
 * Handles the action.
 *
 * @private
 */
function actionHandler() {
  log.debug('navigate help triggered');

  // create a help view
  var helpView = new HelpView(publishState);

  page.setSubPageView('help', helpView);
}
