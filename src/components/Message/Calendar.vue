<template>
  <div class="calendar-wrapper">
    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="4">
        <v-menu
          v-model="dateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="selectedDate"
              label="เลือกวันที่"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="selectedDate"
            type="month"
            @input="dateMenu = false; fetchMonthData()"
          ></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>

    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="selectedDate"
        :events="calendarEvents"
        :event-color="getEventColor"
        type="month"
        @click:event="showEvent"
        :key="calendarEvents.map(event => event.uniqueKey).join('-')"
      ></v-calendar>
    </v-sheet>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Event Details</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="(item, index) in dataCalendar" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.licenseNo }} - {{ item.tel }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  data () {
    return {
      today: new Date().toISOString().slice(0, 10),
      selectedDate: new Date().toISOString().slice(0, 10),
      dateMenu: false,
      bookingData: [],
      calendarEvents: [],
      dialog: false,
      dataCalendar: [],
      urlAPI: 'http://localhost:5005', // กำหนด URL API ของคุณ
      userId: 'U8b3fd01caa9faa45189b0567eb452041', // ระบุ user ID
      type: 'month' // กำหนดประเภทปฏิทิน
    }
  },
  methods: {
    async fetchMonthData () {
      try {
        const queryParams = this.$route.query
        const shopId = queryParams.shopId

        const selectedYear = new Date(this.selectedDate).getFullYear()
        const selectedMonth = new Date(this.selectedDate).getMonth() + 1 // เพิ่ม 1
        const selectedDay = new Date(this.selectedDate).getDate() // ใช้ getDate เพื่อรับวันที่จริง

        const response = await axios.get(`${this.urlAPI}/Booking/get/calendar`, {
          params: {
            shopId: shopId,
            userId: this.userId,
            year: selectedYear,
            month: selectedMonth,
            day: selectedDay
          }
        })

        console.log('Response from API:', response.data)
        this.bookingData = response.data || []
        await this.transformBookingsToEvents()
      } catch (error) {
        console.error('Error fetching booking data:', error)
      }
    },
    transformBookingsToEvents () {
      if (!Array.isArray(this.bookingData)) {
        console.error('Booking data is not an array:', this.bookingData)
        return
      }

      // Create a Set to track unique keys
      const uniqueKeys = new Set()

      this.calendarEvents = this.bookingData.map(booking => {
        const eventDate = new Date(booking.dueDateDay)
        if (isNaN(eventDate.getTime())) {
          console.error('Invalid date format:', booking.dueDateDay)
          return null
        }

        // Create a unique key
        const key = `${booking.id}-${eventDate.toISOString().slice(0, 10)}-${booking.timeText}`

        // Check for uniqueness
        if (uniqueKeys.has(key)) {
          console.warn('Duplicate event key detected:', key)
          return null // Skip this event if it's a duplicate
        }
        uniqueKeys.add(key)

        return {
          name: booking.memberName,
          start: eventDate,
          end: eventDate,
          time: booking.timeText,
          status: booking.statusBt,
          color: this.getStatusColor(booking.statusBt),
          timed: false,
          id: key,
          uniqueKey: key,
          ...booking
        }
      }).filter(event => event !== null)
    },
    async showEvent (event) {
      this.dataCalendar = []
      this.selectedEvent = event.event.start
      console.log('event', event.event)
      console.log('type', this.type)

      let url = ''
      if (this.type === 'week') {
        url = `${this.urlAPI}/booking_view/get?shopId=${this.userId}&DATE_FORMAT(dueDate,'%Y-%m-%d %H')=${moment(event.event.start).format('YYYY-MM-DD HH')}&statusBt=${event.event.statusBt}` // แก้ไขการใช้ backticks
      } else {
        url = `${this.urlAPI}/booking_view/get?shopId=${this.userId}&dueDate=${event.event.start} ${event.event.time}&statusBt=${event.event.statusBt}` // แก้ไขการใช้ backticks
      }

      console.log('url', url)
      try {
        const response = await axios.get(url)
        console.log('getData', response.data)
        for (let i = 0; i < response.data.length; i++) {
          let d = response.data[i]
          d.chkConfirm = d.statusUseBt === 'use' && d.statusBt === 'confirm'
          d.chkCancel = d.statusUseBt === 'use' && d.statusBt === 'cancel'
          d.color = d.statusBt === 'confirm' ? 'green' : d.statusBt === 'confirmJob' ? 'info' : 'red'
          d.name = d.bookingDataCustomerName || ''
          d.licenseNo = d.bookingDataCustomerRegisNumber || ''
          d.tel = d.bookingDataCustomerTel || ''
          d.carModel = d.bookingDataCustomerCarModel || ''
          d.displayFlowName = d.displayFlowName || ''
          this.dataCalendar.push(d)
        }
        this.dialog = true
      } catch (error) {
        console.error('Error fetching event data:', error)
      }
    },
    getEventColor (event) {
      return event.color || 'blue'
    },
    getStatusColor (status) {
      switch (status) {
        case 'confirm':
          return 'green'
        case 'confirmJob':
          return 'info'
        case 'cancel':
          return 'red'
        default:
          return 'orange'
      }
    }
  }
}
</script>
<style scoped>
  .calendar-wrapper {
    padding: 16px;
  }
  .v-calendar {
    border-radius: 8px;
  }
  </style>
