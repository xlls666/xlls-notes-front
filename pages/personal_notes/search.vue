<template>
	<view class="search-container">
		<!-- 顶部导航栏 -->
		<view class="top-bar">
			<view class="search-bar">
				<u-search placeholder="搜索" bgColor="white" :showAction="false" v-model="searchText"
					@search="searchByKey"></u-search>
			</view>
		</view>

		<!-- 快捷搜索 -->
		<!-- <view class="quick-search">
      <text class="section-title">快捷搜索</text>
      <view class="tags">
        <button v-for="tag in quickTags" :key="tag" class="tag-btn" @click="onTagClick(tag)">{{ tag }}</button>
      </view>
    </view> -->

		<!-- 最近搜索 -->
		<view class="recent-search" v-if="recentSearchShow">
			<text class="section-title">最近搜索</text>
			<view class="recent-tags">
				<view v-for="item in recentSearches" :key="item" class="recent-tag">
					<text>{{ item }}</text>
					<u-icon name="trash" size="24" color="#999" @click="onDeleteRecent(item)" />
				</view>
			</view>
		</view>

		<view class="card-container">
			<view v-for="note in list" :key="note.id" class="note-card">
				<view class="note-header">
					<text class="note-tag">{{ note.tag || '-' }}</text>
					<!-- <text class="note-more" @click="handleMore(note)">...</text> -->
					<uni-icons class="note-more" type="more-filled" style="font-size: 28rpx;" :style="{ height: popupHeight }"
						@click="handleMore(note)" />
				</view>
				<!-- 新增的标题与来源行 -->
				<view class="note-title-source">
					<rich-text class="note-title" :nodes="note.title"></rich-text>

					<text class="note-source">{{ note.source }}</text>
				</view>

				<view class="note-body">
					<rich-text class="note-content" :nodes="note.content"></rich-text>
				</view>
			</view>
		</view>

		<!-- 加载中 -->
		<view v-if="loading" class="loading-text">加载中...</view>
		<!-- 没有更多内容 -->
		<view v-if="noMore" class="no-more-text">没有更多内容了</view>
		<!-- 底部AI搜索按钮 -->
		<button class="ai-search-btn" @click="openAiSearch">AI 查询 </button>
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

		<!-- AI搜索 -->
		<u-popup :show="aiShow" mode="bottom" @close="() => { this.aiShow = false }">
			<view class="ai-popup-container">
				<u-text align="center" lineHeight="70" size="20" text="AI 搜索" class="popup-title"></u-text>
				<view class="input-wrapper">
					<u-textarea placeholder="请输入内容" border="surround" v-model="aiSearchText" class="ai-input"
						height="150"></u-textarea>
				</view>
				<button class="ai-search-btn" @click="onAiSearch">搜索</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getEsNotesByKeyword,
		getAiNotesByKeyword,
		getPersonalNotesList
	} from '@/api/notes/notes.js'
	import paginationMixin from '@/mixins/paginationMixin'
	import dayjs from 'dayjs'

	export default {
		mixins: [paginationMixin],
		filters: {
			formatTime(time) {
				return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
			}
		},
		data() {
			return {
				statusBarHeight: 20, // 可根据实际情况调整或从 mixin 获取
				navBarHeight: 44,
				searchText: '',
				quickTags: ['无标签', '有链接', '有图片', '有语音', '那年今日'],
				recentSearches: [],
				recentSearchShow: true,
				show: false,
				selectedNote: {},
				aiShow: false,
				aiSearchText: '',
				searchType: 1 // 搜索类型，1：普通搜索，2：AI搜索
			};
		},
		methods: {
			searchByKey() {
				if (!this.searchText) {
					return
				}
				this.recentSearchShow = false
				this.searchType = 1
				this.resetPagination()
				this.loadNextPage()
			},
			// 实现 loadNextPage 方法
			loadNextPage() {
				if (this.searchType === 1) {
					// this.loadData(getEsNotesByKeyword, { keyword: this.searchText }, 'records');

					this.loadData(getPersonalNotesList, {
						recycle: false,
						keyword: this.searchText
					}, 'records')

					let keywordJson = uni.getStorageSync('es_search_keyword');
					let keywordArray = keywordJson ? JSON.parse(keywordJson) : [];

					// 如果已存在该关键词，则先移除旧项
					const index = keywordArray.indexOf(this.searchText);
					if (index > -1) {
						keywordArray.splice(index, 1);
					}

					// 将当前搜索词插入到数组最前面
					keywordArray.unshift(this.searchText);

					// 保留最多 10 条记录
					if (keywordArray.length > 10) {
						keywordArray = keywordArray.slice(0, 10);
					}

					// 保存回 storage（以 JSON 字符串形式）
					uni.setStorageSync('es_search_keyword', JSON.stringify(keywordArray));
				} else if (this.searchType === 2) {
					this.loadData(getAiNotesByKeyword, {
						keyword: this.aiSearchText
					}, 'records');
				}

			},

			onDeleteRecent(item) {
				this.recentSearches = this.recentSearches.filter(i => i !== item);
				uni.setStorageSync('es_search_keyword', JSON.stringify(this.recentSearches));
			},
			editNote() {
				this.show = false
				this.$tab.navigateTo(`/pages/personal_notes/edit?id=${this.selectedNote.id}`)
			},
			deleteNote() {
				console.log('deleteNote', item)
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
			handleMore(note) {
				this.selectedNote = note // 将当前 note 赋值给 selectedNote
				this.show = true
			},
			openAiSearch() {
				this.aiShow = true
			},
			onAiSearch() {
				// AI 搜索逻辑
				this.aiShow = false
				this.recentSearchShow = false
				this.searchType = 2
				this.resetPagination()
				this.loadNextPage()
			}
		},
		onLoad() {
			const keywordJson = uni.getStorageSync('es_search_keyword');
			if (keywordJson) {
				try {
					const keywordArray = JSON.parse(keywordJson);
					this.recentSearches = keywordArray;
					this.recentSearchShow = true;
				} catch (e) {
					// 解析失败时做容错处理
					this.recentSearches = [];
				}
			}
		}
	};
</script>

<style scoped lang="scss">
	.search-container {
		padding: 0 20rpx;
		height: 100%;
		box-sizing: border-box;

		// 顶部导航栏
		.top-bar {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			display: flex;
			align-items: center;
			padding: 0 20rpx;
			z-index: 1000;
			box-sizing: border-box;

			.search-bar {
				width: 100%;
			}
		}

		// .quick-search {
		//   margin-top: calc(44px + 20rpx + 20rpx + 20rpx);
		//   /* navBarHeight + padding + margin */
		// }

		// 最近搜索 
		.recent-search {
			margin-top: calc(44px + 20rpx + 20rpx + 20rpx);

			.section-title {
				font-size: 28rpx;
				font-weight: bold;
				margin-bottom: 20rpx;
				color: #333;
			}

			.recent-tags {
				margin-top: 17rpx;
				display: flex;
				flex-wrap: wrap;
				gap: 12rpx;

				.recent-tag {
					display: flex;
					align-items: center;
					background-color: #e0e0e0;
					border-radius: 16rpx;
					padding: 10rpx 20rpx;
					font-size: 26rpx;
					color: #666;

					u-icon {
						margin-left: 10rpx;
						cursor: pointer;
					}
				}
			}
		}

		// .tags {
		//   display: flex;
		//   flex-wrap: wrap;
		//   gap: 12rpx;
		// }

		// .tag-btn {
		//   background-color: #f0f0f0;
		//   border: none;
		//   border-radius: 16rpx;
		//   padding: 10rpx 20rpx;
		//   font-size: 26rpx;
		//   color: #333;
		//   cursor: pointer;
		// }
		.card-container {
			margin-top: 100rpx;

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
		}


		.loading-text,
		.no-more-text {
			text-align: center;
			font-size: 24rpx;
			color: #aaa;
			margin: 20rpx 0;
		}

		.ai-search-btn {
			position: fixed;
			bottom: 100rpx;
			left: 50%;
			transform: translateX(-50%);
			background-color: #007aff;
			color: white;
			font-size: 30rpx;
			border-radius: 40rpx;
			padding: 20rpx 60rpx;
			box-shadow: 0 8rpx 20rpx rgba(0, 122, 255, 0.2);
			font-weight: bold;
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

		.ai-popup-container {
			height: 900rpx;
			padding: 0 40rpx;
		}
	}
</style>