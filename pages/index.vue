<template>
  <view :style="{ paddingTop: (statusBarHeight + navBarHeight) + 'px' }" class="notes-container">
    <!-- 顶部导航栏 -->
    <view class="top-bar">
      <view class="top-bar-left">
        <!-- <u-icon name="menu" size="36" color="#333" class="menu-icon" @click="onMenuClick" /> -->
        <text class="top-bar-title">{{name ? name + '的' : ''}}个人笔记</text>
      </view>
      <view class="top-bar-right">
        <view class="icon-wrapper" @click="goToAI">
          <u-icon name="AI" size="20" color="#333" />
        </view>
        <view class="icon-wrapper" @click="goToSearch">
          <u-icon name="search" size="28" color="#333" />
        </view>
      </view>
    </view>

    <view v-if="!isLogin" class="login-prompt">
      <u-button type="primary" text="登录" shape="circle" size="large" @click="goToLogin"></u-button>
    </view>

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
    <uni-icons v-if="isLogin" class="floating-icon" type="compose" size="30" color="#007AFF"
      @click="goToCreateNote()" />
    <u-popup :show="show" mode="center" overlayOpacity="0.1" @close="close">
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
import { getPersonalNotesList, putPersonalNotesRecycle } from '@/api/notes/notes'
import dayjs from 'dayjs'
import { getToken } from '@/utils/auth'
export default {
  mixins: [navBarMixin, paginationMixin],
  filters: {
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  computed: {
    name() {
      return this.$store.state.user.name
    }
  },
  data() {
    return {
      isLogin: false,
      navBarHeight: 0, // 导航栏高度（不含状态栏）
      statusBarHeight: 0, // 状态栏高度
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
    this.isLogin = getToken()
    if (this.isLogin) {
      this.resetPagination()
      this.loadNextPage()
    }

  },
  methods: {
		goToAI(){
      this.$tab.navigateTo('/pages/ai/rag')
    },
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
      this.loadData(getPersonalNotesList, { recycle: false }, 'records')
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
    },
    goToLogin() {
      this.$tab.navigateTo('/pages/login')
    },
    goToSearch() {
      this.$tab.navigateTo('/pages/personal_notes/search')
    }
  }
}
</script>

<style lang="scss" scoped>
.notes-container {
  padding: 20rpx;
  background-color: #f8f9fa;

  .login-prompt {
    position: fixed;
    left: 50%;
    bottom: 20%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10rpx;

    &-left {
      display: flex;
      align-items: center;
    }

    &-title {
      font-size: 32rpx;
      font-weight: bold;
      margin-left: 10rpx;
      color: #333;
    }

    &-right {
      display: flex;
      align-items: center;
      padding: 6rpx 12rpx;

      .icon-wrapper {
        margin-left: 12rpx;
        cursor: pointer;
      }
    }
  }

  .note-card {
    background-color: #ffffff;
    border-radius: 16rpx;
    margin-bottom: 30rpx;
    padding: 24rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);

    .note-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30rpx;
      flex-wrap: wrap;
      /* 允许换行，避免拥挤 */

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

      .note-more {
        font-size: 28rpx;
        height: auto;
      }
    }

    .note-title-source {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

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
    }

    .note-body {
      display: flex;
      flex-direction: column;

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
    }
  }

  .loading-text,
  .no-more-text {
    text-align: center;
    font-size: 24rpx;
    color: #aaa;
    margin: 20rpx 0;
  }

  .floating-icon {
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
  }

  .menu-icon {
    cursor: pointer;
  }

  .popup-content {
    width: 600rpx;
    padding: 40rpx;
    background-color: #fff;
    border-radius: 16rpx;

    .popup-item {
      display: flex;
      align-items: center;
      padding: 24rpx 0;
      font-size: 28rpx;
      color: #333;
      border-bottom: 1rpx solid #eee;

      &.delete-item {
        border-bottom: none;

        .delete-text {
          color: #ff5722;
        }
      }

      .item-text {
        margin-left: 20rpx;
      }
    }

    .popup-time {
      margin-top: 40rpx;
      display: flex;
      flex-direction: column;
      font-size: 24rpx;
      color: #999;
    }
  }
}
</style>
