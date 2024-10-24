<template>
  <v-app>
    <v-main>
      <v-app-bar flat class="app-bar" dark>
        <v-toolbar-title class="text-button font-weight-bold">
          <span style="color: #FBBC05;">WAKIM</span><span>BOOKING</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="text-right" style="margin-right: 10px;">
          <div class="text-subtitle-2 font-weight-medium"> {{ user.displayName }}</div>
        </div>
        <v-badge
        overlap
        color="success"
        dot
        offset-x="12"
        offset-y="40"
      >
        <v-avatar size="42">
          <v-img :src="userPhotoURL" alt="User Profile" @error="userPhotoURL = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'"></v-img>
        </v-avatar>
      </v-badge>
        <v-btn icon @click="showProfileMenu = !showProfileMenu">
          <v-icon>mdi-menu-down</v-icon>
        </v-btn>
      </v-app-bar>

      <div class="menu " v-if="showProfileMenu === true" :close-on-content-click="false">
        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon left>mdi-account</v-icon>
                  <span>{{ user.displayName }}</span>
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-icon left>mdi-email</v-icon>
                  <span>{{ user.email }}</span>
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
            <v-card-text class="text-h5 mb-4 mt-4 h2 font-weight-bold" style="color: #333333;">โปรไฟล์</v-card-text>
          </v-col>
        </v-row>
        <v-row justify="center" class="mt-8">
          <v-card
            class="mx-auto elevation-3"
            outlined
            max-width="800"
            style="padding: 40px; border-radius: 16px; background-color: #f9f9f9;"
          >
            <v-skeleton-loader v-if="isLoading" class="mx-auto" type="card" height="300" />
            <v-card-title class="text-h5 justify-center" v-else>
              <v-img
                :src="user.photoURL"
                max-width="120"
                max-height="120"
                class="mr-3 mb-4 rounded-circle"
                contain
                @error="handleImageError1"
              ></v-img>
            </v-card-title>
            <v-card-text v-if="!isLoading">
              <v-form>
                <v-text-field
                  v-model="user.displayName"
                  label="Display Name"
                  disabled
                  outlined
                  style="margin-bottom: 16px;"
                  prepend-icon="mdi-account"
                  :rules="[(v) => !!v || 'Display Name is required']"
                  color="#0765b0"
                ></v-text-field>
                <v-text-field
                  v-model="user.email"
                  label="Email"
                  disabled
                  outlined
                  style="margin-bottom: 16px;"
                  prepend-icon="mdi-email"
                  :rules="[(v) => !!v || 'Email is required']"
                  color="#0765b0"
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
