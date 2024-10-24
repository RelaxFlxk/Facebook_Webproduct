<template>
  <v-app>
    <v-main>
      <v-app-bar flat class="app-bar" dark>
        <v-toolbar-title class="text-h6 font-weight-bold">
          <span style="color: #FBBC05;">[ WAKIM</span><span>BOOKING ]</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="text-right" style="margin-right: 16px;">
          <div class="text-h7 mb-1"> {{ user.displayName }}</div>
        </div>
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
        <v-row align="center">
          <v-col cols="auto">
            <v-btn @click="$router.go(-1)" icon >
              <v-icon style="font-size: 2rem; padding: 10px;">mdi-chevron-left</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-card-text class="mb-5 mt-4 h2 font-weight-bold" style="color: #303030;">โปรไฟล์</v-card-text>
          </v-col>
        </v-row>
        <v-row justify="center" class="mt-8">
          <!-- Card สำหรับแสดงข้อมูลโปรไฟล์ -->
          <v-card class="mx-auto" outlined max-width="1000" max-height="600" style="padding: 40px; border-radius: 10px;">
            <v-card-title class="text-h5 justify-center">
              <v-img
                :src="user.photoURL"
                max-width="100"
                max-height="100"
                class="mr-3 mb-8 rounded-circle"
                contain
                @error="handleImageError1"
              ></v-img>
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="user.displayName"
                  label="Display Name"
                  disabled
                  outlined
                  style="margin-bottom: 20px;"
                  prepend-icon="mdi-account"
                ></v-text-field>
                <v-text-field
                  v-model="user.email"
                  label="Email"
                  disabled
                  outlined
                  style="margin-bottom: 20px;"
                  prepend-icon="mdi-email"
                ></v-text-field>
              </v-form>
            </v-card-text>
          </v-card>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { auth } from '@/main'
// import axios from 'axios'

export default {
  data () {
    return {
      isLoading: true,
      userPhotoURL: 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
      urlAPI: 'http://localhost:5005',
      userId: 'U9bc765fb4c3dd68fed8c409009cb5f32',
      shopId: 'U63f4a14fe78b8bf8414c1d197e432954',
      showProfileMenu: false,
      activeTab: 'home',
      user: {
        displayName: '',
        photoURL: '',
        email: ''
      },
      headers: [
        { text: 'วันที่', value: 'CREATE_DATE' },
        { text: 'ชื่อ', value: 'displayName' },
        { text: 'คะแนน', value: 'rating', sortable: false },
        { text: 'ความคิดเห็น', value: 'comment' },
        { text: 'ดูรายละเอียดงาน', value: 'actions', sortable: false }
      ],
      ratings: []
    }
  },
  created () {
    this.initializeData()
  },
  methods: {
    viewDetails (item) {
      console.log('ดูรายละเอียดของ:', item)
    },
    async initializeData () {
      this.isLoading = true
      try {
        await this.getUserInfo()
      } catch (error) {
        console.error('Error initializing data:', error)
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
        this.userPhotoURL = parsedUser.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'
      } else {
        const user = auth.currentUser
        if (user) {
          this.user = {
            displayName: user.displayName || 'User',
            email: user.email,
            photoURL: user.photoURL
          }
          this.userPhotoURL = user.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'
          localStorage.setItem('userInfoGoogle', JSON.stringify(this.user))
        } else {
          this.navigateToLogin()
        }
      }
    },
    handleImageError1 () {
      this.user.photoURL = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541' // URL ของรูปภาพสำรอง
    },
    handleImageError (item) {
    // ตรวจสอบว่า item เป็นอ็อบเจ็กต์ก่อน
      if (typeof item === 'object' && item !== null) {
        item.pictureUrl = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541' // URL ของรูปภาพสำรอง
      } else {
        console.error('Expected item to be an object, but got:', item)
        // คุณอาจต้องการจัดการกับกรณีนี้ เช่น:
        // item = {}; // สร้างอ็อบเจ็กต์ใหม่ถ้าจำเป็น
      }
    },
    async signOut () {
      try {
        await auth.signOut()
        localStorage.removeItem('userInfoGoogle')
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
