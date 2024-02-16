#!/bin/sh

rm -rf calligo-site-repo

echo "Clonning calligo-site"
git clone "git@github.com:tokilabs/calligo-site.git" calligo-site-repo

cd calligo-site-repo

echo "Checking out 'integration' branch"
git checkout integration
