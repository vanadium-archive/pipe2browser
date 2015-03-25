// Copyright 2015 The Vanadium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/*
 * Holds references to runtime context but instead of one big context object
 * different context are exposed as their own object allowing other modules
 * just pick the context they need.
 * @fileoverview
 */

import { PageView } from 'views/page/view'
import { PipesView } from 'views/pipes/view'

/*
 * Reference to the current page view object constructed by the application
 * @type {View}
 */
export var page = new PageView();

/*
 * Reference to the current pipes view object constructed by the application
 * @type {View}
 */
export var pipesViewInstance = new PipesView();
