<template>
	<view class="rag-container">
		<!-- 使用scroll-view替换title-section，支持富文本和自动高度调整 -->
		<scroll-view class="content-section" scroll-y="true" id="scrollView">
			<view v-for="(item, index) in chatList" :key="index" class="chat-item">
				<view :class="['message', item.role]">
					<text class="message-text">{{ item.content }}</text>
				</view>
			</view>
			<view v-if="isLoading" class="loading">
				<text>AI正在输入中...</text>
			</view>
		</scroll-view>

		<!-- 添加底部输入框和按钮，固定在底部 -->
		<view class="input-section">
			<input v-model="inputMessage" type="text" placeholder="请输入消息..." @confirm="sendMessage" />
			<button class="send-button" @click="sendMessage" :disabled="isLoading">发送</button>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/config.js'
import { getToken } from '@/utils/auth.js'
import { postChatStream } from '@/api/notes/rag.js'

export default {
	data() {
		return {
			chatList: [],
			inputMessage: '',
			isLoading: false,
			currentAiMessage: '',
			typewriterTimer: null // 用于模拟打字机效果的定时器
		}
	},

	onLoad() {
	},
	
	beforeDestroy() {
		// 组件销毁前清除定时器
		if (this.typewriterTimer) {
			clearTimeout(this.typewriterTimer);
		}
	},
	
	methods: {
		async sendMessage() {
			if (!this.inputMessage.trim() || this.isLoading) {
				return
			}
			
			try {
				// 添加用户消息到聊天列表
				const userMessage = this.inputMessage.trim()
				this.chatList.push({
					role: 'user',
					content: userMessage
				})
				
				// 初始化AI消息，确保角色标识为'ai'
				this.chatList.push({
					role: 'ai', // 确保角色标识为'ai'
					content: ''
				})
				
				// 设置加载状态
				this.isLoading = true
				this.inputMessage = ''
				
				// 准备请求数据
				const requestData = {
					message: userMessage,
					userId: '1',
					pageSize: 5
				}
				
				// 调用流式接口
				await this.callStreamAPI(requestData, this.chatList.length - 1) // 传递正确的aiMessageIndex
				
				// 滚动到底部
				this.scrollToBottom()
			} catch (error) {
				console.error('聊天请求失败:', error)
				this.isLoading = false
				uni.showToast({
					title: '请求失败，请重试',
					icon: 'none'
				})
			}
		},
		
		// 处理流式API调用
		callStreamAPI(requestData, aiMessageIndex) {
			return new Promise((resolve, reject) => {
				let fullResponse = '';
				
				const url = baseUrl + '/rag/chat-stream';
				
				const xhr = uni.request({
					url: url,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Authorization': getToken() ? `Bearer ${getToken()}` : ''
					},
					data: requestData,
					success: (res) => {
						// 处理完整响应
						const data = res.data || res.responseText;
						if (data) {
							fullResponse += data; // 确保每次接收到的数据都添加到fullResponse中
							this.parseStreamData(fullResponse, aiMessageIndex); // 使用完整的fullResponse进行解析
						}
						this.isLoading = false;
						resolve();
					},
					fail: (err) => {
						this.isLoading = false;
						reject(err);
					}
				});
			});
		},
		
		// 解析流式数据
		parseStreamData(data, aiMessageIndex) {
			// 获取AI回复内容
			let aiContent = '';
			if (data && data.data) {
				aiContent = data.data;
			} else if (typeof data === 'string') {
				aiContent = data;
			}
			
			// 如果没有内容，直接结束
			if (!aiContent) {
				this.isLoading = false;
				return;
			}
			
			// 拼接已有内容和新内容
			const existingContent = this.chatList[aiMessageIndex].content;
			aiContent = existingContent + aiContent; // 确保每次接收到的数据都能正确拼接到已有内容之后

			// 更新聊天列表中的AI消息内容（这里直接更新完整内容）
			this.chatList[aiMessageIndex].content = aiContent;

			// 逐字显示内容
			let index = 0;
			const displayNextCharacter = () => {
				if (index < aiContent.length) {
					// 逐步更新内容
					this.chatList[aiMessageIndex].content = aiContent.substring(0, index + 1);
					console.log('Updated content:', this.chatList[aiMessageIndex].content); // 添加调试信息
					
					index++;
					
					// 滚动到底部以显示新内容
					this.scrollToBottom();
					
					// 继续显示下一个字符
					this.typewriterTimer = setTimeout(displayNextCharacter, 20); // 20ms间隔，可以根据需要调整速度
				} else {
					// 显示完成
					this.isLoading = false;
					console.log('Display complete'); // 添加调试信息
				}
			};
			
			// 开始显示
			displayNextCharacter();
		},

		scrollToBottom() {
			this.$nextTick(() => {
				uni.pageScrollTo({
					scrollTop: 10000,
					duration: 100
				})
			})
		}
	}
};
</script>

<style scoped lang="scss">
.rag-container {
	display: flex;
	flex-direction: column;
	padding: 20rpx;
	background-color: #ffffff;
	height: 100vh;
	
	.content-section {
		flex: 1;
		width: 100%;
		padding: 20rpx 25rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
	}

	.chat-item {
		margin-bottom: 20rpx;
		
		.message {
			max-width: 80%;
			padding: 20rpx;
			border-radius: 10rpx;
			word-wrap: break-word;
			
			&.user {
				background-color: #007AFF;
				color: white;
				margin-left: auto;
			}
			
			&.ai {
				background-color: #f0f0f0;
				color: #333;
				margin-right: auto;
			}
			
			.message-text {
				font-size: 28rpx;
				line-height: 1.5;
			}
		}
	}
	
	.loading {
		text-align: center;
		padding: 20rpx;
		color: #999;
		font-size: 24rpx;
	}

	.input-section {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 20rpx 0 50rpx 0;
		
		input {
			flex: 1;
			height: 60rpx;
			border: 1px solid #ddd;
			border-radius: 30rpx;
			padding: 0 20rpx;
			margin-right: 10rpx;
			background-color: #f5f5f5;
		}
		
		.send-button {
			white-space: nowrap;
			padding: 0 30rpx;
			height: 60rpx;
			background-color: #007AFF;
			color: white;
			border-radius: 30rpx;
			
			&[disabled] {
				background-color: #ccc;
			}
		}
	}
}
</style>