import express from 'express'
import { createServer } from 'http'
import logger from 'morgan'
import { json as apiRequestParser } from 'body-parser'

import 'colors'

import authServer from './features/auth'
import renderer from './features/renderer'
import webpackServer from './features/webpack'

const app = express()
const server = createServer(app)

app.use(apiRequestParser())
app.use(logger('dev', { skip: (req) => req.url.includes('.hot-update.') }))

app.use(webpackServer)
app.use(authServer)
app.use(renderer)

server.listen(process.env.PORT || 3000, () => {
  console.log(
    '👍  Development server listening on'.green,
    `http://localhost:${server.address().port}`.yellow.underline,
    '\n'
  )
})
