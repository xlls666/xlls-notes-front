import request from '@/utils/request'

export function postChat(data) {
  return request({
    url: '/rag/chat',
    method: 'post',
    data: data
  })
}

export function postChatStream(data) {
  return request({
    url: '/rag/chat-stream',
    method: 'post',
    data: data
  })
}