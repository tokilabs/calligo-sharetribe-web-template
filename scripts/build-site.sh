#!/bin/sh

echo "Installing calligo-site packages using npm install"
npm install

echo "Running build on calligo site"
npm run build
