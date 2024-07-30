<template>
<v-main>
    <v-card class="content pa-3"
    min-height="100vh"
    :style="'background-color:'+ DarkModeBackground +';'"
    >
    <br>
    <br>
      <!-- <img :src="LoGo" class="a" style="height:67.03px"> -->
    <v-card class="pa-3 mt-10" min-height="40vh"  v-if="profile">
      <v-row>
      <v-col class="text-center mt-n3 mb-8">
        <v-avatar class="mt-n16 pa-1" :style="'border:2px solid' + DarkModeButton +';'" :color="DarkModeBackground" size="130">
        <img
          :src="LoGo"
        >
      </v-avatar>
      </v-col>
    </v-row>
    <h4 class="text-center" :style="'color:' + DarkModefont +';'">ยืนยันข้อมูลการเข้ารับบริการ</h4>
    <div class="text-center" :style="'color:' + DarkModefont +';'" v-if="shop.length > 0">{{shop[0].shopName}}</div>
      <div class="avatar text-center">
          <v-avatar size="120" style="border:5px solid #FFFFFF;">
              <img :src= profile.pictureUrl>
          </v-avatar>
          <!-- <p class="text-center">{{profile.displayName}}</p> -->
      </div>
        <br>
        <h4 class="text-center" style="color:#000000;">{{profile.displayName}}</h4>
          <div >
              <br>
              <v-row >
                <v-col cols="6">
                  <v-row v-for="(a , index) in jobitem" :key="index" style="margin: 0px;">
                    <v-col cols="12" style="padding-top: 0px;"  v-if="index < 3">
                      <!-- v-if="a.showCard !== 'False'" -->
                      <div >
                        <p class="text-left font-weight-medium" style="color:#000000;margin-bottom: 0px;margin-start:20px;">
                          {{a.name + ':  ' + a.value}}</p>
                        <!-- <p class="text-left font-weight-medium" style="color:#959597;margin-bottom: 0px;margin-start:20px;">
                          {{a.value}}</p> -->
                      </div>
                    </v-col>
                    <!-- <v-col cols="6">
                    </v-col> -->
                  </v-row>
                </v-col>
                  <v-col cols="6" style="padding-top: 0px;" v-if="jobitem.length > 0">
                      <!-- v-if="a.showCard !== 'False'" -->
                      <div >
                        <p class="text-left font-weight-medium" style="color:#000000;margin-bottom: 0px;margin-start:20px;">
                          วันที่เข้ารับบริการ</p>
                        <p class="text-left" style="color:#959597;margin-bottom: 0px;margin-start:20px;">
                          {{ momenDate_1(jobitem[0].endDate)}}</p>
                      </div>
                      <div >
                        <p class="text-left font-weight-medium" style="color:#000000;margin-bottom: 0px;margin-start:20px;">
                          เวลารับรถ</p>
                        <p class="text-left font-weight-medium" style="color:#959597;margin-bottom: 0px;margin-start:20px;">
                          {{jobitem[0].endTime}}</p>
                      </div>
                    </v-col>
              </v-row>
          </div>
          <br>
      </v-card>
        <div class="text-center mt-10">
          <v-btn
          class="ma-2 button"
          :color="DarkModeButton"
          @click="jobConfirm()"
          dark>
              ยืนยัน
          </v-btn>
          <v-btn
          class="ma-2 button"
          :color="DarkModeButton"
          dark
          @click="clearData()"
          >
              ยกเลิก
          </v-btn>
        </div>
    </v-card>
</v-main>
</template>

<script>
import axios from 'axios' // api
import moment from 'moment'

