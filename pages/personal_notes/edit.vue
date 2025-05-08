<template>
  <view class="edit-container">
    <!-- 标签 -->
    <view class="input-group">
      <text class="input-label">标签</text>
      <input class="input-field" v-model="note.tag" placeholder="非必填" />
    </view>

    <!-- 标题 -->
    <view class="input-group">
      <text class="input-label">标题</text>
      <input class="input-field" v-model="note.title" placeholder="非必填" />
    </view>

    <!-- 来源 -->
    <view class="input-group">
      <text class="input-label">出处</text>
      <input class="input-field" v-model="note.source" placeholder="非必填" />
    </view>

    <!-- 笔记 -->
    <view class="input-group">
      <text class="input-label">笔记</text>
      <textarea class="input-field" v-model="note.content" placeholder="必填" />
    </view>

    <!-- 保存按钮 -->
    <button class="save-btn" @click="saveNote">保存</button>
  </view>
</template>

<script>
import { postPersonalNotes, getPersonalNotes,putPersonalNotes } from '@/api/notes/notes';
export default {
  data() {
    return {
      note: {
        title: '',
        content: '',
        tag: '',
        source: '' // 新增字段
      }
    };
  },
  onLoad(option) {
    if (option && option.id) {
      getPersonalNotes(option.id).then(res => {
        this.note = res.data;
      }).catch(err => {
        console.error(err);
      });
    }
  },
  methods: {
    saveNote() {
      if (this.note.id) {
        putPersonalNotes(this.note).then(() => {
          uni.showToast({ title: '修改成功' });
          setTimeout(() => {
            uni.navigateBack(); // 返回上一页
          }, 800);
        }).catch(err => {
          uni.showToast({ title: '修改失败', icon: 'none' });
          console.error(err);
        });
      } else {
        postPersonalNotes(this.note).then(() => {
          uni.showToast({ title: '保存成功' });
          setTimeout(() => {
            uni.navigateBack(); // 返回上一页
          }, 800);
        }).catch(err => {
          uni.showToast({ title: '保存失败', icon: 'none' });
          console.error(err);
        });
      }
    }
  }
};
</script>

<style scoped>
.edit-container {
  padding: 40rpx;
  background-color: #f8f9fa;
}

.input-group {
  margin-bottom: 40rpx;
}

.input-label {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: block;
}

.input-field {
  width: 100%;
  min-height: 80rpx;
  font-size: 28rpx;
  border-radius: 16rpx;
  border: 1rpx solid #ccc;
  background-color: #fff;
  box-sizing: border-box;
  box-shadow: inset 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  /* 垂直居中 */
  padding: 0 32rpx;
}

.content-field {
  width: 100%;
  min-height: 80rpx;
  /* 增加最小高度 */
  padding: 24rpx 32rpx;
  /* 增加内边距 */
  font-size: 28rpx;
  border-radius: 16rpx;
  border: 1rpx solid #ccc;
  background-color: #fff;
  box-sizing: border-box;
  box-shadow: inset 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.content-field {
  height: 300rpx;
  line-height: 44rpx;
  overflow-y: auto;
  resize: none;
  /* 防止 textarea 被拖拽改变大小 */
}

.save-btn {
  margin-top: 60rpx;
  background-color: #007AFF;
  color: white;
  font-size: 30rpx;
  border-radius: 40rpx;
  padding: 24rpx 0;
  font-weight: bold;
  box-shadow: 0 8rpx 20rpx rgba(0, 122, 255, 0.2);
}

.save-btn:active {
  opacity: 0.85;
}
</style>