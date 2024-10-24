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
                label="เลือกเดือน"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="selectedDate"
              type="month"
              @input="dateMenu = false"
              @change="fetchMonthData"
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
        @click:date="viewDayEvents"
        :key="calendarEvents.map(event => event.uniqueKey).join('-')"
        ></v-calendar>
      </v-sheet>
    </div>
  </template>

<script>
import axios from 'axios'

export default {
  name: 'BookingCalendar',
  data () {
    return {
      dateMenu: false,
      selectedDate: new Date().toISOString().slice(0, 10),
      calendarEvents: [],
      urlAPI: 'http://localhost:5005',
      userId: 'U9bc765fb4c3dd68fed8c409009cb5f32',
      selectedEventDate: null,
      selectedDateEvents: [],
      eventDialog: false
    }
  },
  methods: {
    async fetchMonthData () {
      try {
        const userId = this.userId
        const queryParams = this.$route.query
        const shopId = queryParams.shopId

        // แยกปีและเดือนจาก selectedDate
        const selectedYear = new Date(this.selectedDate).getFullYear()
        const selectedMonth = new Date(this.selectedDate).getMonth() + 1 // เพิ่ม 1 เพราะ getMonth() คืนค่า 0-11

        const response = await axios.get(`${this.urlAPI}/Booking/get/calendar`, {
          params: {
            shopId: shopId,
            userId: userId,
            year: selectedYear,
            month: selectedMonth
          }
        })

        // ตรวจสอบการตอบกลับจาก API
        console.log('Response from API:', response.data) // ตรวจสอบข้อมูลที่ได้รับ

        this.bookingData = response.data || [] // ตรวจสอบว่า response.data มีค่าเป็น undefined หรือไม่
        this.transformBookingsToEvents()
      } catch (error) {
        console.error('Error fetching booking data:', error)
      }
    },
    transformBookingsToEvents () {
      if (!Array.isArray(this.bookingData)) {
        console.error('Booking data is not an array:', this.bookingData)
        return
      }

      this.calendarEvents = this.bookingData.map(booking => {
        const eventDate = new Date(booking.dueDateDay) // Convert dueDateDay to Date object
        return {
          name: booking.memberName,
          start: eventDate, // Use Date object directly
          end: eventDate, // Use Date object directly
          time: booking.timeText,
          status: booking.statusBt,
          color: this.getStatusColor(booking.statusBt),
          timed: false,
          id: `${booking.id}-${eventDate.toISOString().slice(0, 10)}`, // Create a unique ID
          uniqueKey: `${booking.id}-${eventDate.toISOString().slice(0, 10)}`, // Create a unique key
          ...booking
        }
      })
    },
    getEventColor (event) {
      return event.color || 'blue'
    },
    viewDayEvents ({ date }) {
      this.selectedEventDate = date
      this.selectedDateEvents = this.calendarEvents.filter(event =>
        event.start.toISOString().slice(0, 10) === date.toISOString().slice(0, 10)
      )
      this.eventDialog = this.selectedDateEvents.length > 0
    },
    formatDate (dateStr) {
      if (!dateStr) return ''
      return new Intl.DateTimeFormat('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(dateStr))
    },
    getStatusColor (status) {
      const statusColors = {
        confirmJob: '#b0e370',
        closeJob: '#d8d8d8',
        confirm: '#b7e1fc',
        cancel: '#ffb2b2'
      }
      return statusColors[status] || 'orange'
    },
    getTextColor (status) {
      const statusTextColors = {
        confirmJob: '#4b810f',
        confirm: '#0085b2',
        closeJob: '#808080',
        cancel: '#ff0000'
      }
      return statusTextColors[status] || 'white'
    }
  },
  created () {
    this.fetchMonthData()
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
