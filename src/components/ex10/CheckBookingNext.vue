<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col class="main pa-0 " col="12" md="12" sm="12">
          <v-card class="pa-3 pt-6 pb-6 mt-5" elevation="10" v-if="dataBookingData.length > 0">
            <div class="pa-0 ma-0">
              <div class="text-center">
                <h6 class="text-start"><strong>วันที่นัดหมาย : </strong> {{dataBooking.filter(el => { return el.bookNo === bookingSelect })[0].dueDate}}</h6>
                <h6 class="text-start"><strong>สาขา : </strong> {{dataBooking.filter(el => { return el.bookNo === bookingSelect })[0].masBranchName}}</h6>
                <h6 class="text-start"><strong>ประเภทบริการ : </strong> {{dataBooking.filter(el => { return el.bookNo === bookingSelect })[0].flowName}}</h6>
                <div v-for="(item, index) in dataBookingData" v-bind:key="index">
                  <h6 class="text-start"><strong>{{item.fieldName}} : </strong> {{item.fieldValue}}</h6>
                </div>
              </div>
            </div>
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
    if (this.$route.query.shopId && this.$route.query.uuid) {
      this.profile = {
        'userId': this.$route.query.uuid
      }
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
          console.log('DataRSRSRSRSRSR', rs)
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
