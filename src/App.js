import React from 'react'
import './App.css'
import { useState, useEffect } from 'react'
import Main from './pages/Main'
import '@fontsource/roboto'
import parseJwt from './utils/parseJwt'
import { UserContext } from './context/UserContext'

const App = _ => {

  const loginURI = encodeURI('https://oic.docker.portavita.net:9090/authorize?client_id=local-react-app&redirect_uri=http://localhost:8080&nonce=asdf&response_type=id_token+token&scope=openid')
  const userInfoURI = encodeURI('https://oic.docker.portavita.net:9090/userinfo')

  const [loading, setLoading] = useState(true)
  const [user, setUser] = React.useState()

  useEffect(_ => {
    const qs = decodeURI(window.location.href.split('#')[1])
    const qs2obj = qs => qs.split('&')
        .map(s => s.split('='))
        .reduce((o, [k, v]) => (o[k] = v || true, o), {})
    const data = qs2obj(qs)
    setUser(data)
    if (!data.access_token) window.location.replace(loginURI)
    window.history.replaceState('FHIR Station', 'FHIR Station', '/')
    ;(async _ => {
      const userInfo = data.access_token ? await fetch(userInfoURI, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      })
      .then(res => res.text())
      .catch(err => {
        throw err.message
      }) : ''
      setUser(current => ({ ...current, userInfo: parseJwt(userInfo, 1) }))
    })()
    setUser(data)
    setLoading(false)
  }, [])

  if (loading) return (
    <div className='App'>
      <p>loading...</p>
    </div>
  )

  return (
    <UserContext.Provider value={user}>
      <div className='App-header'>
        {user.access_token
          ? <Main />
          : <p>Authenticating...</p>}
      </div>
    </UserContext.Provider>
  )
}

export default App
