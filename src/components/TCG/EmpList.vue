<template>
  <v-main>
    <div class="page-content footer-clear">
      <headerdeco></headerdeco>
      <div class="content my-0 px-4 pt-6 ml-4">
        <v-btn icon @click="gotoLanding">
          <v-icon>mdi-chevron-left</v-icon> ย้อนกลับ
        </v-btn>
      </div>
      <div class="content my-0 px-4 pt-4">
          <div class="d-flex">
              <div class="align-self-center">
                  <h3 class="font-16 mb-2 color-black bold">ศูนย์ที่ปรึกษาทางการเงิน SMEs (บสย. FA Center)</h3>
                  นัดหมายหมอหนี้ที่ปรึกษาทางการเงิน (Financial Advisory)
                  จากผู้ทรงคุณวุฒิอดีตผู้บริหารระดับสูง<br>
                  ของสถาบันการเงิน ในด้านต่างๆ ดังนี้<br>
                  <ol>
                    <li>ด้านการขอสินเชื่อ/เตรียมความพร้อมก่อนกู้เงิน</li>
                    <li>พัฒนาธุรกิจ/การแก้ไขปัญหาธุรกิจ</li>
                    <li>ปรับโครงสร้างหนี้/หาแนวทางแก้ไขหนี้</li>
                  </ol>
              </div>
          </div>
      </div>
      <div
        elevation="2"
        class="mx-2 px-1 pt-3 pb-5 mb-12 rounded-xl"
      >
          <!-- <topmenu></topmenu> -->
          <v-row
            align="center"
            justify="center"
            class="ma-3"
          >
            <v-btn-toggle
              v-model="toggle_menu"
              rounded
              block="true"
              class="rounded-xl"
            >
              <v-btn active-class="menu_tcg_active">
                หมอหนี้
              </v-btn>
              <v-btn active-class="menu_tcg_active">
                คิวนัดหมาย
              </v-btn>
              <v-btn active-class="menu_tcg_active">
                ประวัติปรึกษา
              </v-btn>
            </v-btn-toggle>
          </v-row>
          <div v-if="toggle_menu === 0">
            <template v-for="(item, i) in dataEmp" >
            <v-expansion-panels :key="'panel' + i" :style="(i === dataEmp.length-1) ? 'border-bottom-right-radius: 24px!important;border-bottom-left-radius: 24px!important' : ''">
              <v-expansion-panel>
                <v-expansion-panel-header disable-icon-rotate>
                  <v-row dense :key="i" class="ml-2">
                    <v-col cols="3">
                      <v-avatar
                        v-if="item.empImge"
                      >
                        <v-img :src="item.empImge"></v-img>
                      </v-avatar>
                      <v-avatar
                        v-else
                        color="indigo"
                      >
                        <v-icon dark>mdi-account-circle</v-icon>
                      </v-avatar>
                    </v-col>
                    <v-col cols="9">
                        {{ item.empFirst_NameTH }} {{ item.empLast_NameTH }}<br>
                        <v-btn
                          class="mt-2"
                          outlined
                          rounded
                          small
                          @click="addBooking(item)"
                        >
                          นัดปรึกษา
                        </v-btn>
                    </v-col>
                  </v-row>
                  <template v-slot:actions>
                    <v-icon color="primary">
                      mdi-badge-account-horizontal
                    </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div v-html="nl2br(item.additionalInformation,false,false)"></div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
          </div>
          <div v-if="toggle_menu === 1 && bookingData.length > 0" class="mt-6">
            <div v-for="(Bitem, index) in bookingData" :key="index">
              <v-card class="ma-2 my-4 pa-3" style="display: flex;min-height: 90px;flex-direction: column;border-radius: 20px 20px 20px 20px;">
                  <div style="display: flex;justify-content: center;align-items: center;">
                    <h5>{{ 'นัดหมาย วันที่ : ' +  Bitem.dueDateTextDay }}</h5>
                  </div>
                  <div style="display: flex;flex-direction: column;">
                    <div style="display: flex;justify-content: space-between;">
                      <p class="ma-0 mb-1">{{ Bitem.flowName }}</p>
                      <div v-if="Bitem.statusName === 'Job'">
                        <v-chip
                        v-if="jobData.filter((item) => item.jobNo === Bitem.jobNo).length > 0"
                        :color="Bitem.color"
                        dark
                      >{{ jobData.filter((item) => item.jobNo === Bitem.jobNo)[0].stepTitle }}
                    </v-chip>
                      </div>
                      <v-chip
                        v-else
                        :color="Bitem.color"
                        dark
                      >{{ Bitem.statusName }}</v-chip>
                    </div>
                    <div>
                      <p class="ma-0 mb-1">{{ 'คุณ ' + Bitem.bookingDataCustomerName }}</p>
                    </div>
                    <div>
                      <p class="ma-0 mb-1">{{ 'หมอหนี้ ' + Bitem.bookingEmpFlowName }}</p>
                    </div>
                  </div>
              </v-card>
            </div>
          </div>
          <div v-if="toggle_menu === 2 && HistoryData.length > 0">
            <div v-for="(Hitem, index) in HistoryData" :key="index">
              <v-card class="ma-2 my-4 pa-3" style="display: flex;min-height: 90px;flex-direction: column;border-radius: 20px 20px 20px 20px;">
                  <div style="display: flex;justify-content: center;align-items: center;">
                    <h5>{{ 'นัดหมาย วันที่ : ' +  Hitem.dueDateTextDay }}</h5>
                  </div>
                  <div style="display: flex;flex-direction: column;">
                    <div style="display: flex;justify-content: space-between;">
                      <p class="ma-0 mb-1">{{ Hitem.flowName }}</p>
                      <v-chip
                        color="green"
                        dark
                      >จบงาน</v-chip>
                    </div>
                    <div>
                      <p class="ma-0 mb-1">{{ 'หมอหนี้ ' + Hitem.bookingEmpFlowName }}</p>
                    </div>
                  </div>
              </v-card>
            </div>
          </div>
        </div>
    </div>

    <v-bottom-sheet v-model="sheet" v-if="EmpSelect" scrollable persistent>
      <v-card
        class="text-center pa-2"
      >
        <v-card-title class="pa-0">
          <v-row class="mr-2">
            <v-col cols="12" class="text-right">
              <v-btn icon @click="sheet = !sheet">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <!-- <v-row dense class="ml-4 mr-2">
            <v-col cols="2">
              <v-avatar
                v-if="EmpSelect[0].empImge"
              >
                <v-img :src="EmpSelect[0].empImge"></v-img>
              </v-avatar>
              <v-avatar
                v-else
                color="indigo"
              >
                <v-icon dark>mdi-account-circle</v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="9">
              <v-card-title class="text-left body-2">{{ EmpSelect[0].empFirst_NameTH + ' ' + EmpSelect[0].empLast_NameTH }}</v-card-title>
            </v-col>
          </v-row> -->
        </v-card-title>
        <v-card-text style="overflow-x: hidden;">
          <v-row class="mx-2">
            <v-col cols="12">
              <v-sheet height="64">
                <v-toolbar
                  flat
                >
                  <v-btn
                    outlined
                    class="mr-1"
                    color="grey darken-2"
                    @click="setToday"
                  >
                    Today
                  </v-btn>
                  <v-btn
                    fab
                    text
                    small
                    color="grey darken-2"
                    @click="prev"
                  >
                    <v-icon small>
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                  <v-btn
                    fab
                    text
                    small
                    color="grey darken-2"
                    @click="next"
                  >
                    <v-icon small>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                  <v-toolbar-title style="font-size: 1rem;" v-if="$refs.calendar">
                    {{ $refs.calendar.title }}
                  </v-toolbar-title>
                </v-toolbar>
              </v-sheet>
              <v-calendar
                ref="calendar"
                v-model="focus"
                color="primary"
                :weekdays="weekday"
                :type="type"
                :events="events"
                :event-overlap-mode="mode"
                :event-overlap-threshold="30"
                :event-color="getEventColor"
                @click:event="showTime"
                @change="getEvents"
              >
            </v-calendar>
            </v-col>
          </v-row>
          <v-divider></v-divider><br><br>
          <v-row class="mx-2">
            <v-col>
              <v-chip-group
                v-model="formSelect.time"
                color="#FFFFFF"
                active-class="primary--text"
                mandatory
                column
              >
                <v-chip
                  v-for="(itemTime, index) in showTimeData"
                  :key="index"
                  :value="itemTime.value"
                >
                  {{ itemTime.value }}
                </v-chip>
              </v-chip-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                class="mt-2 mb-6"
                outlined
                rounded
                small
                @click="gotoBooking()"
              >
                ยืนยันนัดหมาย
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- <v-card-actions>
        </v-card-actions> -->
      </v-card>
    </v-bottom-sheet>
  </v-main>
