<template>
  <v-main>
      <v-card style="min-height: 100vh;">
        <v-card-title class="pa-3">
          <!-- <v-row>
            <v-col cols="12">
              <v-icon x-large color="#007bff" @click="dialog = false">mdi-chevron-left</v-icon>
            </v-col>
            <v-col cols="12" class="text-center pt-0">
              <v-avatar v-if="!profile.pictureUrl" size="70">
              <img
                :src="profile.pictureUrl"
                >
            </v-avatar>
            <v-avatar color="indigo" size="70" v-else>
              <v-icon dark >
                mdi-account-circle
              </v-icon>
            </v-avatar>
            </v-col>
          </v-row> -->
          <v-row  class="mb-2">
              <v-col cols="2" style="display: flex;justify-content: flex-start;">
                <!-- <v-icon x-large color="#007bff" @click="dialog = false">mdi-chevron-left</v-icon> -->
              </v-col>
              <v-col cols="7" style="word-wrap: break-word;display: flex;justify-content: center;align-items: center;">
                <div v-if="profile.displayName">
                  <p class="mt-1 mb-0 font-weight-bold" v-if="profile.displayName.length > 20" style="font-size: 16px;">{{profile.displayName.substring(0, 20)}}...</p>
                  <p class="mt-1 mb-0 font-weight-bold" v-else style="font-size: 16px;">{{profile.displayName}}</p>
                </div>
                <p class="mt-1 mb-0 font-weight-bold" v-else style="font-size: 16px;"> </p>
              </v-col>
              <v-col cols="3" class="pl-0 pr-4" style="display: flex;justify-content: flex-end;">
                  <v-avatar v-if="profile.pictureUrl" color="#007bff">
                    <img
                      :src="profile.pictureUrl"
                    >
                  </v-avatar>
                  <v-avatar v-else color="#007bff">
                    <v-icon dark>
                      mdi-account-circle
                    </v-icon>
                  </v-avatar>
              </v-col>
            </v-row>
            <v-tabs
            fixed-tabs
              v-model="tab"
            >
              <v-tab
                v-for="(item, index) in tabItem"
                :key="index"
              >
                <p class="mb-1 font-weight-black">{{ item.name }}</p>
              </v-tab>
            </v-tabs>

<!-- <v-tabs-items v-model="tab">
  <v-tab-item
    v-for="item in items"
    :key="item.tab"
  >
    <v-card flat>
      <v-card-text>{{ item.content }}</v-card-text>
    </v-card>
  </v-tab-item>
