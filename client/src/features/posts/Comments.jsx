import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getComments, addComment, likeComment } from '../../api'

export default function Comments({postId}){
  const qc = useQueryClient()
  const { data: comments=[] } = useQuery({ queryKey: ['comments', postId], queryFn: ()=> getComments(postId) })
  const mAdd = useMutation({ mutationFn: addComment, onSuccess: ()=> qc.invalidateQueries({ queryKey: ['comments', postId] }) })
  const mLike = useMutation({ 
    mutationFn: likeComment, 
    onMutate: async (commentId) => {
      await qc.cancelQueries({ queryKey: ['comments', postId] })
      const prev = qc.getQueryData(['comments', postId])
      qc.setQueryData(['comments', postId], old => 
        old?.map(c => c.id === commentId ? {...c, likes: (c.likes || 0) + 1} : c)
      )
      return { prev }
    },
    onError: (err, vars, context) => {
      qc.setQueryData(['comments', postId], context.prev)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['comments', postId] })
    }
  })
  const [text,setText] = React.useState('')

  const submit = (e)=>{
    e.preventDefault()
    if(!text) return
    mAdd.mutate({postId, content:text, author:'Anon', time:Date.now(), likes:0})
    setText('')
  }

  return (
    <div style={{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'12px',padding:'1.5rem',boxShadow:'var(--shadow)'}}>
      <h4 style={{margin:'0 0 1rem 0',fontSize:'1.125rem',fontWeight:600}}>Comments</h4>
      <form onSubmit={submit} style={{marginBottom:'1.5rem'}}>
        <div style={{display:'flex',gap:'0.75rem'}}>
          <input 
            value={text} 
            onChange={e=>setText(e.target.value)} 
            placeholder="Write a comment..." 
            style={{flex:1,padding:'0.75rem 1rem',border:'1px solid var(--border)',borderRadius:'8px',fontSize:'0.875rem',outline:'none',background:'var(--card-bg)',color:'var(--fg)'}}
          />
          <button 
            type="submit" 
            style={{background:'var(--primary)',color:'white',border:'none',padding:'0.75rem 1.5rem',borderRadius:'8px',fontSize:'0.875rem',fontWeight:600,cursor:'pointer',transition:'background 0.2s',whiteSpace:'nowrap'}}
            onMouseEnter={e=>e.target.style.background='var(--primary-dark)'}
            onMouseLeave={e=>e.target.style.background='var(--primary)'}
          >
            Add Comment
          </button>
        </div>
      </form>
      <div>
        {comments.length === 0 && <div style={{textAlign:'center',padding:'2rem',color:'var(--gray-500)',fontSize:'0.875rem'}}>No comments yet. Be the first!</div>}
        {comments.map(c=> (
          <div key={c.id} style={{borderTop:'1px solid var(--border)',padding:'1rem 0'}}>
            <div style={{marginBottom:'0.5rem',color:'var(--fg)'}}>{c.content}</div>
            <div style={{display:'flex',alignItems:'center',gap:'1rem',fontSize:'0.875rem',color:'var(--gray-500)'}}>
              <span>by {c.author?.displayName || c.author?.username || c.author || 'Anonymous'}</span>
              <button 
                onClick={()=> mLike.mutate(c.id)} 
                style={{background:'transparent',border:'1px solid var(--border)',padding:'0.25rem 0.75rem',borderRadius:'6px',fontSize:'0.75rem',cursor:'pointer',transition:'all 0.2s',color:'var(--gray-500)'}}
                onMouseEnter={e=>{e.target.style.borderColor='var(--primary)';e.target.style.color='var(--primary)'}}
                onMouseLeave={e=>{e.target.style.borderColor='var(--border)';e.target.style.color='var(--gray-500)'}}
              >
                ❤️ {c.likes||0}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
