import request from '@/utils/request'

// ai搜索
export function getAiNotesByKeyword(data) {
  return request({
    url: '/personal-notes/relative/ai-keyword',
    method: 'get',
    params: data
  })
}

// 根据关键字查询es笔记
export function getEsNotesByKeyword(data) {
  return request({
    url: '/personal-notes/relative/es-keyword',
    method: 'get',
    params: data
  })
}

// 删除个人笔记至回收站
export function putPersonalNotesRecycle(data) {
  return request({
    url: `/personal-notes/recycle/${data}`,
    method: 'put'
  })
}

// 修改个人笔记
export function putPersonalNotes(data) {
  return request({
    url: '/personal-notes/update',
    method: 'put',
    data: data
  })
}

// 查询个人笔记
export function getPersonalNotes(data) {
  return request({
    url: `/personal-notes/detail/${data}`,
    method: 'get'
  })
}

// 查询用户个人笔记列表
export function getPersonalNotesList(data) {
  return request({
    url: '/personal-notes/list',
    method: 'get',
    params: data
  })
}

// 保存个人笔记
export function postPersonalNotes(data) {
  return request({
    url: '/personal-notes/add',
    method: 'post',
    data: data
  })
}