<template>
    <v-app>
      <v-main>
      <v-overlay :value="isLoading">
        <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
      </v-overlay>
      <v-app-bar flat class="app-bar" dark>
        <v-toolbar-title class="text-h8 font-weight-bold">
          <span style="color: #FBBC05;">WAKIM</span><span>BOOKING</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="text-right" style="margin-right: 18px;">
          <div class="text-h10 mb-1"> {{ user.displayName }}</div>
        </div>
        <v-avatar size="42">
          <v-img :src="userPhotoURL" alt="User Profile" @error="handleImageError"></v-img>
        </v-avatar>
        <v-btn icon @click="showProfileMenu = !showProfileMenu">
          <v-icon>mdi-menu-down</v-icon>
        </v-btn>
      </v-app-bar>
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

      </v-main>
      <v-bottom-navigation v-model="activeTab" grow class="bottom-nav" app>
        <v-btn v-for="item in bottomNavItems" :key="item.title" :value="item.value"
               class="bottom-nav-btn"
               @click="item.value === 'profile' ? goToProfile() : item.value === 'My_Rating' ? goToRating() : activeTab = item.value">
          <span class="bottom-nav-title white--text mt-1">{{ item.title }}</span>
          <v-icon class="bottom-nav-icon">{{ item.icon }}</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-app>
  </template>

<script>
import { auth } from '@/main'

export default {
  name: 'userLayout',
  props: {
    user: {
      type: Object,
      default: () => ({
        displayName: '',
        photoURL: '',
        email: ''
      })
    }
  },
  data () {
    return {
      userPhotoURL: 'https://via.placeholder.com/42',
      urlAPI: 'http://localhost:5005',
      userId: 'U9bc765fb4c3dd68fed8c409009cb5f32',
      shopId: 'U63f4a14fe78b8bf8414c1d197e432954',
      isLoading: true,
      showProfileMenu: false,
      activeTab: 'home',
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
    this.checkUserLoginStatus()
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

  </style>
