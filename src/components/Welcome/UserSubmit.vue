<template>
  <main>
    <v-container>
      <br>
      <br>
      <v-card>
        <v-container>
          <v-card-text>
          <v-row justify="center">
              <h3 class="underline-01">ลงทะเบียนเข้าใช้งาน</h3>
          </v-row>
          <v-row justify="center">
            <h4>เพื่อรับการแจ้งเตือน</h4>
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
<style scoped>
.underline-01 {
  background-image: linear-gradient(90deg, #e67399, #f2a640);
  background-position: bottom;
  background-size: 100% 10%;
  background-repeat: no-repeat;
}
</style>
<script>
import axios from 'axios' // api
import moment from 'moment-timezone'
export default {
  data () {
    return {
      profile: null
    }
  },
  async mounted () {
    let checkShopId = ''
    if (this.$route.query.shopId) {
      checkShopId = this.$route.query.shopId
    } else {
      const queryString = decodeURIComponent(window.location.search).replace(
        '?liff.state=',
        ''
      )
      console.log('queryString', queryString)
      const params = new URLSearchParams(queryString)
      checkShopId = params.get('shopId')
    }
    let dataLineConfig = await this.getDataLineConfig(checkShopId)
    await this.checkLiffLogin(dataLineConfig)
    // await this.onSubmit()
    if (this.$route.query.shopId) {
      setTimeout(() => this.getDataChk(), 1000)
    }
    // console.log('result', result.status)
    // console.log('likeToken', this.$route.query.likeToken)
  },
  methods: {
    async getDataChk () {
      if (this.profile.userId) {
        await axios.get(this.DNS_IP + '/member/get?shopId=' + this.$route.query.shopId + '&liffUserId=' + this.profile.userId).then(async result => {
          var lineUserIds = ''
          var liffUserIds = ''
          if (typeof result.data.status === 'undefined') {
            lineUserIds = result.data[0].lineUserId || ''
            liffUserIds = result.data[0].liffUserId || ''
          }
          if (result.data.status === false) {
            await this.onSubmit()
          } else if (lineUserIds === '' && liffUserIds !== '') {
            await this.onUpdate(result.data[0].memberId)
          } else if (lineUserIds !== '' && liffUserIds !== '') {
            this.$swal(
              'ผิดพลาด!',
              'คุณได้ทำรายการนี้ไปแล้ว',
              'error'
            )
            this.$liff.sendMessages([
              {
                type: 'text',
                text: 'คุณได้ทำรายการนี้ไปแล้ว'
              }
            ])
              .then(() => {
                console.log('message sent')
                this.$liff.closeWindow()
              })
              .catch((err) => {
                console.log('error', err)
              })
          }
        })
      } else {
        this.$swal(
          'ผิดพลาด!',
          'กรุณาทำรายการใหม่',
          'error'
        )
      }
    },
    async checkLiffLogin (dataLineConfig) {
      console.log('dataLineConfig', dataLineConfig)
      await this.$liff
        .init({
          liffId: dataLineConfig.liffMainID
        }).then(async () => {
          if (process.env.NODE_ENV === 'development') {
            this.getProfile_dev()
          } else {
            if (!this.$liff.isLoggedIn()) {
              await this.$liff.login({redirectUri: window.location.href})
            } else {
              await this.getProfile()
            }
          }
        }).catch((err) => {
        // this.$router.push({ name: '404' })
          console.log(err.code, err.message)
        })
      // this.$liff.init({ 'liffId': liffId }, function (data) {})
    },
    async getProfile () {
      let _this = this
      await this.$liff.getProfile().then(function (profile) {
        _this.profile = profile
        console.log('prod', _this.profile)
      }).catch(function (error) {
        console.log('Error getting profile: ' + error)
      })
    },
    getProfile_dev () {
      this.profile = this.$profile_dev
      console.log('dev', this.profile)
    },
    async onSubmit () {
      // var idMember = 'Link_' + Date.now()
      var idMember = moment().valueOf()
      const params = {
        name: this.profile.displayName,
        picture: this.profile.pictureUrl,
        liffUserId: this.profile.userId,
        shopId: this.$route.query.shopId,
        memberId: idMember,
        CREATE_USER: this.profile.userId,
        LAST_USER: this.profile.userId
      }
      const result = await this.callBeTaskAPIActivity('post', `/member/add`, params)
      console.log('result', result.status)
      if (result.status) {
        this.$swal(
          'สำเร็จ!',
          'ยินดีต้อนรับสู่ร้านค้าของเรา',
          'success'
        )
        // window.location.replace(`https://access.line.me/dialog/bot/accountLink?linkToken=${this.$route.query.likeToken}&nonce=${idMember}-${this.profile.userId}`)
        // window.location.href = `https://access.line.me/dialog/bot/accountLink?linkToken=${this.$route.query.likeToken}&nonce=${idMember}-${this.profile.userId}`
        if (this.$liff.isInClient()) {
          this.$liff.sendMessages([
            {
              type: 'text',
              text: 'เปิดรับการแจ้งเตือนเรียบร้อย หมายเลขสมาชิกของคุณคือ ' + idMember
            }
          ])
            .then(() => {
              console.log('message sent')
              this.$liff.closeWindow()
            })
            .catch((err) => {
              console.log('error', err)
            })
        } else {
          window.location.replace(`https://access.line.me/dialog/bot/accountLink?linkToken=${this.$route.query.likeToken}&nonce=${idMember}-${this.profile.userId}-Linked`)
        }
      } else {
        this.$swal({
          title: 'เกิดข้อผิดพลาด กรุณาลองใหม่',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#b3b1ab',
          confirmButtonText: 'ตกลง'
        }).then((confirm) => {
          if (confirm.isConfirmed) {
            location.reload()
          }
        })
      }
    },
    async onUpdate (idMember) {
      // window.location.replace(`https://access.line.me/dialog/bot/accountLink?linkToken=${this.$route.query.likeToken}&nonce=${idMember}-${this.profile.userId}`)
      // window.location.href = `https://access.line.me/dialog/bot/accountLink?linkToken=${this.$route.query.likeToken}&nonce=${idMember}-${this.profile.userId}`
      if (this.$liff.isInClient()) {
        this.$liff.sendMessages([
          {
            type: 'text',
            text: 'คุณทำรายการนี้ไปแล้ว หมายเลขสมาชิกของคุณคือ ' + idMember
          }
        ])
          .then(() => {
            console.log('message sent')
            this.$liff.closeWindow()
          })
          .catch((err) => {
            console.log('error', err)
          })
      } else {
        window.location.replace(`https://access.line.me/dialog/bot/accountLink?linkToken=${this.$route.query.likeToken}&nonce=${idMember}-${this.profile.userId}-Linked`)
      }
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
