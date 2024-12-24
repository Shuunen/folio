#!/bin/bash

find ./dist -type f -name "*.html" -print0 | xargs -0 sed -i 's/<script/<script nonce="shu7782n1"/g'
