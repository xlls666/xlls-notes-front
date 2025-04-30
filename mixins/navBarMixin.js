export default {
  data() {
    return {
      navBarHeight: 0
    }
  },
  mounted() {
    this.initNavBarHeight()
  },
  methods: {
    initNavBarHeight() {
      const systemInfo = uni.getSystemInfoSync()

      // #ifdef MP-WEIXIN 
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
      this.navBarHeight =
        menuButtonInfo.bottom + menuButtonInfo.top - systemInfo.statusBarHeight
      // #endif

      // #ifndef MP-WEIXIN 
      this.navBarHeight = systemInfo.statusBarHeight
      // #endif
    }
  }
}