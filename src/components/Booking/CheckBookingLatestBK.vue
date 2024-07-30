<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col class="main pa-0 " col="12" md="12" sm="12">
          <v-card
            class="content pa-2 ps-8 pr-8"
            height="100vh"
            :style="
              'background: linear-gradient(180deg, ' +
                ColorByShop[1] +
                ' 40%,' +
                ColorByShop[0] +
                ' 100%);'
            ">
          <br />
          <br />
          <!-- <v-card-text v-if="momenDate_1(new Date()) === momenDate_1(dataBooking.dueDate) && profile" class="white--text h5 mt-3 text-center"><strong>{{'โปรดนำ QR Code ให้เจ้าหน้าที่แสกน'}}</strong></v-card-text> -->
          <!-- <v-app-bar v-if="momenDate_1(new Date()) === momenDate_1(dataBooking.dueDate) && profile" :color="momenDate_1(new Date()) === momenDate_1(dataBooking.dueDate) ? 'teal' : 'error'">
              <v-avatar class="mr-3">
                <v-icon x-large dark>
                  mdi-qrcode-scan
                </v-icon>
              </v-avatar>
              <v-card-text class="white--text h6 mt-3"><strong>{{'โปรดนำ QR Code ให้เจ้าหน้าที่แสกน'}}</strong></v-card-text>
            </v-app-bar> -->
            <br />
          <!-- <v-card-text class="white--text h6 mt-3" v-if="momenDate_1(new Date()) === momenDate_1(dataBooking.dueDate)"><strong>{{'โปรดนำ QR Code ให้เจ้าหน้าที่แสกน' }}</strong></v-card-text> -->
            <!-- <v-img v-if="LoGo.length > 0" :src="LoGo" class="a" max-width="250" ></v-img> -->
            <v-img
              v-if="momenDate_1(new Date()) !== momenDate_1(dataBooking.dueDate)"
              src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FcheckBooking.png?alt=media&token=bf363bd8-39cb-4350-b134-ab9a739863ef"
              class="a"
              max-width="150"
            ></v-img>
            <!-- <v-img
              v-if="momenDate_1(new Date()) !== momenDate_1(dataBooking.dueDate)"
              :src="require('@/assets/checkBooking.png')"
              class="a"
              max-width="150"
            ></v-img> -->

            <v-card class="pa-3" v-if="momenDate_1(new Date()) === momenDate_1(dataBooking.dueDate)">
              <v-card-text class="h6 mt-3 text-center">
                <strong>{{'QR ของคุณพร้อมแล้ว'}}</strong>
                <p>แสดง QR code นี้เพื่อใช้แสกน</p>
                </v-card-text>
              <!-- <v-app-bar color="teal">
              <v-avatar class="mr-3">
                <v-icon x-large dark>
                  mdi-qrcode-scan
                </v-icon>
              </v-avatar>
              <v-card-text class="white--text h6 mt-3">
                <strong>{{'QR ของคุณพร้อมแล้ว'}}</strong>
                <p>แสดง QR code นี้เพื่อใช้แสกน</p>
                </v-card-text>
            </v-app-bar> -->
              <div class="text-center">
                <qrcode-vue  :value="value" :size="size" level="H" :foreground="foreground" />
              </div>
            </v-card>

            <!-- <v-card class="pa-3 pt-6 pb-6 mt-16" elevation="10">
              <div class="pa-0 ma-0">
                <div class="text-center">
                  <h5 class="">ขอบคุณที่เข้ารับบริการกับเรา</h5>
                </div>
              </div>
            </v-card> -->
            <v-app-bar :color="momenDate_1(new Date()) === momenDate_1(dataBooking.dueDate) ? 'teal' : 'error'" v-if="profile">
              <v-avatar class="mr-3">
                <v-icon x-large dark>
                  {{momenDate_1(new Date()) === momenDate_1(dataBooking.dueDate) ? 'mdi-clock-check' : 'mdi-clock-alert'}}
                </v-icon>
                <!-- <v-img :src="profile.pictureUrl"></v-img> -->
              </v-avatar>
              <!-- <v-toolbar-title class="white--text">{{ profile.displayName }}</v-toolbar-title> -->
              <v-card-text class="white--text h6 mt-3"><strong>{{ momenDate_1(new Date()) === momenDate_1(dataBooking.dueDate) ? 'ท่านได้นัดหมายวันนี้' : 'วันที่นัดหมายของท่านไม่ใช่วันนี้' }}</strong></v-card-text>
            </v-app-bar>
            <v-card class="pa-3 pt-6 pb-6 mt-5" elevation="10" v-if="dataBookingData.length > 0">
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
          </v-card>
        </v-col>
      </v-row>
    </v-container>
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
      shop: [],
      LoGo: [],
      DarkModefont: '',
      DarkMode: '',
      dataBookingList: [],
      dataBooking: [],
      dataBookingData: [],
      sequenceNo: 0
    }
  },
  async mounted () {
    if (this.$route.query.shopId) {
      await this.getBookingList()
      await this.checkLiffLogin()
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
    async checkLiffLogin () {
      await this.$liff
        .init({
          liffId: this.$liffIdMain
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
    getShop () {
      if (this.$route.query.shopId) {
        axios
          .get(this.DNS_IP + '/sys_shop/get?shopId=' + this.$route.query.shopId)
          .then(response => {
            let rs = response.data
            if (rs.length > 0) {
              this.shop = rs
              rs.forEach(v => {
                if (v.primaryColor) {
                  this.ColorByShop.push(v.primaryColor, v.secondaryColor)
                } else {
                  this.ColorByShop.push('#E1F3FF', '#FFFFFF')
                }
                if (v.shopImge) {
                  this.LoGo = v.shopImge
                } else {
                  this.LoGo = require('@/assets/Thank.svg')
                }
                if (v.darkMode === 'True') {
                  this.DarkMode = '#FFFFFF'
                  this.DarkModefont = '#FFFFFF'
                } else {
                  this.DarkMode = ''
                  this.DarkModefont = '#173053'
                }
              })
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
    async getBookingList () {
      this.dataBookingList = []
      await axios
        .get(
          this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.$route.query.shopId +
            '&dueDate=' +
            this.momenDate_1(new Date()) +
            '&checkOnsite=is null&statusBt=wait and confirm'
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
            '&checkOnsite=is null&statusBt=wait and confirm'
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
            '&checkOnsite=is null&statusBt=wait and confirm'
              )
              .then(async responses => {
                let rsUse = responses.data
                if (rsUse.status !== false) {
                  this.dataBooking = rsUse[0]
                  this.value = 'https://betask-linked-admin.web.app/BookingMobile?bookNo=' + rsUse[0].bookNo + '&shopId=' + rsUse[0].shopId
                  this.getBookingData(rsUse[0])
                  // if (this.dataBookingList.length > 0) {
                  //   let rsUseNo = this.dataBookingList.sort((a, b) => {
                  //     if (a.dueDate > b.dueDate) return -1
                  //     return a.dueDate < b.dueDate ? 1 : 0
                  //   })
                  //   console.log('rsUseNo', rsUseNo)
                  // }
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
