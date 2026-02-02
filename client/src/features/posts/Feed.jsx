import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPosts, addPost } from '../../api'
import PostItem from './PostItem'
import NewPostForm from './NewPostForm'

export default function Feed(){
  const qc = useQueryClient()
  const { data: posts = [], isLoading, isError, error } = useQuery({ queryKey: ['posts'], queryFn: getPosts })
  const m = useMutation({ mutationFn: addPost, onSuccess: ()=> qc.invalidateQueries({ queryKey: ['posts'] }) })
  const [filter, setFilter] = React.useState('')

  console.debug('Feed posts:', posts, { isLoading, isError, error })

  const filteredPosts = posts.filter(p => 
    !filter || 
    p.title?.toLowerCase().includes(filter.toLowerCase()) || 
    p.content?.toLowerCase().includes(filter.toLowerCase()) ||
    p.author?.displayName?.toLowerCase().includes(filter.toLowerCase()) ||
    p.author?.username?.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <NewPostForm onCreate={(d)=> m.mutate(d)} />
      <div style={{marginBottom:'1.5rem'}}>
        <input 
          type="search"
          placeholder="🔍 Search posts..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{width:'100%',padding:'0.75rem 1rem',border:'1px solid var(--border)',borderRadius:'8px',fontSize:'0.875rem',background:'var(--card-bg)',color:'var(--fg)',outline:'none'}}
        />
      </div>
      <div>
        {isLoading && <div style={{textAlign:'center',padding:'3rem',color:'var(--gray-500)'}}>Loading posts…</div>}
        {isError && <div style={{background:'#fee2e2',border:'1px solid #fca5a5',color:'#991b1b',padding:'1rem',borderRadius:'8px',marginBottom:'1rem'}}>⚠️ Error loading posts: {String(error?.message || error)}</div>}
        {!isLoading && !isError && filteredPosts.length === 0 && posts.length > 0 && <div style={{textAlign:'center',padding:'3rem',color:'var(--gray-500)'}}>No posts match your search.</div>}
        {!isLoading && !isError && posts.length === 0 && <div style={{textAlign:'center',padding:'3rem',color:'var(--gray-500)'}}>No posts yet. Be the first to post!</div>}
        {filteredPosts.map(p=> <PostItem key={p.id} post={p} />)}
      </div>
    </div>
  )
}