</template>

<script>
import axios from 'axios' // api
import QrcodeVue from 'qrcode.vue'
import moment from 'moment'
// import TopMenu from './TopMenu.vue'
import HeaderDeco from './HeaderDeco.vue'
// import { date } from 'vue-xlsx-table'
export default {
  components: {
    name: '',
    QrcodeVue,
    // 'topmenu': TopMenu,
    'headerdeco': HeaderDeco
  },
  watch: {
    async model (newQuestion, oldQuestion) {
      let year = moment(this.date).format('YYYY')
      this.itemMonth.forEach((v, k) => {
        if (k === newQuestion) {
          this.date = moment(year + v.value, 'YYYY-MM').format('YYYY-MM')
        }
      })
      await this.DefaultDay(this.date)
      // await this.DefaultDay()
    },
    async focus (newQuestion, oldQuestion) {
      console.log('newQuestion', newQuestion)
      console.log('oldQuestion', oldQuestion)
    }
  },
  data () {
    return {
      toggle_menu: 1,
      formSelect: {
        flowId: 1891,
        empId: '',
        masBranchID: '759',
        datemonth: '',
        dateday: '',
        time: '',
        date: ''
      },
      shopId: 'Uf33589642476a4a765c3f2ef72eba9f0',
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
      shop: [],
      LoGo: [],
      DataFlow: [],
      DataFlowNameAll: [],
      languageSelect: 0,
      dateDayCustom: [],
      dateDayoffValue: [],
      ColorByShop: [],
      DarkMode: '',
      DarkModeStatus: null,
      DarkModeButton: '',
      DarkModeBackground: '',
      DarkModefont: '',
      EmpSelect: null,
      dataEmp: [],
      dataEmpAll: [],
      EmpItemLimit: [],
      branchData: [],
      branch: [],
      sheet: false,
      LimitBooking: [],
      Alltimeavailable: [],
      customerTimeSlot: 'False',
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days'
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      mode: 'stack',
      modes: ['stack', 'column'],
      weekday: [0, 1, 2, 3, 4, 5, 6],
      showTimeData: [],
      params_uid: null,
      bookingData: [],
      HistoryData: [],
      jobData: []
    }
  },
  async mounted () {
    if (this.$route.query.uid) {
      this.params_uid = this.$route.query.uid
    } else {
      const queryString = decodeURIComponent(window.location.search).replace(
        '?liff.state=',
        ''
      )
      const params = new URLSearchParams(queryString)
      this.params_uid = params.get('uid')
    }

    // let checkShopId = ''
    // if (this.$route.query.shopId) {
    //   checkShopId = this.$route.query.shopId
    // } else {
    //   const queryString = decodeURIComponent(window.location.search).replace(
    //     '?liff.state=',
    //     ''
    //   )
    //   console.log('queryString', queryString)
    //   const params = new URLSearchParams(queryString)
    //   checkShopId = params.get('shopId')
    // }
    let dataLineConfig = await this.getDataLineConfig(this.shopId)
    await this.checkLiffLogin(dataLineConfig)
    await this.getShop()
    await this.getDataFlow()
    await this.getDataBranch()
    this.checkBranch()
    await this.getBookingData()
    await this.getJob()
    if (this.bookingData.length === 0) {
      this.toggle_menu = 0
    }
    // this.$refs.calendar.checkChange()
  },
  created () {
    window.addEventListener('resize', this.myEventHandler)
  },
  destroyed () {
    window.removeEventListener('resize', this.myEventHandler)
  },
  methods: {
    gotoLanding () {
      window.location.href = 'https://chatclinic.tcg.or.th/tcghealthcheck_dev/landing'
    },
    async showTime ({ nativeEvent, event }) {
      this.showTimeData = []
      let dateEvent = moment(event.end).format('YYYY-MM-DD')
      this.formSelect.date = dateEvent
      this.showTimeData = this.Alltimeavailable.filter((item) => item.date === dateEvent)[0].time
    },
    async getEvents ({ start, end }) {
      // console.log('True')
      this.showTimeData = []
      this.Alltimeavailable = []
      const events = []
      const month = end.month
      const year = end.year
      const countDay = end.day
      // console.log('DATA!!!', month, year, countDay)
      let formattedMonth = moment({ year, month: month - 1 }).format('YYYY-MM')
      await this.getLimitBooking(formattedMonth)
      for (let i = 0; i < countDay; i++) {
        let date = moment({ year, month: month - 1 }).add(i, 'days').format('YYYY-MM-DD')
        let currentDate = moment().format('YYYY-MM-DD')
        if (date >= currentDate) {
          console.log('date', date, ' - ', currentDate)
          let checkAllowedDate = this.allowedDates(date)
          if (checkAllowedDate === true) {
            let time = this.setLimitBooking(date)
            this.Alltimeavailable.push({'date': date, 'time': time})
            // console.log('time', time)
            // console.log('checkAllowedDate', checkAllowedDate)
            if (time.length === 0) {
              events.push({
                name: 'เต็ม',
                start: new Date(`${date}T00:00:00`),
                end: new Date(`${date}T23:59:59`),
                color: 'red'
              })
            } else {
              events.push({
                name: 'ว่าง',
                start: new Date(`${date}T00:00:00`),
                end: new Date(`${date}T23:59:59`),
                color: 'green'
              })
            }
          }
        }
        // console.log('errrrrrrr', date, events)
      }
      this.events = events
      // console.log('this.event', JSON.stringify(this.events))
    },
    getEventColor (event) {
      return event.color
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    async checkBranch () {
      if (this.formSelect.masBranchID !== '') {
        await this.getEmp()
      }
    },
    async gotoBooking () {
      if (this.formSelect.time !== '' && this.formSelect.date !== '') {
        this.$swal({
          title: this.languageSelect === 0 ? 'ยืนยันการนัดหมาย?' : 'Want to make an appointment?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#b3b1ab',
          confirmButtonText: this.languageSelect === 0 ? 'ใช่' : 'Yes',
          cancelButtonText: this.languageSelect === 0 ? 'ไม่' : 'No'
        })
          .then(async result => {
            this.$router.push('/tcg/BookingFormEmp?uid=' + this.profile.userId + '&shopId=' + this.shopId + '&source=CalendarBookingEmp&time=' +
          this.formSelect.time + '&flowId=' + this.formSelect.flowId + '&date=' +
          this.formSelect.date + '&empId=' + this.formSelect.empId + '&masBranchID=' + this.formSelect.masBranchID + '&languageSelect=' + this.languageSelect +
          '&fromAddTimeCus=&customerTimeSlot=' + this.customerTimeSlot)
          // window.location = 'https://liff.line.me/' + this.dataLineConfig.liffBookingFormEmpID + '?shopId=' + this.shopId + '&source=CalendarBookingEmp&time=' +
          // this.formSelect.timeValue + '&flowId=' + this.formSelect.flowId + '&date=' +
          // this.formSelect.date + '&empId=' + this.formSelect.empId + '&masBranchID=' + this.formSelect.masBranchID + '&languageSelect=' + this.languageSelect +
          // '&fromAddTimeCus=&customerTimeSlot=' + this.customerTimeSlot
          })
      } else {
        if (this.formSelect.date === '') {
          this.$swal({
            title: 'กรุณาเลือกวันที่ต้องการ',
            text: '',
            type: 'info',
            timer: 2000,
            showConfirmButton: false
          })
        } else {
          this.$swal({
            title: 'กรุณาเลือกเวลาต้องการ',
            text: '',
            type: 'info',
            timer: 2000,
            showConfirmButton: false
          })
        }
      }
    },
    allowedDates (date) {
      let typeDayCustom = this.dataEmpAll.filter(item => { return item.empId === this.formSelect.empId })[0].typeDayCustom
      let dateDay = moment(date).day()
      let dateDayoffValue = JSON.parse(this.dataEmpAll.filter(item => { return item.empId === this.formSelect.empId })[0].dateDayoffValue) || []
      let dateDayCustom = JSON.parse(this.dataEmpAll.filter(item => { return item.empId === this.formSelect.empId })[0].dateDayCustom) || []
      if (typeDayCustom === 'off') {
        if (dateDayoffValue.filter((item) => item === dateDay).length === 0 && dateDayCustom.filter((item) => item === date).length === 0) {
          return true
        } else {
          return false
        }
      } else {
        console.log('TRUE', date, dateDayCustom.filter((item) => item === date), dateDayCustom.filter((item) => item === date).length === 1)
        if (dateDayCustom.filter((item) => item === date).length === 1) {
          return true
        } else {
          return false
        }
      }
    },
    async addBooking (item) {
      this.formSelect.empId = item.empId
      this.formSelect.date = ''
      this.formSelect.time = ''
      this.EmpSelect = this.dataEmp.filter((row) => { return row.empId === item.empId })
      this.sheet = true
      if (this.focus === '') {
        this.focus = moment().format('YYYY-MM-DD')
      }
      if (this.$refs.calendar) {
        let end = this.$refs.calendar.lastEnd
        let start = this.$refs.calendar.lastStart
        await this.getEvents({ start, end })
      }
      // this.$router.push('/CalendarBookingEmp?shopId=' + this.shopId + '&empId=' + item.empId + '&flowId=' + this.formSelect.flowId + '&masBranchID=' + this.formSelect.masBranchID)
    },
    async selectflow () {
      await this.setQueue(this.date)
      await this.DefaultDay()
    },
    async getLimitBooking (month) {
      const result = await axios.get(this.DNS_IP + '/LimitBookingDateEmp/get?shopId=' + this.shopId + '&empId=' + this.formSelect.empId + '&bookingDate=' + month)
      if (!result.data.status) {
        if (result.data.length > 0) {
          this.LimitBooking = result.data
          // await this.setLimit(month)
          // await this.DefaultDay()
        } else {
          this.LimitBooking = []
          // await this.setLimit(month)
          // await this.DefaultDay()
        }
      }
    },
    setLimitBooking (dateItem) {
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
        // console.log('this.DataFlowNameAll', this.DataFlowNameAll[0])
        if (this.customerTimeSlot === 'False') {
          slotByflow = this.DataFlowNameAll[0].timeSlot
          // console.log('overTimeIF', slotByflow)
        } else {
          slotByflow = this.fromAddTimeCus
          // console.log('overTimeELSE', slotByflow)
        }
        let overTime = this.DataFlowNameAll[0].overTime
        // console.log('overTime', overTime)
        if (dataTimeCheck.length >= slotByflow) {
          let LimitBooking = this.checkDateToTime(dateItem)
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
          // console.log('dataTimeCheck IF', dataTimeCheck)
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
    async checkLiffLogin (dataLineConfig) {
      this.getProfile_dev()
      // await this.$liff
      //   .init({
      //     liffId: '1657329342-wpGx9ry3'
      //   })
      // this.$liff.init({ 'liffId': liffId }, function (data) {})
    },
    async getProfile () {
      let _this = this
      await this.$liff
        .getProfile()
        .then(function (profile) {
          _this.profile = profile
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
      this.profile.userId = this.params_uid
      console.log('dev', this.profile)
    },
    async getBotinfo () {
      if (this.shopId) {
        const url = `${this.DNS_IP}/line/getOa`
        // const url = 'http://localhost:81/Api/vgroupl_api/v1/Zoom/Login/getData?'
        const config = {
          headers: {
            'botId': this.shopId
          }
        }
        await axios.get(url, config).then((response) => {
          let rs = response.data
          window.location.href = 'line://ti/p/' + rs.basicId
        })
      }
    },
    getShop () {
      if (this.shopId) {
        axios.get(this.DNS_IP + '/sys_shop/get?shopId=' + this.shopId).then(response => {
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
        // console.log('this.dateDayCustom', this.dateDayCustom)
        // console.log('this.dateDayoffValue', this.dateDayoffValue)
      })
    },
    async getDataBranch () {
      this.branch = []
      this.branchData = []
      await axios.get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
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
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            if (d.flowId !== null && d.flowId !== '') {
              let checkFlowId = JSON.parse(d.flowId)
              if (checkFlowId.filter((a) => parseInt(a) === this.formSelect.flowId).length > 0) {
                if (d.setTime !== null && d.setTime !== '[]' && d.setTime !== '') {
                  let s = {}
                  // console.log(d)
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
        } else {
          this.dataEmp = []
          this.dataEmpAll = []
          this.EmpItemLimit = []
        }
      })
      console.log('dataEmp', this.dataEmpAll)
    },
    async searchAny () {
      this.dataBooking = []
      this.dataBookingData = []
      this.bookingSelect = ''
      await axios
        .get(
          this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.shopId +
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
    async getJob () {
      await axios
        .get(
          this.DNS_IP +
            '/job/get?shopId=' +
            this.shopId + '&userId=' +
            this.profile.userId
        )
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            console.log('JOB', rs)
            rs.forEach((item) => {
              console.log('item.jobNo', item.jobNo)
              if (item.jobNo === 'JB088816251689329768881') {
                console.log('item', item.stepTitle, item.jobNo)
              }
              this.jobData.push(item)
            })
          }
        })
    },
    async getBookingData () {
      await axios
        .get(
          this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.shopId + '&userId=' +
            this.profile.userId
        )
        .then(async response => {
          let rs = response.data
          if (typeof rs.status === 'undefined') {
            rs.forEach((item) => {
              // if (item.bookNo === 'BK362494191689330036249') {
              //   this.bookingData.push(item)
              // }
              if (item.RECORD_STATUS_Job !== 'D' && item.statusBt !== 'cancel') {
                item.statusName = ''
                if (item.statusBt === null || item.statusBt === 'wait') {
                  item.statusName = 'รอยืนยันนัดหมาย'
                  item.color = 'primary'
                }
                if (item.statusBt === 'confirm') {
                  item.statusName = 'ยืนยันนัดหมาย'
                  item.color = 'green'
                }
                if (item.statusBt === 'confirmJob') {
                  item.statusName = 'Job'
                  item.color = 'green'
                }
                this.bookingData.push(item)
              }
              if ((item.jobNo !== '' || item.jobNo !== null) && item.RECORD_STATUS_Job === 'D') {
                this.HistoryData.push(item)
              }
              // console.log('item', item.statusBt)
            })
          }
          // let separatedData = rs.reduce((acc, item) => {
          //   if (!acc[item.bookNo]) {
          //     acc[item.bookNo] = []
          //   }
          //   acc[item.bookNo].push(item)
          //   console.log('acc', item.bookNo)
          //   return acc
          // }, {})
          // const finalData = Object.entries(separatedData).map(([bookNo, values]) => ({ [bookNo]: values }))
          // console.log('bookingData!!!', finalData)
        })
      console.log('bookingData', this.bookingData)
      console.log('HistoryData', this.HistoryData)
    }
  }
}
</script>

<style scoped>
.menu_tcg_active {
  background-color: #4988dc !important;
  color: #ffffff !important;
}
.page-content {
    min-height: 80vh;
    position: relative;
    overflow-x: hidden;
    transition: all 350ms ease;
    z-index: 2;
    padding-bottom: 60px;
}
.no-ani, .no-ani .offcanvas, .no-ani .header-bar, .no-ani #footer-bar, .no-ani #page, .no-ani .page-content, .no-ani .btn, .no-ani .icon, .no-ani {
    transition: all 0ms ease !important;
}
.page-content .header-bar {
    position: relative;
    z-index: 1;
}
.font-16 {
    font-size: 16px !important;
}
.color-black {
    color: #000 !important;
}

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
