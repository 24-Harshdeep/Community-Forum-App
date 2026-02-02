import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from './userSlice'
import Feed from './features/posts/Feed'
const PostDetail = lazy(() => import('./features/posts/PostDetail'))

export default function App(){
  const theme = useSelector(state => state.user.theme)
  const dispatch = useDispatch()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="app">
      <header>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h1><Link to="/feed">Forum</Link></h1>
          <button 
            onClick={() => dispatch(toggleTheme())}
            style={{background:'var(--card-bg)',border:'1px solid var(--border)',padding:'0.5rem 1rem',borderRadius:'8px',cursor:'pointer',fontSize:'1.25rem',transition:'all 0.2s'}}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/feed" replace/>} />
          <Route path="/feed" element={<Feed/>} />
          <Route path="/posts/:id" element={<Suspense fallback={<div>Loading...</div>}><PostDetail/></Suspense>} />
        </Routes>
      </main>
    </div>
  )
}
