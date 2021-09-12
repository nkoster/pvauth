;(async _ => {

const loginURI = encodeURI('https://oic.docker.portavita.net:9090/authorize?client_id=local-react-app&redirect_uri=http://localhost:8080&nonce=asdf&response_type=id_token+token&scope=openid')
const logoutURI = encodeURI('https://docker.portavita.net:8001/uitgelogd.html')
const userInfoURI = encodeURI('https://oic.docker.portavita.net:9090/userinfo')
const div = document.querySelector('div')
const qs = decodeURI(window.location.href.split('#')[1])
const qs2obj = qs => qs
  .split('&')
  .map(s => s.split('='))
  .reduce((o, [k, v]) => (o[k] = v || true, o), {})
const data = qs2obj(qs)
if (!data.id_token) window.location.replace(loginURI)
const logout = _ => { window.location.replace(logoutURI) }
const userInfo = await fetch(userInfoURI, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${data.access_token}`
    }
  })
  .then(res => res.text())
  .catch(err => {
    throw err.message
  })
const parseJwt = (token, part) => {
  const b64 = token.split('.')[part]
    .replace(/-/g, '+').replace(/_/g, '/')
  const json = decodeURIComponent(atob(b64).split('')
    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
    .join(''))
  return JSON.parse(json)
}
div.innerHTML = `<button><span>logout</span></button><br><pre><code>${
  data.id_token ? JSON.stringify(data, null, 4) + '\n' +
    JSON.stringify(parseJwt(data.id_token, 0), null, 4) + '\n' +
    JSON.stringify(parseJwt(data.id_token, 1), null, 4) + '\n' +
    JSON.stringify(parseJwt(userInfo, 1), null, 4)
    : 'loading...'
}</code></pre>`
window.history.replaceState('PV Single Page App', 'PV Single Page App', '/')
const span = document.querySelector('span')
document.querySelector('button').addEventListener('click', logout)
const expiresIn = parseInt(data.expires_in)
if (!isNaN(expiresIn)) {
  const logoutTime = Date.now() + expiresIn * 1000
  setInterval(_ => {
    if (logoutTime - Date.now() < 1) logout()
    const minutesLeft = Math.round((logoutTime - Date.now()) / 1000 / 60)
    span.innerText = `logout (auto in ${minutesLeft} min)`
  }, 1000)
}

})()
