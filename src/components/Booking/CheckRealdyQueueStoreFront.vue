<template>
  <v-main>
    <v-card
    :ripple="false"
    :img="ImgCover"
    height="240px"
    width="100%"
    >
    </v-card>
    <v-card class="pa-6 pb-10 px-0 mt-n10 mb-14"
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
          <v-container>
            <v-form ref="form_search" v-model="validSearch" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="masBranchID"
                    :item-text="languageSelect === 0 ? 'text' : 'textEng'"
                    background-color="white"
                    style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                    hide-details
                    :items="branchItem"
                    :label="languageSelect === 0 ? 'สาขา' : 'Branch'"
                    solo
                    dense
                    required
                    :rules ="[rules.required]"
                    ><template #prepend-inner>
                      <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                        mdi-map-marker-outline
                      </v-icon>
                    </template>
                  </v-select>
                </v-col>
                <!-- <v-col cols="12">
                  <v-select
                    :item-text="languageSelect === 0 ? 'text' : 'textEng'"
                    style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                    v-model="flowSelect"
                    hide-details
                    background-color="white"
                    :items="DataFlowItem"
                    :label="languageSelect === 0 ? 'ประเภทบริการ' : 'Service'"
                    solo
                    dense
                    required
                    :rules ="[rules.required]"
                    @change="setTime()"
                  >
                    <template #prepend-inner>
                      <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                        mdi-note-text-outline
                      </v-icon>
                    </template>
                  </v-select>
                </v-col> -->
                <v-col cols="12">
                  <v-menu
                    ref="menu"
                    v-model="menuStart"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        hide-details
                        background-color="white"
                        v-model="dateStart"
                        style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                        :label="languageSelect === 0 ? 'วัน/เดือน/ปี' : 'Date'"
                        readonly
                        solo
                        dense
                        required
                        :rules ="[rules.required]"
                        v-bind="attrs"
                        v-on="on"
                      >
                      <template #prepend-inner>
                      <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                        mdi-calendar
                      </v-icon>
                    </template></v-text-field>
                    </template>
                    <v-date-picker
                      @input="menuStart = false"
                      v-model="dateStart"
                      no-title
                      scrollable
                    >
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                <!-- <v-col cols="12" v-if="flowSelect !== ''"> -->
                  <v-select
                    style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                    v-model="time"
                    hide-details
                    background-color="white"
                    :items="timeavailable"
                    :label="languageSelect === 0 ? 'เวลา' : 'Time'"
                    solo
                    dense
                    required
                    :rules ="[rules.required]"
                  >
                    <template #prepend-inner>
                      <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                        mdi-map-marker-circle
                      </v-icon>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="12" class="pt-0">
                  <v-btn
                    color="warning"
                    block
                    @click="checkSearch()"
                  >
                    <v-icon color="white" left>mdi-clipboard-text-search</v-icon>
                    {{ languageSelect === 0 ? "ตรวจสอบคิวที่กำลังใช้บริการ" : "Check active queue" }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
    <v-sheet class="pa-3 pt-5 mt-3" :style="'background-color:'+ DarkModeBackground +';border-radius: 0px 0px 0px 0px;'" >
        <!-- <div class="" style="border-radius: 45px 45px 0px 0px;display:flex;justify-content: center;background-color:#FFFFFF;min-height: 180px;" v-if="dataBookingData.length > 0 && checkQueue !== 0">
          <v-row style="margin:auto;">
          <v-col cols="12" class="text-center"><v-icon color="#28B446" x-large class="ma-0 mr-2" style="font-size:70px;">mdi-check-circle</v-icon></v-col>
          <v-col cols="12" class="text-center font-weight-bold"><h3 style="color:#28B446;">{{ languageSelect === 0 ? "รับคิวเรียบร้อย" : "Received the queue" }}</h3></v-col>
        </v-row>
      </div> -->
      <div class="" style="border-radius: 45px 45px 0px 0px;display:flex;justify-content: center;background-color:#FFFFFF;min-height: 180px;" v-if="checkQueue === 0">
        <v-row style="margin:auto;">
          <v-col cols="12" class="text-center"><v-icon color="#dc3545" x-large class="ma-0 mr-2" style="font-size:70px;">mdi-alert-circle</v-icon></v-col>
          <v-col cols="12" class="text-center font-weight-bold"><h3 style="color:#dc3545;">{{ languageSelect === 0 ? "ไม่มีเลขคิว" : "No queue number" }}</h3></v-col>
        </v-row>
      </div>
      <div v-if="dataBookingData.length > 0 && dataBookingData[0].storeFrontQueue" class="pa-3" :style="'border-top: 4px dotted '+ DarkModeBackground + ';background-color:#FFFFFF;min-height: 180px;'">
        <h4 class="text-center font-weight-bold mt-5" style="color:#092C4C">{{ shop[0].shopName }}</h4>
        <v-row>
          <v-col cols="6" >
            <div class="text-left ml-6 mt-3">
              <p class="font-weight-bold" style="color:#092C4C">{{ languageSelect === 0 ? "วันที่นัดหมาย" : "Date" }}</p>
              <p style="color:#092C4C" class="mt-n4 font-weight-bold">{{ languageSelect === 0 ? "เวลา" : "Time of issue" }}</p>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="text-right mr-6 mt-3">
              <p class="font-weight-bold"  style="color:#092C4C">{{momenDate_2(dataBookingData[0].dueDate)}}</p>
              <p style="color:#092C4C" class="mt-n4 font-weight-bold">{{momenTime(dataBookingData[0].dueDate)}}{{ languageSelect === 0 ? "  น." : "" }}</p>
            </div>
          </v-col>
        </v-row>
      </div>
      <v-sheet v-if="dataBookingData.length > 0 && dataBookingData[0].storeFrontQueue" class="pa-3" :style="'background-color:#FFFFFF;min-height: 180px;border-radius: 0px 0px 45px 45px;border-top: 4px dotted '+ DarkModeBackground + ';position:relative'">
        <span :style="'background-color:'+ DarkModeBackground + ';padding: 14px 15px;border-radius: 50%;position: absolute;bottom: 167px;left: -12px;'"></span>
        <span :style="'background-color:'+ DarkModeBackground + ';padding: 14px 15px;border-radius: 50%;position: absolute;top: -14px;right: -12px;'"></span>
        <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? "คิวที่กำลังใช้บริการ" : "Active queue" }}</h5>
        <p style="color:#092C4C;font-size: 80px;" class="text-center font-weight-black mt-n5 mb-n5">{{dataBookingData[0].storeFrontQueue}}</p>
        <!-- <div style="display:flex;justify-content: center;" v-if="beforQueue !== 0"> -->
          <!-- <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? "มีคิวก่อนหน้าคุณ" : "At the front of the queue" }}</h5>
          <h5 style="color:#FFFFFF;background-color:#092C4C;min-height: 30px;width:30px;border-radius: 80px 80px 80px 80px;display: flex;justify-content: center;align-items: center;" class="text-center font-weight-black ml-2 mr-2 mt-2">{{beforQueue}}</h5>
          <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? "คิว" : "Queue" }}</h5> -->
        <!-- </div>
        <h5 v-else style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? "ถึงคิวคุณแล้ว" : "You are in the queue" }}</h5> -->
        <!-- <div style="display:flex;justify-content: center;">
          <v-sheet class="pa-3 mt-2" :style="'background-color:#092C4C;min-height: 100px;width:100px;border-radius: 80px 80px 80px 80px;align-items: center;'">
            <h1 class="text-center mt-3" style="color:#FFFFFF" >A001</h1>
          </v-sheet>
          <div style="position: relative;">
            <h5 class="text-center mb-0 font-weight-bold" style="color:#092C4C;position: absolute;bottom: 0;left: 20px;" >คิว</h5>
          </div>
        </div> -->

      </v-sheet>
      <!-- <div style="background-color:#FFFFFF ;border-radius: 0px 0px 45px 45px;" class="pa-3 px-5">
        <p style="color:#092C4C;font-size: 13px;" class="ont-weight-bold">*ทางบริษัทขอสงวนสิทธิ์ในการข้ามคิว กรณีลูกค้าไม่แสดงตน</p>
      </div> -->

      <!-- <v-app-bar :color="momenDate_1(new Date()) === momenDate_1(dataBooking.dueDate) ? 'teal' : 'error'" v-if="profile">
              <v-avatar class="mr-3">
                <v-icon x-large dark>
                  {{momenDate_1(new Date()) === momenDate_1(dataBooking.dueDate) ? 'mdi-clock-check' : 'mdi-clock-alert'}}
                </v-icon>
              </v-avatar>
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
            </v-card> -->
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

