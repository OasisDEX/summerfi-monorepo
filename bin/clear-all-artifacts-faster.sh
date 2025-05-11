#!/bin/bash

# Find all targets, print, and delete in parallel (optimized for macOS/BSD find)
find . \
  \( -path '*/node_modules' -o -path './armada-protocol' -o -path '*/.next' \) -prune -false \
  -o \( -type d \( -name dist -o -name cache -o -name coverage -o -name .turbo -o -name node_modules \) -print \) \
  -o \( -type f \( -name tsconfig.build.tsbuildinfo -o -name tsconfig.tsbuildinfo \) -print \) \
| tee /dev/tty | xargs -n 1 -P 8 rm -rf