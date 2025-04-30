<template>
  <view :style="{ paddingTop: navBarHeight + 'px' }" class="notes-container">
    <!-- 笔记列表 -->
    <view v-for="note in list" :key="note.id" class="note-card">
      <view class="note-header">
        <text class="note-time">{{ note.createTime }}</text>
        <text class="note-tag">{{ note.tag }}</text>
      </view>
      <view class="note-body">
        <text class="note-title">{{ note.title }}</text>
        <text class="note-content">{{ note.content }}</text>
      </view>
    </view>
    <!-- 加载中 -->
    <view v-if="loading" class="loading-text">加载中...</view>
    <!-- 没有更多内容 -->
    <view v-if="noMore" class="no-more-text">没有更多内容了</view>
  </view>
</template>
<script>
import navBarMixin from '@/mixins/navBarMixin'
import paginationMixin from '@/mixins/paginationMixin'
import { getPersonalNotesList } from '@/api/notes/notes'
import { formatTime } from '@/utils/time'

export default {
  mixins: [navBarMixin,paginationMixin],
  data() {
    return {
      navBarHeight: 0, // 导航栏+状态栏总高度
      // 可选：覆盖默认分页大小
      pagination: {
        current: 1,
        size: 10
      }
    }
  },
  onLoad() {
    this.resetPagination()
    this.loadNextPage()
  },
  methods: {
    // 实现 loadNextPage 方法
    loadNextPage() {
      this.loadData(getPersonalNotesList, {}, 'records')
    }
  }
}
</script>

<style scoped>
/* .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  } */
.notes-container {
  padding: 20rpx;
}

.note-card {
  border: 1rpx solid #e4e4e4;
  border-radius: 10rpx;
  margin-bottom: 30rpx;
  padding: 20rpx;
  background-color: #fff;
}

.note-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.note-time {
  font-size: 24rpx;
  color: #888;
}

.note-tag {
  font-size: 24rpx;
  color: #007AFF;
}

.note-body {
  display: flex;
  flex-direction: column;
}

.note-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  color: #333;
}

.note-content {
  font-size: 28rpx;
  color: #666;
}
</style>
