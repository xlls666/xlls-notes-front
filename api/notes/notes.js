import request from '@/utils/request'

// 查询用户个人信息
export function getPersonalNotesList(data) {
  return request({
    url: '/personal-notes/list',
    method: 'get',
    params: data
  })
}