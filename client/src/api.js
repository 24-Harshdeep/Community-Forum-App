const BASE = '/api'

export async function getPosts(){
  const res = await fetch(`${BASE}/posts`)
  return res.json()
}

export async function getPost(id){
  const res = await fetch(`${BASE}/posts/${id}`)
  return res.json()
}

export async function addPost(data){
  const res = await fetch(`${BASE}/posts`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
  return res.json()
}

export async function likePost(id){
  const post = await getPost(id)
  const res = await fetch(`${BASE}/posts/${id}`, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({likes:(post.likes||0)+1})})
  return res.json()
}

export async function getComments(postId){
  const res = await fetch(`${BASE}/comments?postId=${postId}`)
  return res.json()
}

export async function addComment(data){
  const res = await fetch(`${BASE}/comments`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
  return res.json()
}

export async function likeComment(id){
  const res0 = await fetch(`${BASE}/comments/${id}`)
  const c = await res0.json()
  const res = await fetch(`${BASE}/comments/${id}`, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({likes:(c.likes||0)+1})})
  return res.json()
}