</v-tabs-items> -->
        </v-card-title>
        <v-card-text style="overflow-x: hidden;" v-if="tab === 0">
            <div v-for="(Bitem, index) in bookingData.filter((dtItem) => dtItem.statusBt === 'wait' || dtItem.statusBt === null)" :key="index">
              <v-card class="ma-2 mx-6 my-4 pa-3" style="display: flex;min-height: 90px;flex-direction: column;border-radius: 20px 20px 20px 20px;">
                  <div style="display: flex;flex-direction: column;">
                    <div style="display: flex;flex-wrap: wrap;flex-direction: column;align-items: flex-start;">
                      <!-- <p class="font-weight-bold mb-1" style="font-size:14px">{{ Bitem.dueDateTextDay }}</p> -->
                      <div class="my-2" style="display: flex;align-items: center;justify-content: center;">
                        <v-icon  color="primary" >mdi-calendar</v-icon>
                        <p class="text-center ma-0 ml-2" v-if="Bitem.dueDateTextDay" style="font-size:16px">
                          <!-- <v-icon x-large color="#F48686" class="mx-1 mr-2 iconify" data-icon="ic:twotone-access-time"></v-icon> -->
                          {{'วันที่ : ' + Bitem.dueDateTextDay}}</p>
                      </div>
                      <div class="my-2" style="display: flex;align-items: center;justify-content: center;">
                        <v-icon  color="primary" >mdi-calendar-clock</v-icon>
                        <p class="text-center ma-0 ml-2" v-if="Bitem.timeText" style="font-size:16px">
                          <!-- <v-icon x-large color="#F48686" class="mx-1 mr-2 iconify" data-icon="ic:twotone-access-time"></v-icon> -->
                          {{'เวลานัดหมาย : ' + Bitem.timeText}}</p>
                      </div>
                      <div class="my-2" style="display: flex;align-items: center;justify-content: center;">
                        <v-icon  color="primary" >mdi-star-circle</v-icon>
                        <p class="text-center ma-0 ml-2" v-if="Bitem.flowName" style="font-size:16px">
                          <!-- <v-icon x-large color="#F48686" class="mx-1 mr-2 iconify" data-icon="ic:twotone-access-time"></v-icon> -->
                          {{'บริการ : ' + Bitem.flowName}}</p>
                      </div>
                      <div class="my-2" style="display: flex;align-items: center;justify-content: center;" v-if="Bitem.bookingEmpFlowName">
                        <v-icon  color="primary" >mdi-account-circle</v-icon>
                        <p class="text-center ma-0 ml-2"  style="font-size:16px">
                          <!-- <v-icon x-large color="#F48686" class="mx-1 mr-2 iconify" data-icon="ic:twotone-access-time"></v-icon> -->
                          {{Bitem.bookingEmpFlowName}}</p>
                      </div>
                    </div>
                  </div>
                  <div style="display: flex;justify-content: center;flex-wrap: wrap;">
                    <v-btn
                      class="ma-3"
                      elevation="2"
                      rounded
                      dark
                      :loading="loaderEdit"
                      color="primary"
                      @click="EditData(Bitem)"
                    >เลื่อนนัดหมาย</v-btn>
                    <v-btn
                      class="ma-3"
                      elevation="2"
                      rounded
                      outlined
                      dark
                      color="red"
                      @click="setCancel(Bitem)"
                    >ยกเลิกจอง</v-btn>
                    <!-- <v-btn
                      class="ma-3"
                      elevation="2"
                      rounded
                      dark
                      small
                      color="error"
                    >ยกเลิก</v-btn> -->
                  </div>
              </v-card>
            </div>
        </v-card-text>
        <v-card-text style="overflow-x: hidden;" v-if="tab === 1">
            <div v-for="(Bitem, index) in bookingData.filter((dtItem) => dtItem.statusBt === 'confirm')" :key="index">
              <v-card class="ma-2 mx-6 my-4 pa-3" style="display: flex;min-height: 90px;flex-direction: column;border-radius: 20px 20px 20px 20px;">
                  <div style="display: flex;flex-direction: column;">
                    <div style="display: flex;flex-wrap: wrap;flex-direction: column;align-items: flex-start;">
                      <!-- <p class="font-weight-bold mb-1" style="font-size:14px">{{ Bitem.dueDateTextDay }}</p> -->
                      <div class="my-2" style="display: flex;align-items: center;justify-content: center;">
                        <v-icon  color="primary" >mdi-calendar</v-icon>
                        <p class="text-center ma-0 ml-2" v-if="Bitem.dueDateTextDay" style="font-size:16px">
                          <!-- <v-icon x-large color="#F48686" class="mx-1 mr-2 iconify" data-icon="ic:twotone-access-time"></v-icon> -->
                          {{'วันที่ : ' + Bitem.dueDateTextDay}}</p>
                      </div>
                      <div class="my-2" style="display: flex;align-items: center;justify-content: center;">
                        <v-icon  color="primary" >mdi-calendar-clock</v-icon>
                        <p class="text-center ma-0 ml-2" v-if="Bitem.timeText" style="font-size:16px">
                          <!-- <v-icon x-large color="#F48686" class="mx-1 mr-2 iconify" data-icon="ic:twotone-access-time"></v-icon> -->
                          {{'เวลานัดหมาย : ' + Bitem.timeText}}</p>
                      </div>
                      <div class="my-2" style="display: flex;align-items: center;justify-content: center;">
                        <v-icon  color="primary" >mdi-star-circle</v-icon>
                        <p class="text-center ma-0 ml-2" v-if="Bitem.flowName" style="font-size:16px">
                          <!-- <v-icon x-large color="#F48686" class="mx-1 mr-2 iconify" data-icon="ic:twotone-access-time"></v-icon> -->
                          {{'บริการ : ' + Bitem.flowName}}</p>
                      </div>
                      <div class="my-2" style="display: flex;align-items: center;justify-content: center;" v-if="Bitem.bookingEmpFlowName">
                        <v-icon  color="primary" >mdi-account-circle</v-icon>
                        <p class="text-center ma-0 ml-2"  style="font-size:16px">
                          <!-- <v-icon x-large color="#F48686" class="mx-1 mr-2 iconify" data-icon="ic:twotone-access-time"></v-icon> -->
                          {{Bitem.bookingEmpFlowName}}</p>
                      </div>
                    </div>
                  </div>
                  <div style="display: flex;justify-content: center;flex-wrap: wrap;">
                    <v-btn
                      class="ma-3"
                      elevation="2"
                      rounded
                      dark
                      :loading="loaderEdit"
                      color="primary"
                      @click="EditData(Bitem)"
                    >เลื่อนนัดหมาย</v-btn>
                    <v-btn
                      class="ma-3"
                      elevation="2"
                      rounded
                      outlined
                      dark
                      color="red"
                      @click="setCancel(Bitem)"
                    >ยกเลิกจอง</v-btn>
                    <!-- <v-btn
                      class="ma-3"
                      elevation="2"
                      rounded
                      dark
                      small
                      color="error"
                    >ยกเลิก</v-btn> -->
                  </div>
              </v-card>
            </div>
        </v-card-text>
        <v-card-text style="overflow-x: hidden;" v-if="bookingData.length === 0">
              <v-card class="ma-2 mx-6 my-4 pa-3" style="display: flex;min-height: 150px;flex-direction: column;justify-content: center;border-radius: 20px 20px 20px 20px;">
                  <div style="display: flex;flex-direction: column;">
                      <!-- <p class="font-weight-bold mb-1" style="font-size:14px">{{ Bitem.dueDateTextDay }}</p> -->
                      <div class="my-2" style="display: flex;align-items: center;justify-content: center;">
                        <v-icon x-large color="primary" >mdi-information-outline</v-icon>
                      </div>
                      <div class="my-2" style="display: flex;align-items: center;justify-content: center;">
                        <p class="text-center ma-0 ml-2" style="font-size:16px">
                          <!-- <v-icon x-large color="#F48686" class="mx-1 mr-2 iconify" data-icon="ic:twotone-access-time"></v-icon> -->
                          {{'ไม่มีรายการนัดหมายที่สามารถเลื่อนนัดได้'}}</p>
                      </div>
                  </div>
              </v-card>
        </v-card-text>
        <!-- <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Save
          </v-btn>
        </v-card-actions> -->
        <EditBookingEmp @confirmed="clear" @close="loaderEdit = false" ref="EditBookingEmp"></EditBookingEmp>
        <EditBookingFlow @confirmed="clear" @close="loaderEdit = false" ref="EditBookingFlow"></EditBookingFlow>
      </v-card>
      <v-dialog v-model="dialogCancel">
        <v-card class="pa-3 px-5">
          <v-col class="text-right">
            <v-btn
              class="mx-2 mr-n2 mt-n2"
              fab
              dark
              small
              color="red"
              @click="dialogCancel = false, cancelItem = []"
            >
              <v-icon dark>
                mdi-close
              </v-icon>
            </v-btn>
            <!-- <v-icon color="#173053" fab @click="dialogCancel = false, cancelItem = []">mdi-close</v-icon> -->
          </v-col>
          <h4 class="text-center mb-6">ยกเลิกนัดหมาย</h4>
          <v-textarea
          outlined
          name="input-7-4"
          label="หมายเหตุ"
          v-model="remarkcancel"
          ></v-textarea>
          <div style="display: flex;justify-content: center;flex-wrap: wrap;">
            <v-btn
              class="ma-3"
              elevation="2"
              rounded
              dark
              :loading="loaderEdit"
              color="primary"
              @click="CancelCheckTimeslotStatus(cancelItem)"
            >ยืนยัน</v-btn>
          </div>
        </v-card>
      </v-dialog>
      <GoogleCalendar ref="GoogleCalendarRef" />
  </v-main>
