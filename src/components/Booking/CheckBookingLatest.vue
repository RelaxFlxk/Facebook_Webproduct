<template>
  <v-main>
    <v-card
    :ripple="false"
    :img="ImgCover"
    height="240px"
    width="100%"
    >
    </v-card>
    <v-card class="pa-6 pb-10 px-0 mt-n10"
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
    <!-- <v-sheet class="pa-3 pt-5 mt-6" :style="'background-color:'+ DarkModeBackground +';border-radius: 0px 0px 0px 0px;'">
        <div class="" style="border-radius: 45px 45px 0px 0px;display:flex;justify-content: center;background-color:#FFFFFF;min-height: 180px;" v-if="momenDate_1(new Date()) === momenDate_1(dataBooking.dueDate)">
          <v-row style="margin:auto;">
          <v-col cols="12" class="text-center"><v-icon color="#28B446" x-large class="ma-0 mr-2" style="font-size:70px;">mdi-check-circle</v-icon></v-col>
          <v-col cols="12" class="text-center font-weight-bold"><h3 style="color:#28B446;">รับคิวเรียบร้อย</h3></v-col>
        </v-row>
      </div>
      <div class="" style="border-radius: 45px 45px 0px 0px;display:flex;justify-content: center;background-color:#FFFFFF;min-height: 180px;" v-else>
        <v-row style="margin:auto;">
          <v-col cols="12" class="text-center"><v-icon color="#dc3545" x-large class="ma-0 mr-2" style="font-size:70px;">mdi-alert-circle</v-icon></v-col>
          <v-col cols="12" class="text-center font-weight-bold"><h3 style="color:#dc3545;">วันที่นัดหมายของท่านไม่ใช่วันนี้</h3></v-col>
        </v-row>

      </div>
      <div v-if="dataBookingData.length > 0" class="pa-3" :style="'border-top: 4px dotted '+ DarkModeBackground + ';background-color:#FFFFFF;min-height: 180px;'">
        <h4 class="text-center font-weight-bold mt-5" style="color:#092C4C">{{ shop[0].shopName }}</h4>
        <v-row>
          <v-col cols="6" >
            <div class="text-left ml-6 mt-3">
              <p class="font-weight-bold" style="color:#092C4C">วันที่นัดหมาย</p>
              <p style="color:#092C4C" class="mt-n4 font-weight-bold">เวลา</p>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="text-right mr-6 mt-3">
              <p class="font-weight-bold"  style="color:#092C4C">{{momenDate_2(dataBooking.dueDate)}}</p>
              <p style="color:#092C4C" class="mt-n4 font-weight-bold">{{momenTime(dataBooking.dueDate) + '  น.'}}</p>
            </div>
          </v-col>
        </v-row>
      </div>
      <v-sheet class="pa-3" :style="'background-color:#FFFFFF;min-height: 180px;border-radius: 0px 0px 45px 45px;border-top: 4px dotted '+ DarkModeBackground + ';position:relative'">
        <span :style="'background-color:'+ DarkModeBackground + ';padding: 14px 15px;border-radius: 50%;position: absolute;bottom: 165px;left: -12px;'"></span>
        <span :style="'background-color:'+ DarkModeBackground + ';padding: 14px 15px;border-radius: 50%;position: absolute;top: -12px;right: -12px;'"></span>
        <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">มีคิวก่อนหน้าคุณ</h5>
        <div style="display:flex;justify-content: center;">
          <v-sheet class="pa-3 mt-2" :style="'background-color:#092C4C;min-height: 100px;width:100px;border-radius: 80px 80px 80px 80px;align-items: center;'">
            <h1 class="text-center mt-3" style="color:#FFFFFF" >{{sequenceNo}}</h1>
          </v-sheet>
          <div style="position: relative;">
            <h5 class="text-center mb-0 font-weight-bold" style="color:#092C4C;position: absolute;bottom: 0;left: 20px;" >คิว</h5>
          </div>
        </div>

      </v-sheet> -->
      <!-- <div style="background-color:#FFFFFF ;border-radius: 0px 0px 45px 45px;" class="pa-3 px-5">
        <p style="color:#092C4C;font-size: 13px;" class="ont-weight-bold">*ทางบริษัทขอสงวนสิทธิ์ในการข้ามคิว กรณีลูกค้าไม่แสดงตน</p>
      </div> -->

      <v-app-bar :color="momenDate_1(new Date()) === momenDate_1(dataBooking.dueDate) ? 'teal' : 'error'" v-if="profile">
              <v-avatar class="mr-3">
                <v-icon x-large dark>
                  {{momenDate_1(new Date()) === momenDate_1(dataBooking.dueDate) ? 'mdi-clock-check' : 'mdi-clock-alert'}}
                </v-icon>
              </v-avatar>
              <v-card-text class="white--text h6 mt-3"><strong>{{ momenDate_1(new Date()) === momenDate_1(dataBooking.dueDate) ? 'ท่านได้นัดหมายวันนี้' : 'วันที่นัดหมายของท่านไม่ใช่วันนี้' }}</strong></v-card-text>
            </v-app-bar>
            <v-card class="pa-3 pt-6 pb-6 mt-5 ma-5" elevation="10" v-if="dataBookingData.length > 0">
              <div class="pa-0 ma-0">
                <div class="text-center">
                  <h6 class="text-start"><strong>วันที่นัดหมาย : </strong> {{format_date1(dataBooking.dueDate)}}</h6>
                  <h6 class="text-start"><strong>สาขา : </strong> {{dataBooking.masBranchName}}</h6>
                  <h6 class="text-start"><strong>ประเภทบริการ : </strong> {{dataBooking.flowName}}</h6>
                  <h6 class="text-start" v-if="sequenceNo > 0"><strong>ลำดับการจอง : </strong> {{sequenceNo}}</h6>
                  <v-timeline
                    align-top
                    dense
                  >
                    <v-timeline-item :color="momenDate_1(new Date()) === momenDate_1(dataBooking.dueDate) ? 'teal' : 'error'">
                      <template v-slot:icon>
                        <v-icon small dark>{{momenDate_1(new Date()) === momenDate_1(dataBooking.dueDate) ? 'mdi-book-check' : 'mdi-book-cancel'}}</v-icon>
                      </template>
                      <div v-for="(item, index) in dataBookingData" :key="index">
                          <h6 class="text-start" v-if="item.fieldValue !== ''"><strong>{{item.fieldName}} : </strong> {{item.fieldValue}}</h6>
                      </div>
                    </v-timeline-item>
                  </v-timeline>
                </div>
              </div>
            </v-card>
    <!-- </v-sheet> -->
    </v-card>
    <v-footer padless fixed>
        <v-col
          class="text-center"
          cols="12"
        >
        <strong style="color:#092C4C;">{{'* หากลูกค้าต้องการเลื่อนนัดกรุณาติดต่อเจ้าหน้าที่ โทร. ' + shop[0].contactTel}}</strong>
        </v-col>
      </v-footer>
  </v-main>
