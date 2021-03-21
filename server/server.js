import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'
import axios from 'axios'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

require('colors')
const { writeFile, readFile, stat, unlink } = require('fs').promises

let Root
try {
  // eslint-disable-next-line import/no-unresolved
  Root = require('../dist/assets/js/ssr/root.bundle').default
} catch {
  // console.log('SSR not found. Please run "yarn run build:ssr"'.red)
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

server.use((req, res, next) => {
  res.set('x-skillcrucial-user', '9014abd2-0916-4eab-adc0-f65959f79224')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  next()
})

server.get('/api/v1/users', (req, res) => {
  stat(`${__dirname}/test.json`)
    .then(() => {
      readFile(`${__dirname}/test.json`, { encoding: 'utf8' })
        .then((text) => {
          res.json(JSON.parse(text))
        })
        .catch(async (err) => {
          console.log('Reading ERROR ', err)
        })
    })
    .catch(async () => {
      const { data: users } = await axios('http://jsonplaceholder.typicode.com/users')
      writeFile(`${__dirname}/test.json`, JSON.stringify(users), {
        encoding: 'utf8'
      })
      res.json(users)
    })
})

server.post('/api/v1/users', async (req, res) => {
  const user = req.body
  const text = await readFile(`${__dirname}/test.json`, { encoding: 'utf8' })
  const users = JSON.parse(text)
  user.id = +users[users.length - 1].id + 1
  users.push(user)
  writeFile(`${__dirname}/test.json`, JSON.stringify(users), {
    encoding: 'utf8'
  })
  res.json({ status: 'success', id: user.id })
})

server.patch('/api/v1/users/:userId', async (req, res) => {
  const { userId: id } = req.params
  const user = req.body
  const text = await readFile(`${__dirname}/test.json`, { encoding: 'utf8' })
  const users = JSON.parse(text)
  users.forEach((el, index) => {
    if (el.id === +id) users[index] = Object.assign(users[index], user)
  })
  // users[id - 1] = Object.assign(users[id - 1], user)
  writeFile(`${__dirname}/test.json`, JSON.stringify(users), {
    encoding: 'utf8'
  })
  res.json({ status: 'success', id })
})

server.delete('/api/v1/users/:userId', async (req, res) => {
  const { userId: id } = req.params
  const text = await readFile(`${__dirname}/test.json`, { encoding: 'utf8' })
  let users = JSON.parse(text)
  users = users.filter((user) => user.id !== +id)
  writeFile(`${__dirname}/test.json`, JSON.stringify(users), {
    encoding: 'utf8'
  })
  res.json({ status: 'success', id })
})

server.delete('/api/v1/users', (req, res) => {
  unlink(`${__dirname}/test.json`)
  res.json({ status: 'success' })
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}

// console.log(`Serving at http://localhost:${port}`)
