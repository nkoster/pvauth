import React from 'react'
import './App.css'
import { useState, useEffect, useRef } from 'react'
import Login from './pages/Login'
import Main from './pages/Main'
import '@fontsource/roboto'

const App = _ => {

  const [tokens, setTokens] = useState({})
  const [loading, setLoading] = useState(true)

  const inactive = useRef(false)

  useEffect(_ => {
    let tokens = localStorage.getItem('portavitaTokens')
    if (!tokens) {
      setLoading(false)
      return
    }
    try {
      tokens = JSON.parse(tokens)
    } catch(err) {
      setLoading(false)
      return
    }
    if (tokens.accessToken) {
      fetch('https://auth.w3b.net/verify', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: tokens.accessToken
        })
      })
      .then(res => res.json())
      .then(res => {
        if (res.result) {
          setTokens(tokens)
        } else {
          localStorage.removeItem('portavitaTokens')
        }
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        console.log(err.message)
      })
    }
  }, [])

  if (loading) return (
    <div className='App'>
      <p>loading...</p>
    </div>
  )

  return (
    <div className='App-header'>
      {tokens.accessToken
        ? <Main
            setTokens={setTokens}
            tokens={tokens}
            inactive={inactive}
          />
        : <Login
            setTokens={setTokens}
            inactive={inactive}
          />}
    </div>
  )
}

export default App
