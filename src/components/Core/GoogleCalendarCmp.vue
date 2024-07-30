<template>
  <div v-show="false">
    <v-row>
      <v-container>
      <v-col cols="12">
        <v-btn
      elevation="2"
      @click="handleClickLogin"
      color="green"
      >Google Log in</v-btn>
      </v-col>
      <v-col cols="12">
      <!-- <v-row v-if="checkLogin"> -->
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="pb-0 pt-0">
                <v-text-field
                  v-model="refreshToken"
                  label="refreshToken"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pb-0 pt-0">
                <v-text-field
                  v-model="eventId"
                  label="eventId"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn
                  elevation="2"
                  color="orange"
                  @click="getEvent()"
                  >Get Event</v-btn>
              </v-col>
              <!-- <v-col cols="12" class="pb-0 pt-0">
                <v-text-field
                  v-model="calendarId"
                  label="calendarId"
                  outlined
                ></v-text-field>
              </v-col> -->
            </v-row>
          </v-card-text>
        </v-card>
        <hr>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="pb-0 pt-0">
                <v-text-field
                  v-model="Summmary"
                  label="Summmary"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pb-0 pt-0">
                <v-text-field
                  v-model="Description"
                  label="Description"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pb-0 pt-0">
                <v-text-field
                  v-model="Location"
                  label="Location"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pb-0 pt-0">
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="StartDate"
                      label="StartDate"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="StartDate"
                    @input="menu1 = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" class="pb-0 pt-0">
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="EndDate"
                      label="EndDate"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="EndDate"
                    @input="menu2 = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" class="pb-0 pt-0">
                <v-btn
                  elevation="2"
                  color="info"
                  @click="createEvent()"
                  >CREATE Event</v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn
                  elevation="2"
                  color="orange"
                  @click="updateEvent()"
                  >Update Event</v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn
                  elevation="2"
                  color="error"
                  @click="deleteEvent()"
                  >delete Event</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      </v-container>
    </v-row>
  </div>
