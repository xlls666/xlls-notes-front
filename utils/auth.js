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

// 兼容所有平台的 Base64 解码器
function base64Decode(input) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  let str = input.replace(/=+$/, '')
  let output = ''

  if (typeof wx !== 'undefined' && wx.base64ToArrayBuffer) {
    // 微信小程序环境
    const buffer = wx.base64ToArrayBuffer(str)
    const dataView = new DataView(buffer)
    for (let i = 0; i < buffer.byteLength; i++) {
      output += String.fromCharCode(dataView.getUint8(i))
    }
    return output
  } else if (typeof atob === 'function') {
    // 浏览器环境
    return decodeURIComponent(
      atob(str).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join('')
    )
  } else {
    throw new Error('当前环境不支持 Base64 解码')
  }
}

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const decodedStr = base64Decode(base64)
    return JSON.parse(decodedStr)
  } catch (e) {
    console.error('JWT 解析失败:', e)
    return null
  }
}