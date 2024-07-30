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
            "
          >
            <br />
            <br />
            <br />
            <!-- <v-img v-if="LoGo.length > 0" :src="LoGo" class="a" max-width="250" ></v-img> -->
            <v-img
              v-if="LoGo.length > 0"
              src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FbookingNext.png?alt=media&token=4bf5e5ed-5781-4f5b-ad09-d2ccea5bdce3"
              class="a"
              max-width="150"
            ></v-img>
            <!-- <v-img
              v-if="LoGo.length > 0"
              :src="require('@/assets/bookingNext.png')"
              class="a"
              max-width="150"
            ></v-img> -->

            <!-- <v-card class="pa-3 pt-6 pb-6 mt-16" elevation="10">
              <div class="pa-0 ma-0">
                <div class="text-center">
                  <h5 class="">ขอบคุณที่เข้ารับบริการกับเรา</h5>
                </div>
              </div>
            </v-card> -->
            <v-app-bar :color="dataBookingItem.length > 0 ? 'teal' : 'error'" v-if="profile">
              <v-avatar class="mr-3">
                <v-icon x-large dark>
                  {{dataBookingItem.length > 0 ? 'mdi-clock-check' : 'mdi-clock-alert'}}
                </v-icon>
                <!-- <v-img :src="profile.pictureUrl"></v-img> -->
              </v-avatar>
              <!-- <v-toolbar-title class="white--text">{{ profile.displayName }}</v-toolbar-title> -->
              <v-card-text class="white--text h6 mt-3"><strong>{{ dataBookingItem.length > 0 ? 'ดูนัดหมายล่วงหน้า' : 'ท่านไม่มีนัดหมายต่อไป' }}</strong></v-card-text>
            </v-app-bar>
            <v-card-text v-if="dataBookingItem.length > 0">
              <v-select
                v-model="bookingSelect"
                :items="dataBookingItem"
                label="เลือกวันที่นัดหมาย"
                solo
                @change="getBookingData(bookingSelect)"
              >
              </v-select>
            </v-card-text>
            <v-card class="pa-3 pt-6 pb-6 mt-5" elevation="10" v-if="dataBookingData.length > 0">
              <div class="pa-0 ma-0">
                <div class="text-center">
                  <h6 class="text-start"><strong>วันที่นัดหมาย : </strong> {{dataBooking.filter(el => { return el.bookNo === bookingSelect })[0].dueDate}}</h6>
                  <h6 class="text-start"><strong>สาขา : </strong> {{dataBooking.filter(el => { return el.bookNo === bookingSelect })[0].masBranchName}}</h6>
                  <h6 class="text-start"><strong>ประเภทบริการ : </strong> {{dataBooking.filter(el => { return el.bookNo === bookingSelect })[0].flowName}}</h6>
                  <v-timeline
                    align-top
                    dense
                  >
                    <v-timeline-item color="teal">
                      <template v-slot:icon>
                        <v-icon small dark>mdi-book-check</v-icon>
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

export default {
  components: {
    name: ''
  },
  data () {
    return {
      profile: null,
      ColorByShop: [],
      shop: [],
      LoGo: [],
      DarkModefont: '',
      DarkMode: '',
      dataBooking: [],
      dataBookingItem: [],
      dataBookingData: [],
      bookingSelect: ''
    }
  },
  async mounted () {
    if (this.$route.query.shopId) {
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
      if (this.dataBookingItem.length === 1) {
        this.bookingSelect = this.dataBookingItem[0].value
        this.getBookingData(this.dataBookingItem[0].value)
      }
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
    async searchAny () {
      this.dataBooking = []
      this.dataBookingData = []
      this.bookingSelect = ''
      await axios
        .get(
          this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.$route.query.shopId +
            '&userId=' +
            this.profile.userId +
            '&dueDateNext=' +
            this.momenDate_1(new Date()) +
            '&checkOnsite=is null&statusBt=wait and confirm'
        )
        .then(async response => {
          let rs = response.data
          if (rs.status !== false) {
            var rsUse = rs.sort((a, b) => {
              if (a.dueDate < b.dueDate) return -1
              return a.dueDate > b.dueDate ? 1 : 0
            })
            for (let i = 0; i < rsUse.length; i++) {
              let d = rsUse[i]
              let s = {}
              if (this.dataBookingItem.filter(el => { return el.text === d.dueDate }).length === 0) {
                d.dueDateCheck = this.format_date(d.dueDate)
              } else {
                d.dueDateCheck = this.format_date(d.dueDate) + ' (' + i + ')'
              }
              this.dataBooking.push(d)
              s.value = d.bookNo
              s.text = d.dueDateCheck
              this.dataBookingItem.push(s)
            }
          } else {
            this.$swal(
              'ผิดพลาด',
              'ไม่พบข้อมูลนัดหมาย',
              'error'
            )
          }
        })
    },
    async getBookingData (bookNo) {
      await axios
        .get(
          this.DNS_IP +
            '/BookingData/get?shopId=' +
            this.$route.query.shopId +
            '&bookNo=' + bookNo
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
