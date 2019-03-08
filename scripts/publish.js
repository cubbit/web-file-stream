'use strict';

const child_process = require('child_process');
const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs-extra');
const module_path = path.resolve(__dirname, '..');


function _clean()
{
    console.log('Cleaning folders...');

    rimraf.sync(path.resolve(module_path, 'dist'));
    rimraf.sync(path.resolve(module_path, 'build'));

    console.log('Cleaned!');
}

function _compile_ts()
{
    console.log('Compiling typescript...');

    let result;

    // Compile ts
    result = child_process.spawnSync('tsc', [], {shell: true, stdio: 'inherit', cwd: module_path});
    if(result.status)
        throw new Error(`Unable to compile typescript`);

    // Copy js
    fs.copySync(path.resolve(module_path, 'build', 'src'), path.resolve(module_path, 'dist'));

    console.log('Compiled!');
}

function _npm_package()
{
    console.log('Preparing package.json...');

    const package_path = path.resolve(module_path, 'dist', 'package.json');
    fs.copySync(path.resolve(module_path, 'package.json'), package_path);
    let package_json = JSON.parse(fs.readFileSync(package_path).toString());
    package_json.private = false;
    delete package_json.scripts;
    delete package_json.devDependencies;
    fs.writeFileSync(package_path, JSON.stringify(package_json, null, 4));

    console.log('Prepared!');
}

function _files()
{
    console.log('Copying custom files...');

    const files = ['README.md', 'LICENSE'];
    for(const file of files)
        fs.copySync(path.resolve(module_path, file), path.resolve(module_path, 'dist', file));

    console.log('Copied!');
}

function _npm_publish()
{
    console.log('Publishing package...');

    let result;

    result = child_process.spawnSync('npm', ['publish', '--access', 'public'], {shell: true, stdio: 'inherit', cwd: path.resolve(module_path, 'dist')});
    if(result.status)
        throw new Error(`Unable to publish package`);

    console.log('Published!');
}

function pack()
{
    console.log('Packing...');

    _clean();
    _compile_ts();
    _npm_package();
    _files();

    console.log('Packed!');
}

function publish()
{
    console.log('Publishing...');

    pack();
    _npm_publish();

    console.log('Published!');
}

module.exports = {pack, publish};
