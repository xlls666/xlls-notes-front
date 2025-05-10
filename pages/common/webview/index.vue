<template>
  <view class="agreement-container">
    <scroll-view scroll-y style="height: 100vh; padding: 20rpx;">
      <view class="agreement-content" v-if="title === '用户服务协议'" v-html="agreementText"></view>
      <view class="agreement-content" v-if="title === '隐私政策'" v-html="privateText"></view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      agreementText: `
        <h2>卢曼卡片笔记 - 用户协议</h2>
        <p><strong>一、前言</strong></p>
        <p>欢迎使用卢曼卡片笔记应用。本用户协议适用于您对本应用的使用，通过注册或使用本应用，即表示您已阅读并接受本协议的所有条款。</p>
        
        <p><strong>二、服务内容</strong></p>
        <ol>
          <li>卢曼卡片笔记是一款用于个人知识管理的应用，允许用户创建、编辑和存储笔记。</li>
          <li>应用提供的所有功能仅限于学习和个人用途，禁止用于任何商业目的。</li>
        </ol>

        <p><strong>三、账号与安全</strong></p>
        <ol>
          <li>您需提供真实、有效的信息完成注册，并对其安全性负责。</li>
          <li>禁止将您的账号借给他人使用，也不得盗用他人账号。</li>
        </ol>

        <p><strong>四、用户行为规范</strong></p>
        <ol>
          <li>不得在本应用中发布任何违法、不道德或侵犯他人隐私的内容。</li>
          <li>不得利用技术手段攻击本应用或干扰其正常运行。</li>
        </ol>

        <p><strong>五、免责条款</strong></p>
        <ol>
          <li>本应用尽力保障服务的稳定性，但不对因不可抗力导致的服务中断承担责任。</li>
          <li>用户应对自己的数据备份负责，本应用不承担数据丢失的责任。</li>
        </ol>

        <p><strong>六、其他</strong></p>
        <ol>
          <li>本协议可能会根据法律法规变化进行更新，更新后将在应用内提示您查看。</li>
          <li>如有争议，双方应友好协商解决；协商不成的，可向开发者所在地法院提起诉讼。</li>
        </ol>
      `,
      privateText: `
        <h2>卢曼卡片笔记 - 隐私协议</h2>
        <p><strong>一、前言</strong></p>
        <p>我们非常重视用户的隐私保护。本隐私协议解释了我们在您使用卢曼卡片笔记时如何收集、使用和保护您的个人信息。</p>
        
        <p><strong>二、信息收集</strong></p>
        <ol>
          <li><strong>基本信息</strong>：当您注册账号时，我们会收集您的用户名等基本信息。</li>
          <li><strong>设备信息</strong>：为优化用户体验，我们可能收集您的设备型号、操作系统版本等非敏感信息。</li>
          <li><strong>使用数据</strong>：我们会记录您使用应用的功能和频率，以帮助改进产品。</li>
        </ol>

        <p><strong>三、信息使用</strong></p>
        <ol>
          <li>我们不会将您的个人信息出售给第三方。</li>
          <li>所收集的信息仅用于提供和改进我们的服务，例如个性化推荐、故障排查等。</li>
        </ol>

        <p><strong>四、数据安全</strong></p>
        <ol>
          <li>我们采取合理的技术和组织措施保护您的数据，防止未经授权的访问、泄露或滥用。</li>
          <li>数据存储在安全服务器上，仅授权人员可以访问。</li>
        </ol>

        <p><strong>五、数据保留</strong></p>
        <ol>
          <li>只要您的账户处于活动状态，我们将保留您的信息。</li>
          <li>如果您要求注销账户，我们将按照法律要求删除您的相关信息。</li>
        </ol>

        <p><strong>六、其他</strong></p>
        <ol>
          <li>本隐私政策可能会根据法律法规变化而调整，变更后会在应用内通知您。</li>
          <li>如有任何疑问或投诉，请联系我们的客服团队。</li>
        </ol>
      `,
      title: null
    };
  },
  onLoad(event) {
    this.title = event.title;
    uni.setNavigationBarTitle({
      title: event.title || "用户协议"
    });
  }
};
</script>

<style scoped>
.agreement-container {
  padding: 20rpx;
}
.agreement-content {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}
h2 {
  text-align: center;
  margin-bottom: 30rpx;
}
p, ol, li {
  margin-bottom: 20rpx;
}
</style>