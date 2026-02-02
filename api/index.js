const fs = require('fs')
const path = require('path')

const dbPath = path.join(__dirname, 'db.json')

// Simple in-memory cache to persist data during function warm starts
let dbCache = null
let lastRead = 0
const CACHE_TTL = 5000 // 5 seconds

function getDb() {
  const now = Date.now()
  if (!dbCache || now - lastRead > CACHE_TTL) {
    dbCache = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
    lastRead = now
  }
  return dbCache
}

function saveDb(db) {
  dbCache = db
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
  } catch (err) {
    console.log('Write failed (expected on Vercel), using cache only')
  }
}

module.exports = (req, res) => {
  const db = getDb()
  
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
  
  // POST /posts
  if (pathname === '/posts' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      const data = JSON.parse(body)
      const newPost = {
        ...data,
        id: db.posts.length > 0 ? Math.max(...db.posts.map(p => p.id)) + 1 : 1,
        createdAt: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        commentCount: 0,
        views: 0
      }
      db.posts.push(newPost)
      saveDb(db)
      res.json(newPost)
    })
    return
  }
  
  // GET /posts/:id
  if (pathname.match(/^\/posts\/\d+$/) && req.method === 'GET') {
    const id = parseInt(pathname.split('/')[2])
    const post = db.posts.find(p => p.id === id)
    return post ? res.json(post) : res.status(404).json({ error: 'Not found' })
  }
  
  // PATCH /posts/:id (for likes)
  if (pathname.match(/^\/posts\/\d+$/) && req.method === 'PATCH') {
    const id = parseInt(pathname.split('/')[2])
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      const updates = JSON.parse(body)
      const postIndex = db.posts.findIndex(p => p.id === id)
      if (postIndex === -1) {
        return res.status(404).json({ error: 'Not found' })
      }
      db.posts[postIndex] = { ...db.posts[postIndex], ...updates }
      saveDb(db)
      res.json(db.posts[postIndex])
    })
    return
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
  
  // POST /comments
  if (pathname === '/comments' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      const data = JSON.parse(body)
      const newComment = {
        ...data,
        id: db.comments.length > 0 ? Math.max(...db.comments.map(c => c.id)) + 1 : 1,
        createdAt: new Date().toISOString(),
        likes: 0,
        likedBy: []
      }
      db.comments.push(newComment)
      
      // Update post comment count
      const postIndex = db.posts.findIndex(p => p.id === data.postId)
      if (postIndex !== -1) {
        db.posts[postIndex].commentCount = (db.posts[postIndex].commentCount || 0) + 1
      }
      
      saveDb(db)
      res.json(newComment)
    })
    return
  }
  
  // PATCH /comments/:id (for likes)
  if (pathname.match(/^\/comments\/\d+$/) && req.method === 'PATCH') {
    const id = parseInt(pathname.split('/')[2])
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      const updates = JSON.parse(body)
      const commentIndex = db.comments.findIndex(c => c.id === id)
      if (commentIndex === -1) {
        return res.status(404).json({ error: 'Not found' })
      }
      db.comments[commentIndex] = { ...db.comments[commentIndex], ...updates }
      saveDb(db)
      res.json(db.comments[commentIndex])
    })
    return
  }
  
  res.status(404).json({ error: 'Not found' })
}
