# Webpack 5 Boilerplate Template

## Requirements

* `node` : `^12 || >=14` - `v16.13.0`
* `npm`

# Setup

## Installation

1. Choose and download the latest template release from [List of Releases](https://github.com/WeAreAthlon/frontend-webpack-boilerplate/releases).
2. Extract the release archive to a new directory, rename it to your project name and browse the directory.
3. Install all dependencies using `yarn install` command. 

```sh 
$ yarn install --frozen-lockfile
```

# Configuration

## Environment Configuration

* Edit the [`configuration/environment.js`](configuration/environment.js) if you want to specify:
  * **`server`**: configure development server, specify `host`, `port`. Refer to the full development server configuration options for [`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/).
  * **`limits`**: configure file size thresholds for assets optimizations.
    * Image/Font files size in bytes. Below this value the image file will be served as Data URL (_inline base64_).
  * **`paths`**: `src` or `dist` directories names and file system location.

## Additional `webpack` configuration

You can additionally configure `webpack` for specific environment:
* `development` - [`configuration/webpack.dev.config.js`](configuration/webpack.dev.config.js)
* `production` - [`configuration/webpack.prod.config.js`](configuration/webpack.prod.config.js)
  * Note that if you prefer to build and deploy [`sourcemap`](https://webpack.js.org/configuration/devtool/#production) files:
> You should configure your server to disallow access to the Source Map file for normal users!

# Development

## Assets Source

* **SASS/PostCSS** files are located under `src/scss/`
* **JavaScript** files with support of latest ECMAScript _ES6 / ECMAScript 2016(ES7)/ etc_ files are located under `src/js/`
* **Image** files are located under `src/images/`
* **Font** files are located under `src/fonts/`
* **HTML** files are located under `src/`
  * It will **automatically** build **all HTML files** placed under `src/` directory, no need to manually configure each template anymore!
  

## Start project in DEVELOPMENT MODE

```sh
$ yarn start
```

## Build Assets

### One time build assets for development

```sh
$ yarn build
```

### Build assets and enable source files watcher

```sh
$ yarn watch
```

This command is suitable if you develop with external web server.

> **Note:** File watching does not work with *NFS* (*Windows*) and virtual machines under *VirtualBox*. Extend the configuration in such cases by:

```js
module.exports = {
  //...
  watchOptions: {
    poll: 1000 // Check for changes every second
  }
};
```

### Start a development server - reloading automatically after each file change.

```sh
$ npm run dev
```

# Production 

## Build Assets

Optimize assets for production by:

```sh
$ npm run production
```

## Get Built Assets

* _CSS_ files are located under `/dist/css/`
* _JavaScript_ files with support of _ES6 / ECMAScript 2016(ES7)_ files are located under `/dist/js/`
* _Images_ are located under `/dist/images/`
  * Images part of the _design_ (_usually referenced in the CSS_) are located under `/dist/images/design/`
  * Images part of the _content_ (_usually referenced via `<img>` tags_) are located under `/dist/images/content/`
* _Fonts_ are located under `/dist/fonts/`
* _HTML_ files are located under `/dist/`

# Run Code Style Linters

## SASS

```sh
$ npm run lint:sass
```
## JavaScript

```sh
$ npm run lint:js
```

# Additional Tools

## Run Assets Bundle Analyzer

```sh
$ npm run stats
```

> This will open the visualisaion on the default configuraiton URL `localhost:8888`, you can change this URL or port following the [package](https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-cli) documentation.