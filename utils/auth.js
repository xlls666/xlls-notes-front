const TokenKey = 'Notes-Token'

export function getToken() {
  const token = uni.getStorageSync(TokenKey)
  if (!token) {
    return false
  }
  const decoded = parseJwt(token)
  if (!decoded || !decoded.exp) {
    return false
  }

  if(decoded.exp <= Date.now() / 1000){
    return false
  }
  return token  
}

export function setToken(token) {
  return uni.setStorageSync(TokenKey, token)
}

export function removeToken() {
  return uni.removeStorageSync(TokenKey)
}

// 解析 JWT 令牌
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))

    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}