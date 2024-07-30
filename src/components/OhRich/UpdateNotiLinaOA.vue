<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col cols="12">
          กำลังเชื่อมต่อกับ LINE OA (Connecting to LINE OA)
        </v-col>
        <v-col cols="12">
          กรุณารอสักครู่ (Please wait a moment)
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<script>
import axios from 'axios' // api
import moment from 'moment'

export default {
  data () {
    return {
      shopId: '',
      dataLineConfig: '',
      profile: null,
      bookNo: ''
    }
  },
  async mounted () {
    this.shopId = 'Ue9f527da07ff2da05246ea3f62671493'
    if (this.$route.query.bookNo) {
      this.bookNo = this.$route.query.bookNo
      if (this.profile === null) {
        this.dataLineConfig = await this.getDataLineConfig(this.shopId)
        await this.checkLiffLogin(this.dataLineConfig)
      }
      // if (this.profile !== null) {
      //   this.checkMemberOhrich()
      // }
    } else {
      const queryString = decodeURIComponent(window.location.search).replace(
        '?liff.state=',
        ''
      )
      console.log('queryString', queryString)
      const params = new URLSearchParams(queryString)
      this.bookNo = params.get('bookNo')
      if (this.profile === null) {
        this.dataLineConfig = await this.getDataLineConfig(this.shopId)
        await this.checkLiffLogin(this.dataLineConfig)
      }
    }
  },
  methods: {
    async checkLiffLogin (dataLineConfig) {
      // console.log('dataLineConfig', dataLineConfig.liffMainID)
      await this.$liff
        .init({
          // liffId: '2002311531-kpKrxaqn', withLoginOnExternalBrowser: true
          liffId: dataLineConfig.liffUpdateNotiLinaOA, withLoginOnExternalBrowser: true
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
        .then(async function (profile) {
          _this.profile = profile
          await _this.checkMemberOhrich()
        })
        .catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
    },
    getProfile_dev () {
      this.profile = this.$profile_dev
      console.log('dev', this.profile)
    },
    async checkMemberOhrich () {
      await this.saveUserId()
      await axios.get(this.DNS_IP + '/member/get?shopId=' + this.shopId + '&liffUserId=' + this.profile.userId).then(async result => {
        var lineUserIds = ''
        var liffUserIds = ''
        if (result.data.status === false) {
          await this.onSubmit()
        } else {
          lineUserIds = result.data[0].lineUserId || ''
          liffUserIds = result.data[0].liffUserId || ''
          if (lineUserIds === '' && liffUserIds !== '') {
            await this.onUpdate(result.data[0].memberId)
          }
        }
        let dttt = {
          checkGetQueue: 'False',
          firstSend: 'True'
        }
        await axios
          .post(this.DNS_IP + '/Booking/pushMsgQueueOhrich/' + this.bookNo, dttt)
          .then(async response => {}).catch(error => {
            console.log('response function pushMsgQueueOhrich : ', error)
          }).catch(error => {
            console.log('error function pushMsgQueueOhrich : ', error)
          })
      }).catch(error => {
        console.log('error function member get : ', error)
      })
      window.location.href = 'https://betask-linked.web.app/CheckQueueStoreFrontOhrich?bookNo=' + this.bookNo
    },
    async saveUserId () {
      let userId = {
        'userId': this.profile.userId
      }
      await axios.post(this.DNS_IP + '/Booking/edit/' + this.bookNo, userId).then(async response => {
        console.log('response', response)
      }).catch(error => {
        console.log('error function saveUserId : ', error)
      })
    },
    async onSubmit () {
      // var idMember = 'Link_' + Date.now()
      var idMember = moment().valueOf()
      const params = {
        name: this.profile.displayName,
        picture: this.profile.pictureUrl,
        liffUserId: this.profile.userId,
        lineUserId: this.profile.userId,
        shopId: this.shopId,
        memberId: idMember,
        CREATE_USER: this.profile.userId,
        LAST_USER: this.profile.userId
      }
      const result = await this.callBeTaskAPIActivity('post', `/member/add`, params)
      console.log('result', result.status)
    },
    async onUpdate (idMember) {
      // "https://api-belinked.betaskthai.com/member/editWebhook/" + request.body.events[0].message.text.split(" ")[2]
      // window.location.replace(`https://access.line.me/dialog/bot/accountLink?linkToken=${this.$route.query.likeToken}&nonce=${idMember}-${this.profile.userId}`)
      // window.location.href = `https://access.line.me/dialog/bot/accountLink?linkToken=${this.$route.query.likeToken}&nonce=${idMember}-${this.profile.userId}`
      const params = {
        lineUserId: this.profile.userId,
        liffUserId: this.profile.userId,
        LAST_USER: this.profile.userId
      }
      const result = await this.callBeTaskAPIActivity('post', '/member/editWebhook/' + idMember, params)
      console.log('result', result.status)
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
