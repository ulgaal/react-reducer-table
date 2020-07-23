#!/bin/bash
# A bash script to generate documentation for react-infotip

mkdir -p doc/ref

# react-docgen
npx react-docgen src/Table.js src/Pagination.js \
 -o stories/docgen.json  --resolver=findAllComponentDefinitions

# react-docgen to md 
node --experimental-modules stories/generateRefDocs.mjs
