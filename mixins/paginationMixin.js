// @/mixins/paginationMixin.js
export default {
  data() {
    return {
      list: [],           // 当前数据列表
      total: 0,           // 总数
      loading: false,     // 是否正在加载
      noMore: false,      // 是否无更多数据
      pagination: {
        current: 1,
        size: 10
      }
    }
  },
  methods: {
    // 加载数据（需在页面中调用）
    loadData(getDataApi, params = {}, dataField = 'records') {
      this.loading = true

      const requestParams = {
        ...this.pagination,
        ...params
      }

      return getDataApi(requestParams)
        .then(res => {
          const { [dataField]: records, total } = res.data

          this.list = [...this.list, ...records]
          this.total = total
          this.noMore = this.list.length >= this.total

          return res
        })
        .catch(err => {
          console.error('加载失败', err)
          uni.showToast({ title: '加载失败', icon: 'none' })
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 重置分页参数（用于刷新）
    resetPagination() {
      this.list = []
      this.total = 0
      this.noMore = false
      this.pagination.current = 1
    }
  },
  onReachBottom() {
    if (!this.loading && !this.noMore) {
      this.pagination.current += 1
      this.loadNextPage()
    }
  },
  // 子类中实现此方法以触发加载
  loadNextPage() {
    // 需要子类覆盖
  }
}