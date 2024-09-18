<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar flat class="app-bar" dark>
      <v-toolbar-title class="text-h6 font-weight-bold">
        <span style="color: #FBBC05;">WAKIM</span><span>BOOKING</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="showProfileMenu = !showProfileMenu">
        <v-avatar size="32">
          <img src="https://scontent.fbkk12-1.fna.fbcdn.net/v/t39.30808-6/330866163_722243462736415_5773031836703429458_n.jpg?stp=cp6_dst-jpg&_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeHr5PMzv5WYfsZKcjFCAcE2bSfmpwlyzgFtJ-anCXLOAdLUBNY9e_GsnfRSVvkOqu28TfMZCFoHX_aOXseaR9ZH&_nc_ohc=tcpVJMOkq_EQ7kNvgFYCRwb&_nc_ht=scontent.fbkk12-1.fna&oh=00_AYCcNvhDePpxp-_Qe380Kc1L7mGXtoYaLP_C6bgzsU7o1g&oe=66CD35D9" alt="Avatar">
        </v-avatar>
      </v-btn>
      <v-menu v-model="showProfileMenu" :close-on-content-click="false" offset-y>
        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>สุรพัศ วงศรี</v-list-item-title>
                <v-list-item-subtitle>suraphat@gmail.com</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item link @click="signOut">
              <v-list-item-title>ออกจากระบบ</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <!-- Balance Card -->
        <v-card class="mb-4 rounded-lg" style="background: linear-gradient(90deg, #043873 0%, #0765b0 100%);" dark>
          <v-card-text>
            <div class="text-h6 mb-1">ยอดจองวันนี้</div>
            <div class="text-h4 font-weight-bold">12340 คน</div>
          </v-card-text>
        </v-card>

        <!-- Quick Actions Grid -->
        <v-row>
          <v-col v-for="action in quickActions" :key="action.title" cols="6" md="4">
            <v-card outlined class="text-center rounded-lg clickable-card" @click="handleAction(action)">
              <v-card-text>
                <v-icon large color="#043873">{{ action.icon }}</v-icon>
                <div class="mt-2">{{ action.title }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <!-- Statistics Cards -->
        <v-row>
          <v-col v-for="stat in statistics" :key="stat.title" cols="12" md="4">
            <v-card outlined class="rounded-lg">
              <v-card-title class="d-flex align-center">
                <v-icon left color="#043873">{{ stat.icon }}</v-icon>
                {{ stat.title }}
              </v-card-title>
              <v-card-text class="text-center">
                <div class="text-h5 font-weight-bold">{{ stat.value }}</div>
                <div :class="stat.change > 0 ? 'green--text' : 'red--text'">
                  {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Booking History -->
        <v-card outlined class="rounded-lg mt-4">
          <v-card-title class="d-flex align-center">
            <v-icon left color="#043873">mdi-calendar-clock</v-icon>
            ประวัติการจองคิว
          </v-card-title>
          <v-data-table :headers="bookingHeaders" :items="bookings" class="elevation-1">
            <template v-slot:item.status="{ item }">
              <v-chip :color="item.status === 'ยืนยันแล้ว' ? 'green' : item.status === 'ยกเลิก' ? 'red' : 'orange'" dark>
                {{ item.status }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>

        <!-- Calendar for Booking -->
        <v-card outlined class="rounded-lg mt-4">
          <v-card-title class="d-flex align-center">
            <v-icon left color="#043873">mdi-calendar</v-icon>
            ปฏิทินการจองคิว
          </v-card-title>
          <v-card-text>
            <v-calendar
              v-model="selectedDate"
              color="primary"
              is-expanded
              :events="calendarEvents"
            >
              <template v-slot:day="{ day, outside }">
                <div v-if="!outside" class="text-h6">
                  {{ day.date }}
                  <v-chip v-if="hasBooking(day.date)" small color="green" dark>จองแล้ว</v-chip>
                </div>
              </template>
            </v-calendar>
          </v-card-text>
        </v-card>

      </v-container>
    </v-main>

    <!-- Bottom Navigation -->
    <v-bottom-navigation v-model="activeTab" grow class="bottom-nav" app>
      <v-btn
        v-for="item in bottomNavItems"
        :key="item.title"
        :value="item.value"
        class="bottom-nav-btn"
      >
        <v-icon class="bottom-nav-icon">{{ item.icon }}</v-icon>
        <span class="bottom-nav-title white--text">{{ item.title }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      showProfileMenu: false,
      activeTab: 'home',
      selectedDate: new Date().toISOString().substr(0, 10),
      quickActions: [
        { title: 'จองคิว', icon: 'mdi-calendar-plus' },
        { title: 'แจ้งโอน', icon: 'mdi-bank-transfer' },
        { title: 'โปรโมชั่น', icon: 'mdi-ticket-percent' },
        { title: 'My subscription', icon: 'mdi-star' },
        { title: 'ติดต่อเรา', icon: 'mdi-phone' },
        { title: 'อื่นๆ', icon: 'mdi-dots-horizontal' }
      ],
      statistics: [
        { title: 'Total Profit', icon: 'mdi-cash-multiple', value: '฿2,435k', change: -3.5 },
        { title: 'Total Bookings', icon: 'mdi-calendar-check', value: '1,200', change: 12 },
        { title: 'New Customers', icon: 'mdi-account-group', value: '43.5k', change: 10 }
      ],
      bookingHeaders: [
        { text: 'ชื่อลูกค้า', value: 'name' },
        { text: 'วันที่จอง', value: 'date' },
        { text: 'เวลา', value: 'time' },
        { text: 'สถานะ', value: 'status' }
      ],
      bookings: [
        { name: 'สุรพัศ วงศรี', date: '2024-08-23', time: '14:00', status: 'ยืนยันแล้ว' },
        { name: 'สมชาย ทองดี', date: '2024-08-24', time: '09:00', status: 'รอการยืนยัน' },
        { name: 'อนันต์ เกตุแก้ว', date: '2024-08-25', time: '10:00', status: 'ยืนยันแล้ว' },
        { name: 'ศิริพร วงศ์สว่าง', date: '2024-08-26', time: '13:00', status: 'ยืนยันแล้ว' },
        { name: 'พรทิพย์ จันทร์เพ็ญ', date: '2024-08-27', time: '15:00', status: 'ยกเลิก' }
      ],
      calendarEvents: [],
      bottomNavItems: [
        { title: 'หน้าหลัก', icon: 'mdi-home', value: 'home' },
        { title: 'นัดหมาย', icon: 'mdi-calendar', value: 'appointments' },
        { title: 'บริการ', icon: 'mdi-content-cut', value: 'services' },
        { title: 'โปรไฟล์', icon: 'mdi-account', value: 'profile' }
      ]
    }
  },
  mounted () {
    this.calendarEvents = this.bookings.map(booking => ({
      name: booking.name,
      start: booking.date,
      end: booking.date,
      color: booking.status === 'ยกเลิก' ? 'red' : 'green'
    }))
  },
  methods: {
    signOut () {
      // Implement sign out logic
    },
    hasBooking (date) {
      return this.bookings.some(booking => booking.date === date && booking.status !== 'ยกเลิก')
    }
  }
}
</script>

<style scoped>
.app-bar {
  background: linear-gradient(90deg, #043873 0%, #0765b0 100%) !important;
  color: #ffffff !important;
}

.bottom-nav {
  background: linear-gradient(90deg, #043873 0%, #0765b0 100%) !important;
  color: #ffffff !important;
}

.bottom-nav-btn {
  color: #ffffff !important;
}

.bottom-nav-icon {
  color: #ffffff !important;
}
.v-bottom-navigation {
  box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
  position: fixed;
  bottom: 0;
  width: 100%;
}

.v-card {
  border-radius: 15px;
}

.v-card-text .text-h4 {
  color: #fff !important;
}

.v-avatar img {
  border-radius: 50%;
}

.v-data-table {
  border-radius: 15px;
}
</style>
