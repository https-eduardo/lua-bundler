# Lua Bundler
A simple and fast lua bundler, joining the content of a group of luas and saving in a single file

## Getting started
### 1.1 Requirements
- An up-to-date release of NodeJS and NPM
### 1.2 Project configuration
Clone this project to your workstation
```sh
git clone https://github.com/https-eduardo/lua-bundler.git my-project
```
Now install all the dependencies of the project
```sh
cd ./my-project
npm install
// or
yarn install
```
## Usage
To bundle your files, configure the directory where they are and where the bundled lua will be save. You can set priorities and skip files too.

The config file is ``config.js``
```js
export default {
    path: 'C:/Users/user/Desktop/luafiles',
    priorities: [],
    skip: [],
    save: {
        path: 'C:/Users/user/Desktop/save/bundle.lua',
    }
}
```

### Contributing
You are free to suggest an improvement, report a bug, or ask something.
