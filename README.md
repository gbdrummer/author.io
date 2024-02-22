# Boilerplate for new Author Software, Inc. product UIs

--*Description of UI goes here.*--

This repository contains the source code, build tool, test suite, and development environment for this application.

## Setup

After cloning this repository, run `npm run setup` in the root directory. This will install all the necessary dependencies.

## Developing on this repo

To run locally from source, run `npm run locally` in the root directory. This will spin up a simple webserver configured to allow for client-side routing. Check the console for the URL. Port `3003` us used by default. If this port is unavailable, the server will use a random available port. If you'd like to specify a different port, you can set it in the `locally` script in `package.json` in the root directory.

The import alias `aui` is included for AuthorUI by default. To add additional aliases, edit the import map specified in `./src/index.html`.

## Building for Production

To build a distribution package, run `npm run build` in the root directory. This will produce a folder called `dist` where the files will be written.

AuthorUI bundles JavaScript in as few chunks as possible. This is dependent on client-side routes which are loaded dynamically at runtime. You should add each entry point path to `config.json` in the root directory (Globbing is supported).

For example, if you have a `routes` folder in your app, you should add this path to the `entries` field in `config.json`:

`routes/**/index.js`

> NOTE: This assumes each route has an `index.js` file used as its entry point.

When `config.json` is configured correctly, the application JavaScript will be bundled in as few chunks as are necessary to support dynamic importing of routes.

> NOTE: Source maps are included by default.

## Testing a Production Build

To build the distribution package and run it in the browser, run `npm run locally:prod` in the root directory.