#!/bin/bash

set -e

git config -f .gitmodules --get-regexp '^submodule\..*\.path$' |
    while read path_key path
    do
        url_key=$(echo $path_key | sed 's/\.path/.url/')
        url=$(git config -f .gitmodules --get "$url_key")
        
        # Add a check to ensure the path and URL are not empty
        if [ -z "$path" ] || [ -z "$url" ]; then
            echo "Error: Missing path or URL for submodule configuration."
            exit 1
        fi
        
        git submodule add --force $url $path 
    done
