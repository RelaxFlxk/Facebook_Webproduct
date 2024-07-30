<template>
  <v-main>
    <v-card
    :ripple="false"
    :img="ImgCover"
    height="240px"
    width="100%"
    >
    </v-card>
    <v-card class="pa-6 pb-10 px-0 mt-n10 mb-10"
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
         <div style="display:flex;justify-content: center;" class="ma-3">
            <v-chip
              class="mr-1 font-weight-black"
              :style="'background-color:' + (languageSelect === 0 ? DarkModeButton : 'rgb(103 103 103 / 18%)') + ';font-size:20px'"
              dark
              @click="languageSelect = 0"
              >
              <v-avatar left>
                <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fflag-TH.png?alt=media&token=e4bd7ffa-aed9-47e3-9240-4dcb9d8d284e"></v-img>
              </v-avatar>
                TH
            </v-chip>
            <v-chip
              class="ml-1 font-weight-black"
              :style="'background-color:' + (languageSelect === 1 ? DarkModeButton : 'rgb(103 103 103 / 18%)') + ';font-size:20px'"
              dark
              @click="languageSelect = 1">
              <v-avatar left>
                <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fflag-USA1.png?alt=media&token=a83dd820-f576-457a-8d08-1009cea9d70b"></v-img>
              </v-avatar>
                EN
            </v-chip>
          </div>
         <div class="text-center mt-4" v-if="dataLineConfig.checkConfig === false">
            <v-btn
              v-if="this.$route.query.shopId"
              elevation="10"
              color="green"
              dark
              @click="getBotinfo()"
            >{{ languageSelect === 0 ? "รับการแจ้งเตือนผ่าน Line OA" : "Get notified LINE OA" }}</v-btn>
        </div>
        <div v-else class="text-center mt-4">
          <v-btn
              v-if="this.$route.query.shopId && this.$route.query.shopId.includes('SD_') === false"
              elevation="10"
              color="green"
              dark
              @click="getBotinfoChatAuto()"
            >{{ languageSelect === 0 ? "รับการแจ้งเตือนผ่าน Line OA" : "Get notified LINE OA" }}</v-btn>
        </div>
    <v-sheet class="pa-3 pt-5 mt-3" :style="'background-color:'+ DarkModeBackground +';border-radius: 0px 0px 0px 0px;'" >
        <!-- <div class="" style="border-radius: 45px 45px 0px 0px;display:flex;justify-content: center;background-color:#FFFFFF;min-height: 180px;" v-if="dataBookingData.length > 0 && checkQueue !== 0">
          <v-row style="margin:auto;">
          <v-col cols="12" class="text-center"><v-icon color="#28B446" x-large class="ma-0 mr-2" style="font-size:70px;">mdi-check-circle</v-icon></v-col>
          <v-col cols="12" class="text-center font-weight-bold"><h3 style="color:#28B446;">{{ languageSelect === 0 ? "รับคิวเรียบร้อย" : "Received the queue" }}</h3></v-col>
        </v-row>
      </div>
      <div class="" style="border-radius: 45px 45px 0px 0px;display:flex;justify-content: center;background-color:#FFFFFF;min-height: 180px;" v-if="checkQueue === 0">
        <v-row style="margin:auto;">
          <v-col cols="12" class="text-center"><v-icon color="#dc3545" x-large class="ma-0 mr-2" style="font-size:70px;">mdi-alert-circle</v-icon></v-col>
          <v-col cols="12" class="text-center font-weight-bold"><h3 style="color:#dc3545;">{{ languageSelect === 0 ? "ไม่มีเลขคิว" : "No queue number" }}</h3></v-col>
        </v-row>
      </div> -->
      <div v-if="dataBookingData.length > 0 && dataBookingData[0].storeFrontQueue" class="pa-3" :style="'border-top: 4px dotted '+ DarkModeBackground + ';background-color:#FFFFFF;min-height: 180px;'">
        <h4 class="text-center font-weight-bold mt-5" style="color:#092C4C">{{ shop[0].shopName }}</h4>
        <v-row>
          <v-col cols="6" >
            <div class="text-left ml-6 mt-3">
              <p class="font-weight-bold" style="color:#092C4C">{{ languageSelect === 0 ? "วันที่นัดหมาย" : "Date" }}</p>
              <p style="color:#092C4C" v-if="showTime === 'แสดง'" class="font-weight-bold">{{ languageSelect === 0 ? "เวลา" : "Time of issue" }}</p>
              <p style="color:#092C4C" v-if="dataBookingData[0].servicePoint" class="font-weight-bold">{{ languageSelect === 0 ? "จุดบริการ" : "Service point" }}</p>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="text-right mr-6 mt-3">
              <p class="font-weight-bold"  style="color:#092C4C">{{momenDate_2(dataBookingData[0].dueDate)}}</p>
              <p style="color:#092C4C" class="font-weight-bold" v-if="showTime === 'แสดง'">{{momenTime(dataBookingData[0].dueDate)}}{{ languageSelect === 0 ? "  น." : "" }}</p>
              <p style="color:#092C4C" v-if="dataBookingData[0].servicePoint" class="font-weight-bold">{{ languageSelect === 0 ? dataBookingData[0].servicePoint : JSON.parse(dataBookingData[0].servicePointCount).filter(el => { return el.textTh === dataBookingData[0].servicePoint}).length > 0 ? JSON.parse(dataBookingData[0].servicePointCount).filter(el => { return el.textTh === dataBookingData[0].servicePoint})[0].textEn:dataBookingData[0].servicePoint}}</p>
            </div>
          </v-col>
        </v-row>
        <v-row v-for="(item, index) in dataBookingDataUse" :key="index">
          <v-col class="text-left pb-0 pt-0" cols="6"><p class="font-weight-bold ml-6"  style="color:#092C4C">{{ languageSelect === 0 ? item.fieldName:item.fieldNameEn}}</p></v-col>
          <!-- <v-col class="text-right pb-0 pt-0" cols="6"><p class="font-weight-bold mr-6"  style="color:#092C4C">{{languageSelect === 0 ? item.fieldValue : item.fieldType === 'Selects' || item.fieldType === 'Autocompletes' ? JSON.parse(item.optionField).filter(el => { return el.text === dataBookingData[0].servicePoint}).length > 0 ? JSON.parse(dataBookingData[0].servicePointCount).filter(el => { return el.textTh === dataBookingData[0].servicePoint})[0].textEn:dataBookingData[0].servicePoint}}</p></v-col> -->
          <v-col class="text-right pb-0 pt-0" cols="6"><p class="font-weight-bold mr-6"  style="color:#092C4C">{{item.fieldValue}}</p></v-col>
        </v-row>
      </div>
      <v-sheet v-if="dataBookingData.length > 0 && dataBookingData[0].storeFrontQueue" class="pa-3" :style="'background-color:#FFFFFF;min-height: 180px;border-radius: 0px 0px 45px 45px;border-top: 4px dotted '+ DarkModeBackground + ';position:relative'">
        <span :style="'background-color:'+ DarkModeBackground + ';padding: 14px 15px;border-radius: 50%;position: absolute;bottom: 176px;left: -12px;'"></span>
        <span :style="'background-color:'+ DarkModeBackground + ';padding: 14px 15px;border-radius: 50%;position: absolute;top: -12px;right: -12px;'"></span>
        <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? "หมายเลขคิวของคุณ" : "Your Number" }}</h5>
        <p style="color:#092C4C;font-size: 80px;" class="text-center font-weight-black mt-n5 mb-n5">{{dataBookingData[0].storeFrontQueue}}</p>
        <div style="display:flex;justify-content: center;" v-if="beforQueue > 0">
          <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? "มีคิวก่อนหน้าคุณ" : "At the front of the queue" }}</h5>
          <h5 style="color:#FFFFFF;background-color:#092C4C;min-height: 30px;width:30px;border-radius: 80px 80px 80px 80px;display: flex;justify-content: center;align-items: center;" class="text-center font-weight-black ml-2 mr-2 mt-2">{{beforQueue}}</h5>
          <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? "คิว" : "Queue" }}</h5>
        </div>
        <!-- <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? textCheckQueue:textCheckQueueEng }}</h5> -->
        <div v-else>
          <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? "ตอนนี้คุณอยู่คิวแรกแล้ว" : "You are now in the first queue." }}</h5>
          <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? "กรุณารอเจ้าหน้าที่เรียกคิว" : "Please wait for the staff to call the queue." }}</h5>
        </div>
        <!-- <div style="display:flex;justify-content: center;">
          <v-sheet class="pa-3 mt-2" :style="'background-color:#092C4C;min-height: 100px;width:100px;border-radius: 80px 80px 80px 80px;align-items: center;'">
            <h1 class="text-center mt-3" style="color:#FFFFFF" >A001</h1>
          </v-sheet>
          <div style="position: relative;">
            <h5 class="text-center mb-0 font-weight-bold" style="color:#092C4C;position: absolute;bottom: 0;left: 20px;" >คิว</h5>
          </div>
        </div> -->

      </v-sheet>
    </v-sheet>
    </v-card>
    <v-footer padless fixed>
        <v-col
          class="text-center"
          cols="12"
        >
        <strong style="color:#092C4C;">{{ languageSelect === 0 ? "* ทางบริษัทขอสงวนสิทธิ์ในการข้ามคิว กรณีลูกค้าไม่แสดงตน" : "Note: Please be ready 5 minutes before the queue is coming." }}</strong>
        </v-col>
        <v-col
          class="text-center pt-0"
          cols="12"
          v-if="languageSelect === 1"
        >
          <strong style="color:#092C4C;">If after 15 minutes the queue will be cancelled.</strong>
        </v-col>
      </v-footer>
  </v-main>
