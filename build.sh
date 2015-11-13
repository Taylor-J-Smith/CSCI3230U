#!/bin/bash
GR='\033[0;37m'
WH='\033[1;37m'

browserify public/app.js > public/bundle.js
printf "${GR}bundled components into ${WH}public/bundle.js\n"
printf "${GR}run with ${WH}nodejs server.js\n"