#!/usr/bin/env bash

# make a release zip for Chrome and Opera
#
# elsewhere, we make another zip for AMO Firefox (and Edge),
# as well as request a signed self-hosted XPI with `web-ext sign`,
# but we reuse the checkout folder when making the AMO zip
# and when requesting the self-hosted XPI, so any checkout folder
# changes below will make it to the Firefox/Edge packages

# this script takes a mandatory argument which is the git tag to build

if [ -n "$1" ]; then
  SUBDIR=checkout
  [ -d $SUBDIR ] && rm -rf $SUBDIR
  mkdir $SUBDIR
  cp -r -f -a .git $SUBDIR
  cd $SUBDIR
  git reset --hard "$1"

  # clean up
  rm -rf src/tests # remove unit tests
  rm src/data/dnt-policy.txt # only used by unit tests

  # include LICENSE in build
  cp LICENSE src/

  # blank out locale descriptions to reduce package size
  ../scripts/min_locales.py

else
  echo "Please supply a tag name for the release you are zipping"
  exit 1
fi


echo "Building zip version" "$1"

(cd src && zip -q -r ../privacy_badger-"$TARGET".zip .)
mv privacy_badger*.zip ../pkg/
cd -
