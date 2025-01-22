#!/bin/bash
# added to exclude armada-protocol, nested node_modules and .next folders
# to be faster and not delete the wrong files
find . -path '*/node_modules' -prune -o -path ./armada-protocol -prune -o -path '*/.next' -prune -o -name dist -type d -exec rm -rvf {} \;
find . -path '*/node_modules' -prune -o -path ./armada-protocol -prune -o -path '*/.next' -prune -o -name tsconfig.build.tsbuildinfo -type f -exec rm -rvf {} \;
find . -path '*/node_modules' -prune -o -path ./armada-protocol -prune -o -path '*/.next' -prune -o -name tsconfig.tsbuildinfo -type f -exec rm -rvf {} \;
