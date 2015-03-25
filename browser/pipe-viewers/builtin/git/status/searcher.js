// Copyright 2015 The Vanadium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

export function gitStatusSearch(item, keyword) {
  if (!keyword) {
    return true;
  }

  // we only search file
  if (item.file.indexOf(keyword) >= 0) {
    return true
  }

  return false;
};