export default {
  components: {

  },
  data () {
    return {
      jobitem: [],
      jobId: this.$route.query.jobId,
      shopId: this.$route.query.shopId,
      profile: [],
      job: null,
      DarkMode: '',
      DarkModeStatus: null,
      DarkModeButton: '',
      DarkModeBackground: '',
      DarkModefont: '',
      ColorByShop: [],
      LoGo: [],
      shop: [],
      dataLineConfig: {}
    }
  },
  async mounted () {
    await this.getShop()
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
    this.dataLineConfig = dataLineConfig
    await this.checkLiffLogin(dataLineConfig)
    await this.getjob()
  },
  methods: {
    async getShop () {
      if (this.$route.query.shopId) {
        await axios.get(this.DNS_IP + '/sys_shop/get?shopId=' + this.$route.query.shopId).then(response => {
          let rs = response.data
          if (rs.length > 0) {
            this.shop = rs
            rs.forEach(v => {
              if (v.primaryColor) {
                this.ColorByShop.push(v.primaryColor, v.secondaryColor)
                this.DarkModeBackground = v.primaryColor
                this.DarkModeButton = v.secondaryColor
              } else {
                this.ColorByShop.push('#E1F3FF', '#FFFFFF')
                this.DarkModeBackground = '#FFFFFF'
                this.DarkModeButton = '#E1F3FF'
              }
              if (v.shopImge) {
                this.LoGo = v.shopImge
              } else {
                this.LoGo = require('@/assets/Booking.png')
              }
              if (v.darkMode === 'True') {
                this.DarkMode = '#FFFFFF'
                this.DarkModefont = '#FFFFFF'
                this.DarkModeStatus = true
              } else {
                this.DarkMode = '#ffffff00'
                this.DarkModefont = '#173053'
                this.DarkModeStatus = false
              }
            })
          } else {
            this.shop = null
          }
          console.log('this.LoGo', this.LoGo)
        })
      } else {
        this.ColorByShop.push('#E1F3FF', '#FFFFFF')
        this.DarkMode = '#ffffff00'
        this.DarkModefont = '#173053'
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
              this.$liff.login({redirectUri: window.location.href})
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
    async getjob () {
      this.jobitem = []
      axios.get(this.DNS_IP + '/job/getJobId?jobId=' + this.jobId).then((response) => {
        let rs = response.data
        if (rs.length > 0) {
          console.log('rs', rs)
          if (rs[0].userId === null || rs[0].userId === '') {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {
                Id: d.jobId,
                value: d.fieldValue,
                name: d.fieldName,
                showCard: d.showCard,
                flowId: d.flowId,
                endDate: d.endDate,
                endTime: d.endTime
              }
              this.jobitem.push(s)
            }
            console.log('job', this.jobitem)
          } else {
            if (rs[0].RECORD_STATUS === 'N') {
              for (let i = 0; i < rs.length; i++) {
                let d = rs[i]
                let s = {
                  Id: d.jobId,
                  value: d.fieldValue,
                  name: d.fieldName,
                  showCard: d.showCard,
                  flowId: d.flowId,
                  endDate: d.endDate,
                  endTime: d.endTime
                }
                this.jobitem.push(s)
              }
              console.log('job', this.jobitem)
            } else {
              this.alert()
            }
          }
        }
      })
    },
    async jobConfirm () {
      this.$swal({
        title: 'ต้องการ ยืนยันข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async () => {
          const result = await axios.get(this.DNS_IP + '/member/get?shopId=' + this.shopId + '&liffUserId=' + this.profile.userId)
          console.log('result', result.data.status)
          if (result.data.status === false) {
            let statusSend = {
              statusSend: 'false',
              userId: this.profile.userId
            }
            console.log('this.jobId', this.jobId)
            await axios.post(this.DNS_IP + '/job/updateStatus/' + this.jobId, statusSend).then(async (response) => {
              console.log(response)
              if (this.dataLineConfig.checkConfig !== false) {
                this.getDataChkMember()
              } else {
                this.getBotinfo('memberNo')
              }
              this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success').then(result => {
                this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=jobConfirm')
              }).catch((error) => {
                console.log('error function addData : ', error)
                this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=jobConfirm')
              })
            })
          } else {
            let statusSend = {
              statusSend: 'true',
              userId: this.profile.userId
            }
            console.log('this.jobId', this.jobId)
            console.log('statusSend', statusSend)
            await axios.post(this.DNS_IP + '/job/updateStatus/' + this.jobId, statusSend).then(async (response) => {
              console.log(response)
              if (this.dataLineConfig.checkConfig !== false) {
                this.getDataChkMember()
              }
              this.pushmessage()
              this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success').then(result => {
                this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=jobConfirm')
              }).catch((error) => {
                console.log('error function addData : ', error)
                this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=jobConfirm')
              })
            })
          }
        })
    },
    async pushmessage () {
      let updateStatusSend = {
        updateStatusSend: 'false'
      }
      await axios
        .post(
          this.DNS_IP + '/job/pushMsg/' + this.jobId, updateStatusSend
        )
        .then(response => {
          console.log(JSON.stringify(this.jobId))
        })
    },
    async alert () {
      this.$swal('คุณมีข้อมูลอยู่แล้ว', '', 'success').then(result => {
        this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=jobConfirm')
      }).catch((err) => {
        // this.$router.push({ name: '404' })
        console.log(err.code, err.message)
        this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=jobConfirm')
      })
    },
    async clearData () {
      this.$liff.closewindow()
    },
    async getBotinfo (text) {
      let url = `${this.DNS_IP}/line/getOa`
      // const url = 'http://localhost:81/Api/vgroupl_api/v1/Zoom/Login/getData?'
      const config = {
        headers: {
          'botId': this.shopId
        }
      }
      await axios.get(url, config).then((response) => {
        let rs = response.data
        console.log('rs1', rs)
        if (text === 'memberNo') {
          // window.location.href = 'https://line.me/R/oaMessage/' + rs.basicId + `?เปิดรับการแจ้งเตือน ` + this.profile.userId
          window.location.href = 'https://line.me/R/oaMessage/' + rs.basicId + `/?เปิดรับการแจ้งเตือน`
        } else {
          window.location.href = 'line://ti/p/' + rs.basicId
        }
      })
    },
    async getDataChkMember () {
      if (this.profile.userId) {
        await axios.get(this.DNS_IP + '/member/get?shopId=' + this.$route.query.shopId + '&liffUserId=' + this.profile.userId).then(async result => {
          var lineUserIds = ''
          var liffUserIds = ''
          // if (typeof result.data.status === 'undefined') {
          //   lineUserIds = result.data[0].lineUserId || ''
          //   liffUserIds = result.data[0].liffUserId || ''
          // }
          if (result.data.status === false) {
            await this.onSubmit()
          } else {
            lineUserIds = result.data[0].lineUserId || ''
            liffUserIds = result.data[0].liffUserId || ''
            if (lineUserIds === '' && liffUserIds !== '') {
              await this.onUpdate(result.data[0].memberId)
            }
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
    async onSubmit () {
      // var idMember = 'Link_' + Date.now()
      var idMember = moment().valueOf()
      const params = {
        name: this.profile.displayName,
        picture: this.profile.pictureUrl,
        liffUserId: this.profile.userId,
        lineUserId: this.profile.userId,
        shopId: this.$route.query.shopId,
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

<style scoped>
.button {
  width: 40%;
  color: #fff;
  font-weight: 200;
  letter-spacing: 1px;
  margin: 6px 3px;
  padding: 10px 28px;
  border-radius: 25px !important;
  background-color: #0047A5;
}
  .main{
  padding: 0px;
  background: #FFFFFF;
  height: 100vh;
  }
  .content{
    overflow:auto;
    white-space: normal;
  }
  .a{
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0px;
}

</style>
