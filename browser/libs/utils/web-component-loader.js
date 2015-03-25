// Copyright 2015 The Vanadium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

export function importComponent(path) {
	return new Promise((resolve, reject) => {
		var link = document.createElement('link');
		link.setAttribute('rel', 'import');
		link.setAttribute('href', path);
		link.onload = function() {
		  resolve();
		};
		document.body.appendChild(link);
	});
}