</template>

<script>
import axios from 'axios' // api
import QrcodeVue from 'qrcode.vue'
import moment from 'moment' // แปลง date

export default {
  components: {
    name: '',
    QrcodeVue
  },
  data () {
    return {
      textCheckQueue: '',
      textCheckQueueEng: '',
      languageSelect: 0,
      checkMemberId: '',
      value: '',
      size: 200,
      foreground: '#000000',
      profile: null,
      ColorByShop: [],
      DarkMode: '',
      DarkModeStatus: null,
      DarkModeButton: '',
      DarkModeBackground: '',
      DarkModefont: '',
      shop: [],
      LoGo: [],
      ImgCover: '',
      dataBookingList: [],
      dataBooking: [],
      dataBookingData: [],
      dataBookingDataUse: [],
      sequenceNo: 0,
      shopId: this.$route.query.shopId,
      bookNo: this.$route.query.bookNo,
      beforQueue: '',
      checkQueue: null,
      dataLineConfig: {},
      showTime: ''
    }
  },
  async mounted () {
    if (this.$route.query.shopId) {
      if (this.$route.query.checkLine) {

      } else {
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
      }
      await this.getBookingField()
      await this.getShop()

      await this.getBookingData()
      await this.getBookingDataUse()
    } else {
      this.$swal(
        'พบความผิดพลาดระหว่างดำเนินการ',
        'กรุณาติดต่อเจ้าหน้าที่',
        'info'
      )
    }
    if (this.$route.query.languageSelect) {
      this.languageSelect = parseInt(this.$route.query.languageSelect)
    } else {
      this.languageSelect = 0
    }
  },
  methods: {
    async getBookingField () {
      this.showTime = ''
      await axios
        .get(this.DNS_IP + '/BookingField/get?shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.status === false) {
            this.showTime = 'แสดง'
          } else {
            this.showTime = rs[0].showTime || 'แสดง'
          }
        })
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
    async getShop () {
      if (this.$route.query.shopId) {
        await axios.get(this.DNS_IP + '/sys_shop/get?shopId=' + this.$route.query.shopId).then(response => {
          let rs = response.data
          console.log('rs', rs)
          if (rs.length > 0) {
            this.shop = rs
            console.log('this.shop', this.shop)
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
      console.log('this.shop', this.shop)
    },
    async getBookingQueue () {
      await axios
        .get(this.DNS_IP + '/booking_view/get?shopId=' + this.shopId + '&dueDate=' + this.dataBookingData[0].dueDateDay + '&storeFrontQueue=is not null&statusBt=confirm')
        .then(async response => {
          let rs = response.data
          console.log('test', rs)
          if (rs.length > 0) {
            if (rs.filter((item, key) => item.storeFrontQueue === this.dataBookingData[0].storeFrontQueue).length > 0) {
              let findIndex = rs.findIndex((item, key) => item.storeFrontQueue === this.dataBookingData[0].storeFrontQueue)
              console.log('findIndex', findIndex)
              this.beforQueue = rs.filter((item, key) => key < findIndex).length
              console.log('this.beforQueue', this.beforQueue)
              this.checkQueue = this.dataBookingData[0].storeFrontQueue
            } else {
              this.dataBookingData = []
              this.checkQueue = 0
              console.log('this.beforQueue', this.beforQueue)
            }
          } else {
            this.checkQueue = 0
          }
        })
    },
    async getBookingData () {
      this.dataBookingData = []
      await axios
        // .get(this.DNS_IP + '/BookingData/get?shopId=' + this.shopId + '&bookNo=' + this.bookNo)
        .get(this.DNS_IP + '/booking_view/get?shopId=' + this.shopId + '&userId=' + this.profile.userId + '&dueDateDay=' + moment().format('YYYY-MM-DD') + '&storeFrontQueue=is not null&statusBt=confirm')
        .then(async response => {
          let rs = response.data
          console.log('booking_view', rs)
          if (rs.length > 0) {
            this.dataBookingData = rs
            await this.getBookingQueue()
          }
        })
    },
    async getBookingDataUse () {
      this.dataBookingDataUse = []
      await axios
        .get(this.DNS_IP + '/BookingData/get?shopId=' + this.shopId + '&bookNo=' + this.dataBookingData[0].bookNo)
        // .get(this.DNS_IP + '/booking_view/get?shopId=' + this.shopId + '&bookNo=' + this.bookNo)
        .then(async response => {
          let rs = response.data
          console.log('rsUse', rs)
          if (rs.length > 0) {
            this.dataBookingDataUse = rs
          }
        })
    },
    async checkMember (bookNo) {
      await axios.get(this.DNS_IP + '/booking_view/get?bookNo=' + bookNo)
        .then(async (response) => {
          let rs = response.data
          console.log('RSTESTTTTTT', response)
          if (rs[0].lineUserId === null || rs[0].lineUserId === '') {
            this.checkMemberId = 'memberNo'
          } else {
            this.checkMemberId = 'memberTrue'
          }
          console.log('this.checkMemberId', this.checkMemberId)
        }).catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
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
        await this.checkMember(this.$route.query.bookNo)
        await axios.get(url, config).then((response) => {
          let rs = response.data
          console.log('rs1111', rs)
          if (this.checkMemberId === 'memberNo') {
          // window.location.href = 'https://line.me/R/oaMessage/' + rs.basicId + `?เปิดรับการแจ้งเตือน ` + this.profile.userId
            window.location.href = 'https://line.me/R/oaMessage/' + rs.basicId + `/?เปิดรับการแจ้งเตือน`
            // liff.openliff.openWindow({
            //   url: 'https://line.me/R/oaMessage/' + rs.basicId + `?เปิดรับการแจ้งเตือน`,
            //   external: true
            // })
          } else {
            window.location.href = 'line://ti/p/' + rs.basicId
          }
        })
      }
    },
    async getBotinfoChatAuto () {
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
          window.location.href = 'line://ti/p/' + rs.basicId
        })
      }
    }
  }
}
</script>

<style scoped>
.main {
  background-color: #ffffff;
  height: 100vh;
}
.content {
  overflow: auto;
  white-space: normal;
}
.a {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  max-height: 350px;
}
</style>