</template>
<script>
import axios from 'axios' // api
import moment from 'moment-timezone'
// import QrcodeVue from 'qrcode.vue'
// import adminLeftMenu from '../Sidebar.vue' // เมนู
export default {
  components: {

  },
  data () {
    return {
      eventId: '',
      calendarId: '66h6jueetal14hcm8vn7an38p8@google.com',
      refreshToken: '',
      expireDate: '',
      checkLogin: false,
      Summmary: '',
      Description: '',
      Location: '',
      menu1: false,
      menu2: false,
      StartDate: '',
      EndDate: '',
      shopId: '',
      bookingItem: [],
      bookingData: [],
      flowItem: [],
      empItem: [],
      evenStatus: '',
      attendeesEmail: [],
      bookNo: '',
      statusGoogleCalendarEmp: '',
      contactEmail: '',
      webHookUrl: 'https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/'
      // webHookUrl: 'https://e661-2403-6200-88a4-e62f-f840-2028-9b38-c913.ngrok-free.app/'
      // webHookUrl: 'http://127.0.0.1:5003/be-linked-a7cdc/asia-southeast1/'
    }
  },
  async mounted () {
  // await this.checkTypeEvenEmp()
  },
  methods: {
    validateEmail (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      console.log('emailRegex.test(email)', emailRegex.test(email))
      return emailRegex.test(email)
    },
    async checkTypeEvenEmp (shopId, status, bookNo) {
      console.log('status!!!!!!!!!@!#@#$@#$@#$@#$@#', status)
      this.shopId = shopId
      this.evenStatus = status
      //   this.evenStatus = 'Add'
      this.bookNo = bookNo
      //   this.bookNo = 'BK143157651684727414315'
      await this.getShop()
      if (this.refreshToken === null || this.refreshToken === '') {
        // await this.handleClickLogin(status, bookNo)
      } else {
        await this.getBooking(this.bookNo)
        await this.getBookingData(this.bookNo)
        await this.getFlow(this.bookingItem[0].flowId)
        if (this.statusGoogleCalendarEmp === 'True') {
          await this.getEmp(this.bookingItem[0].bookingEmpFlow)
        }
        if (this.evenStatus === 'Add') {
          let allItem = await this.buliDataEmp('Add')
          await this.createEvent(allItem)
        } else if (this.evenStatus === 'Edit') {
          let allItem = await this.buliDataEmp('Edit')
          console.log('Edit!!')
          await this.updateEvent(allItem)
        } else if (this.evenStatus === 'Delete') {
          await this.deleteEvent()
          //   let allItem = await this.buliDataEmp('Delete')
        }
      }
    },
    async buliDataEmp (status) {
      let item = {}
      item.refreshToken = this.refreshToken
      item.Summmary = this.bookingItem[0].flowName + ' - ' + this.bookingData.filter((a) => a.fieldName === 'ชื่อ')[0].fieldValue
      let Description = ''
      this.bookingData.forEach((a) => {
        Description += a.fieldName + ' : ' + (a.fieldValue || ' ')
        Description += '\n'
      })
      Description += 'ชื่อช่าง :' + this.bookingItem[0].bookingEmpFlowName
      //    แปลงเวลานัดหมาย
      item.Description = Description
      const timezone = 'Asia/Bangkok'
      const dateSelect = moment.tz(`${this.bookingItem[0].dueDateDay} ${this.bookingItem[0].timeDue}`, 'YYYY-MM-DD HH:mm', timezone).format()
      item.StartDate = dateSelect
      item.EndDate = await this.setTimeEmp(dateSelect, this.bookingItem)
      await this.getSysUser()
      console.log('this.attendeesEmail', this.attendeesEmail)
      item.attendees = this.attendeesEmail
      if (this.statusGoogleCalendarEmp === 'True') {
        if (status === 'Add') {
          try {
            if (this.validateEmail(this.empItem[0].empEmail)) {
              let obj = {'email': this.empItem[0].empEmail}
              item.attendees.push(obj)
            }
          } catch (error) {
            console.log(error)
          }
        } else if (status === 'Edit') {
          try {
            if (this.validateEmail(this.empItem[0].empEmail)) {
              let obj = {'email': this.empItem[0].empEmail}
              item.attendees.push(obj)
            }
          } catch (error) {
            console.log(error)
          }
        }
        if (this.shopId === 'Ub7cbc419244731cdd682354dd0e57cef') {
          try {
            console.log('----------------', this.empItem[0])
            if (this.empItem[0].refreshTokenGoogleCalendar) {
              let data = await this.getRefreshTotokenEmp(this.empItem[0].refreshTokenGoogleCalendar)
              if (data) {
                console.log('$$$$$$$$$', data)
                item.refreshToken = data
                if (this.contactEmail) {
                  let obj = {'email': this.contactEmail}
                  item.attendees.push(obj)
                }
              }
            }
          } catch (error) {
            item.refreshToken = this.refreshToken
          }
        }
      }
      if (this.flowItem[0].GoogleCalendarMeet === 'True') {
        item.requestId = this.bookingItem[0].bookNo
        if (this.bookingItem[0].bookingDataCustomerEmail !== null && this.bookingItem[0].bookingDataCustomerEmail !== '') {
          let obj = {'email': this.bookingItem[0].bookingDataCustomerEmail}
          item.attendees.push(obj)
        }
      }
      return item
    },
    async checkTypeEven (shopId, status, bookNo) {
      console.log('status!!!!!!!!!@!#@#$@#$@#$@#$@#', status)
      this.shopId = shopId
      this.evenStatus = status
      //   this.evenStatus = 'Add'
      this.bookNo = bookNo
      //   this.bookNo = 'BK143157651684727414315'
      await this.getShop()
      if (this.refreshToken === null || this.refreshToken === '') {
        // await this.handleClickLogin(status, bookNo)
      } else {
        await this.getBooking(this.bookNo)
        await this.getBookingData(this.bookNo)
        await this.getFlow(this.bookingItem[0].flowId)
        // if (this.statusGoogleCalendarEmp === 'True') {
        //   await this.getEmp(this.bookingItem[0].bookingEmpFlow)
        // }
        if (this.evenStatus === 'Add') {
          let allItem = await this.buliData('Add')
          await this.createEvent(allItem)
        } else if (this.evenStatus === 'Edit') {
          let allItem = await this.buliData('Edit')
          console.log('Edit!!')
          await this.updateEvent(allItem)
        } else if (this.evenStatus === 'Delete') {
          await this.deleteEvent()
          //   let allItem = await this.buliDataEmp('Delete')
        }
      }
    },
    async buliData (status) {
      let item = {}
      item.refreshToken = this.refreshToken
      console.log('!!!!!!@#!@#!@#', this.bookingItem)
      item.Summmary = this.bookingItem[0].flowName + ' - ' + this.bookingData.filter((a) => a.fieldName === 'ชื่อ')[0].fieldValue
      let Description = ''
      this.bookingData.forEach((a) => {
        Description += a.fieldName + ' : ' + a.fieldValue
        Description += '\n'
      })
      //    แปลงเวลานัดหมาย
      item.Description = Description
      const timezone = 'Asia/Bangkok'
      const dateSelect = moment.tz(`${this.bookingItem[0].dueDateDay} ${this.bookingItem[0].timeDue}`, 'YYYY-MM-DD HH:mm', timezone).format()
      item.StartDate = dateSelect
      item.EndDate = await this.setTimeFlow(dateSelect, this.bookingItem[0].flowId)
      await this.getSysUser()
      console.log('this.attendeesEmail', this.attendeesEmail)
      item.attendees = this.attendeesEmail
      if (this.flowItem[0].GoogleCalendarMeet === 'True') {
        item.requestId = this.bookingItem[0].bookNo
        if (this.bookingItem[0].bookingDataCustomerEmail !== null && this.bookingItem[0].bookingDataCustomerEmail !== '') {
          let obj = {'email': this.bookingItem[0].bookingDataCustomerEmail}
          item.attendees.push(obj)
        }
      }
      return item
    },
    async getBooking () {
      await axios.get(this.DNS_IP + '/booking_view/get?bookNo=' + this.bookNo).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          this.bookingItem = rs
        }
      })
    },
    async getBookingData () {
      await axios.get(this.DNS_IP + '/BookingData/get?bookNo=' + this.bookNo).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          this.bookingData = rs
        }
      })
    },
    async getFlow (flowId) {
      await axios.get(this.DNS_IP + '/flow/get?flowId=' + flowId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          this.flowItem = rs
        }
      })
    },
    async getEmp (empId) {
      await axios.get(this.DNS_IP + '/empSelect/get?empId=' + empId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          this.empItem = rs
        }
      })
    },
    async setTimeEmp (dateSelect, bookingData) {
      // this.flowItem
      // console.log('---------dateSelect', dateSelect)
      // console.log('---------bookingData', bookingData)
      let date = moment(dateSelect).format('YYYY-MM-DD')
      let time = moment(dateSelect).format('HH:mm')
      // console.log('time', time)
      let timeSlot = bookingData[0].timeSlotCustomer || 1
      // console.log('timeSlot', timeSlot)
      let countTime = 60
      try {
        let setTime = await this.getTimeEmp(date, bookingData[0].bookingEmpFlow)
        // console.log(setTime)
        if (setTime.length === 0 || setTime.length === 1) {
          countTime = 60
        } else {
          let firtIndex = setTime.findIndex((item) => item.value === time)
          // console.log('firtIndex', firtIndex)
          let filterTime = setTime.filter((item, index) => index >= firtIndex && index <= ((timeSlot + firtIndex)))
          // console.log('filterTime', filterTime)
          if (timeSlot !== filterTime.length) {
            let previousTime = moment(setTime[0].value, 'HH:mm')
            let currentTime = moment(setTime[1].value, 'HH:mm')
            const diffMinutes = currentTime.diff(previousTime, 'minutes')
            countTime = diffMinutes * timeSlot
            // console.log('diffMinutes', diffMinutes)
          } else {
            let previousTime = moment(filterTime[0].value, 'HH:mm')
            let currentTime = moment(filterTime[filterTime.length - 1].value, 'HH:mm')
            // console.log('previousTime', previousTime)
            // console.log('currentTime', currentTime)
            const diffMinutes = currentTime.diff(previousTime, 'minutes')
            countTime = diffMinutes
            // console.log('diffMinutesElse', diffMinutes)
          }
        }
        console.log('countTime', countTime)
      } catch (error) {
        console.error('Error fetching flow data:', error)
        countTime = 60
      }
      const timezone = 'Asia/Bangkok'
      let dtInput = moment(dateSelect).format('YYYY-MM-DD HH:mm')
      const dt = moment.tz(dtInput, 'YYYY-MM-DD HH:mm', timezone)
      const EndDateTime = dt.clone().add(countTime, 'minutes').format('YYYY-MM-DD HH:mm')
      let dataReturn = moment.tz(`${EndDateTime}`, 'YYYY-MM-DD HH:mm', timezone).format()
      // console.log('dataReturn', dataReturn)
      return dataReturn
    },
    async getTimeEmp (dateSelect, empId) {
      try {
        const response = await axios.get(this.DNS_IP + '/empSelect/get?empId=' + empId)
        const rs = response.data
        if (rs.length > 0) {
          let setTime = []
          if (rs[0].setTimebyday === 'True') {
            let timeData = JSON.parse(rs[0].setTime)
            let timeJson = timeData.filter((items) => items.value === new Date(dateSelect).getDay()) || []
            // console.log('timeJson', timeJson)
            setTime = timeJson[0].setTime || []
          } else {
            setTime = JSON.parse(rs[0].setTime) || []
          }
          return setTime
        }
      } catch (error) {
        console.error('Error fetching flow data:', error)
        return []
      }
    },
    async setTimeFlow (dateSelect, flowId) {
      const timezone = 'Asia/Bangkok'
      let dtInput = moment(dateSelect).format('YYYY-MM-DD HH:mm')
      const dt = moment.tz(dtInput, 'YYYY-MM-DD HH:mm', timezone)
      // console.log('dt', dt)
      let countTime = 60
      try {
        const response = await axios.get(this.DNS_IP + '/flow/get?flowId=' + flowId)
        const rs = response.data
        if (rs.length > 0) {
          console.log('FLOW-------!!!!!', rs)
          countTime = rs[0].OnsiteEndTime === 0 ? 60 : rs[0].OnsiteEndTime
          const EndDateTime = dt.clone().add(countTime, 'minutes').format('YYYY-MM-DD HH:mm')
          let dataReturn = moment.tz(`${EndDateTime}`, 'YYYY-MM-DD HH:mm', timezone).format()
          // คืนค่า countTime หรือ EndDateTime ตามที่ต้องการ
          return dataReturn // หรือ return EndDateTime ตามที่คุณต้องการ
        }
      } catch (error) {
        console.error('Error fetching flow data:', error)
        const EndDateTime = dt.clone().add(countTime, 'minutes').format('YYYY-MM-DD HH:mm')
        let dataReturn = moment.tz(`${EndDateTime}`, 'YYYY-MM-DD HH:mm', timezone).format()
        return dataReturn
      }
    },
    // async checkExpireDate (expireDate) {
    //   // const timestamp = 1684397395837
    //   // const expirationDate = moment.utc(timestamp)
    //   const currentDate = moment()
    //   // console.log('currentDate', currentDate)
    //   if (currentDate.isAfter(expireDate)) {
    //     console.log('รหัสหมดอายุแล้ว1')
    //     await this.handleClickLogin()
    //   } else {
    //     console.log('รหัสยังไม่หมดอายุ1')
    //   }
    // // },
    // ConvertToDateTime (expirydate) {
    //   const timestamp = expirydate
    //   const dateTime = moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
    //   console.log(dateTime)
    //   return dateTime
    // },
    async UpdateRefreshToken (res) {
      console.log('res', res)
      const refreshToken = res.refresh_token
      const item = {
        refreshTokenGoogleCalendar: refreshToken
      }
      await axios
        .post(this.DNS_IP + '/sys_shop/edit/' + this.shopId, item)
        .then(async response => {
          console.log('response', response)
        })
        .catch((err) => { console.log('error', err) })
    },
    async handleClickLogin (status, bookNo) {
      this.$gAuth
        .getAuthCode()
        .then((authCode) => {
        // on success
          console.log('authCode', authCode)
          axios
            .post(this.webHookUrl + 'GoogleCalendar-createToken', {code: authCode})
          // .post('http://localhost:5002/be-linked-a7cdc/asia-southeast1/GoogleCalendar-createToken', {code: authCode})
            .then(async (response) => {
            // this.checkLogin = true
              console.log('token', response.data)
              await this.UpdateRefreshToken(response.data)
              await this.checkTypeEvenEmp(status, bookNo)
            }).catch((err) => {
              console.log('err', err)
            })
        })
        .catch((error) => {
          console.log('error login', error)
        // on fail do something
        })
    },
    async UpdateEventId_Booking (bookNo, googleCalendarEventId) {
      console.log('response.data.id', googleCalendarEventId)
      const dataitem = {
        'googleCalendarEventId': googleCalendarEventId
      }
      await axios
        .post(this.DNS_IP + '/Booking/edit/' + bookNo, dataitem)
        .then(async response => {
          console.log('response!@!@!@!@', response)
        })
        .catch((err) => { console.log('error', err) })
    },
    async createEvent (item, bookNo) {
    //   let dt = {
    //     refreshToken: this.refreshToken,
    //     Summmary: this.Summmary,
    //     Description: this.Description,
    //     Location: this.Location,
    //     StartDate: this.StartDate,
    //     EndDate: this.EndDate,
    //     attendees: [
    //       {'email': 'chinnawut.vgrouphonda@gmail.com'}
    //     ]
    //   }
      console.log('item', item)
      try {
        await axios
          .post(this.webHookUrl + 'GoogleCalendar-createEvent', item)
          .then(async (response) => {
            console.log('createEvent', response.data)
            console.log('response.data.id', response.data.data.id)
            await this.UpdateEventId_Booking(this.bookNo, response.data.data.id)
          })
      } catch (error) {
        console.log('error', error)
      }
    },
    getEvent () {
      let dt = {
        refreshToken: this.refreshToken,
        eventId: this.eventId
      }
      axios
        .post(this.webHookUrl + 'GoogleCalendar-getEvent', dt)
        .then(async (response) => {
          console.log('getEvent', response.data)
          if (response.data.status === 200) {
            this.Summmary = response.data.data.summary
            this.Description = response.data.data.description
            this.Location = response.data.data.location
            this.StartDate = this.momenDate_1(response.data.data.start.dateTime)
            this.EndDate = this.momenDate_1(response.data.data.end.dateTime)
          } else {
            this.Summmary = ''
            this.Description = ''
            this.Location = ''
            this.StartDate = ''
            this.EndDate = ''
          }
        })
    },
    async getEventCheck () {
      let itemGet = {
        refreshToken: this.refreshToken,
        eventId: this.bookingItem[0].googleCalendarEventId
      }
      let rsData = []
      await axios
        .post(this.webHookUrl + 'GoogleCalendar-getEvent', itemGet)
        .then(async (response) => {
          console.log('getEvent', response.data)
          if (response.data.status === 200) {
            let rs = response.data.data
            if (rs.attendees) {
              let empEmail = rs.attendees.filter((a) => a.email !== rs.creator.email)
              rsData = empEmail
            } else {
              rsData = []
            }
          } else {
            rsData = []
          }
        })
      return rsData
    },
    async updateEvent (item) {
      let itemUpdate = item
      itemUpdate.eventId = this.bookingItem[0].googleCalendarEventId
      console.log('this.bookingItem[0].googleCalendarEventId', itemUpdate)
      //   let dt = {
      //     refreshToken: this.refreshToken,
      //     eventId: this.eventId,
      //     Summmary: this.Summmary,
      //     Description: this.Description,
      //     Location: this.Location,
      //     StartDate: this.StartDate,
      //     EndDate: this.EndDate
      //   }
      if (this.bookingItem[0].googleCalendarEventId !== null) {
        try {
          await axios
            .post(this.webHookUrl + 'GoogleCalendar-updateEvent', itemUpdate)
            .then(async (response) => {
              console.log('updateEvent11', response.data)
            }).catch((err) => {
              console.log('error', err)
            })
        } catch (error) {
          console.log('error', error)
        }
      }
    },
    async deleteEvent () {
      let dt = {
        refreshToken: this.refreshToken,
        eventId: this.bookingItem[0].googleCalendarEventId
      }
      await axios
        .post(this.webHookUrl + 'GoogleCalendar-deleteEvent', dt)
        .then(async (response) => {
          console.log('deleteEvent', response.data)
        })
    },
    async getShop () {
      await axios.get(this.DNS_IP + '/sys_shop/get?shopId=' + this.shopId).then(async (response) => {
        let rs = response.data
        if (rs.length > 0) {
          this.contactEmail = rs[0].contactEmail
          if (this.shopId === 'Ub7cbc419244731cdd682354dd0e57cef') {
            console.log('_____IF')
            console.log('rs[0].refreshTokenGoogleCalenda', rs[0].refreshTokenGoogleCalendar)
            if (rs[0].refreshTokenGoogleCalendar) {
              await this.getRefreshTotoken(rs[0].refreshTokenGoogleCalendar)
            } else {
              this.refreshToken = ''
            }
          } else {
            console.log('_____ELSE')
            await this.getAccess_token()
          }
          // this.refreshToken = rs[0].refreshTokenGoogleCalendar
          // saichongot123@gmail.com 1//0g96maaiJcjKnCgYIARAAGBASNwF-L9IrvFA4GuAGtvfLf5ZfmSDxoXxBeym4BpxaJjVoc5SrB176u4FsYYoCCWa7rrwdAh-CZkA
          // this.refreshToken = '1//0gYwyLYeD179cCgYIARAAGBASNwF-L9Ir4eWR6-pPbjgYzJYPqm74y0-JiXqw5EmCbKduRf5VF0c1BIgD37qsWdtqt7bENC5uBss'
          this.statusGoogleCalendarEmp = rs[0].statusGoogleCalendarEmp
        }
      })
    },
    async getAccess_token () {
      await axios.get(this.DNS_IP + '/GoogleCalendarRefreshToken/get').then(response => {
        let rs = response.data
        if (rs.length > 0) {
          console.log('GoogleCalendarRefreshToken', rs)
          this.refreshToken = rs[0].access_token
        }
      })
    },
    async getRefreshTotokenEmp (refreshToken) {
      let dt = {
        refreshToken: refreshToken
      }
      let token = null
      await axios
        .post(this.webHookUrl + 'GoogleCalendar-GetToken', dt)
        .then(async (response) => {
          console.log(response)
          if (response.data.access_token) {
            token = response.data.access_token
          }
        })
        .catch((error) => {
          console.log(error)
        })
      console.log('token', token)
      return token
    },
    async getRefreshTotoken (refreshToken) {
      let dt = {
        refreshToken: refreshToken
      }
      await axios
        .post(this.webHookUrl + 'GoogleCalendar-GetToken', dt)
        .then(async (response) => {
          console.log(response)
          if (response.data.access_token) {
            this.refreshToken = response.data.access_token
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async getSysUser () {
      await axios.get(this.DNS_IP + '/system_user/get?shopId=' + this.shopId + '&USER_ROLE=admin').then(response => {
        let rs = response.data
        if (rs.length > 0) {
          console.log('system_user', rs)
          rs.forEach((item) => {
            let obj = {
              'email': item.userName
            }
            this.attendeesEmail.push(obj)
          })
        }
      })
    }
  }
}
</script>
