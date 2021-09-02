import React, { useState } from 'react'
import { TextField, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const Error = _ => {
  return <p>something went wrong, it might be you</p>
}

const Login = ({setTokens}) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(false)
  
  const classes = useStyles()

  const onChangeUsername = evt => setUsername(evt.target.value)
  const onChangePassword = evt => setPassword(evt.target.value)

  const onLogin = evt => {
    evt.preventDefault()
    fetch('https://auth.w3b.net/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username, password
      })
    })
    .then(res => res.json())
    .then(tokens => {
      if (!tokens.accessToken) {
        setErr(true)
        return
      }
      localStorage.setItem('portavitaTokens', JSON.stringify(tokens))
      setTokens(tokens)
    })
    .catch(err => {
      console.log(err.message)
      setErr(true)
    })
  }
  return (
    <div style={{maxWidth: '600px'}}>
      {err && <Error />}
      <form onSubmit={onLogin} >
        <div className={classes.box} >
          <TextField 
            type='text'
            name='username'
            label='Username'
            className={classes.root}
            onChange={onChangeUsername}
          />
          <TextField
            type='password'
            name='password'
            label='Password'
            className={classes.root}
            onChange={onChangePassword}
          />
          <Button
            color='primary'
            variant='outlined'
            type='submit'
            className={classes.root}
            >Login</Button>
        </div>
      </form>
    </div>
  )
}

const useStyles = makeStyles({
  root: {
    borderRadius: 3,
    margin: '10px',
  },
  box: {
    marginTop: '100px',
    maxWidth: '700px',
    display: 'flex',
    alignItems: 'baseline'
  }
})

export default Login
