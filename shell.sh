#!/bin/bash
# Copyright 2015 The Vanadium Authors. All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

readonly DIR=$(dirname $0)
export V23_CREDENTIALS="${DIR}/credentials"

main() {
  if [[ -d "${DIR}/credentials" ]]
  then
    ${JIRI_ROOT}/release/go/bin/agentd bash
  else
    ${JIRI_ROOT}/release/go/bin/agentd bash -c "${JIRI_ROOT}/release/go/bin/principal seekblessings && exec bash"
  fi
}

main "$@"
