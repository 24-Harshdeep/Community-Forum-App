const jsonServer = require('json-server')
const auth = require('json-server-auth')
const path = require('path')

module.exports = (req, res) => {
  const server = jsonServer.create()
  const router = jsonServer.router(path.join(__dirname, 'db.json'))
  const middlewares = jsonServer.defaults()

  server.db = router.db
  server.use(middlewares)
  server.use(auth)
  server.use(router)
  
  server(req, res)
}
