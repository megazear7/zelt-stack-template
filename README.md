# ZeltTemplate Stack

The Zelt Stack uses Zod, Express, Lit, and TypeScript. This template provides
a frontend and backend where both sides communicate with the same type definitions
with a simple service layer abstraction. It comes with a cli setup for project
initialization as well as built in AI model support.

## Setup

```sh
git clone --depth=1 git@github.com:megazear7/zelt-stack-template.git my-cool-project
cd my-cool-project
node rename.js my-cool-project
git init
nvm use 22
npm install
npm run build:cli
npm run init
git add .
git commit -m "Init commit from the zelt template after project rename"
npm start
```

If your app needs custom setup steps or has any other need for a cli,
that can be developed under `src/cli` and run with `npm run init`.

## Develop

```
npm start
```
