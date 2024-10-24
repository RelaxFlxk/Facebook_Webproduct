<template>
  <v-app>
    <v-main>
      <v-overlay :value="isLoading">
        <v-container>
          <v-row justify="center">
            <v-col cols="auto">
              <v-progress-circular
                indeterminate
                :size="50"
                :width="5"
                color="primary"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-overlay>

    <v-app-bar  flat class="app-bar" dark>
      <v-toolbar-title class="text-h8 font-weight-bold">
        <span style="color: #FBBC05;">WAKIM</span><span>BOOKING</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <div class="text-right" style="margin-right: 18px;">
        <div class="text-h10 mb-1"> {{ user.displayName }}</div>
      </div> -->
      <!-- ปรับการแสดง avatar พร้อม badge -->
      <v-badge
        overlap
        color="success"
        dot
        offset-x="12"
        offset-y="40"
        bordered
      >
        <v-avatar size="42">
          <v-img :src="userPhotoURL" alt="User Profile" @error="userPhotoURL = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'"></v-img>

        </v-avatar>
      </v-badge>
      <v-btn icon @click="showProfileMenu = !showProfileMenu">
        <v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- เมนูโปรไฟล์ -->
    <div class="menu" v-if="showProfileMenu === true" :close-on-content-click="false">
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

      <v-container fluid>
        <v-fade-transition>
          <div v-if="!isLoading">
            <v-card-text class="text-h4 mb-8 mt-4 h2 font-weight-bold" style="color: #303030;">ข้อมูลการจอง</v-card-text>
            <v-row>
              <v-col v-for="stat in statistics" :key="stat.title" cols="12" sm="6" md="4" lg="3">
                <v-card outlined class="rounded-lg" height="100">
                  <v-card-title class="d-flex align-center">
                    <v-icon left color="#043873" class="mr-2">{{ stat.icon }}</v-icon>
                    <span class="subtitle-1 font-weight-bold" style="color: #043873;">{{ stat.title }}</span>
                  </v-card-title>
                  <v-card-text class="text-center pt-0">
                    <div class="text-h6 font-weight-bold">{{ stat.value }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <!--DATA--TABLE-->
            <!-- Booking History Table -->
            <v-card outlined class="rounded-lg mt-4">
              <v-card-title class="d-flex align-center py-2">
                <v-icon left color="#043873" class="mr-2">mdi-calendar-clock</v-icon>
                <span class="subtitle-1 font-weight-bold" style="color: #043873;">ประวัติการจองคิว</span>
              </v-card-title>
              <v-data-table
                :headers="bookingHeaders"
                :items="bookings"
                class="elevation-1"
                dense
                :items-per-page="5"
              >
                <template #[`item.statusBt`]="{ item }">
                  <v-chip
                    small
                    :color="getStatusColor(item.statusBt)"
                    :text-color="getTextColor(item.statusBt)"
                  >
                  {{ item.statusBt || 'Null' }}
                  </v-chip>
                </template>
              </v-data-table>
            </v-card>

            <v-card outlined class="rounded-lg mt-4">
              <v-card-title class="d-flex align-center">
                <v-icon left color="#043873">mdi-calendar</v-icon>
                <span class="subtitle-1 font-weight-bold" style="color: #043873;" > ปฏิทินการจองคิว </span>
              </v-card-title>
              <BookingCalendar />
            </v-card>
          </div>
        </v-fade-transition>
      </v-container>
    </v-main>
    <v-bottom-navigation v-model="activeTab" grow class="bottom-nav" app>
      <v-btn v-for="item in bottomNavItems" :key="item.title" :value="item.value"
             class="bottom-nav-btn"
             @click="item.value === 'home' ? gotoHome() : item.value === 'booking' ? gotoBookingForm() : item.value === 'profile' ? goToProfile() : item.value === 'My_Rating' ? goToRating() : activeTab = item.value">
        <span class="bottom-nav-title white--text mt-1">{{ item.title }}</span>
        <v-icon class="bottom-nav-icon">{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import BookingCalendar from './Calendar.vue'
import { auth } from '@/main'
import axios from 'axios'

export default {
  components: {
    BookingCalendar
  },
  data () {
    return {
      userPhotoURL: 'https://via.placeholder.com/42',
      urlAPI: 'http://localhost:5005',
      userId: 'U9bc765fb4c3dd68fed8c409009cb5f32',
      shopId: 'U63f4a14fe78b8bf8414c1d197e432954',
      isLoading: true,
      totalPrice: null,
      totalBookings: null,
      showProfileMenu: false,
      activeTab: 'home',
      calendarEvents: [],
      selectedDate: new Date().toISOString().slice(0, 10),
      user: {
        displayName: '',
        photoURL: '',
        email: ''
      },
      quickActions: [
        {
          title: 'จองคิว',
          icon: 'mdi-calendar-plus'
        },
        {
          title: 'รายการแจ้งโอน',
          icon: 'mdi-bank-transfer'
        },
        {
          title: 'My Rating',
          icon: 'mdi-star'
        }
      ],
      statistics: [
        {
          title: 'Total Price',
          icon: 'mdi-cash-multiple',
          value: 'กำลังโหลด...'
        },
        {
          title: 'Total Bookings',
          icon: 'mdi-calendar-check',
          value: 'กำลังโหลด...'
        }
      ],
      bookingHeaders: [
        {
          text: 'ชื่อลูกค้า',
          value: 'memberName'
        },
        {
          text: 'เบอร์โทร',
          value: 'bookingDataCustomerTel'
        },
        {
          text: 'วันที่จอง',
          value: 'dueDateTextDay'
        },
        {
          text: 'เวลา',
          value: 'timeText'
        },
        {
          text: 'สถานะ',
          value: 'statusBt'
        }
      ],
      bookings: [],
      bottomNavItems: [
        {
          title: 'หน้าหลัก',
          icon: 'mdi-home',
          value: 'home'
        },
        {
          title: 'จองคิว',
          icon: 'mdi-calendar-plus',
          value: 'booking'
        },
        {
          title: 'My Rating',
          icon: 'mdi-star',
          value: 'My_Rating'
        },
        {
          title: 'โปรไฟล์',
          icon: 'mdi-account',
          value: 'profile'
        }
      ]
    }
  },
  created () {
    this.initializeData()
    this.fetchTotalPrice()
    this.checkUserLoginStatus()
    this.fetchTotalBookings()
    this.getBookings()
  },
  methods: {
    goToProfile () {
      const paramsUrl = this.$route.query
      this.$router.push({ path: '/Message/Profile', query: paramsUrl })
    },
    goToRating () {
      const shopId = this.$route.query.shopId
      const userId = this.$route.query.userId
      this.$router.push({ path: '/Message/rating', query: { shopId: shopId, userId: userId } })
    },
    gotoHome () {
      const queryParams = this.$route.query // ดึง query parameters
      const shopId = queryParams.shopId
      const uid = queryParams.uid
      const loginWith = queryParams.loginWith
      this.$router.push({ path: '/Message/test', query: { shopId: shopId, uid: uid, loginWith: loginWith } })
    },
    gotoBookingForm () {
      const shopId = this.$route.query.shopId
      this.$router.push({ path: '/BookingForm', query: { shopId: shopId } })
    },
    getStatusColor (status) {
      switch (status) {
        case 'confirmJob':
          return '#b0e370' // สีพื้นหลังสำหรับสถานะ confirmJob
        case 'closeJob':
          return '#d8d8d8' // สีพื้นหลังสำหรับสถานะ closeJob
        case 'confirm':
          return '#b7e1fc' // สีพื้นหลังสำหรับสถานะ confirm
        case 'cancel':
          return '#ffb2b2' // สีพื้นหลังสำหรับสถานะ cancel
        default:
          return 'orange' // สีพื้นหลังเริ่มต้น
      }
    },
    getTextColor (status) {
      switch (status) {
        case 'confirmJob':
          return '#4b810f' // สีข้อความสำหรับสถานะ confirmJob
        case 'confirm':
          return '#0085b2' // สีข้อความสำหรับสถานะ confirm
        case 'closeJob':
          return '#808080' // สีข้อความสำหรับสถานะ closeJob
        case 'cancel':
          return '#ff0000' // สีข้อความสำหรับสถานะ cancel
        default:
          return 'white' // สีข้อความเริ่มต้น
      }
    },
    checkUserLoginStatus () {
      const user = JSON.parse(localStorage.getItem('userInfoGoogle'))
      if (!user) {
        this.$router.push('/MessageLogin')
      }
    },
    async initializeData () {
      this.isLoading = true
      try {
        await this.getUserInfo()
        // เรียก API อื่นๆ ที่จำเป็นต่อหน้า dashboard
        await Promise.all([
          this.fetchTotalPrice(),
          this.fetchTotalBookings()
        ])
      } catch (error) {
        console.error('Error initializing data:', error)
        this.$toast.error('ไม่สามารถโหลดข้อมูลได้')
      } finally {
        this.isLoading = false
      }
    },
    async getUserInfo () {
      const storedUser = localStorage.getItem('userInfoGoogle')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        this.user = {
          displayName: parsedUser.displayName || 'User',
          email: parsedUser.email,
          photoURL: parsedUser.photoURL
        }
        this.userPhotoURL = parsedUser.photoURL || 'https://via.placeholder.com/42'
      } else {
        const user = auth.currentUser
        if (user) {
          this.user = {
            displayName: user.displayName || 'User',
            email: user.email,
            photoURL: user.photoURL
          }
          this.userPhotoURL = user.photoURL || 'https://via.placeholder.com/42'
          localStorage.setItem('userInfoGoogle', JSON.stringify(this.user))
        } else {
          this.navigateToLogin()
        }
      }
    },
    handleImageError (item) {
    // ตรวจสอบว่า item เป็นอ็อบเจ็กต์ก่อน
      if (typeof item === 'object' && item !== null) {
        item.pictureUrl = 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg' // URL ของรูปภาพสำรอง
      } else {
        console.error('Expected item to be an object, but got:', item)
        // คุณอาจต้องการจัดการกับกรณีนี้ เช่น:
        // item = {}; // สร้างอ็อบเจ็กต์ใหม่ถ้าจำเป็น
      }
    },
    async fetchTotalPrice () {
      try {
        const userId = this.userId // userId ที่ config ไว้
        const response = await axios.get(`${this.urlAPI}/totalprice/${userId}`)
        if (response.data && response.data.length > 0) {
          // รวม totalprice จากทุก record
          const totalPrice = response.data.reduce((sum, record) => {
            // ตรวจสอบว่า totalPrice เป็นตัวเลขก่อนที่จะรวม
            const price = parseFloat(record.totalPrice)
            return sum + (isNaN(price) ? 0 : price)
          }, 0)

          // แปลงเป็นรูปแบบที่อ่านง่าย และเพิ่มสกุลเงินที่ท้าย
          this.statistics[0].value = totalPrice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) + ' บาท'
        } else {
          console.log('No data found for totalPrice')
          this.statistics[0].value = 'กำลังโหลด..'
        }
      } catch (error) {
        console.error('Error fetching totalPrice:', error)
        this.statistics[0].value = 'กำลังโหลด..'
      }
    },
    async fetchTotalBookings () {
      try {
        const response = await axios.get(`${this.urlAPI}/totalBooking/${this.userId}`)
        if (response.data.totalBooking) {
          this.statistics[1].value = response.data.totalBooking + ' ครั้ง' // อัปเดต Total Bookings
        } else {
          console.error('Failed to fetch total bookings:', response.data.message)
        }
      } catch (error) {
        console.error('Error fetching total bookings:', error)
      }
    },
    async getBookings () {
      try {
        const response = await axios.get(`${this.urlAPI}/Booking/get/${this.shopId}/${this.userId}`)
        this.bookings = response.data // บันทึกข้อมูลการจอง
      } catch (error) {
        console.error('Error fetching bookings:', error)
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
      // ตรวจสอบว่าในวันนั้นมีการจองหรือไม่
      return this.calendarEvents.some(event => event.start === date)
    },
    handleAction (action) {
      if (action.title === 'My Rating') {
        const shopId = this.$route.query.shopId
        const userId = this.userId // เปลี่ยนเป็นค่าที่ต้องการส่ง
        this.$router.push({ path: '/Message/rating', query: { shopId: shopId, userId: userId } })
      } else {
      // จัดการ action อื่น ๆ ที่ไม่ใช่ My Rating
        console.log(`Action clicked: ${action.title}`)
      }
    },
    async signOut () {
      try {
        await auth.signOut()
        localStorage.removeItem('userInfoGoogle') // ลบ key ใน localStorage 'userInfoGoogle'
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
    navigateToLogin () {
      if (this.$route.path !== '/MessageLogin') {
        this.$router.push('/MessageLogin').catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            throw err
          }
        })
      }
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

.text-right {
  text-align: right;
  margin-right: 10px;
  /* ปรับระยะห่างจากขอบขวาตามที่ต้องการ */
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
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.menu {
  right: 20px !important;
  position: absolute;
  top: 65px !important;
  z-index: 10;
  max-width: 250px;
  /* กำหนดขนาดสูงสุดที่เหมาะสม */
  width: auto;
  /* ปรับขนาดให้พอดีกับเนื้อหา */
}

.clickable-card {
  cursor: pointer;
}

@media (max-width: 600px) {
  .app-bar {
    justify-content: space-between;
  }
}
</style>
