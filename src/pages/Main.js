import React, { useRef, useEffect, useState } from 'react'
import { Button, TextField } from '@material-ui/core'
import { UserContext } from '../context/UserContext'
const logoutURI = encodeURI('https://docker.portavita.net:8001/uitgelogd.html')

const Main = _ => {

  const user = React.useContext(UserContext)
  const [testText, setTestText] = useState('')

  const active = useRef(false)
  const logoutTime = useRef(Date.now() + 5000)
  const [minutesLeft, setMinutesLeft] = React.useState('')
  const interval = useRef()

  const logout = _ => {
    clearInterval(interval.current)
    window.location.replace(logoutURI)
  }

  useEffect(_ => {
    if (user.expires_in > 1000) {
      logoutTime.current = Date.now() + user.expires_in * 1000
      interval.current = setInterval(_ => {
        if (Date.now() > logoutTime.current) {
          console.log('Inactive, logging out')
          logout()
        }
        setMinutesLeft(`(auto in ${Math.round((logoutTime.current - Date.now()) / 1000 / 60)} min)`)
      }, 1000)
    }
  }, [])

  const onChange = evt => {
    setTestText(evt.target.value)
    active.current = true
  }

  return (
    <div>
      <h4>{user?.userInfo?.family_name}</h4>
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
      >logout {minutesLeft}</Button>
    </div>
  )
}

export default Main
