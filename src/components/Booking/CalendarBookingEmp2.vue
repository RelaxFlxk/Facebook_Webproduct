<template>
  <v-main class="pa-5 fontInter" :style="'background-color:'+ DarkModeBackground +';'">
    <v-overlay :value="newCustomerStatusOverlay"></v-overlay>
    <v-card
      :ripple="false"
      :img="ImgCover"
      height="200px"
      width="100%"
      style="border-radius: 12px;"
    >
    </v-card>
    <v-card class="pt-6 pb-10"
          :color="DarkModeBackground"
          :style="'background-color:'+ DarkModeBackground +';min-height: 100vh;border-radius: 0px 0px 0px 0px;'"
          >
        <v-row>
          <v-col class="text-center">
            <v-avatar class="pa-1" :color="DarkModeBackground" size="120" style="margin-top: -90px">
            <img
              :src="LoGo"
            >
          </v-avatar>
          <div style="position:absolute; top:0px; right: 15px">
            <v-btn-toggle v-model="languageSelect">
              <v-btn
                :style="'background-color:' + (languageSelect === 0 ? 'rgba(0,0,0,.12)!important' : '')"
                small
                @click="languageSelect = 0"
              >
                TH
              </v-btn>

              <v-btn
                :style="'background-color:' + (languageSelect === 1 ? 'rgba(0,0,0,.12)!important' : '')"
                small
                @click="languageSelect = 1"
              >
                EN
              </v-btn>
            </v-btn-toggle>
          </div>
          </v-col>
        </v-row>
      <v-sheet
        class="mx-auto mt-0 pa-0 pt-5 pb-5"
        min-height="60vh"
        rounded
        :style="'background-color:' + '#FFFFFF' +';border-radius: 15px 15px 15px 15px;'"
      >
       <h5
          class="text-center mt-1"
          :style="'color:' + '#000000' + ';'"
          v-if="shop.length > 0"
        >
        {{ languageSelect === 0 ? "ตรวจสอบคิวนัดหมาย" : "Reservation" }}
        </h5>
        <!-- <h4
          class="text-center mt-1 font-weight-bold"
          :style="'color:' + '#000000' + ';'"
          v-if="shop.length > 0"
        >
          {{ shop[0].shopName }}
        </h4> -->
        <v-row align="center" class="mt-2">
          <v-col cols="12" >
            <v-select
              v-if="branch.length > 1"
              v-model="formSelect.masBranchID"
              :label="languageSelect === 0 ? 'เลือกสาขา *' : 'Select Branch *'"
              dense
              outlined
              :item-text="languageSelect === 0 ? 'text' : 'textEn'"
              :items="branch"
              attach
              :menu-props="{ bottom: true, offsetY: true }"
              @change="selectBranch()"
            ></v-select>
            <v-select
              v-if="formSelect.masBranchID !== '' && formSelect.masBranchID !== null"
              v-model="formSelect.flowId"
              :label="languageSelect === 0 ? 'เลือกประเภทบริการ *' : 'Select Service *'"
              :item-text="languageSelect === 0 ? 'text' : 'textEn'"
              dense
              outlined
              :items="DataFlow"
              attach
              :menu-props="{ bottom: true, offsetY: true }"
              @change="checkBranch(), checkTitleEmp()"
            >
            <template slot="item" slot-scope="data">
              <p class="text-wrap" >{{languageSelect === 0 ? data.item.text : data.item.textEn}}</p>
          </template></v-select>
            <v-select
              v-if="formSelect.masBranchID !== '' && dataEmp.length > 1"
              v-model="formSelect.empId"
              :label="languageSelect === 0 ? empTitleTh + ' *' : empTitleEng + ' *'"
              dense
              outlined
              :items="dataEmp"
              attach
            :menu-props="{ bottom: true, offsetY: true }"
              @change="fromAddTimeCus = '',checkCustomerTimeSlot()"
            ></v-select>
            <v-select
              :item-text="languageSelect === 0 ? 'text' : 'textEng'"
              item-value="value"
              v-if="customerTimeSlot === 'True' && formSelect.empId !== '' && timeSlotbyCustomer.length > 1"
              v-model="fromAddTimeCus"
              :items="timeSlotbyCustomer"
              :label="languageSelect === 0 ? 'จำนวนชั่วโมง *' : 'number of hours *'"
              :background-color="DarkMode"
              color="#000000"
              outlined
              required
              dense
              attach
              :menu-props="{ bottom: true, offsetY: true }"
              :rules ="[rules.required]"
              @change="selectflow()"
            >
            </v-select>
          </v-col>
        </v-row>
        <div class="pa-0 mb-2 mt-n8" v-if="formSelect.empId !== ''">
          <v-row>
            <v-col cols="8">
            <v-menu
              ref="menupicker"
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="-80"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                  <h6
                  class="pa-1 mt-0"
                  :style="'color:'+ '#000000' +';'"
                  v-bind="attrs"
                  v-on="on">
                  {{languageSelect === 0 ? defaultMonth.filter((v , k) => (k + 1) === parseInt(momenDate_MM(date)))[0] + ' ' + ' ' + (parseInt(momenDate_YYYY(date)) + 543) : defaultMonthEng.filter((v , k) => (k + 1) === parseInt(momenDate_MM(date)))[0] + ' ' + ' ' + (parseInt(momenDate_YYYY(date))) }}
                  <v-icon
                  >
                    mdi-calendar-month
                  </v-icon>

                  </h6>
              </template>
              <v-date-picker
                v-model="date"
                type="month"
                no-title
                scrollable
                @input="menu2 = false"
                :min="currentMonth"
                :locale="languageSelect === 0 ? 'th': 'sv-se'"
                @change="setMonthCarousel()"
              ></v-date-picker>
            </v-menu>
            </v-col>
            <v-col cols="4" class="text-right pr-2">
              <v-icon
                class="mr-1"
                v-if="previous"
                color="#000000"
                @click="setMonthCarousel('previous')"
              >
                mdi-chevron-left
              </v-icon>
              <v-icon
                class=""
                color="#000000"
                @click="setMonthCarousel('next')"
              >
                mdi-chevron-right
              </v-icon>
            </v-col>
          </v-row>
        </div>
       <v-slide-group
          v-if="dateSelect.length > 0 && (customerTimeSlot === 'True' ? fromAddTimeCus !== '' : dataEmpAll.length > 0 && formSelect.empId !== '') "
          v-model="model"
          center-active
          class="pt-0 mt-n1"
          color="primary"
        >
          <v-slide-item
            v-for="(item, n) in dateSelect"
            :key="'a'+n"
          >
            <div class="text-center mr-3">
              <v-card
                v-if="(dataEmpAll.filter((a) =>  a.empId === formSelect.empId)[0].typeDayCustom === 'off' && dayCustom(item.date).length === 0 && dayoffvalue(item.date).length === 0) || (dataEmpAll.filter((a) => a.empId === formSelect.empId)[0].typeDayCustom === 'on' && dayCustom(item.date).length > 0)"
                :color="item.active ? shop[0].secondaryColor : '#FFFFFF'"
                :style="'border:'+ (item.active ? '' : '1px solid #ccc') + ' !important; border-radius: 12px'"
                v-on:click="item.active? item.active = false: item.active = true  ,getDetails(item,n)"
                class="px-3 py-2"
                min-width="45"
              >
                <div :style="'color:'+ (item.active ? getContrastYIQ(shop[0].secondaryColor) : '#000000') + ' !important;'">
                  <p class="mt-2 text-center mb-0 text-caption" style="line-height: 0.5rem;">
                    <span v-if="languageSelect === 0">{{item.text}}</span>
                    <span v-else>{{dateEng.filter(el => { return el.text === item.text })[0].textEn}}</span>
                  </p>
                  <span class="text-h6 mt-n6">{{item.value}}</span>
                </div>
              </v-card>

              <v-card
                v-else
                color="#eeeeee"
                style="border: #eee; !important; border-radius: 12px"
                class="px-3 py-2"
                min-width="45"
              >
                <div style="color:#aaaaaa !important;">
                  <p class="mt-2 text-center mb-0 text-caption" style="line-height: 0.5rem;">
                    <span v-if="languageSelect === 0">{{item.text}}</span>
                    <span v-else>{{dateEng.filter(el => { return el.text === item.text })[0].textEn}}</span>
                  </p>
                  <span class="text-h6">{{item.value}}</span>
                </div>
              </v-card>
            </div>
          </v-slide-item>
        </v-slide-group>

        <v-expand-transition>
          <v-sheet
            v-if="customerTimeSlot === 'True' ? fromAddTimeCus !== '' : showDetails.length > 0  && formSelect.empId !== ''"
            min-height="200"
            tile
            class="mx-auto"
          >
              <!-- <h5 class="mt-3 font-weight-bold text-center" >
                {{languageSelect === 0 ? 'เวลาที่สามารถจองได้': 'Available Time'}}
              </h5> -->
              <!-- :style="'background-color: ' + (hover ? shop[0].secondaryColor + '33' : shop[0].secondaryColor + '11')" -->
              <v-row class="mt-4 no-gutters mx-auto">
                <template v-for="(item , index) in showDetails">
                  <v-col cols="4" class="my-2 pr-3" :key="index" v-if="(item.countBooking < parseInt(item.limitBooking)) && !item.Overtime">
                    <v-hover v-slot="{ hover }">
                      <v-btn
                        :elevation="hover ? 4 : 0"
                        class="font-weight-bold text-center fontInter"
                        height="42"
                        outlined
                        block
                        :color="shop[0].secondaryColor + 'aa'"
                        @click="addBooking(item)"
                      >
                        {{item.time}}
                      </v-btn>
                    </v-hover>
                  </v-col>
                </template>
              </v-row>
          </v-sheet>
        </v-expand-transition>
      </v-sheet>
    </v-card>
     <v-dialog
      v-model="dialogSelectGoto"
      max-width="100%"
      persistent
    >
      <v-card style="background: linear-gradient(180deg, #ffffff 10%, #e1f3ff 100%);" height="auto">
        <v-container fluid class="pa-4">
          <!-- <div class="mb-2" style="text-align: end;">
            <v-card-title style="justify-content: space-between;"><div class="pl-3">กรุณาเลือก</div> <v-avatar color="#FAD4D4" size="35">
                  <span style="color:red;padding-bottom: 4px;"><v-icon class="iconify" color="red" data-icon="fluent:receipt-add-20-regular"></v-icon></span>
            </v-avatar></v-card-title>
          </div> -->
          <v-row dense>
            <v-col cols="6" style="border-right: 2px solid #ccd1e4;">
              <div style="text-align: center;" @click="dialogSelectGoto = false">
                <v-avatar color="#9A9897" size="50">
                  <span><span><v-icon class="iconify" color="white" style="font-size: 30px;" data-icon="fa:calendar"></v-icon></span></span>
                </v-avatar>
                <div>นัดหมายใหม่</div>
                <div>Boooking</div>
              </div>
            </v-col>
            <v-col cols="6" v-if="statusCheckDiposit">
              <div height="200px" style="text-align: center;" @click="gotoCheckUser('upload')">
                <v-avatar color="#9A9897" size="50">
                  <span><v-icon class="iconify" color="white" style="font-size: 40px;" data-icon="fluent:receipt-add-20-regular"></v-icon></span>
                </v-avatar>
                <div>แนบหลักฐานโอนเงิน</div>
                <div>Uploaded file</div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
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
      console.log('newQuestion', newQuestion)
      console.log('oldQuestion', oldQuestion)
      // let year = moment(this.date).format('YYYY')
      // this.itemMonth.forEach((v, k) => {
      //   if (k === newQuestion) {
      //     // console.log('moment', moment(year + v.value, 'YYYY-MM').format('YYYY-MM'))
      //     this.date = moment(year + v.value, 'YYYY-MM').format('YYYY-MM')
      //   }
      // })
      // await this.DefaultDay(this.date)
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
      defaultMonthEng: ['January', 'Febuary', 'Mar', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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
      statusChek: false,
      dataEmp: [],
      dataEmpAll: [],
      EmpItemLimit: [],
      branchData: [],
      branch: [],
      timeavailable: [],
      empTitleTh: '',
      empTitleEng: '',
      timeSlotbyCustomer: [],
      customerTimeSlot: 'False',
      fromAddTimeCus: '',
      statusCheckDiposit: false,
      dialogSelectGoto: false,
      dataLineConfig: {},
      StatusChecknewCustome: false,
      newCustomerStatusOverlay: false,
      next_bookingNowCheckCount_month: 'False'
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
    this.dataLineConfig = dataLineConfig
    await this.checkLiffLogin(dataLineConfig)
    await this.checkBanUserId(this.profile.userId, checkShopId)
    await this.getShop()
    // await this.getDataFlow()
    await this.getDataBranch()
    await this.checkUserId()
    // await this.newCustomerStatusCheck()
    if (this.$route.query.empId) {
      this.formSelect.empId = parseInt(this.$route.query.empId)
      this.formSelect.flowId = parseInt(this.$route.query.flowId)
      this.formSelect.masBranchID = parseInt(this.$route.query.masBranchID)
      await this.checkBranch()
      await this.checkCustomerTimeSlot()
    }
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
    async selectBranch () {
      this.formSelect.flowId = ''
      this.dateSelect = []
      this.showDetails = []
      this.customerTimeSlot = 'False'
      await this.getDataFlow()
    },
    flowOne () {
      if (this.DataFlowName.length === 1) {
        this.formSelect.flowId = this.DataFlowName[0].value
        this.checkBranch()
        this.checkTitleEmp()
      }
    },
    // async newCustomerStatusCheck () {
    //   const BookingData = await axios.get(this.DNS_IP + '/booking_view/get?shopId=' + this.shopId + '&userId=' + this.profile.userId)
    //     .then(async response => {
    //       if (response.data.status === false) {
    //         return []
    //       } else {
    //         return response.data
    //         // return []
    //       }
    //       // return []
    //     })
    //     .catch(error => {
    //       console.log('error function addData : ', error)
    //       return []
    //     })
    //   const checkFlow = await axios.get(this.DNS_IP + '/flow/get?shopId=' + this.shopId)
    //     .then(async response => {
    //       // console.log('res', response.data)
    //       if (response.data.status === false) {
    //         return []
    //       } else {
    //         return response.data
    //         // return []
    //       }
    //     })
    //     .catch(error => {
    //       console.log('error function addData : ', error)
    //       return []
    //     })
    //   console.log('BookingData!!!!!!!!!!!!!', BookingData)
    //   console.log('checkFlow!!!!!!!!!!!!!', checkFlow.filter((item) => item.newCustomerStatus === 'True'))
    //   if (BookingData.length === 0 && checkFlow.filter((item) => item.newCustomerStatus === 'True').length > 0) {
    //     console.log('IF')
    //     this.StatusChecknewCustome = true
    //   } else {
    //     this.StatusChecknewCustome = false
    //   }
    // },
    async checkUserId () {
      this.statusCheckDiposit = false
      await axios
        .get(
          this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.$route.query.shopId +
            '&userId=' +
            this.profile.userId +
            '&checkOnsite=is null&statusBt=null&checkDeposit=True&depositStatus=null'
        )
        .then(async response => {
          let rs = response.data
          console.log('response.data', rs)
          if (rs.status === false) {
            this.dialogSelectGoto = false
          } else {
            let checkDepositStatus = rs.filter(el => { return moment(el.dueDate).format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD') })
            // console.log('response.data', checkDepositStatus)
            if (checkDepositStatus.length > 0) {
              this.statusCheckDiposit = true
              this.dialogSelectGoto = true
            } else {
              this.statusCheckDiposit = false
              this.dialogSelectGoto = false
            }
          }
        })
    },
    gotoCheckUser (text) {
      if (text === 'history') {
        this.$router.push('/CheckBookingNext?shopId=' + this.$route.query.shopId)
      } else {
        this.$router.push('/PaymentUpload?shopId=' + this.$route.query.shopId + '&languageSelect=' + this.languageSelect)
      }
    },
    calculateTime (start, end) {
      let countTime = null
      // if (end > start) {
      //   let time = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
      //   let h = parseInt(time.split(':')[0])
      //   let m = parseInt(time.split(':')[1])
      //   countTime = (h * 60) + m
      // } else {
      //   countTime = 0
      // }
      if (end > start) {
        let genTime = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
        let h = parseInt(genTime.split(':')[0])
        let m = parseInt(genTime.split(':')[1])
        if (h === 0 && m !== 0) {
          countTime = m + ' นาที'
        } else if (h !== 0 && m === 0) {
          countTime = h + ' ชม.'
        } else {
          countTime = h + ' ชม. ' + m + ' นาที'
        }
      } else {
        countTime = 'No Data'
      }
      return countTime
    },
    calculateTimeEng (start, end) {
      let countTime = null
      // if (end > start) {
      //   let time = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
      //   let h = parseInt(time.split(':')[0])
      //   let m = parseInt(time.split(':')[1])
      //   countTime = (h * 60) + m
      // } else {
      //   countTime = 0
      // }
      if (end > start) {
        let genTime = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
        let h = parseInt(genTime.split(':')[0])
        let m = parseInt(genTime.split(':')[1])
        if (h === 0 && m !== 0) {
          countTime = m + ' min.'
        } else if (h !== 0 && m === 0) {
          countTime = h + ' h.'
        } else {
          countTime = h + ' h. ' + m + ' min.'
        }
      } else {
        countTime = 'No Data'
      }
      return countTime
    },
    async AddallowedDatesBysetTimebyday () {
      this.dateDayoffValue = JSON.parse(this.dataEmpAll.filter((a) => a.empId === this.formSelect.empId)[0].dateDayoffValue || '[]')
      if (this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTimebyday === 'True') {
        console.log('IF1')
        this.statusChek = true
        let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTime)
        timeJson.forEach((item) => {
          console.log('for')
          if (item.setTime.length < this.fromAddTimeCus) {
            console.log('IF2')
            if (this.dateDayoffValue.filter((i) => i === item.value).length === 0) {
              console.log('item.value', item.value)
              this.dateDayoffValue.push(item.value)
            }
          }
        })
      } else {
        this.statusChek = false
      }
      console.log('this.dateDayoffValue', this.dateDayoffValue)
    },
    checkCustomerTimeSlot () {
      this.statusChek = false
      // console.log('DataFlowNameAll', this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId))
      this.timeSlotbyCustomer = []
      this.customerTimeSlot = this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId)[0].customerTimeSlot
      let timeSLOT = this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId)[0].timeSlot
      let coutTimeSlot = 1
      // console.log('TIMESLOTBYFLOW_____', this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId)[0].timeSlot)
      let allTime = []
      if (this.customerTimeSlot === 'True') {
        // console.log('EmpItemLimit', this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTime)
        if (this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTimebyday === 'True') {
          let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTime)
          let dataTime = []
          timeJson.forEach((itemTime, index) => {
            console.log('item', itemTime)
            allTime = itemTime.setTime
            allTime.forEach((item, key) => {
              let ss = {}
              if (allTime.length === 1) {
                ss.text = 'ไม่ระบุ (มีเวลาเดียว)'
                ss.value = key + 1
                dataTime.push(ss)
              } else {
                if (key > 0) {
                  let start = allTime.filter((i, k) => k === 0)[0].value
                  let end = item.value
                  ss.text = this.calculateTime(start, end)
                  ss.textEng = this.calculateTimeEng(start, end)
                  ss.value = key
                  // console.log('TIMEEEE', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value)
                  // console.log('TIMEEEE2', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value, 'coutTime', coutTimeSlot)
                  if (coutTimeSlot === timeSLOT) {
                    dataTime.push(ss)
                    coutTimeSlot = 1
                  } else {
                    coutTimeSlot = coutTimeSlot + 1
                  }
                  // this.timeSlotbyCustomer.push(ss)
                }
              }
              if ((key + 1) === allTime.length) {
                coutTimeSlot = 1
              }
            })
          })
          dataTime.forEach((i, n) => {
            // console.log('TTTTTT', this.timeSlotbyCustomer.filter((item) => item.text === i.text && item.value === i.value).length === 0)
            if (this.timeSlotbyCustomer.filter((item) => item.text === i.text && item.value === i.value).length === 0) {
              console.log('n', n)
              this.timeSlotbyCustomer.push(i)
            }
          })
          // console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
        } else {
          allTime = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTime)
          allTime.forEach((item, key) => {
            let ss = {}
            if (allTime.length === 1) {
            // ss.text = item.value
            // ss.value = key + 1
            // this.timeSlotbyCustomer.push(ss)
              this.fromAddTimeCus = key + 1
              this.selectflow()
            } else {
              if (key > 0) {
                let start = allTime.filter((i, k) => k === 0)[0].value
                let end = item.value
                ss.text = this.calculateTime(start, end)
                ss.textEng = this.calculateTimeEng(start, end)
                ss.value = key
                // console.log('____', ss.value, timeSLOT, '-', ss.value / timeSLOT)
                // console.log('TIMEEEE', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value, 'coutTime', coutTimeSlot)
                if (coutTimeSlot === timeSLOT) {
                  this.timeSlotbyCustomer.push(ss)
                  coutTimeSlot = 1
                } else {
                  coutTimeSlot = coutTimeSlot + 1
                }
              }
            }
          })
        }
      } else {
        this.selectflow()
      }

      // console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
    },
    checkTitleEmp () {
      let checkDataEmpTitle = this.DataFlowNameAll.filter(el => { return el.flowId === this.formSelect.flowId })
      if (checkDataEmpTitle.length > 0) {
        this.empTitleTh = checkDataEmpTitle[0].empTitleTh || 'พนักงานช่าง'
        this.empTitleEng = checkDataEmpTitle[0].empTitleEng || 'Employee'
      } else {
        this.empTitleTh = 'พนักงานช่าง'
        this.empTitleEng = 'Employee'
      }
    },
    async bookingBynewCustomerStatus () {
      // Link Local
      // window.location = 'http://localhost:8081/BookingFormEmp?shopId=' + this.shopId + '&source=CalendarBookingEmpnewCustomerStatus&flowId=' +
      // this.formSelect.flowId + '&empId=' + this.formSelect.empId + '&masBranchID=' + this.formSelect.masBranchID + '&languageSelect=' + this.languageSelect

      // link หลัก
      window.location = 'https://liff.line.me/' + this.dataLineConfig.liffBookingFormEmpID + '?shopId=' + this.shopId + '&source=CalendarBookingEmpnewCustomerStatus&flowId=' +
      this.formSelect.flowId + '&empId=' + this.formSelect.empId + '&masBranchID=' + this.formSelect.masBranchID + '&languageSelect=' + this.languageSelect
    },
    async checkBranch () {
      let newCustomerStatus = this.DataFlowNameAll.filter((item) => item.flowId === this.formSelect.flowId)[0].newCustomerStatus
      console.log('DataFlowNameAll', newCustomerStatus)
      console.log('formSelect.flowId', this.formSelect.flowId)
      if (newCustomerStatus === 'True') {
        if (this.formSelect.masBranchID !== '') {
          this.newCustomerStatusOverlay = true
          console.log('IFFFFF')
          this.formSelect.empId = ''
          await this.getEmp()
          await this.bookingBynewCustomerStatus()
        }
      } else {
        if (this.formSelect.masBranchID !== '') {
          console.log('ElSE')
          this.formSelect.empId = ''
          await this.getEmp()
        }
      }
    },
    dayCustom (item) {
      let dateDayCustom = this.dataEmpAll.filter((a) => a.empId === this.formSelect.empId)[0].dateDayCustom || '[]'
      let d = JSON.parse(dateDayCustom).filter((b) => b === item)
      return d
    },
    dayoffvalue (item, itemqq = 'NO') {
      let newDate = new Date(item)
      let day = newDate.getDay()
      let dateDayoffValue = this.dataEmpAll.filter((a) => a.empId === this.formSelect.empId)[0].dateDayoffValue || '[]'
      let d = []
      // console.log('dateDayoffValue', this.dateDayoffValue)
      // console.log('JSON.parse(dateDayoffValue)', JSON.parse(dateDayoffValue))
      if (this.statusChek === true) {
        // console.log('if', itemqq, this.dateDayoffValue.filter((b) => b === day), newDate)
        d = this.dateDayoffValue.filter((b) => b === day)
      } else {
        console.log('else')
        d = JSON.parse(dateDayoffValue).filter((b) => b === day)
      }
      return d
    },
    async DefaultDay () {
      // console.log('dateSelect', this.dateSelect)
      let count = 0
      this.dateSelect.forEach((v, k) => {
        let typeDayCustom = this.dataEmpAll.filter((a) => a.empId === this.formSelect.empId)[0].typeDayCustom
        if (typeDayCustom === 'off') {
          if (this.dayCustom(v.date).length === 0 && this.dayoffvalue(v.date, 'test').length === 0) {
            if (count === 0) {
              v.active = true
              this.getDetails(v, k)
              count = 1
              // console.log('kkkkkkkkif', k)
              // console.log('kkkkkkkkif', v)
            }
          }
        } else {
          if (this.dayCustom(v.date).length > 0) {
            if (count === 0) {
              v.active = true
              this.getDetails(v, k)
              count = 1
              // console.log('kkkkkkkkelse', k)
              // console.log('kkkkkkkkelse', v)
            }
          }
        }
      })
    },
    // async setDataDefault () {
    //   this.formSelect.flowId = this.DataFlow[0].value
    //   await this.setQueue(this.date)
    //   await this.DefaultDay()
    // },
    async setMonthCarousel (item) {
      // console.log('//////////////////////////', moment(this.date, 'YYYY-MM').format('YYYY-MM'))
      // console.log('currentMonth', moment(this.currentMonth, 'YYYY-MM').format('YYYY-MM'))
      if (item === 'next') {
        this.date = moment(this.date).add(1, 'months').format('YYYY-MM')
      } else if (item === 'next_bookingNowCheckCount_month') {
        this.date = moment(this.date).add(1, 'months').format('YYYY-MM')
      } else if (item === 'previous') {
        this.date = moment(this.date).add(-1, 'months').format('YYYY-MM')
      } else {

      }
      if (moment(this.date, 'YYYY-MM').format('YYYY-MM') > moment(this.currentMonth, 'YYYY-MM').format('YYYY-MM')) {
        if (this.next_bookingNowCheckCount_month === 'False') {
          this.previous = true
          console.log('true')
        }
      } else {
        this.previous = false
        console.log('false')
      }
      // console.log('******************', this.date)
      await this.setQueue(moment(this.date, 'YYYY-MM').format('YYYY-MM'))
      await this.DefaultDay()
    },
    async addBooking (item) {
      console.log('item', item)
      let text = ''
      if (this.languageSelect === 0) {
        text = 'บริการ : <b>' + this.DataFlow.filter((row) => { return this.formSelect.flowId === row.flowId })[0].flowName + '</b><br/>'
        text += 'วัน : <b>' + item.date.split('-')[2] + ' ' + this.defaultMonth.filter((v, k) => (k + 1) === parseInt(this.momenDate_MM(item.date)))[0] + ' ' + (parseInt(this.momenDate_YYYY(item.date)) + 543) + '</b><br/>'
        text += 'เวลา : <b>' + item.time + '</b><br/>'
      } else {
        text = 'Service : <b>' + this.DataFlow.filter((row) => { return this.formSelect.flowId === row.flowId })[0].flowNameEn + '</b><br/>'
        text += 'Date : <b>' + item.date.split('-')[2] + ' ' + this.defaultMonthEng.filter((v, k) => (k + 1) === parseInt(this.momenDate_MM(item.date)))[0] + ' ' + (parseInt(this.momenDate_YYYY(item.date))) + '</b><br/>'
        text += 'Time : <b>' + item.time + '</b><br/>'
      }
      this.$swal({
        title: this.languageSelect === 0 ? 'ยืนยันนัดหมาย?' : 'Confirm Reservation?',
        html: text,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: this.languageSelect === 0 ? 'ยืนยัน' : 'Confirm',
        cancelButtonText: this.languageSelect === 0 ? 'ยกเลิก' : 'Cancel'
      })
        .then(async result => {
          //     this.$router.push('/BookingFormEmp?shopId=' + this.shopId + '&source=CalendarBookingEmp&time=' +
          // item.timeValue + '&flowId=' + this.formSelect.flowId + '&date=' +
          // item.date + '&empId=' + this.formSelect.empId + '&masBranchID=' + this.formSelect.masBranchID + '&languageSelect=' + this.languageSelect +
          // '&fromAddTimeCus=' + this.fromAddTimeCus + '&customerTimeSlot=' + this.customerTimeSlot)
          window.location = 'https://liff.line.me/' + this.dataLineConfig.liffBookingFormEmpID + '?shopId=' + this.shopId + '&source=CalendarBookingEmp&time=' +
          item.timeValue + '&flowId=' + this.formSelect.flowId + '&date=' +
          item.date + '&empId=' + this.formSelect.empId + '&masBranchID=' + this.formSelect.masBranchID + '&languageSelect=' + this.languageSelect +
          '&fromAddTimeCus=' + this.fromAddTimeCus + '&customerTimeSlot=' + this.customerTimeSlot
        })
    },
    async getDetails (item, key, a) {
      this.showDetails = []
      // console.log('imte', item)
      // console.log('key', key)
      this.dateSelect.filter((item, n) => n !== key).forEach((i, u) => { i.active = false })
      if (this.dateSelect.filter((item) => item.active === true).length > 0) {
        this.showDetails = this.allDetails.filter((d) => d.date === item.date)
      } else {
        this.showDetails = []
      }
      this.model = key
    },
    async selectflow () {
      console.log('selectflow')
      await this.AddallowedDatesBysetTimebyday()
      await this.setQueue(this.date)
      await this.DefaultDay()
    },
    async setQueue (month) {
      this.dateSelect = []
      this.allDetails = []
      this.showDetails = []
      console.log('setQueue')
      // console.log('month', month)
      if (this.formSelect.empId) {
        console.log('getLimitBooking')
        await this.getLimitBooking(month)
        this.dateSelect.sort(this.compare)
        console.log('sortCompare', this.dateSelect)
        // await this.setLimit(month)
      } else {
        // this.$swal('กรุณาเลือกประเภทบริการ', 'ผิดพลาด', 'error')
      }
    },
    async getLimitBooking (month) {
      const result = await axios.get(this.DNS_IP + '/LimitBookingDateEmp/get?shopId=' + this.shopId + '&empId=' + this.formSelect.empId + '&bookingDate=' + month)
      if (!result.data.status) {
        if (result.data.length > 0) {
          console.log('result1', result.data)
          this.LimitBooking = result.data
          await this.setLimit(month)
          await this.DefaultDay()
        } else {
          this.LimitBooking = []
          console.log('result2', result.data)
          await this.setLimit(month)
          await this.DefaultDay()
        }
      }
    },
    async test () {

    },
    compare (a, b) {
      if (parseInt(a.value) < parseInt(b.value)) {
        return -1
      }
      if (parseInt(a.value) > parseInt(b.value)) {
        return 1
      }
      return 0
    },
    async setLimit (item) {
      this.dateSelect = []
      this.allDetails = []
      let month = moment(item).format('MM')
      let year = moment(item).format('YYYY')
      // เซ็ตวันที่และวัน เช่น 1-จ
      let data = this.getDaysArray(year, month)
      // console.log('data', data)
      let bookingNowCheck = this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheck
      let bookingNowCheckCount = this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheckCount || 1
      let bookingNowCheckTimeStatus = this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheckTimeStatus || 'False'
      if (bookingNowCheck === 'True') {
        // console.log('test', this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheckCount || 1)
        let CheckMonth = moment().add(bookingNowCheckCount, 'days').format('YYYY-MM')
        // console.log('CheckMonth', CheckMonth)
        if (CheckMonth !== this.currentMonth) {
          console.log('IF')
          this.next_bookingNowCheckCount_month = 'True'
          this.setMonthCarousel('next_bookingNowCheckCount_month')
        } else {
          this.next_bookingNowCheckCount_month = 'False'
          console.log('ELSE')
        }
        this.currentDate = moment().add(bookingNowCheckCount, 'days').format('YYYY-MM-DD')
        this.currentMonth = moment(this.currentDate, 'YYYY-MM').format('YYYY-MM')
      } else {
        this.currentDate = moment().format('YYYY-MM-DD')
      }
      console.log('this.currentDate', this.currentDate)
      // console.log('bookingNowCheck', bookingNowCheck)
      // let limitTime = JSON.parse(this.dataEmpAll.filter((item) => item.empId === this.formSelect.empId)[0].setTime)
      await data.forEach(async (v, k) => {
        let limitTime = null
        // console.log('v', v)
        // console.log('ก่อน- วันที่', new Date(moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')).getDay(), '---', v.split('-')[0])
        if (this.dataEmpAll.filter((dataEmpAllitem) => dataEmpAllitem.empId === this.formSelect.empId)[0].setTimebyday === 'True') {
          let timeJson = JSON.parse(this.dataEmpAll.filter((dataEmpAllitem) => dataEmpAllitem.empId === this.formSelect.empId)[0].setTime).filter((items) => items.value === new Date(moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')).getDay())
          limitTime = timeJson[0].setTime || []
        } else {
          limitTime = JSON.parse(this.dataEmpAll.filter((dataEmpAllitem) => dataEmpAllitem.empId === this.formSelect.empId)[0].setTime)
        }
        // console.log('limitTIme', limitTime)
        let dataTimeCheck = await this.setLimitBooking(moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD'))
        // console.log('วันที่ ', v.split('-')[0], ' ________index', k)
        // console.log('dataTimeCheck', new Date(moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')).getDay())
        let s = {}
        s.text = v.split('-')[1]
        s.value = v.split('-')[0]
        s.checkLimit = null
        s.color = ''
        s.active = false
        s.date = moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
        let countBooking = 0
        let totalLimit = limitTime.reduce((x, y) => { return x + parseInt(y.limitBooking) }, 0)
        limitTime.forEach((a, b) => {
          // console.log('a', a)
          // console.log('timevaliablie', moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD'), '  ', dataTimeCheck)
          let cheklimit = 0
          if (dataTimeCheck.filter((TimeA, TimeB) => a.value === TimeA.value).length > 0) {
            cheklimit = 0
          } else {
            cheklimit = 1
          }
          // let cheklimit = this.LimitBooking.filter((item) => { return a.value === item.bookingTime && moment(item.bookingDate, 'DD').format() === moment(v.split('-')[0], 'DD').format() }).map((d) => d.countBooking)[0] || 0
          let ss = {}
          let currentDateBybookingNowCheckTimeStatus = moment().format('YYYY-MM-DD')
          if (bookingNowCheckTimeStatus === 'True') {
            currentDateBybookingNowCheckTimeStatus = this.currentDate
          }
          if (moment(this.date + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD') === currentDateBybookingNowCheckTimeStatus) {
            console.log('textTime', moment().format(a.value), moment().format('HH:mm'))
            // console.log('textTime', moment().format(a.value) < moment().format('HH:mm'))
            if (moment().format(a.value) > moment().format('HH:mm')) {
              ss.date = moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
              ss.time = a.text
              ss.timeValue = a.value
              ss.countBooking = cheklimit
              ss.limitBooking = a.limitBooking
              ss.Overtime = false
              this.allDetails.push(ss)
            } else {
              ss.date = moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
              ss.time = a.text
              ss.timeValue = a.value
              ss.countBooking = cheklimit
              ss.limitBooking = a.limitBooking
              ss.Overtime = true
              this.allDetails.push(ss)
            }
          } else {
            ss.date = moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
            ss.time = a.text
            ss.timeValue = a.value
            ss.countBooking = cheklimit
            ss.limitBooking = a.limitBooking
            ss.Overtime = false
            this.allDetails.push(ss)
          }
          if ((countBooking += cheklimit) >= totalLimit) {
            s.checkLimit = false
            s.color = this.DarkMode
            s.colortext = '#000000'
            // console.log('cheklimitIF', v, a.value, cheklimit)
          } else {
            s.checkLimit = true
            s.color = '#0D47A1'
            s.colortext = '#FFFFFF'
            // console.log('cheklimit', v, a.value, cheklimit)
          }
        })
        // เซ็ตวันที่เป็นปัจจุบัน
        if (moment(item, 'YYYY-MM').format() <= moment(this.currentMonth, 'YYYY-MM').format()) {
          // console.log('ddd/', parseInt(s.value), parseInt(this.currentDate.split('-')[2]))
          if (parseInt(s.value) >= parseInt(this.currentDate.split('-')[2])) {
            // console.log('s', s)
            this.dateSelect.push(s)
          }
        } else {
          // console.log('s', JSON.stringify(s))
          this.dateSelect.push(s)
        }
      })
      // console.log('val', this.dateSelect)
      // console.log('allDetails', this.allDetails)
    },
    getDaysArray (year, month) {
      // console.log('result', result)
      var monthIndex = month - 1 // 0..11 instead of 1..12
      var names = [ 'อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส' ]
      var date = new Date(year, monthIndex, 1)
      var result = []
      while (date.getMonth() === monthIndex) {
        result.push(date.getDate() + '-' + names[date.getDay()])
        date.setDate(date.getDate() + 1)
      }
      console.log('result', result)
      return result
    },
    async checkLiffLogin (dataLineConfig) {
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
            let checkBranchByFlow = d.masBranchID || 'All'
            if ((checkBranchByFlow === this.formSelect.masBranchID.toString()) || checkBranchByFlow === 'All') {
              console.log('this.StatusChecknewCustome', this.StatusChecknewCustome)
              if (this.StatusChecknewCustome === true) {
                if (d.newCustomerStatus === 'True') {
                  d.text = d.flowName
                  d.textEn = d.flowNameEn
                  d.value = d.flowId
                  dataFlowName.push(d)
                  dataFlowNameAll.push(d)
                  dataFlow.push(d)
                }
              } else {
                d.text = d.flowName
                d.textEn = d.flowNameEn
                d.value = d.flowId
                dataFlowName.push(d)
                dataFlowNameAll.push(d)
                dataFlow.push(d)
              }
            }
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
            this.CaseOneBranch()
            // this.checkTime()
            // this.getEmp()
          }
        }
      })
      // console.log('branchData', this.branchData)
    },
    async CaseOneBranch () {
      await this.selectBranch()
      await this.flowOne()
    },
    async getEmp () {
      this.dataEmp = []
      this.dataEmpAll = []
      this.dateSelect = []
      this.showDetails = []
      this.timeSlotbyCustomer = []
      this.fromAddTimeCus = ''
      this.customerTimeSlot = 'False'
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
                  s.text = d.empFull_NameTH
                  s.textEng = d.empFull_NameTH
                  s.value = d.empId
                  this.dataEmp.push(s)
                  this.dataEmpAll.push(d)
                  let limit = {}
                  limit.empId = d.empId
                  limit.limitBookingCheck = d.limitBookingCheck || 'False'
                  limit.setTime = d.setTime || '[]'
                  limit.setTimebyday = d.setTimebyday
                  this.EmpItemLimit.push(limit)
                }
              }
            }
          }
          if (this.dataEmp.length === 0) {
            this.$swal(
              this.languageSelect === 0 ? 'ไม่มี' + this.empTitleTh + 'สำหรับประเภทบริการนี้' : 'There is no ' + this.empTitleEng + ' for this type of service.',
              this.languageSelect === 0 ? 'กรุณาเลือกประเภทบริการอื่นๆ' : 'Please select another type of service.',
              'info'
            )
          }
          if (this.dataEmp.length === 1) {
            this.formSelect.empId = this.dataEmp[0].value
            this.checkCustomerTimeSlot()
          }
          console.log('EmpItemLimit', this.EmpItemLimit)
        } else {
          this.dataEmp = []
          this.dataEmpAll = []
          this.EmpItemLimit = []
        }
      })
      console.log('dataEmp', this.dataEmpAll)
    },
    async setLimitBooking (dateItem) {
      this.time = ''
      let dataTimeCheck = []
      // this.showTable = []
      if (this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTimebyday === 'True') {
        let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTime).filter((items) => items.value === new Date(dateItem).getDay())
        dataTimeCheck = timeJson[0].setTime || []
        // console.log('IF')
      } else {
        // console.log('ELSE')
        dataTimeCheck = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTime) || []
      }
      this.limitBookingCheck = this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].limitBookingCheck || 'False'
      if (this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].limitBookingCheck || 'False') {
        // dataTimeCheck = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTime) || []
        let slotByflow = []
        if (this.customerTimeSlot === 'False') {
          slotByflow = this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId)[0].timeSlot
          // console.log('overTimeIF', slotByflow)
        } else {
          slotByflow = this.fromAddTimeCus
          // console.log('overTimeELSE', slotByflow)
        }
        let overTime = this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId)[0].overTime
        // console.log('overTime', overTime)
        if (dataTimeCheck.length >= slotByflow) {
          let LimitBooking = await this.checkDateToTime(dateItem)
          // เซ็ต Status True ให้แต่ละช่วงเวลา
          dataTimeCheck.forEach((v, k) => {
            if (typeof v.status === 'undefined') {
              v.status = true
              if (v.limitBooking === '0') {
                v.status = false
              }
            }
          })
          // เซ็ต Status False ให้กับเวลาที่มีคนจองเข้ามาแล้ว
          if (LimitBooking !== 'False') {
            if (LimitBooking.length > 0) {
              dataTimeCheck.forEach((v, k) => {
                let bookingTarget = LimitBooking.filter((a) => a.bookingTime === v.value)
                if (bookingTarget.length > 0) {
                  v.status = false
                  let bookingTargetSlot = bookingTarget[0].timeSlotCustomer || bookingTarget[0].timeSlot
                  // console.log('bookingTager', bookingTarget)
                  for (let bT = 0; bT < bookingTargetSlot; bT++) {
                    if (dataTimeCheck[k + bT] !== undefined) {
                      dataTimeCheck[k + bT].status = false
                    }
                  }
                }
              })
            }
          }
          // จับคู่เวลาตาม slotbyFlow
          let Newtimeavailable = []
          let slotCheck = slotByflow
          for (let i = 0; i < dataTimeCheck.length; i++) {
            let num = i + (slotCheck - 1)
            let checkitem = dataTimeCheck.filter((item, key) => (key >= i && key <= num))
            Newtimeavailable.push(checkitem)
          }
          // console.log('Newtimeavailable', Newtimeavailable)
          dataTimeCheck = []
          //  ตัดเวลาที่มีค่า False ออก
          Newtimeavailable.forEach((v, k) => {
            if (overTime === 'True') {
              if (v.filter((v) => v.status === false).length <= 0) {
                dataTimeCheck.push(v[0])
              }
            } else {
              if (v.filter((v) => v.status === false).length <= 0 && v.length === slotCheck) {
                dataTimeCheck.push(v[0])
              }
            }
          })
          return dataTimeCheck
        } else {
          // console.log('ทดสอบ')
          dataTimeCheck = []
          return dataTimeCheck
        }
      } else {
        // console.log('dataTimeCheck ELSEEEEE', dataTimeCheck)
        // LimitBookingBy Flow
        // dataTimeCheck = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTime) || []
        return dataTimeCheck
      }
      // await this.chekSlotTime()
    },
    checkDateToTime (dateItem) {
      let dt = this.LimitBooking.filter((item) => moment(item.bookingDate).format('YYYY-MM-DD') === moment(dateItem, 'YYYY-MM-DD').format('YYYY-MM-DD'))
      if (dt.length > 0) {
        return dt
      } else {
        return 'False'
      }
    },
    getContrastYIQ (hexcolor) {
      var r = parseInt(hexcolor.substring(1, 3), 16)
      var g = parseInt(hexcolor.substring(3, 5), 16)
      var b = parseInt(hexcolor.substring(5, 7), 16)
      var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
      return (yiq >= 128) ? 'black' : 'white'
    }
  }
}
</script>

<style scoped>
.fontInter {
  font-family: Inter,sans-serif,-apple-system,blinkmacsystemfont,Segoe UI,roboto,Helvetica Neue,arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol !important;
}
.cardradius {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
}
.v-sheet.v-card:not(.v-sheet--outlined) {
  -webkit-box-shadow: 0 3px 1px -2px rgb(255, 255, 255), 0 2px 2px 0 rgb(255 255 255), 0 1px 5px 0 rgb(255 255 255) !important;
    box-shadow: 0 3px 1px -2px rgb(255, 255, 255), 0 2px 2px 0 rgb(255 255 255), 0 1px 5px 0 rgb(255 255 255) !important;
}
.cardBox {
  box-shadow: 0 3px 1px -2px rgb(255, 255, 255), 0 2px 2px 0 rgb(255 255 255), 0 1px 5px 0 rgb(255 255 255);
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
