// import nextI18next from '../i18n';
// import nextI18NextMiddleware from 'next-i18next/middleware';
const express = require('express')
const next = require('next')


const port = process.env.PORT || 3000
const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler();

export default (async () => {
  await app.prepare()
  const server = express()

  console.log("start loading I18n");
  // await nextI18next.initPromise
  // server.use(nextI18NextMiddleware(nextI18next))
  console.log("I18n loaded");

  server.get('*', (req, res) => handle(req, res))

  await server.listen(port)
  console.log(`> Ready on http://localhost:${port}`) // eslint-disable-line no-console
})()
