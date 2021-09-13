const parseJwt = (token, part) => {
  let b64
  try {
    b64 = token.split('.')[part]
      .replace(/-/g, '+').replace(/_/g, '/')
  } catch {
    b64 = ''
  }
  const json = decodeURIComponent(atob(b64).split('')
    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
    .join(''))
  return json ? JSON.parse(json) : {}
}

export default parseJwt
