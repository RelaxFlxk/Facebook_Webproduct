<template>
  <v-app>
    <v-app-bar flat class="app-bar" dark>
      <v-toolbar-title class="text-h6 font-weight-bold">
        <span style="color: #FBBC05;">WAKIM</span><span>BOOKING</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="text-right" style="margin-right: 16px;">
        <div class="text-h7 mb-1"> {{ user.displayName }}</div>
      </div>
      <v-avatar size="42">
        <img
          :src="userPhotoURL"
          alt="User Profile"
          @error="handleImageError"
        >
      </v-avatar>
      <v-btn icon @click="showProfileMenu = !showProfileMenu">
        <v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </v-app-bar>
    <!--Menu-Navbar----->
    <div class="menu"
      v-if="showProfileMenu === true"
      :close-on-content-click="false"
    >
        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon left>mdi-account</v-icon>
                  {{ user.displayName }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-icon left>mdi-email</v-icon>
                  {{ user.email }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item link @click="signOut">
              <v-list-item-icon>
                <v-icon class="red--text">mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="red--text">ออกจากระบบ</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </div>
    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <!-- เพิ่ม spinner ที่นี่ -->
        <v-overlay :value="isLoading">
          <v-progress-circular
            indeterminate
            size="64"
            color="primary"
          ></v-progress-circular>
        </v-overlay>

        <!-- เนื้อหาหลัก -->
        <v-fade-transition>
          <div v-if="!isLoading">
            <!-- Balance Card -->
            <v-card class="mb-4 rounded-lg" style="background: linear-gradient(90deg, #043873 0%, #0765b0 100%);" dark>
              <v-card-text style="padding: 16px 24px;">
                <div class="text-h6 mb-1" style="margin-left: 16px;">ยอดจองประจำวัน</div> <!-- เพิ่ม margin ที่นี่ -->
                <div class="text-h4 font-weight-bold" style="margin-left: 16px;">12340 คน</div> <!-- เพิ่ม margin ที่นี่ -->
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
                <template #[`item.status`]="{ item }">
                  <v-chip :color="item.status === 'ยืนยันแล้ว' ? 'green' : 'red'" dark>
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
                  <template #day="{ day, outside }">
                    <div v-if="!outside" class="text-h6">
                      {{ day.date }}
                      <v-chip v-if="hasBooking(day.date)" small color="green" dark>จองแล้ว</v-chip>
                    </div>
                  </template>
                </v-calendar>
              </v-card-text>
            </v-card>

          </div>
        </v-fade-transition>
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
import { auth } from '@/main'

export default {
  data () {
    return {
      isLoading: true,
      user: {
        displayName: '',
        photoURL: '',
        email: ''
      },
      urlAPI: 'http://localhost:5005',
      showProfileMenu: false,
      activeTab: 'home',
      selectedDate: new Date().toISOString().substr(0, 10),
      quickActions: [
        { title: 'จองคิว', icon: 'mdi-calendar-plus' },
        { title: 'แจ้งโอน', icon: 'mdi-bank-transfer' },
        // { title: 'โปรโมชั่น', icon: 'mdi-ticket-percent' },
        { title: 'My subscription', icon: 'mdi-star' }
        // { title: 'ติดต่อเรา', icon: 'mdi-phone' },
        // { title: 'อื่นๆ', icon: 'mdi-dots-horizontal' }
      ],
      statistics: [
        { title: 'Total Profit', icon: 'mdi-cash-multiple', value: '฿2,435k', change: -3.5 },
        { title: 'Total Bookings', icon: 'mdi-calendar-check', value: '1,200', change: 12 }
        // { title: 'New Customers', icon: 'mdi-account-group', value: '43.5k', change: 10 }
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
      ],
      userPhotoURL: ''
    }
  },
  created () {
    this.initializeData()
  },
  methods: {
    async initializeData () {
      this.isLoading = true
      try {
        await this.getUserInfo()
        // เพิ่มการโหลดข้อมูลอื่นๆ ที่จำเป็นที่นี่
        // เช่น this.loadBookings(), this.loadStatistics() เป็นต้น
      } catch (error) {
        console.error('Error initializing data:', error)
      } finally {
        this.isLoading = false
      }
    },
    getUserInfo () {
      return new Promise((resolve) => {
        // ตรวจสอบข้อมูลใน localStorage ก่อน
        const storedUser = localStorage.getItem('userInfoGoogle')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          this.user = {
            displayName: parsedUser.displayName || 'User',
            email: parsedUser.email,
            photoURL: parsedUser.photoURL
          }
          this.userPhotoURL = this.getValidPhotoURL(parsedUser.photoURL)
          console.log('User data from localStorage:', this.user)
          resolve()
        } else {
          // ถ้าไม่มีข้อมูลใน localStorage ให้ใช้ auth state
          auth.onAuthStateChanged((user) => {
            if (user) {
              console.log('User data from Firebase:', user)
              this.user = {
                displayName: user.displayName || 'User',
                email: user.email,
                photoURL: user.photoURL
              }
              this.userPhotoURL = this.getValidPhotoURL(user.photoURL)
              console.log('Updated user object:', this.user)
              localStorage.setItem('userInfoGoogle', JSON.stringify(this.user))
            } else {
              this.navigateToLogin()
            }
            resolve()
          })
        }
      })
    },
    navigateToLogin () {
      if (this.$route.path !== '/MessageLogin') {
        this.$router.push('/MessageLogin').catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            throw err
          }
        })
      }
    },
    getValidPhotoURL (url) {
      if (url && url.startsWith('http')) {
        return url
      } else if (url && url.startsWith('//')) {
        return 'https:' + url
      } else {
        return 'https://via.placeholder.com/42'
      }
    },
    async signOut () {
      try {
        await auth.signOut()
        localStorage.removeItem('userInfoGoogle') // เปลี่ยนจาก 'user' เป็น 'userInfoGoogle'
        sessionStorage.clear()
        this.user = {
          displayName: '',
          email: '',
          photoURL: ''
        }
        this.userPhotoURL = ''
        this.navigateToLogin()
      } catch (error) {
        console.error('Error during sign out:', error)
      }
    },
    // New method to check if there is a booking for a specific date
    hasBooking (date) {
      return this.bookings.some(booking => booking.date === date)
    },
    handleAction (action) {
      if (action.title === 'จองคิว') {
        // เก็บ query parameters ปัจจุบัน
        const currentQuery = { ...this.$route.query }

        // เพิ่มหรือแก้ไข parameters ที่ต้องการส่งไป
        currentQuery.action = 'booking'

        // ใช้ router push ไปยัง /BookingForm พร้อมส่ง query parameters
        this.$router.push({
          path: '/BookingForm',
          query: currentQuery
        })
      } else {
      }
    },
    handleImageError (e) {
      e.target.src = 'https://via.placeholder.com/42'
    }
  }
}
</script>

<style scoped>
.app-bar {
  background: linear-gradient(90deg, #043873 0%, #0765b0 100%) !important;
  color: #ffffff !important;
}
.text-right {
  text-align: right;
  margin-right: 10px; /* ปรับระยะห่างจากขอบขวาตามที่ต้องการ */
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

.clickable-card {
  cursor: pointer;
  transition: all 0.3s;
}

.clickable-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.menu {
  right: 20px !important;
  position: absolute;
  top: 65px !important;
  z-index: 10;
  max-width: 250px; /* กำหนดขนาดสูงสุดที่เหมาะสม */
  width: auto; /* ปรับขนาดให้พอดีกับเนื้อหา */
}
</style>
