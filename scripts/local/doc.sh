#!/bin/bash
# A bash script to generate gh-pages for react-reducer-table

git checkout v0.6
mkdir -p code

# groc documentation
groc --out code --glob 'src/*.js' --except 'src/*.test.js' --index-page-title 'react-reducer-table'

npm run build-storybook

rsync -av --delete storybook-static tmp/
rsync -av --delete code tmp/

git checkout gh-pages

rsync -av --delete tmp/storybook-static/ storybook-static
rsync -av --delete tmp/code/ code
