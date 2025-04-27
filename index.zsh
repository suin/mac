#!/usr/bin/env zsh
set -euo pipefail
BUN_VERSION=1.2.8 # this must be same as the version that is installed by devbox
DIR=$(cd $(dirname $0) && pwd)
export PATH=$DIR/bin:$PATH

# Install bun if not already installed
if [ ! -e "$DIR/bin/bun" ]; then
  echo "bun is not installed. Installing bun..."
  mkdir -p $DIR/bin
  export BUN_INSTALL=$DIR
  SHELL_BACKUP=$SHELL
  export SHELL=/bin/sh # to avoid the install script from changing the shell config
  curl -fsSL https://bun.sh/install | bash -s bun-v$BUN_VERSION
  unset BUN_INSTALL
  export SHELL=$SHELL_BACKUP
  which bun
  bun --version
fi

bun install
exec bun src/index.ts "$@"
