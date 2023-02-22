#!/usr/bin/env bash

main_dir=$(pwd)
CACHE_DIR=".cache"
AZCON_REPO_CACHE="$main_dir/$CACHE_DIR/aztec-connect"
GIT_VENDOR_URL="https://github.com"
AZCON_REPO_PATH="kobyhallx/aztec-connect"
AZCON_CLONE_URL="$GIT_VENDOR_URL/$AZCON_REPO_PATH.git"
AZCON_BUILD="$main_dir/.build"
npm_bin=$(npm bin)
NODE_CJS_TARGET_DIR=$main_dir/dest
WEB_ESM_TARGET_DIR=$main_dir/esm

rm -rf $AZCON_BUILD
rm -rf $WEB_ESM_TARGET_DIR
rm -rf $NODE_CJS_TARGET_DIR
rm -rf node_modules
rm package.json

mkdir -p "$AZCON_BUILD"
mkdir $WEB_ESM_TARGET_DIR

if [[ -d "$AZCON_REPO_CACHE" ]]; then
    echo "$AZCON_REPO_CACHE exists on your filesystem, using it for build..."
else
    echo "$AZCON_REPO_CACHE does not exists on your filesystem, clonning from $AZCON_CLONE_URL"
    git clone $AZCON_CLONE_URL $AZCON_REPO_CACHE
    cd $AZCON_REPO_CACHE
    git checkout 8c75fc368ae1bb55494c3dd4321f49c55683981e
fi

cp -a "$AZCON_REPO_CACHE/." "$AZCON_BUILD/"

npm install --no-save @swc/core@1.3.25 @swc/cli@0.1.59 
# detect-node threads @noir-lang/aztec_backend@next tslib

rm ./.build/barretenberg.js/.swcrc
cd "$AZCON_BUILD/barretenberg.js"
$npm_bin/swc src --config-file $main_dir/.swcrc-web-esm --ignore *.test.ts --out-dir $WEB_ESM_TARGET_DIR
cp "$AZCON_BUILD/barretenberg.js/src/wasm/barretenberg.wasm" "$main_dir/esm/wasm"

$npm_bin/swc src --config-file $main_dir/.swcrc-node-cjs --ignore *.test.ts --out-dir $NODE_CJS_TARGET_DIR
cp "$AZCON_BUILD/barretenberg.js/src/wasm/barretenberg.wasm" "$main_dir/dest/wasm"

cd $main_dir/

sed -i -e "s/export\s*{\s*BarretenbergWorker\s*}\s*from\s*'.\/worker';/\/\/REMOVED BY BUILD: export { BarretenbergWorker } from '.\/worker';/g" esm/wasm/index.js
sed -i -e 's/const.*= require\s*(\s*".\/worker"\s*)\s*;/\/\/REMOVED BY BUILD: const _worker = require(".\/worker");/g' dest/wasm/index.js
cp -a "$AZCON_BUILD/barretenberg.js/src/." "$main_dir/src/"
cp "$AZCON_BUILD/barretenberg.js/package.json" "$main_dir/"
cp "$AZCON_BUILD/barretenberg.js/tsconfig.json" "$main_dir/"

# rm -rf node_modules
# rm package-lock.json

# yarn install --production=true         
# yarn link @noir-lang/aztec_backend

cd $AZCON_BUILD
AZCON_REV=$(git rev-parse HEAD)
AZCON_REV_SHORT=$(git rev-parse --short HEAD)

sed -i -E "s/\[noir-lang\/aztec-connect@.+\]\(.+\)/\[noir-lang\/aztec-connect@$AZCON_REV_SHORT\](https:\/\/github.com\/noir-lang\/aztec-connect\/tree\/$AZCON_REV)/g" $main_dir/README.md

cat $main_dir/package.json | jq '.name = "@noir-lang/barretenberg"' | jq ".version += \"-$AZCON_REV_SHORT\"" | jq '.repository = { "type" : "git", "url" : "https://github.com/noir-lang/barretenberg.git" }' | tee $main_dir/package.json
