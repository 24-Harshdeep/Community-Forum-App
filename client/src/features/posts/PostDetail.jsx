import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPost, likePost } from '../../api'

const Comments = React.lazy(()=> import('./Comments'))

export default function PostDetail(){
  const { id } = useParams()
  const qc = useQueryClient()
  const { data: post } = useQuery({ queryKey: ['post', id], queryFn: ()=> getPost(id) })
  const m = useMutation({ 
    mutationFn: ()=> likePost(id), 
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['post', id] })
      const prev = qc.getQueryData(['post', id])
      qc.setQueryData(['post', id], old => ({...old, likes: (old.likes || 0) + 1}))
      return { prev }
    },
    onError: (err, vars, context) => {
      qc.setQueryData(['post', id], context.prev)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['post', id] })
    }
  })

  if(!post) return <div>Loading post...</div>

  return (
    <div>
      <div style={{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'12px',padding:'2rem',marginBottom:'2rem',boxShadow:'var(--shadow)'}}>
        <h2 style={{margin:'0 0 1rem 0',fontSize:'1.875rem',fontWeight:700,lineHeight:1.2}}>{post.title}</h2>
        <p style={{margin:'0 0 1.5rem 0',color:'var(--gray-600)',fontSize:'1.125rem',lineHeight:1.7}}>{post.content}</p>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:'1rem',borderTop:'1px solid var(--border)'}}>
          <div style={{fontSize:'0.875rem',color:'var(--gray-500)'}}>by {post.author?.displayName || post.author?.username || post.author || 'Anonymous'}</div>
          <button 
            onClick={()=> m.mutate()} 
            style={{background:'var(--primary)',color:'white',border:'none',padding:'0.625rem 1.25rem',borderRadius:'8px',fontSize:'0.875rem',fontWeight:600,cursor:'pointer',transition:'background 0.2s',display:'flex',alignItems:'center',gap:'0.5rem'}}
            onMouseEnter={e=>e.target.style.background='var(--primary-dark)'}
            onMouseLeave={e=>e.target.style.background='var(--primary)'}
          >
            ❤️ Like ({post.likes||0})
          </button>
        </div>
      </div>
      <React.Suspense fallback={<div style={{textAlign:'center',padding:'2rem',color:'var(--gray-500)'}}>Loading comments...</div>}>
        <Comments postId={post.id} />
      </React.Suspense>
    </div>
  )
}
