#!/bin/bash
# Git credential helper - read from env
read -r line
host=$(echo "$line" | grep -o 'host=[^ ]*' | cut -d= -f2)
if [ "$host" = "github.com" ]; then
    GITHUB_TOKEN=$(cat ~/.auto-company/credentials/github.env 2>/dev/null | grep -v '^#' | grep -v '^$' | head -1)
    if [ -n "$GITHUB_TOKEN" ]; then
        echo "username=tolgabrk"
        echo "password=$GITHUB_TOKEN"
    fi
fi
