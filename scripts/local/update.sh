#!/bin/bash
# A bash script to update the deployed version of react-reducer-table

npm run build
rsync -av --delete package.json dist lib ../../react-reducer-table