</template>

<script>
import axios from 'axios' // api
import moment from 'moment-timezone'
import EditBookingEmp from '../EditBooking/EditBookingEmp.vue'
import EditBookingFlow from '../EditBooking/EditBookingFlow.vue'
import GoogleCalendar from '../Core/GoogleCalendarCmp.vue'

export default {
  components: {
    EditBookingEmp,
    EditBookingFlow,
    GoogleCalendar
  },
  computed: {

  },
  data () {
    return {
      bookingData: [],
      dialog: false,
      dialogm1: '',
      timeSlotStatus: '',
      dataRef: [],
      shopId: this.$route.query.shopId,
      countCustomerEdit: '',
      countDayCustomerEdit: '',
      loaderEdit: false,
      tabItem: [{'value': 'wait', 'name': 'รอยืนยัน'}, {'value': 'confirm', 'name': 'ยืนยันแล้ว'}],
      tab: null,
      dialogCancel: false,
      cancelItem: [],
      remarkcancel: '',
      shopItem: '',
      statusGoogleCalendar: '',
      statusGoogleCalendarEmp: '',
      statusCustomerEditNoTime: '',
      statusCustomerEdit: ''
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
    await this.getShop()
    await this.getBookingData()
  },
  methods: {
    async connectGoogleCalendar (shopId, status, bookNo) {
      console.log('status !!!', status)
      this.$refs.GoogleCalendarRef.checkTypeEven(shopId, status, bookNo)
    },
    clear () {
      console.log('this.dataRef', this.dataRef)
      this.getEditBooking(this.shopId, this.profile)
      this.loaderEdit = false
    },
    clearRemove () {
      this.cancelItem = []
      this.remarkcancel = ''
      this.dialogCancel = false
      this.getBookingData()
    },
    async EditData (item) {
      console.log('!!!!!!!!!!!!!!!!!item', item)
      this.loaderEdit = true
      console.log('!!!!!!!', item.countChangeTimeByCustomer, this.countCustomerEdit, item.countChangeTimeByCustomer < this.countCustomerEdit)
      if (item.countChangeTimeByCustomer < this.countCustomerEdit) {
        if (this.timeSlotStatus === 'True') {
          console.log('True')
          this.$refs.EditBookingEmp.UseOpen(item)
        } else {
          this.$refs.EditBookingFlow.UseOpen(item)
          console.log('False')
        }
      } else {
        this.$swal({
          title: 'เลื่อนนัดไม่สำเร็จ',
          text: 'มีการเลื่อนนัดมากกว่า ' + this.countCustomerEdit + ' ครั้ง',
          type: 'info',
          timer: 2000,
          showConfirmButton: false
        })
        this.loaderEdit = false
      }
    },
    async getEditBooking (shopId, profile) {
      this.shopId = shopId
      this.profile = profile
      await this.getShop(shopId)
      await this.getBookingData(shopId, profile.userId)
      this.dialog = true
    },
    async getBookingData (shopId, userId) {
      this.bookingData = []
      await axios
        .get(
          this.DNS_IP +
            '/booking_view/get?shopId=' + this.shopId + '&userId=' + this.profile.userId
        )
        .then(async response => {
          let rs = response.data
          console.log('rs!!!!!!', rs)
          if (typeof rs.status === 'undefined') {
            console.log('statusCustomerEdit', this.statusCustomerEdit)
            rs.forEach((item) => {
              if (this.statusCustomerEdit === 'True') {
                let daysDifference = null
                console.log('this.statusCustomerEditNoTime', this.statusCustomerEditNoTime)
                if (this.statusCustomerEditNoTime === 'False') {
                  const currentDate = moment().format('YYYY-MM-DD')
                  const targetDate = moment(item.dueDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
                  daysDifference = this.timeStampDay(targetDate, currentDate)
                  console.log('currentDate', currentDate)
                  console.log('targetDate', targetDate)
                  console.log('daysDifference', daysDifference)
                } else {
                  const currentDate = moment().format('YYYY-MM-DD HH:mm:ss')
                  const targetDate = moment(item.dueDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
                  // console.log(currentDate, targetDate)
                  daysDifference = this.timeStampDayAndTime(targetDate, currentDate)
                  console.log('currentDate', currentDate)
                  console.log('targetDate', targetDate)
                  console.log('daysDifference', daysDifference)
                }
                // console.log('!!!!', moment(item.dueDate, 'YYYY-MM-DD').format('YYYY-MM-DD') - moment().format('YYYY-MM-DD'))

                if (moment(item.dueDate, 'YYYY-MM-DD').format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD')) {
                  console.log(moment(item.dueDate, 'YYYY-MM-DD').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'))
                  console.log(daysDifference, parseInt(this.countDayCustomerEdit), daysDifference >= parseInt(this.countDayCustomerEdit))
                  if (daysDifference >= parseInt(this.countDayCustomerEdit)) {
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
                      this.bookingData.push(item)
                    }
                  }
                }
              }
            })
          }
        })
      console.log('bookingData', this.bookingData)
    },
    timeStampDay (item1, item2) {
      const date1 = new Date(item1)
      const date2 = new Date(item2)

      const millisecondsPerDay = 24 * 60 * 60 * 1000 // 1 วันมี 86,400,000 มิลลิวินาที
      const time1 = date1.getTime() // ระบุวันที่เป็นมิลลิวินาที
      const time2 = date2.getTime() // ระบุวันที่เป็นมิลลิวินาที

      const differenceInMilliseconds = Math.abs(time1 - time2) // หาความแตกต่างและตรวจสอบเคสที่จะใช้ค่าบวกเสมอ
      const differenceInDays = differenceInMilliseconds / millisecondsPerDay
      return differenceInDays.toFixed(0)
      // console.log('จำนวนวันระหว่างวันที่ 1 และวันที่ 2:', differenceInDays.toFixed(0))
    },
    timeStampDayAndTime (item1, item2) {
      const date1 = new Date(item1)
      const date2 = new Date(item2)
      const millisecondsPerDay = 24 * 60 * 60 * 1000 // 1 วันมี 86,400,000 มิลลิวินาที
      const differenceInMilliseconds = date1 - date2
      const differenceInDays = differenceInMilliseconds / millisecondsPerDay
      // console.log('differenceInDays.toFixed(2)', differenceInDays.toFixed(2), differenceInDays)
      return differenceInDays.toFixed(2)
    },
    async setCancel (item) {
      this.cancelItem = []
      this.dialogCancel = true
      this.cancelItem = item
    },
    async CancelCheckTimeslotStatus (dt) {
      if (this.timeSlotStatus === 'True') {
        console.log('this.timeSlotStatus === True')
        await this.onCancelChkEmp(dt)
      } else {
        await this.onCancelChk(dt)
        console.log('this.timeSlotStatus === False')
      }
    },
    async onCancelChkEmp (dt) {
      console.log('dt++', dt)
      if (this.remarkcancel !== '') {
        let chkStatus = await this.updateLimitBookingCancelEmp(dt)
        console.log('chkStatusEmp', chkStatus)
        if (chkStatus.status) {
          this.onCancelChkSubmit(dt)
        } else {
          this.onCancelChkSubmit(dt)
        }
      } else {
        this.$swal('ผิดพลาด', 'กรุณาใส่หมายเหตุ', 'error')
      }
    },
    async onCancelChk (dt) {
      console.log('dt', dt)
      if (this.remarkcancel !== '') {
        let chkStatus = await this.updateLimitBookingCancel(dt)
        console.log('chkStatus', chkStatus)
        if (chkStatus.status) {
          this.onCancelChkSubmit(dt)
        } else {
          this.onCancelChkSubmit(dt)
        }
      } else {
        this.$swal('ผิดพลาด', 'กรุณาใส่หมายเหตุ', 'error')
      }
    },
    async updateLimitBookingCancel (item) {
      let result = []
      let dt = {
        flowId: item.flowId,
        dateSelect: moment(item.dueDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'),
        timeSelect: moment(item.dueDate, 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
        shopId: item.shopId,
        userId: item.userId
      }
      await axios.post(this.DNS_IP + '/Booking/updateLimitBookingCancel', dt).then(async response => {
        result = response.data
      })
      return result
    },
    async updateLimitBookingCancelEmp (item) {
      let result = []
      let dt = {
        flowId: item.flowId,
        dateSelect: moment(item.dueDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'),
        timeSelect: moment(item.dueDate, 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
        shopId: item.shopId,
        userId: item.userId,
        bookingEmpFlow: item.bookingEmpFlow,
        masBranchID: item.masBranchID,
        LAST_USER: item.userId
      }
      await axios.post(this.DNS_IP + '/Booking/updateLimitBookingCancelEmp', dt).then(async response => {
        result = response.data
      })
      return result
    },
    async onCancelChkSubmit (dt) {
      this.dataCancelReady = false
      let dtNew = {
        bookNo: dt.bookNo,
        contactDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        status: 'cancel',
        statusUse: 'use',
        shopId: dt.shopId,
        CREATE_USER: dt.userId,
        LAST_USER: dt.userId,
        remarkRemove: (this.remarkcancel || '').replace(/%/g, '%%')
      }
      await axios
        .post(this.DNS_IP + '/booking_transaction/add', dtNew)
        .then(async response => {
          this.$swal('เรียบร้อย', 'ยกเลิกนัดเรียบร้อย', 'success')
          if (this.statusGoogleCalendar === 'True') {
            this.connectGoogleCalendar(dt.shopId, 'Delete', dt.bookNo)
          }
          this.pushMsgLineNotifyGroup_Cancel(dt.bookNo)
          this.pushMsglineCancel(dt)
          await this.clearRemove()
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    async pushMsgLineNotifyGroup_Cancel (bookNo) {
      await axios
        .post(
          this.DNS_IP + '/Booking/pushMsgLineNotifyGroup_Cancel/' + bookNo
        )
        .then(async response => {
          console.log('response', response)
        })
        .catch((error) => {
          console.log('err', error)
        })
    },
    pushMsglineCancel (item) {
      let lineUserId = item.lineUserId || ''
      if (lineUserId !== '') {
        var dt = {
          bookNo: item.bookNo,
          lineUserId: lineUserId,
          dueDate: item.dueDateText,
          flowName: item.flowName,
          shopId: item.shopId,
          tell: this.shopItem[0].contactTel
        }
        axios
          .post(this.DNS_IP + '/Booking/pushMsgCancelBook', dt)
          .then(async response => {})
      }
    },
    async getShop () {
      await axios
        .get(this.DNS_IP + '/sys_shop/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          console.log('rssssssssssss', rs)
          if (rs.length > 0) {
            this.shopItem = rs
            this.timeSlotStatus = rs[0].timeSlotStatus
            this.countCustomerEdit = rs[0].countCustomerEdit
            this.countDayCustomerEdit = rs[0].countDayCustomerEdit
            this.statusCustomerEditNoTime = rs[0].statusCustomerEditNoTime
            this.statusCustomerEdit = rs[0].statusCustomerEdit
            this.statusGoogleCalendar = rs[0].statusGoogleCalendar
            this.statusGoogleCalendarEmp = rs[0].statusGoogleCalendarEmp
          } else {
            this.timeSlotStatus = null
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
    }
  }
}
</script>

<style scoped>

</style>
