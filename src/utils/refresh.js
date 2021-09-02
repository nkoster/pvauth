const refresh = async (tokens, callback) => {
  if (!tokens.refreshToken) return
  const res = await fetch('https://auth.w3b.net/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: tokens.refreshToken })
  })
  .then(r => r.json())
  .catch(err => {
    console.log(err.message)
    return
  })
  const newTokens = { ...tokens, accessToken: res.accessToken }
  callback(newTokens)
  localStorage.setItem('portavitaTokens', JSON.stringify(tokens))
}

module.exports = refresh
