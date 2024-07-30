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
      bookNo: '',
      statusGoogleCalendarEmp: ''
    }
  },
  async mounted () {
    // await this.checkTypeEvenEmp()
  },
  methods: {
    async checkTypeEvenEmp (shopId, status, bookNo) {
      console.log('status!!', status)
      this.shopId = shopId
      this.evenStatus = status
      //   this.evenStatus = 'Add'
      this.bookNo = bookNo
      //   this.bookNo = 'BK143157651684727414315'
      await this.getShop()
      if (this.refreshToken === null || this.refreshToken === '') {
        await this.handleClickLogin(status, bookNo)
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
        Description += a.fieldName + ' : ' + a.fieldValue
        Description += '\n'
      })
      Description += 'ชื่อช่าง :' + this.bookingItem[0].bookingEmpFlowName
      //    แปลงเวลานัดหมาย
      item.Description = Description
      const timezone = 'Asia/Bangkok'
      const dateSelect = moment.tz(`${this.bookingItem[0].dueDateDay} ${this.bookingItem[0].timeDue}`, 'YYYY-MM-DD HH:mm', timezone).format()
      item.StartDate = dateSelect
      item.EndDate = dateSelect
      if (this.statusGoogleCalendarEmp === 'True') {
        if (status === 'Add') {
          if (this.empItem[0].empEmail !== null) {
            item.attendees = [
              {'email': this.empItem[0].empEmail}
            ]
          }
        } else if (status === 'Edit') {
          if (this.empItem[0].empEmail !== null) {
            item.attendees = [
              {'email': this.empItem[0].empEmail}
            ]
          }
        }
      }
      return item
    },
    async checkTypeEven (shopId, status, bookNo) {
      console.log('status!!', status)
      this.shopId = shopId
      this.evenStatus = status
      //   this.evenStatus = 'Add'
      this.bookNo = bookNo
      //   this.bookNo = 'BK143157651684727414315'
      await this.getShop()
      if (this.refreshToken === null || this.refreshToken === '') {
        await this.handleClickLogin(status, bookNo)
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
      item.EndDate = dateSelect
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
            .post('http://127.0.0.1:5002/be-linked-a7cdc/asia-southeast1/GoogleCalendar-createToken', {code: authCode})
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
          .post('http://127.0.0.1:5002/be-linked-a7cdc/asia-southeast1/GoogleCalendar-createEvent', item)
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
        .post('http://127.0.0.1:5002/be-linked-a7cdc/asia-southeast1/GoogleCalendar-getEvent', dt)
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
        .post('http://127.0.0.1:5002/be-linked-a7cdc/asia-southeast1/GoogleCalendar-getEvent', itemGet)
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
            .post('http://127.0.0.1:5002/be-linked-a7cdc/asia-southeast1/GoogleCalendar-updateEvent', itemUpdate)
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
        .post('http://127.0.0.1:5002/be-linked-a7cdc/asia-southeast1/GoogleCalendar-deleteEvent', dt)
        .then(async (response) => {
          console.log('deleteEvent', response.data)
        })
    },
    async getShop () {
      await axios.get(this.DNS_IP + '/sys_shop/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          console.log('rs', rs)
          this.refreshToken = rs[0].refreshTokenGoogleCalendar
          this.statusGoogleCalendarEmp = rs[0].statusGoogleCalendarEmp
        //   this.expireDate = rs[0].expireDateGoogleCalendar
        }
      })
    }
  }
}
</script>
