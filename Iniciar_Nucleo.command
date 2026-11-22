#!/bin/zsh
cd "${0:A:h}"
node --env-file-if-exists=.env.local server.mjs
