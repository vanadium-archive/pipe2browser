// Copyright 2015 The Vanadium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

export function vLogSearch(logItem, keyword) {
  if (!keyword) {
    return true;
  }

  // we do a contains for message, file and threadId fields only
  if (logItem.message.indexOf(keyword) >= 0 ||
    logItem.file.indexOf(keyword) >= 0 ||
    logItem.threadId.toString().indexOf(keyword) >= 0) {
    return true
  }

  return false;
};
