import React, { useState, useRef } from 'react'

export default function NewPostForm({onCreate}){
  const [title,setTitle]=useState('')
  const [content,setContent]=useState('')
  const ref = useRef()

  React.useEffect(()=>{ ref.current?.focus() },[])

  const submit = (e)=>{
    e.preventDefault()
    if(!title) return
    onCreate({title,content,author:'Anonymous',time:Date.now(),likes:0})
    setTitle(''); setContent('')
    ref.current?.focus()
  }

  return (
    <form onSubmit={submit} style={{background:'var(--card-bg)',padding:'1.5rem',borderRadius:'12px',boxShadow:'var(--shadow)',marginBottom:'2rem'}}>
      <h3 style={{margin:'0 0 1rem 0',fontSize:'1.25rem',fontWeight:600}}>Create New Post</h3>
      <input 
        ref={ref} 
        value={title} 
        onChange={e=>setTitle(e.target.value)} 
        placeholder="Post title" 
        style={{width:'100%',padding:'0.75rem 1rem',border:'1px solid var(--border)',borderRadius:'8px',fontSize:'1rem',marginBottom:'0.75rem',outline:'none',transition:'border-color 0.2s',background:'var(--card-bg)',color:'var(--fg)'}}
        onFocus={e=>e.target.style.borderColor='var(--primary)'}
        onBlur={e=>e.target.style.borderColor='var(--border)'}
      />
      <textarea 
        value={content} 
        onChange={e=>setContent(e.target.value)} 
        placeholder="What's on your mind?" 
        rows="4"
        style={{width:'100%',padding:'0.75rem 1rem',border:'1px solid var(--border)',borderRadius:'8px',fontSize:'1rem',resize:'vertical',marginBottom:'1rem',fontFamily:'inherit',outline:'none',transition:'border-color 0.2s',background:'var(--card-bg)',color:'var(--fg)'}}
        onFocus={e=>e.target.style.borderColor='var(--primary)'}
        onBlur={e=>e.target.style.borderColor='var(--border)'}
      />
      <button 
        type="submit" 
        style={{background:'var(--primary)',color:'white',border:'none',padding:'0.75rem 1.5rem',borderRadius:'8px',fontSize:'1rem',fontWeight:600,cursor:'pointer',transition:'background 0.2s'}}
        onMouseEnter={e=>e.target.style.background='var(--primary-dark)'}
        onMouseLeave={e=>e.target.style.background='var(--primary)'}
      >
        Post
      </button>
    </form>
  )
}
