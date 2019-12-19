#!/bin/bash
# 取得jci变量，重新赋值
#export BUILD_ENV=$NODE_ENV
export BUILD_ENV=development
npm run build:sh
