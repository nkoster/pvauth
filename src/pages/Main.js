import React, { useRef, useEffect, useState } from 'react'
import { Button, TextField } from '@material-ui/core'
import refresh from '../utils/refresh'
const TEN_MINUTES = 600000
const TEN_SECONDS = 10000

const Main = ({tokens, setTokens, inactive}) => {

  const [testText, setTestText] = useState('')

  const active = useRef(false)
  const logoutTime = useRef(Date.now() + TEN_MINUTES)
  const interval = useRef()

  const logout = _ => {
    localStorage.removeItem('portavitaTokens')
    clearInterval(interval.current)
    setTokens({})
  }

  useEffect(_ => {
    interval.current = setInterval(_ => {
      if (Date.now() > logoutTime.current) {
        console.log('Inactive, logging out')
        inactive.current = true
        logout()
      }
      if (active.current) {
        active.current = false
        logoutTime.current = Date.now() + TEN_MINUTES
        refresh(tokens, setTokens)
      }
    }, TEN_SECONDS)
  }, [])

  const onChange = evt => {
    setTestText(evt.target.value)
    active.current = true
  }

  return (
    <div>
      <h3>Protected Page</h3>
      <form>
        <TextField
          label='Portavita Test'
          onChange={onChange}
        />
      </form>
      <p>{testText}</p>
      <Button
        color='primary'
        variant='outlined'
        component='span'
        onClick={logout}
        style={{marginTop: '100px'}}
      >logout</Button>
    </div>
  )
}

export default Main
