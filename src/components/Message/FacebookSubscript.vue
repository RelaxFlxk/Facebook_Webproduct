<template>
  <div>
    <button @click="loginWithFacebook">Login with Facebook ...</button>
    <br>
    <button @click="subscribeToPage">Subscribe to Page</button>
    <br>
    <div v-if="this.userFBID !== 221800690861882">
        <button @click="sendMessage">Send Message to Page</button>
    </div>
    <div>
      <p><strong>PSID:</strong> {{ PSID }}</p>
    </div>
    <div v-if="userData">
      <h2>User Data</h2>
      <p><strong>ID:</strong> {{ userData.id }}</p>
      <p><strong>Name:</strong> {{ userData.name }}</p>
      <p><strong>Email:</strong> {{ userData.email }}</p>
      <p><strong>DATA:</strong> {{ userData }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      webhookData: null,
      userFBID: 2218006908618821,
      userData: null,
      PSID: null
    }
  },
  methods: {
    ...mapActions('memberStore', ['getMemberProfile']),
    subscribeToPage () {
    // ตรวจสอบสถานะการเข้าสู่ระบบของผู้ใช้กับ Facebook
    // eslint-disable-next-line no-undef
      FB.getLoginStatus(response => {
        if (response.status === 'connected') {
        // หากผู้ใช้เข้าสู่ระบบ Facebook สามารถสมัครสมาชิกเพจได้
          const pageId = '110743157238372' // ระบุ ID ของเพจของคุณที่นี่
          const pageAccessToken = 'EAADYAoOXQMQBO0IdoyhDZCVz9OWgzM0vNW5gKKMVOqrVrhxyqOZBZB0Cle5fSZAJASY74bW1TGcYywfx5iHpFnif12UKqB9oVr4f5JORi5fG6WYmGZAxDmRJrJFhLCWIzXtqkcDtWil0HwSmgxnmZCdxOTE0V42dqqwabwx0QdiCKXkbFY84A1ZBeP3K31Izx7BbTkSNEDugHzZBzry4g5ftayUx' // ใส่ Page Access Token ของคุณที่นี่
          const apiUrl = `https://graph.facebook.com/v17.0/${pageId}/subscribed_apps?access_token=${pageAccessToken}`

          // ข้อมูลที่คุณต้องการรับการแจ้งเตือน
          const subscribedFields = 'messages'

          // ทำ POST request เพื่อสมัครสมาชิกเพจ
          // eslint-disable-next-line no-undef
          FB.api(apiUrl, 'post', { subscribed_fields: subscribedFields }, response => {
            if (response.success) {
              console.log('ผู้ใช้ได้ทำการสมัครสมาชิกเพจแล้ว', response)
            } else {
              console.error('เกิดข้อผิดพลาดในการสมัครสมาชิกเพจ:', response.error.message)
            }
          })
        } else {
          console.log('ผู้ใช้ยังไม่ได้เข้าสู่ระบบ Facebook')
        }
      })
    },
    sendMessage (data) {
      // สร้าง URL สำหรับ Messenger ที่มีข้อความต้อนรับ
      const pageId = '110743157238372' // ระบุ ID ของเพจของคุณ
      // const pageAccessToken = 'EAADYAoOXQMQBOxHflrJBD999YmcnvYl0pjL7rjsXxLxxWn7MSa3eHvFMtyKyDzZAT7JZBBvwJMksksYvarxTbhn6FYhYQVIOURSY6QNZCHBQBcy6bU0mZCLYq5YdZAlmwr6WKq6DyvIDNESsZBauDujn5blt6mWxhmmZC2eDwDEZBXamUnAfRNUgJP96gcQgaAYROyPdqkZBoaNKZCDTvWdOBX6rdT' // ใส่ Page Access Token ของคุณที่นี่
      const welcomeMessage = `ลูกค้า FBID: ${data.id} เปิดแจ้งเตือนผ่าน Messenger`

      const messengerUrl = `https://www.messenger.com/t/${pageId}?ref=${pageId}&text=${encodeURIComponent(welcomeMessage)}`

      // ส่งผู้ใช้ไปยัง Messenger ด้วย URL
      window.location.href = messengerUrl
      // window.open(messengerUrl, '_blank')
      // const interval = setInterval(() => {
      //   if (window.location.pathname !== '/t/') {
      //     const pathSegments = window.location.pathname.split('/')
      //     const receivedPSID = pathSegments[2] // PSID จะอยู่ในตำแหน่งที่ 2 ของ URL path
      //     if (receivedPSID) {
      //       this.PSID = receivedPSID
      //       // eslint-disable-next-line no-undef
      //       commit('SET_PSID', data.id)
      //       clearInterval(interval)
      //     }
      //   }
      // }, 1000)
    },
    async loginWithFacebook () {
      // eslint-disable-next-line no-undef
      FB.login(
        (response) => {
          if (response.authResponse) {
            this.fetchUserData()
          } else {
            console.log('User cancelled login or did not fully authorize.')
          }
        },
        { scope: 'public_profile,email' }
      )
    },
    async fetchUserData () {
      this.checkLoginStatus()
        .then((response) => {
          if (response.status === 'connected') {
            const accessToken = response.authResponse.accessToken
            const userId = response.authResponse.userID
            const apiUrl = `https://graph.facebook.com/v17.0/${userId}?fields=id,name,email&access_token=${accessToken}`
            return axios.get(apiUrl)
          } else {
            console.log('User has not logged in with Facebook.')
            return null
          }
        })
        .then(async (response) => {
          if (response) {
            this.userData = response.data
            await this.sendMessage(this.userData)
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error)
        })
    },
    checkLoginStatus () {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-undef
        FB.getLoginStatus((response) => {
          resolve(response)
        })
      })
    }
  },
  mounted () {
    window.fbAsyncInit = function () {
      // eslint-disable-next-line no-undef
      FB.init({
        appId: '237505309262020',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v17.0'
      })
    };

    (function (d, s, id) {
      // eslint-disable-next-line one-var
      var js, fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }
      js = d.createElement(s)
      js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    })(document, 'script', 'facebook-jssdk')
  }
}
</script>
