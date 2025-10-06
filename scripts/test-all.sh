#!/usr/bin/env bash
set -euo pipefail
npm --prefix applications/installsure/backend test
npm --prefix applications/installsure/frontend test
npm --prefix applications/demo-dashboard/frontend test
