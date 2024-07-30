<template>
  <main>
    <v-container>
      <br>
      <br>
      <v-card>
        <v-container>
          <v-card-text>
          <v-row justify="center">
              <h3 class="underline-01">อัพเดทเรียบร้อย</h3>
          </v-row>
          <v-row justify="center">
            <h4>ท่านสามารถได้รับการแจ้งเตือนแล้ว</h4>
          </v-row>
          <v-row justify="center">
            <h4>{{messageText}}</h4>
          </v-row>
          </v-card-text>
          <hr>
            <v-card-text>
           <v-row justify="center">
              <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FLINE_ALBUM_220214_0.jpg?alt=media&token=6389daf9-9473-4b5d-8b19-2afb67d015e4" max-width="150"></v-img>
              <!-- <v-img :src="require('@/assets/LINE_ALBUM_220214_0.jpg')" max-width="150"></v-img> -->
           </v-row>
           </v-card-text>
           <hr>
        </v-container>
      </v-card>
    </v-container>
  </main>
</template>

<script>
import axios from 'axios' // api

export default {
  components: {
    name: ''
  },
  data () {
    return {
      profile: [],
      shopId: '',
      memberId: '',
      messageText: ''
    }
  },
  async mounted () {
    this.messageText = 'กรุณารอซักครู่'
    let checkShopId = ''
    let checkMemberId = ''
    if (this.$route.query.shopId) {
      checkShopId = this.$route.query.shopId
      checkMemberId = this.$route.query.memberId
    } else {
      const queryString = decodeURIComponent(window.location.search).replace(
        '?liff.state=',
        ''
      )
      console.log('queryString', queryString)
      const params = new URLSearchParams(queryString)
      checkShopId = params.get('shopId')
      checkMemberId = params.get('memberId')
    }
    this.shopId = checkShopId
    this.memberId = checkMemberId
    let dataLineConfig = await this.getDataLineConfig(checkShopId)
    await this.checkLiffLogin(dataLineConfig)
    setTimeout(() => this.getDataChkMember(), 500)
  },
  methods: {
    async checkLiffLogin (dataLineConfig) {
      await this.$liff
        .init({
          liffId: dataLineConfig.liffMainID
        })
        .then(async () => {
          if (process.env.NODE_ENV === 'development') {
            this.getProfile_dev()
          } else {
            if (!this.$liff.isLoggedIn()) {
              this.$liff.login({ redirectUri: window.location.href })
            } else {
              await this.getProfile()
            }
          }
        })
        .catch(err => {
          // this.$router.push({ name: '404' })
          console.log(err.code, err.message)
        })
      // this.$liff.init({ 'liffId': liffId }, function (data) {})
    },
    async getProfile () {
      let _this = this
      await this.$liff
        .getProfile()
        .then(function (profile) {
          _this.profile = profile
          console.log('prod', _this.profile)
        })
        .catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
    },
    getProfile_dev () {
      this.profile = this.$profile_dev
      console.log('dev', this.profile)
    },
    async getDataChkMember () {
      if (this.profile.userId) {
        await axios.get(this.DNS_IP + '/member/get?shopId=' + this.shopId + '&memberId=' + this.memberId).then(async result => {
          if (result.data.status === false) {
            this.$swal(
              'ผิดพลาด!',
              'เนื่องจากรหัสลูกค้าไม่ถูกต้อง กรุณาติดต่อร้านค่า',
              'error'
            )
            this.messageText = 'เนื่องจากรหัสลูกค้าไม่ถูกต้อง กรุณาติดต่อร้านค่า'
          } else {
            await this.onUpdate(result.data[0].memberId, result.data[0].liffUserId)
            this.messageText = 'อัพเดทสำเร็จ'
          }
        })
      }
      // } else {
      //   this.$swal(
      //     'ผิดพลาด!',
      //     'กรุณาทำรายการใหม่',
      //     'error'
      //   )
      // }
    },
    async onUpdate (idMember, liffUserId) {
      const params = {
        lineUserId: this.profile.userId,
        liffUserId: this.profile.userId,
        LAST_USER: this.profile.userId
      }
      const result = await this.callBeTaskAPIActivity('post', '/member/editWebhook/' + idMember, params)
      console.log('result', result.status)
      const paramsUserId = {
        newUserId: this.profile.userId,
        oldUserId: liffUserId,
        shopId: this.shopId
      }
      const resultUserId = await this.callBeTaskAPIActivity('post', '/member/updateUserIdBookingAndJob', paramsUserId)
      console.log('resultUserId', resultUserId.status)
    },
    async callBeTaskAPIActivity (method, url, params) {
      let result = null
      //   const token = this.$liff.getAccessToken() || '1234567890'
      await axios({
        method: method,
        // headers: {
        //   accessToken: token,
        //   lineUserId: this.profile.userId,
        //   activityId: this.formUpdate.activityId
        // },
        url: this.DNS_IP + url,
        data: params
      }).then((response) => {
        result = response.data
      }).catch((error) => {
        console.log(error)
        result = null
      })
      return result
    }
  }
}
</script>

<style scoped>
.roundDialog {
  border-radius: 30px;
}
.button {
  width: 45%;
  color: #fff;
  font-weight: 200;
  letter-spacing: 1px;
  margin: 6px 3px;
  padding: 10px 28px;
  border-radius: 25px !important;
  background-color: #0047a5;
}
.portrait.v-card {
  margin: 0 auto;
  max-width: 600px;
  width: 100%;
}
.main {
  padding: 0px;
  background: #ffffff;
}
.content {
  border-radius: 10px;
}
.a {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0px;
}
.InputData {
  margin: 0px !important;
  padding: 0px !important;
}
</style>
