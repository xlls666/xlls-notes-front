<template>
  <view :style="{ paddingTop: navBarHeight + 'px' }" class="notes-container">
    <!-- 笔记列表 -->
    <view v-for="note in list" :key="note.id" class="note-card">
      <view class="note-header">
        <text class="note-tag">{{ note.tag || '-' }}</text>
        <!-- <text class="note-more" @click="handleMore(note)">...</text> -->
        <uni-icons class="note-more" type="more-filled" style="font-size: 28rpx;" :style="{ height: popupHeight }"
          @click="handleMore(note)" />
      </view>
      <!-- 新增的标题与来源行 -->
      <view class="note-title-source">
        <text class="note-title">{{ note.title }}</text>
        <text class="note-source">{{ note.source }}</text>
      </view>

      <view class="note-body">
        <text class="note-content">{{ note.content }}</text>
      </view>
    </view>
    <!-- 加载中 -->
    <view v-if="loading" class="loading-text">加载中...</view>
    <!-- 没有更多内容 -->
    <view v-if="noMore" class="no-more-text">没有更多内容了</view>
    <uni-icons class="floating-icon" type="compose" size="30" color="#007AFF" @click="goToCreateNote()" />
    <u-popup :show="show" mode="center" overlayOpacity="0.1" @close="close" >
        <view class="popup-content">
          <view>
              <!-- 操作项 -->
              <view class="popup-item" @click="editNote()">
                <u-icon name="edit-pen" size="24" color="#666"></u-icon>
                <text class="item-text">修改</text>
              </view>
              <!-- 删除按钮 -->
              <view class="popup-item delete-item" @click="deleteNote()">
                <u-icon name="trash" size="24" color="#ff5722"></u-icon>
                <text class="item-text delete-text">删除</text>
              </view>
              <!-- 时间信息 -->
              <view class="popup-time">
                <text>创建时间: {{ selectedNote.createTime | formatTime }}</text>
                <text>修改时间: {{ selectedNote.updateTime | formatTime }}</text>
              </view>
            </view>
        </view>
      </u-popup>
  </view>
</template>
<script>
import navBarMixin from '@/mixins/navBarMixin'
import paginationMixin from '@/mixins/paginationMixin'
import { getPersonalNotesList,putPersonalNotesRecycle } from '@/api/notes/notes'
import dayjs from 'dayjs'
export default {
  mixins: [navBarMixin, paginationMixin],
  filters: {
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  data() {
    return {
      navBarHeight: 0, // 导航栏+状态栏总高度
      // 可选：覆盖默认分页大小
      pagination: {
        current: 1,
        size: 10
      },
      show: false,
      selectedNote: {} // 用于存储当前选中的 note
    }
  },
  onShow() {
    this.resetPagination()
    this.loadNextPage()
  },
  methods: {
    editNote() {
      this.show = false
      this.$tab.navigateTo(`/pages/personal_notes/edit?id=${this.selectedNote.id}`)
    },
    deleteNote() {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这条笔记吗？',
        success: (res) => {
          if (res.confirm) {
            // 调用删除接口
            this.show = false
            putPersonalNotesRecycle(this.selectedNote.id).then((res) => {
              if (res.code === 200) {
                uni.showToast({
                  title: '删除成功',
                  icon: 'none'
                })
                this.resetPagination()
                this.loadNextPage()
              }
            })
          }
        }
      })
    },
    close() {
      this.show = false
      // console.log('close');
    },
    // 实现 loadNextPage 方法
    loadNextPage() {
      this.loadData(getPersonalNotesList, {recycle: false}, 'records')
    },
    handleMore(note) {
      this.selectedNote = note // 将当前 note 赋值给 selectedNote
      this.show = true
    },
    goToCreateNote(note) {
      if (note && note.id) {
        this.$tab.navigateTo(`/pages/personal_notes/edit?id=${note.id}`)
      } else {
        this.$tab.navigateTo(`/pages/personal_notes/edit`)
      }
    }
  }
}
</script>

<style scoped>
.popup-content {
  width: 600rpx;
  padding: 40rpx;
  background-color: #fff;
  border-radius: 16rpx;
}

.popup-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  font-size: 28rpx;
  color: #333;
  border-bottom: 1rpx solid #eee;
}

.item-text {
  margin-left: 20rpx;
}

.popup-divider {
  height: 1rpx;
  background-color: #eee;
  margin: 24rpx 0;
}

.delete-item {
  border-bottom: none;
}

.delete-text {
  color: #ff5722;
}

.popup-time {
  margin-top: 40rpx;
  display: flex;
  flex-direction: column;
  font-size: 24rpx;
  color: #999;
}

.notes-container {
  padding: 20rpx;
  background-color: #f8f9fa;
}

.note-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.note-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30rpx;
  flex-wrap: wrap;
  /* 允许换行，避免拥挤 */
}

.note-tag {
  font-size: 24rpx;
  color: #007aff;
  font-weight: 500;
  padding: 4rpx 16rpx;
  border-radius: 40rpx;
  background-color: #e6f0ff;
  margin-right: 20rpx;
  /* 新增：与 ... 保持间距 */
}

.note-title-source {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.note-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.note-source {
  font-size: 24rpx;
  color: #999999;
  margin-left: 20rpx;
  white-space: nowrap;
}

.note-body {
  display: flex;
  flex-direction: column;
}

.note-content {
  font-size: 26rpx;
  color: #666666;
  line-height: 40rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.floating-icon {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
}

.loading-text,
.no-more-text {
  text-align: center;
  font-size: 24rpx;
  color: #aaa;
  margin: 20rpx 0;
}
</style>