</template>

<script>
import axios from 'axios' // api
import QrcodeVue from 'qrcode.vue'

export default {
  components: {
    name: '',
    QrcodeVue
  },
  data () {
    return {
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
      sequenceNo: 0
    }
  },
  async mounted () {
    if (this.$route.query.shopId) {
      await this.getBookingList()
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
      await this.getShop()
      await this.searchAny()
    } else {
      this.$swal(
        'พบความผิดพลาดระหว่างดำเนินการ',
        'กรุณาติดต่อเจ้าหน้าที่',
        'info'
      )
    }
  },
  methods: {
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
    async getBookingList () {
      this.dataBookingList = []
      await axios
        .get(
          this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.$route.query.shopId +
            '&dueDate=' +
            this.momenDate_1(new Date()) +
            '&checkOnsite=is null&statusBt=confirm'
            // '&checkOnsite=is null&statusBt=wait and confirm'
        )
        .then(async response => {
          let rs = response.data
          if (rs.status === false) {
            this.dataBookingList = []
          } else {
            let rsUse = rs.sort((a, b) => {
              if (a.dueDate > b.dueDate) return -1
              return a.dueDate < b.dueDate ? 1 : 0
            })
            console.log('rsUse', rsUse)
            this.dataBookingList = rsUse
          }
        })
    },
    async searchAny () {
      this.dataBooking = []
      this.dataBookingData = []
      await axios
        .get(
          this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.$route.query.shopId +
            '&userId=' +
            this.profile.userId +
            '&dueDate=' +
            this.momenDate_1(new Date()) +
            '&checkOnsite=is null&statusBt=confirm'
            // '&checkOnsite=is null&statusBt=wait and confirm'
        )
        .then(async response => {
          let rs = response.data
          if (rs.status === false) {
            await axios
              .get(
                this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.$route.query.shopId +
            '&userId=' +
            this.profile.userId +
            '&checkOnsite=is null&statusBt=confirm'
            // '&checkOnsite=is null&statusBt=wait and confirm'
              )
              .then(async responses => {
                let rsUse = responses.data
                if (rsUse.status !== false) {
                  this.dataBooking = rsUse[0]
                  this.value = 'https://betask-linked-admin.web.app/BookingMobile?bookNo=' + rsUse[0].bookNo + '&shopId=' + rsUse[0].shopId
                  this.getBookingData(rsUse[0])
                  this.sequenceNo = 0
                } else {
                  this.sequenceNo = 0
                  this.$swal(
                    'ผิดพลาด',
                    'ไม่พบข้อมูลนัดหมาย',
                    'error'
                  )
                }
              })
          } else {
            let rsUse = rs.sort((a, b) => {
              if (a.dueDate > b.dueDate) return -1
              return a.dueDate < b.dueDate ? 1 : 0
            })
            if (this.dataBookingList.length > 0) {
              let rsUseNo = this.dataBookingList.sort((a, b) => {
                if (a.dueDate < b.dueDate) return -1
                return a.dueDate > b.dueDate ? 1 : 0
              })
              console.log('rsUseNo', rsUseNo)
              this.sequenceNo = rsUseNo.findIndex(x => x.bookNo === rsUse[0].bookNo) + 1
              console.log('sequenceNo', this.sequenceNo)
            }
            this.value = 'https://betask-linked-admin.web.app/BookingMobile?bookNo=' + rsUse[0].bookNo + '&shopId=' + rsUse[0].shopId
            this.dataBooking = rsUse[0]
            this.getBookingData(rsUse[0])
          }
        })
    },
    async getBookingData (dt) {
      await axios
        .get(
          this.DNS_IP +
            '/BookingData/get?shopId=' +
            this.$route.query.shopId +
            '&bookNo=' + dt.bookNo
        )
        .then(async response => {
          let rs = response.data
          this.dataBookingData = rs
          console.log('bookingData', rs)
        })
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
