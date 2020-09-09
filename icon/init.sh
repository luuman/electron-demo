#!/bin/bash
# Run Node

echo '$0: '$0
echo "pwd: "`pwd`
echo "scriptPath1: "$(cd `dirname $0`; pwd)

mkdir $(cd `dirname $0`; pwd)/icons
mkdir $(cd `dirname $0`; pwd)/tmp.iconset

# install dependencies
sips -z 16 16     $(cd `dirname $0`; pwd)/icon.png --out $(cd `dirname $0`; pwd)/tmp.iconset/icon_16x16.png
sips -z 32 32     $(cd `dirname $0`; pwd)/icon.png --out $(cd `dirname $0`; pwd)/tmp.iconset/icon_16x16@2x.png
sips -z 32 32     $(cd `dirname $0`; pwd)/icon.png --out $(cd `dirname $0`; pwd)/tmp.iconset/icon_32x32.png
sips -z 64 64     $(cd `dirname $0`; pwd)/icon.png --out $(cd `dirname $0`; pwd)/tmp.iconset/icon_32x32@2x.png
sips -z 128 128   $(cd `dirname $0`; pwd)/icon.png --out $(cd `dirname $0`; pwd)/tmp.iconset/icon_128x128.png
sips -z 256 256   $(cd `dirname $0`; pwd)/icon.png --out $(cd `dirname $0`; pwd)/tmp.iconset/icon_128x128@2x.png
sips -z 256 256   $(cd `dirname $0`; pwd)/icon.png --out $(cd `dirname $0`; pwd)/tmp.iconset/icon_256x256.png
sips -z 512 512   $(cd `dirname $0`; pwd)/icon.png --out $(cd `dirname $0`; pwd)/tmp.iconset/icon_256x256@2x.png
sips -z 512 512   $(cd `dirname $0`; pwd)/icon.png --out $(cd `dirname $0`; pwd)/tmp.iconset/icon_512x512.png
sips -z 1024 1024   $(cd `dirname $0`; pwd)/icon.png --out $(cd `dirname $0`; pwd)/tmp.iconset/icon_512x512@2x.png

sips -z 256 256   $(cd `dirname $0`; pwd)/icon.png --out $(cd `dirname $0`; pwd)/icons/256x256.png
sips -z 256 256   $(cd `dirname $0`; pwd)/icon.png --out $(cd `dirname $0`; pwd)/icons/516x516.png
sips -z 256 256   $(cd `dirname $0`; pwd)/icon.png --out $(cd `dirname $0`; pwd)/icons/icon.ico

iconutil -c icns $(cd `dirname $0`; pwd)/tmp.iconset -o $(cd `dirname $0`; pwd)/icon.icns
