import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likePost } from '../../api'

export default function PostItem({post}){
  const qc = useQueryClient()
  const m = useMutation({ 
    mutationFn: ()=> likePost(post.id), 
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['posts'] })
      const prev = qc.getQueryData(['posts'])
      qc.setQueryData(['posts'], old => 
        old?.map(p => p.id === post.id ? {...p, likes: (p.likes || 0) + 1} : p)
      )
      return { prev }
    },
    onError: (err, vars, context) => {
      qc.setQueryData(['posts'], context.prev)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['posts'] })
    }
  })

  const navigate = useNavigate()

  return (
    <div style={{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'12px',padding:'1.5rem',marginBottom:'1rem',boxShadow:'var(--shadow)',transition:'box-shadow 0.2s'}}
         onMouseEnter={e=>e.currentTarget.style.boxShadow='var(--shadow-lg)'}
         onMouseLeave={e=>e.currentTarget.style.boxShadow='var(--shadow)'}>
      <h3 style={{margin:'0 0 0.5rem 0',fontSize:'1.25rem',fontWeight:600}}>
        <Link to={`/posts/${post.id}`} style={{color:'var(--fg)',textDecoration:'none'}}>{post.title}</Link>
      </h3>
      <p style={{margin:'0 0 1rem 0',color:'var(--gray-600)',lineHeight:1.6}}>{post.content?.substring(0,200)}{post.content?.length>200?'...':''}</p>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:'0.875rem',color:'var(--gray-500)'}}>
        <div>by {post.author?.displayName || post.author?.username || post.author || 'Anonymous'} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : (post.time ? new Date(post.time).toLocaleDateString() : 'Just now')}</div>
        <div style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
          <button 
            type="button"
            onClick={()=> m.mutate()} 
            style={{background:'transparent',border:'1px solid var(--border)',padding:'0.5rem 1rem',borderRadius:'6px',fontSize:'0.875rem',cursor:'pointer',display:'flex',alignItems:'center',gap:'0.25rem',transition:'all 0.2s',color:'var(--fg)'}}
            onMouseEnter={e=>{e.target.style.borderColor='var(--primary)';e.target.style.color='var(--primary)'}}
            onMouseLeave={e=>{e.target.style.borderColor='var(--border)';e.target.style.color='var(--fg)'}}
          >
            ❤️ {post.likes||0}
          </button>
          <button type="button" onClick={() => navigate(`/posts/${post.id}`)} style={{background:'none',border:'none',color:'var(--primary)',fontWeight:500,cursor:'pointer',padding:0}}>Reply</button>
        </div>
      </div>
    </div>
  )
}
