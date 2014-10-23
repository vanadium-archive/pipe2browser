#!/bin/bash

source "${VEYRON_ROOT}/scripts/lib/shell.sh"

export PATH="node_modules/.bin:${VEYRON_ROOT}/veyron/go/bin:${PATH}"

main() {
  local -r VEYRON_PROXY_ADDR=proxy.envyor.com:8100
  local -r VEYRON_WSPR_PORT=7776
  local -r HTTP_PORT=8080
  local -r NAMESPACE_ROOT=/proxy.envyor.com:8101

  trap "kill -TERM 0" SIGINT SIGTERM EXIT

  export VEYRON_CREDENTIALS="${TMPDIR-/tmp}/p2b_credentials"
  export NAMESPACE_ROOT="${NAMESPACE_ROOT}"
  wsprd --v=1 -alsologtostderr=true -vproxy="${VEYRON_PROXY_ADDR}" --port "${VEYRON_WSPR_PORT}" &
  serve browser/. --port "${HTTP_PORT}" --compress

  wait
}

main "$@"
