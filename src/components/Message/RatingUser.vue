<script>
import { auth } from '@/main'
import axios from 'axios'

export default {
  data () {
    return {
      isLoading: true,
      dialog: false, // สำหรับการควบคุมการแสดง Dialog
      selectedItem: {}, // สำหรับเก็บข้อมูลที่เลือกใน Dialog
      userPhotoURL: 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
      urlAPI: 'http://localhost:5005',
      userId: 'U9bc765fb4c3dd68fed8c409009cb5f32',
      shopId: '',
      showProfileMenu: false,
      activeTab: 'home',
      calendarEvents: [],
      user: {
        displayName: '',
        photoURL: '',
        email: ''
      },
      bottomNavItems: [
        { title: 'หน้าหลัก', icon: 'mdi-home', value: 'home' },
        { title: 'นัดหมาย', icon: 'mdi-calendar', value: 'appointments' },
        { title: 'บริการ', icon: 'mdi-content-cut', value: 'services' },
        { title: 'โปรไฟล์', icon: 'mdi-account', value: 'profile' }
      ],
      headers: [
        { text: 'วันที่', value: 'CREATE_DATE' },
        { text: 'ชื่อ', value: 'displayName' },
        { text: 'คะแนน', value: 'rating', sortable: false },
        { text: 'ความคิดเห็น', value: 'comment' },
        { text: '', value: 'actions', sortable: false }
      ],
      ratings: []
    }
  },
  created () {
    this.initializeData()
  },
  methods: {
    openDialog (item) {
      this.selectedItem = item
      this.dialog = true
    },
    viewDetails (item) {
      console.log('ดูรายละเอียดของ:', item)
    },
    async initializeData () {
      this.isLoading = true
      try {
        await this.getUserInfo()
        await this.fetchRatings()
      } catch (error) {
        console.error('Error initializing data:', error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchRatings () {
      // สมมุติว่า URL จะมีลักษณะประมาณนี้: http://localhost:8080/Message/rating?shopId=xxx
      const queryParams = this.$route.query // ดึง query parameters
      const shopId = queryParams.shopId // shopId
      const userId = 'U9bc765fb4c3dd68fed8c409009cb5f32' // กำหนด userId ที่ต้องการ

      try {
        const response = await axios.get(`${this.urlAPI}/rating/getByShopUser`, {
          params: {
            shopId: shopId,
            userId: userId
          }
        })
        if (Array.isArray(response.data)) {
          this.ratings = response.data
        } else {
          console.error('Response data is not iterable:', response.data)
        }
      } catch (error) {
        console.error('Error fetching ratings:', error)
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
        this.userPhotoURL = parsedUser.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?201503272035412'
      } else {
        const user = auth.currentUser
        if (user) {
          this.user = {
            displayName: user.displayName || 'User',
            email: user.email,
            photoURL: user.photoURL
          }
          this.userPhotoURL = user.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?201503272035412'
          localStorage.setItem('userInfoGoogle', JSON.stringify(this.user))
        } else {
          this.navigateToLogin()
        }
      }
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

<template>
    <v-app>
      <v-main>
        <!-- App Bar -->
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

        <!-- Profile Menu -->
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

        <!-- Main Content -->
        <v-container fluid>
          <v-row align="center">
            <v-col cols="auto">
              <v-btn @click="$router.go(-1)" icon >
                <v-icon style="font-size: 2rem; padding: 10px;">mdi-chevron-left</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-card-text class="mb-5 mt-4 h2 font-weight-bold" style="color: #303030;">My Rating</v-card-text>
            </v-col>
          </v-row>

          <!-- Spinner while loading -->
          <v-row justify="center" v-if="isLoading">
            <v-progress-circular indeterminate color="blue"></v-progress-circular>
          </v-row>

          <!-- Data Table -->
          <v-data-table v-else :headers="headers" :items="ratings" class="elevation-1">
            <template v-slot:item.displayName="slotProps">
              <v-layout align-center>
                <v-avatar size="32" class="mr-2">
                  <v-img :src="slotProps.item.pictureUrl" alt="Customer Photo" @error="() => handleImageError(slotProps.item)"></v-img>
                </v-avatar>
                <span>{{ slotProps.item.displayName }}</span>
              </v-layout>
            </template>

            <template v-slot:item.CREATE_DATE="slotProps">
              <span>{{ slotProps.item.CREATE_DATE }}</span>
            </template>

            <template v-slot:item.rating="slotProps">
              <v-icon v-for="star in 5" :key="star" :color="star <= slotProps.item.rating ? 'warning' : 'grey'">
                mdi-star
              </v-icon>
            </template>

            <template v-slot:item.comment="slotProps">
              <span>{{ slotProps.item.comment }}</span>
            </template>

            <!-- Actions with Dialog -->
            <template v-slot:item.actions="slotProps">
              <v-btn @click="openDialog(slotProps.item)" color="dark" outlined style="font-size: 0.8rem; padding: 5px 10px;">
                ดูรายละเอียด
              </v-btn>
            <!-- Dialog -->
          <v-dialog v-model="dialog" max-width="450px" style="border-radius: 0;">
            <v-card style="border-radius: 5px;">
                <!-- ปุ่มปิดด้านขวาบน -->
                <v-card-actions class="justify-end">
                    <v-btn icon @click="dialog = false">
                        <v-icon color="gray">mdi-close</v-icon>
                    </v-btn>
                </v-card-actions>

                <!-- หัวข้อการนัดหมาย -->
                <div class="text-center h3 font-weight-bold py-0">
                    รายละเอียดการนัดหมาย
                </div>

                <!-- ข้อมูลการนัดหมาย -->
                <v-card-text class="py-0">
                    <v-container class="pa-12"> <!-- เพิ่ม padding -->
                        <v-row>
                            <v-col class="py-1" cols="12" style="font-weight: bold; color: black;">
                                <v-icon color="#043873" left class="align-top">mdi-calendar</v-icon> <!-- ไอคอนวันที่ -->
                                <strong>วันที่นัดหมาย :</strong> 01 ส.ค.
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col class="py-1" cols="12" style="font-weight: bold; color: black;">
                                <v-icon color="#043873"  left class="align-top">mdi-swap-horizontal</v-icon> <!-- ไอคอนประเภทบริการ -->
                                <strong>ประเภทบริการ :</strong> คิว
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col class="py-1" cols="12" style="font-weight: bold; color: black;">
                                <v-icon color="#043873"  left class="align-top">mdi-map-marker</v-icon> <!-- ไอคอนสาขา -->
                                <strong>สาขา :</strong> นนทบุรี
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col class="py-1" cols="12">
                                <v-icon color="#043873"  left class="align-top">mdi-account</v-icon> <!-- ไอคอนชื่อ -->
                                <strong style="font-weight: bold; color: black;">ชื่อ :</strong>
                                <span style="font-weight: lighter; color: #1e1e1e;">Yaom</span>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col class="py-1" cols="12">
                                <v-icon color="#043873"  left class="align-top">mdi-phone</v-icon> <!-- ไอคอนเบอร์โทร -->
                                <strong style="font-weight: bold; color: black;">เบอร์โทร :</strong>
                                <span style="font-weight: lighter; color: #1e1e1e;">077-999-9999</span>
                            </v-col>
                        </v-row>

                        <!-- Divider แยกส่วนข้อมูล -->
                        <v-divider></v-divider>

                        <!-- คะแนนที่ได้รับ -->
                        <v-row>
                            <v-col class="py-1 mt-2" cols="12" style="font-weight: bold; color: black;">
                                <strong>คะแนนที่ได้</strong>
                            </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12" class="py-0">
                              พึงพอใจสถานที่เข้ารับบริการ
                          </v-col>
                          <v-col cols="12" class="py-0">
                              <v-rating value="5" color="warning" empty-icon-color="grey" dense readonly></v-rating>
                          </v-col>
                      </v-row>

                      <v-row>
                          <v-col cols="12" class="py-0">
                              พึงพอใจโดยรวม
                          </v-col>
                          <v-col cols="12" class="py-0">
                              <!-- แก้จาก error เป็น grey -->
                              <v-rating value="3" color="warning" empty-icon-color="grey" dense readonly></v-rating>
                          </v-col>
                      </v-row>

                      <v-row>
                          <v-col cols="12" class="py-0">
                              พึงพอใจการบริการ
                          </v-col>
                          <v-col cols="12" class="py-0">
                              <v-rating value="4" color="warning" empty-icon-color="grey" dense readonly></v-rating>
                          </v-col>
                      </v-row>

                      <v-row>
                          <v-col cols="12" class="py-1">
                              พึงพอใจในพนักงาน
                          </v-col>
                          <v-col cols="12" class="py-1">
                              <v-rating value="5" color="warning" empty-icon-color="grey" dense readonly></v-rating>
                          </v-col>
                      </v-row>

                      <v-row>
                          <v-col cols="12" class="py-1">
                              พึงพอใจการบริการหลังขาย
                          </v-col>
                          <v-col cols="12" class="py-1">
                              <v-rating value="5" color="warning" empty-icon-color="grey" dense readonly></v-rating>
                          </v-col>
                      </v-row>

                        <!-- ความคิดเห็นเพิ่มเติม -->
                        <v-row class="mt-4">
                            <v-col cols="12" class="py-2">
                                <v-icon color="#043873"  left>mdi-comment-text</v-icon> <!-- ไอคอนความคิดเห็น -->
                                <strong style="font-weight: bold; color: black;">ความคิดเห็นเพิ่มเติม :</strong>
                                <span style="font-weight: lighter; color: #1e1e1e;">sssss</span>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
            </template>
          </v-data-table>
        </v-container>
      </v-main>
    </v-app>
  </template>

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