export default {
  components: {
    name: '',
    QrcodeVue
  },
  data () {
    return {
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
      sequenceNo: 0,
      shopId: this.$route.query.shopId,
      bookNo: this.$route.query.bookNo,
      beforQueue: '',
      checkQueue: null,
      time: '',
      timeavailable: [],
      branchItem: [],
      masBranchID: '',
      DataFlowItem: [],
      flowSelect: '',
      dateStart: '',
      validSearch: true,
      menuStart: false,
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
      }
    }
  },
  async mounted () {
    if (this.$route.query.shopId) {
      this.shopId = this.$route.query.shopId
      await this.getDataFlow()
      await this.getDataBranch()
      this.setTime()
      await this.getShop()
      // await this.searchAny()
      // await this.getBookingData()
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
    setTime () {
      this.timeavailable = []
      let checkFlow = this.DataFlowItem.filter(el => { return el.value === this.flowSelect })
      if (checkFlow.length > 0) {
        this.timeavailable = JSON.parse(checkFlow[0].allData.setTime)
      } else {
        this.timeavailable = []
      }
    },
    async getDataFlow () {
      let resultOption = []
      await axios
        .get(this.DNS_IP + `/flow/get?shopId=${this.shopId}&storeFrontCheck=True`)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d.flowName
              s.textEng = d.flowNameEn
              s.value = d.flowId
              s.allData = d
              resultOption.push(s)
              // console.log('this.DataFlowName', this.DataFlowName)
            }
          } else {
            resultOption = []
          }
        })
      this.DataFlowItem = resultOption
      if (resultOption.length > 0) {
        this.flowSelect = this.DataFlowItem[0].value
      }
    },
    async getDataBranch () {
      this.branchItem = await this.getDataFromAPI('/master_branch/get', 'masBranchID', 'masBranchName', '', 'masBranchNameEn')
      if (this.branchItem.length > 0) {
        this.masBranchID = this.branchItem[0].value
      }
    },
    async getDataFromAPI (url, fieldId, fieldName, param, fieldNameEn) {
      let result = []
      await axios
        .get(this.DNS_IP + `${url}?shopId=${this.shopId}${param}`)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d[fieldName]
              if (fieldNameEn) {
                s.textEng = d[fieldNameEn]
              }
              s.value = d[fieldId]
              s.allData = d
              result.push(s)
            }
          } else {
            result = []
          }
        })
      return result
    },
    validate (Action) {
      switch (Action) {
        case 'SEARCH':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_search.validate()
          })
          break
        default:
          break
      }
    },
    checkSearch () {
      this.validate('SEARCH')
      setTimeout(() => this.searchBooking(), 500)
    },
    async searchBooking () {
      if (this.validSearch === true) {
        this.dataBookingData = []
        await this.getBookingDataList(this.dateStart)
        let urlApi = this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.shopId +
            '&masBranchID=' +
            this.masBranchID +
            // '&flowId=' +
            // this.flowSelect +
            '&dueDate=' +
            this.dateStart + ' ' + this.time + '&storeFrontQueue=is not null&statusBt=confirm'
        await axios
          .get(urlApi)
          .then(async response => {
            console.log('getData', response.data.length)
            let rs = response.data
            if (rs.length > 0) {
              let sortData = rs.sort((a, b) => {
                if (a.storeFrontQueue < b.storeFrontQueue) return -1
                return a.storeFrontQueue > b.storeFrontQueue ? 1 : 0
              })
              for (let i = 0; i < sortData.length; i++) {
                let d = sortData[i]
                if (this.BookingDataList[d.bookNo] !== undefined) {
                  d.cusName = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'ชื่อ')
                  d.cusName = (d.cusName.length > 0) ? d.cusName[0].fieldValue : ''
                  this.dataBookingData.push(d)
                }
              }
            }
          })
      }
    },
    async getBookingDataList (dateStart) {
      this.BookingDataList = []
      let url = `${this.DNS_IP}/BookingData/getView?shopId=${this.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}`
      // let url = `${this.DNS_IP}/BookingData/getView?shopId=${this.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}&flowId=${this.flowSelect}`
      await axios
        .get(url)
        .then(async response => {
          if (response.data.status !== false) {
            response.data.forEach((row) => {
              if (typeof (this.BookingDataList[row.bookNo]) === 'undefined') {
                this.BookingDataList[row.bookNo] = []
              }
              this.BookingDataList[row.bookNo].push(row)
            })
          }
        }).catch(error => {
          // this.dataEditReady = true
          setTimeout(() => this.getBookingDataList(dateStart), 3000)
          console.log('catch getBookingDataList : ', error)
        })
      console.log('this.BookingDataList1', this.BookingDataList)
    },
    getDataFromFieldName (data, key) {
      if (data !== undefined) {
        return data.filter(function (el) {
          return el.fieldName === key
        })
      } else {
        return []
      }
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
    async getBookingQueue () {
      await axios
        .get(this.DNS_IP + '/booking_view/get?shopId=' + this.shopId + '&dueDate=' + this.dataBookingData[0].dueDate + '&storeFrontQueue=is not null&statusBt=confirm')
        .then(async response => {
          let rs = response.data
          console.log('test', rs)
          if (rs.length > 0) {
            // let count = 0
            // let rsSort = rs.sort((i, k) => i.storeFrontQueue)
            // let reversed = rs.reverse()
            if (rs.filter((item, key) => item.storeFrontQueue === this.dataBookingData[0].storeFrontQueue).length > 0) {
              let findIndex = rs.findIndex((item, key) => item.storeFrontQueue === this.dataBookingData[0].storeFrontQueue)
              console.log('findIndex', findIndex)
              this.beforQueue = rs.filter((item, key) => key > findIndex).length
              this.checkQueue = this.dataBookingData[0].storeFrontQueue
            } else {
              this.dataBookingData = []
              this.checkQueue = 0
            }
          }
        })
    },
    async getBookingData () {
      this.dataBookingData = []
      await axios
        .get(this.DNS_IP + '/BookingData/get?shopId=' + this.shopId + '&bookNo=' + this.bookNo)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            this.dataBookingData = rs
            console.log('bookingData', rs)
            await this.getBookingQueue()
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
