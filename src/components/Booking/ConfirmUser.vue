<template>
  <v-main>
    <v-card
    :ripple="false"
    :img="ImgCover"
    height="240px"
    width="100%"
    >
    </v-card>
    <v-card class="pa-6 pb-10 mt-n10"
    :color="DarkModeBackground"
          :style="'background-color:'+ DarkModeBackground +';min-height: 100vh;border-radius: 45px 45px 0px 0px;'"
          >
        <v-row>
          <v-col class="text-center">
            <v-avatar class="mt-n16 pa-1" style="" :color="DarkModeBackground" size="150">
            <img
              :src="LoGo"
            >
          </v-avatar>
          </v-col>
         </v-row>
    <v-card class="pa-3 pt-6 pb-6 mt-16" elevation="10" v-if="checkMobile">
    <div v-if="redirectBy === 'BookingForm'" class="pa-0 ma-0">
        <div v-if="bookingthankText !== null || bookingthankText !== ''" class="text-center" >
          <textarea  disabled style="width:100%;height:100%;text-align: center;resize:none" v-model="bookingthankText"></textarea>
        </div>
        <div v-if="shop.length > 0" class="text-center">
          <h5 v-if="this.$route.query.shopId && (bookingthankText === null || bookingthankText === '' )" class="">ทางทีมงาน {{shop[0].shopName}} จะติดต่อกลับให้เร็วทีสุด</h5>
        </div>
        <!-- <h3 class="text-center" v-if="DarkModefont" :style="'color:' + DarkModefont +';'">ขอบคุณที่เข้ารับบริการกับเรา</h3> -->
        <div class="text-center" v-if="dataLineConfig.checkConfig === false">
            <v-btn
            v-if="this.$route.query.shopId"
            elevation="10"
            color="green"
            dark
            :disabled="!valid"
            @click="getBotinfo()"
          >รับการแจ้งเตือนผ่าน Line OA</v-btn>
        </div>
    </div>

    <div v-if="redirectBy !== 'BookingForm'" class="pa-0 ma-0">
      <div  class="text-center">
          <h5 class="">ขอบคุณที่เข้ารับบริการกับเรา</h5>
        </div>
        <div class="text-center" v-if="dataLineConfig.checkConfig === false">
            <v-btn
            v-if="this.$route.query.shopId"
            elevation="10"
            color="green"
            dark
            :disabled="!valid"
            @click="getBotinfo()"
          >รับการแจ้งเตือนผ่าน Line OA</v-btn>
        </div>
    </div>
    </v-card>
    <v-card class="pa-3 pt-6 pb-6 mt-16" elevation="10" v-else>
      <v-card-text class="text-center">
        <h3>ขออภัย กรุณาเปิดใน LINE ของมือถือ</h3>
      </v-card-text>
    </v-card>
    </v-card>
  </v-main>
</template>

<script>
import axios from 'axios' // api
import moment from 'moment'

