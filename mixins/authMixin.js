// utils/authMixin.js
import { getToken } from '@/utils/auth'

export default {
  onLoad() {
    if (!getToken()) {
      // 保存当前页面路径
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const route = currentPage.route
      uni.setStorageSync('lastPage', route)
      this.$tab.reLaunch('/pages/login')
    }
  }
}