<template>
  <v-main>
    <v-card
    :ripple="false"
    :img="ImgCover"
    height="200px"
    width="100%"
    >
    </v-card>
    <v-card class="pa-6 px-3 pb-10 mt-n10"
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
      <v-sheet
        class="mx-auto mt-5 pa-0 pt-5 pb-5"
        min-height="35vh"
        rounded
        :style="'background-color:' + '#FFFFFF' +';border-radius: 15px 15px 15px 15px;'"
      >
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
       <h2
          class="text-center mt-1 font-weight-bold"
          :style="'color:' + '#000000' + ';'"
          v-if="shop.length > 0"
        >
        {{ languageSelect === 0 ? "ค้นหาแพทย์" : "Find a Doctor" }}
        </h2>
        <h4
          class="text-center mt-1 font-weight-bold"
          :style="'color:' + '#000000' + ';'"
          v-if="shop.length > 0"
        >
          {{ shop[0].shopName }}
        </h4>
        <v-row align="center" class="pa-4 pl-7">
          <v-col cols="12" >
            <v-select
              v-model="formSelect.flowId"
              :label="languageSelect === 0 ? 'ประเภทบริการ *' : 'Sevice *'"
              :item-text="languageSelect === 0 ? 'text' : 'textEn'"
              dense
              outlined
              :items="DataFlow"
              attach
            :menu-props="{ bottom: true, offsetY: true }"
              @change="checkBranch()"
            >
            <template slot="item" slot-scope="data">
              <p class="text-wrap" >{{languageSelect === 0 ? data.item.text : data.item.textEn}}</p>
          </template></v-select>
            <v-select
            v-if="formSelect.flowId !== '' || formSelect.masBranchID !== ''"
              v-model="formSelect.masBranchID"
              :label="languageSelect === 0 ? 'สาขา *' : 'Branch *'"
              dense
              outlined
              :item-text="languageSelect === 0 ? 'text' : 'textEn'"
              :items="branch"
              attach
            :menu-props="{ bottom: true, offsetY: true }"
              @change="getEmp()"
            ></v-select>
          </v-col>
        </v-row>
      </v-sheet>
      <v-row dense>
        <v-col
          v-for="(item, i) in dataEmp"
          :key="i"
          cols="12"
        >
          <v-card>
            <div class="d-flex flex-no-wrap justify-space-between">
              <v-row>
                <v-col cols="4">
                  <v-avatar
                    class="ma-3"
                    height="160"
                    size="120"
                    tile
                  >
                    <v-img :src="item.empImge"></v-img>
                  </v-avatar>
                </v-col>
                <v-col>
                  <v-card-title
                    class="text-h6"
                    v-html="item.empFirst_NameTH + ' ' + item.empLast_NameTH"
                  ></v-card-title>
                  <v-card-subtitle v-html="nl2br(item.additionalInformation, false, false)"></v-card-subtitle>
                  <v-card-actions>
                    <v-btn
                      class="ml-2 mt-0"
                      outlined
                      rounded
                      small
                      @click="addBooking(item)"
                    >
                      {{ languageSelect === 0 ? "นัดหมาย" : "Make an appointment" }}
                    </v-btn>
                  </v-card-actions>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-main>
</template>