export default {
  components: {
    name: ''
  },
  data () {
    return {
      valid: true,
      GroupId: this.$route.query.GroupId,
      userName: '',
      userPassword: '',
      shopId: '',
      profile: null,
      fromAdd: {
        GroupId: '',
        shopId: '',
        bookingStatus: 'N'
      },
      rules: {
        numberRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        counterTel: value => value.length <= 10 || 'Max 10 characters',
        IDcardRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        required: value => !!value || 'กรุณากรอก.',
        resizeImag: value =>
          !value ||
          value.size < 2000000 ||
          'Avatar size should be less than 2 MB!',
        counterIDcard: value => value.length <= 13 || 'Max 13 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      dialog: false,
      ColorByShop: [],
      DarkMode: '',
      DarkModeStatus: null,
      DarkModeButton: '',
      DarkModeBackground: '',
      DarkModefont: '',
      shop: [],
      LoGo: [],
      ImgCover: '',
      bookingthankText: null,
      redirectBy: null,
      checkMobile: true,
      dataLineConfig: {}
    }
  },
  async mounted () {
    // if (this.mobileCheck()) {
    this.checkMobile = true
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
    this.dataLineConfig = await this.getDataLineConfig(checkShopId)
    await this.checkLiffLogin(this.dataLineConfig)
    await this.getShop()
    await this.updateUser()
    // } else {
    //   await this.getShop()
    //   this.checkMobile = false
    //   this.$swal('ผิดพลาด', 'ขออภัย กรุณาเปิดใน LINE ของมือถือ', 'info')
    // }
  },
  methods: {
    mobileCheck () {
      let check = false;
      // eslint-disable-next-line
      (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera)
      return check
    },
    async checkLiffLogin (dataLineConfig) {
      console.log('dataLineConfig', dataLineConfig)
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
    async getBotinfo () {
      if (this.$route.query.shopId) {
        const url = `${this.DNS_IP}/line/getOa`
        // const url = 'http://localhost:81/Api/vgroupl_api/v1/Zoom/Login/getData?'
        const config = {
          headers: {
            'botId': this.$route.query.shopId
          }
        }
        await axios.get(url, config).then((response) => {
          let rs = response.data
          console.log('rs1', rs)
          // window.location.href = 'line://ti/p/' + rs.basicId
          window.location.href = 'https://line.me/R/oaMessage/' + rs.basicId + `/?เปิดรับการแจ้งเตือน`
        })
      }
    },
    // async getBotinfo () {
    //   if (this.$route.query.shopId) {
    //     const url = `${this.DNS_IP}/line/getOa`
    //     // const url = 'http://localhost:81/Api/vgroupl_api/v1/Zoom/Login/getData?'
    //     const config = {
    //       headers: {
    //         'botId': this.$route.query.shopId
    //       }
    //     }
    //     console.log('redircetBy', this.$route.query.redirectBy)
    //     if (this.$route.query.redirectBy === 'BookingForm' || this.$route.query.redirectBy === 'PaymentUpload') {
    //       await this.checkMember(this.$route.query.bookNo)
    //     } else {
    //       this.checkMemberId = 'memberTrue'
    //     }
    //     await axios.get(url, config).then((response) => {
    //       let rs = response.data
    //       console.log('rs1111', rs)
    //       if (this.checkMemberId === 'memberNo') {
    //       // window.location.href = 'https://line.me/R/oaMessage/' + rs.basicId + `?เปิดรับการแจ้งเตือน ` + this.profile.userId
    //         window.location.href = 'https://line.me/R/oaMessage/' + rs.basicId + `?เปิดรับการแจ้งเตือน`
    //       } else {
    //         window.location.href = 'line://ti/p/' + rs.basicId
    //       }
    //     })
    //   }
    // },
    getShop () {
      if (this.$route.query.redirectBy) {
        let check = this.$route.query.redirectBy
        if (check === 'rating') {
          this.redirectBy = check
        } else if (check === 'BookingForm') {
          this.redirectBy = check
        } else {
          this.redirectBy = 'N'
        }
        console.log('redirectBy', check)
      } else {
        this.redirectBy = null
      }
      if (this.$route.query.shopId) {
        axios.get(this.DNS_IP + '/sys_shop/get?shopId=' + this.$route.query.shopId).then(response => {
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
                this.LoGo = require('@/assets/Thank.svg')
              }
              if (v.shopImageCover) {
                this.ImgCover = v.shopImageCover
              } else {
                if (v.category === 'ธุรกิจรถยนต์') {
                  this.ImgCover = require('@/assets/Cover2.jpg')
                } else {
                  this.ImgCover = require('@/assets/Cover2.jpg')
                }
              }
              if (v.darkMode === 'True') {
                this.DarkMode = '#FFFFFF'
                this.DarkModefont = '#FFFFFF'
              } else {
                this.DarkMode = ''
                this.DarkModefont = '#173053'
              }
            })
            this.bookingthankText = rs[0].bookingthankText
            console.log('this.bookingthankText', this.bookingthankText)
          } else {
            this.shop = null
          }
        })
      } else {
        this.ColorByShop.push('#E1F3FF', '#FFFFFF')
        this.LoGo = require('@/assets/Thank.svg')
        this.DarkMode = ''
        this.DarkModefont = '#173053'
      }
    },
    async updateUser () {
      // const result = await axios.get(this.DNS_IP + '/member/get?shopId=' + this.$route.query.shopId + '&liffUserId=' + this.profile.userId)
      // console.log('result', result.data)
      // if (result.data.status === false) {
      var dt = {
        LAST_USER: this.profile.userId,
        userId: this.profile.userId
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/Booking/edit/" + this.$route.query.bookNo,
          dt
        )
        .then(async response => {
          if (this.dataLineConfig.checkConfig !== false) {
            this.getDataChkMember()
          }
          // if (this.$liff.isInClient()) {
          // if (this.profile.userId === 'U29e920c9ca4411b09b8c1704f37197c3' || this.profile.userId === 'U35b246f2825895f3fdcc09b72d589f92') {
          //   alert('isInClient')
          // }
          //   this.$liff
          //     .sendMessages([
          //       {
          //         type: 'text',
          //         text: 'เปิดรับการแจ้งเตือน'
          //       }
          //     ])
          //     .then(() => {
          //       console.log('message sent')
          //       // alert('message sent')
          //       this.$liff.closeWindow()
          //     })
          //     .catch((err) => {
          //       console.log('error', err)
          //       // alert('error:' + err)
          //     })
          // }
        })
      // }
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
.main{
  background-color: #FFFFFF;
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
  margin-bottom: 10px;
  max-height: 350px;
}
</style>
