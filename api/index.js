const fs = require('fs')
const path = require('path')

const dbPath = path.join(__dirname, 'db.json')

module.exports = (req, res) => {
  // Read fresh data on each request (Vercel is stateless)
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  
  const url = new URL(req.url, `http://${req.headers.host}`)
  const pathname = url.pathname.replace('/api', '')
  
  // GET /posts
  if (pathname === '/posts' && req.method === 'GET') {
    return res.json(db.posts || [])
  }
  
  // GET /posts/:id
  if (pathname.match(/^\/posts\/\d+$/) && req.method === 'GET') {
    const id = parseInt(pathname.split('/')[2])
    const post = db.posts.find(p => p.id === id)
    return post ? res.json(post) : res.status(404).json({ error: 'Not found' })
  }
  
  // GET /comments
  if (pathname === '/comments' && req.method === 'GET') {
    const postId = url.searchParams.get('postId')
    let comments = db.comments || []
    if (postId) {
      comments = comments.filter(c => c.postId === parseInt(postId))
    }
    return res.json(comments)
  }
  
  // For write operations, return success but data won't persist (Vercel is stateless)
  if (req.method === 'POST' || req.method === 'PATCH') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      const data = JSON.parse(body || '{}')
      res.json({ ...data, id: Date.now() })
    })
    return
  }
  
  res.status(404).json({ error: 'Not found' })
}
