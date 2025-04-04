#!/bin/bash

sudo apt-get install -y git || true
git clone git@github.com:SampurnaC/chrome_extension_fcc.git chrome_ext_starter
cp -r chrome_ext_starter ext-verborum