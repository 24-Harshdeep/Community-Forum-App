const jsonServer = require('json-server')
const auth = require('json-server-auth')
const path = require('path')
const fs = require('fs')

const dbPath = path.join(__dirname, '../db.json')
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))

const router = jsonServer.router(db)
const middlewares = jsonServer.defaults()

const app = jsonServer.create()
app.db = router.db
app.use(middlewares)
app.use(auth)
app.use(router)

module.exports = app