<script>
import axios from 'axios' // api
import QrcodeVue from 'qrcode.vue'
import moment from 'moment'
export default {
  components: {
    name: '',
    QrcodeVue
  },
  watch: {
    async model (newQuestion, oldQuestion) {
      let year = moment(this.date).format('YYYY')
      this.itemMonth.forEach((v, k) => {
        if (k === newQuestion) {
          // console.log('moment', moment(year + v.value, 'YYYY-MM').format('YYYY-MM'))
          this.date = moment(year + v.value, 'YYYY-MM').format('YYYY-MM')
        }
      })
      await this.DefaultDay(this.date)
      // await this.DefaultDay()
    }
  },
  data () {
    return {
      model: 0,
      previous: false,
      itemMonth: [],
      dateEng: [{text: 'อา', textEn: 'Sun'}, {text: 'จ', textEn: 'Mon'}, {text: 'อ', textEn: 'Tue'}, {text: 'พ', textEn: 'Wed'}, {text: 'พฤ', textEn: 'Thu'}, {text: 'ศ', textEn: 'Fri'}, {text: 'ส', textEn: 'Sat'}],
      defaultMonth: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
      defaultMonthEng: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      menu2: false,
      date: moment(moment().format('YYYY-MM'), 'YYYY-MM').format('YYYY-MM'),
      currentDate: moment().format('YYYY-MM-DD'),
      currentMonth: moment().format('YYYY-MM'),
      showDetails: [],
      allDetails: [],
      LimitBooking: [],
      dateSelect: [],
      formSelect: {
        flowId: '',
        empId: '',
        masBranchID: '',
        datemonth: '',
        dateday: ''
      },
      value: '',
      size: 200,
      foreground: '#000000',
      valid: true,
      userName: '',
      userPassword: '',
      shopId: this.$route.query.shopId,
      profile: null,
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
      DataFlow: [],
      DataFlowNameAll: [],
      languageSelect: 0,
      dateDayCustom: [],
      dateDayoffValue: [],
      dataEmp: [],
      dataEmpAll: [],
      EmpItemLimit: [],
      branchData: [],
      branch: [],
      timeavailable: []
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
    await this.getShop()
    await this.getDataFlow()
    await this.getDataBranch()
    // await this.setMonthCarousel()
    // await this.setDataDefault()
  },
  created () {
    window.addEventListener('resize', this.myEventHandler)
  },
  destroyed () {
    window.removeEventListener('resize', this.myEventHandler)
  },
  methods: {
    async checkBranch () {
      if (this.formSelect.masBranchID !== '') {
        await this.getEmp()
      }
    },
    async setDataDefault () {
      this.formSelect.flowId = this.DataFlow[0].value
      await this.setQueue(this.date)
      await this.DefaultDay()
    },
    async addBooking (item) {
      console.log('addBooking', item)
      this.$router.push('/CalendarBookingEmp?shopId=' + this.shopId + '&empId=' + item.empId + '&flowId=' + this.formSelect.flowId + '&masBranchID=' + this.formSelect.masBranchID)
    },
    async selectflow () {
      console.log('selectflow')
      await this.setQueue(this.date)
      await this.DefaultDay()
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
    nl2br (str, replaceMode, isXhtml) {
      let text = str || ''
      // console.log(str, replaceMode, isXhtml)
      var breakTag = (isXhtml) ? '<br />' : '<br>'
      var replaceStr = (replaceMode) ? '$1' + breakTag : '$1' + breakTag + '$2'
      // console.log('str', (str + '').replace(/(&nbsp|[^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr))
      return (text + '').replace(/(&nbsp|[^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr)
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
          window.location.href = 'line://ti/p/' + rs.basicId
        })
      }
    },
    getShop () {
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
                this.DarkModefont = '#000000'
                this.DarkModeStatus = true
              } else {
                this.DarkMode = '#ffffff00'
                this.DarkModefont = '#FFFFFF'
                this.DarkModeStatus = false
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
        this.DarkMode = '#ffffff00'
        this.DarkModefont = '#173053'
      }
    },
    async getDataFlow () {
      this.DataFlowName = []
      this.DataFlowNameAll = []
      this.DataFlow = []
      let dataFlow = []
      let dataFlowName = []
      let dataFlowNameAll = []
      // console.log('DataFlowName', this.DataFlowName)
      await axios.get(this.DNS_IP + '/flow/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            d.text = d.flowName
            d.textEn = d.flowNameEn
            d.value = d.flowId
            dataFlowName.push(d)
            dataFlowNameAll.push(d)
            dataFlow.push(d)
            // let s = rs[i]
            // s.dateDayCustom = JSON.parse(s.dateDayCustom)
            // s.flowId = s.flowId
            // this.dateDayCustom.push(JSON.parse(s.dateDayCustom))
            // let a = rs[i]
            // a.dateDayCustom = JSON.parse(s.dateDayCustom)
            // a.flowId = s.flowId
            // this.dateDayoffValue.push(JSON.parse(s.dateDayoffValue))
          }
          this.DataFlowName = dataFlowName
          this.DataFlowNameAll = dataFlowNameAll
          this.DataFlow = dataFlow
          // this.DataFlowName = dataFlowName.sort((a, b) => {
          //   if (a.text < b.text) return -1
          //   return a.text > b.text ? 1 : 0
          // })
          // this.DataFlowNameAll = dataFlowNameAll.sort((a, b) => {
          //   if (a.text < b.text) return -1
          //   return a.text > b.text ? 1 : 0
          // })
          // this.DataFlow = dataFlow.sort((a, b) => {
          //   if (a.text < b.text) return -1
          //   return a.text > b.text ? 1 : 0
          // })
        } else {
          this.DataFlow = []
          this.DataFlowName = []
          this.DataFlowNameAll = []
        }
        console.log('this.DataFlow', this.DataFlow)
        // console.log('this.dateDayCustom', this.dateDayCustom)
        // console.log('this.dateDayoffValue', this.dateDayoffValue)
      })
    },
    async getDataBranch () {
      this.branch = []
      this.branchData = []
      await axios.get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        console.log('rs', rs)
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            let s = {}
            s.text = d.masBranchName
            s.textEn = d.masBranchNameEn
            s.value = d.masBranchID
            this.branch.push(s)
            this.branchData.push(d)
            // console.log('dtdtdtdt', this.branch)
          }
          if (this.branch.length === 1) {
            this.formSelect.masBranchID = this.branch[0].value
            // this.checkTime()
            // this.getEmp()
          }
        }
      })
      // console.log('branchData', this.branchData)
    },
    async getEmp () {
      this.dataEmp = []
      this.dataEmpAll = []
      await axios.get(this.DNS_IP + '/empSelect/get?privacyPage=bookingform&masBranchID=' + this.formSelect.masBranchID).then(response => {
        let rs = response.data
        console.log('rssssssssssssss', rs)
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            if (d.flowId !== null && d.flowId !== '') {
              let checkFlowId = JSON.parse(d.flowId)
              if (checkFlowId.filter((a) => parseInt(a) === this.formSelect.flowId).length > 0) {
                if (d.setTime !== null && d.setTime !== '[]' && d.setTime !== '') {
                  let s = {}
                  console.log(d)
                  s.text = d.empFull_NameTH
                  s.textEng = d.empFull_NameTH
                  s.value = d.empId
                  this.dataEmp.push(d)
                  this.dataEmpAll.push(d)
                  let limit = {}
                  limit.empId = d.empId
                  limit.limitBookingCheck = d.limitBookingCheck || 'False'
                  limit.setTime = d.setTime || '[]'
                  this.EmpItemLimit.push(limit)
                }
              }
            }
          }
          if (this.dataEmp.length === 0) {
            this.$swal(
              'ไม่มีช่างสำหรับประเภทบริการนี้',
              'กรุณาเลือกประเภทบริการอื่นๆ',
              'info'
            )
          }
          if (this.dataEmp.length === 1) {
            this.formSelect.empId = this.dataEmp[0].value
            this.selectflow()
          }
          console.log('EmpItemLimit', this.EmpItemLimit)
        } else {
          this.dataEmp = []
          this.dataEmpAll = []
          this.EmpItemLimit = []
        }
      })
      console.log('dataEmp', this.dataEmpAll)
    }
  }
}
</script>

<style scoped>
.cardradius {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
}
.button {
  width: 45%;
  color: #fff;
  font-weight: 150;
  letter-spacing: 1px;
  margin: 6px 3px;
  padding: 10px 28px;
  border-radius: 25px !important;
  background-color: #0047a5;
}
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
.my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #1867c0;
  color: #ffffff;
  border: 1px solid #1867c0;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
  left: 4px;
  margin-right: 8px;
  position: relative;
}

.my-event.with-time {
  position: absolute;
  right: 4px;
  margin-right: 0px;
}
</style>
