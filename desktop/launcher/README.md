# Launcher

## Features

- Extend the capabilities of Electron through handlers and bootstrap modules.
- Centralize code that can be reuse by multiple projects.

## How to develop

```bash
git checkout https://github.com/pownthep/playground.git
cd launcher
npm install
npm run dev
```

- You should extend electron features by adding handlers and bootstraps.

- Then, create a new branch and only import the bootstraps and handlers that your app needs.

- Create a custom build script in the tools folder

## Contribution

- Create branch
- Implement code
- Rebase on top master branch
- Create PR
