<template>
  <div class="login-container">
    <v-card class="login-card pa-6">
      <v-card-title class="kanit-title text-center kanit-semibold mb-2 justify-center">
        เข้าสู่ระบบ Wakimbooking
      </v-card-title>
      <v-card-subtitle class="text-center">
        ลงชื่อเข้าใช้บัญชีของคุณ
      </v-card-subtitle>

      <!-- แสดงแหล่งที่มาของ URL -->
      <v-alert v-if="urlSource" type="info" class="mb-4">
        คุณมาจาก: {{ urlSource }}
      </v-alert>

      <!-- แสดงฟอร์มล็อกอินเมื่อไม่ได้มาจาก Facebook หรือเข้า URL โดยตรง -->
      <v-form v-if="!showFacebookButton" ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="อีเมล"
          outlined
          dense
          required
          :error-messages="emailErrors"
        >
          <template v-slot:append>
            <div class="icon-container">
              <v-icon>mdi-email-outline</v-icon>
            </div>
          </template>
        </v-text-field>

        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="รหัสผ่าน"
          type="password"
          outlined
          dense
          required
          :error-messages="passwordErrors"
        >
          <template v-slot:append>
            <div class="icon-container">
              <v-icon>mdi-lock-outline</v-icon>
            </div>
          </template>
        </v-text-field>

        <v-btn type="submit" block color="#00276E" dark large class="mt-4 mb-2">
          เข้าสู่ระบบ
        </v-btn>
        <div class="text-right">
          <a href="#" color="#1E2772">ลืมรหัสผ่าน?</a>
        </div>
      </v-form>
      <div class="d-flex align-center my-4">
        <v-divider></v-divider>
        <span class="mx-2 grey--text text--darken-1">หรือ</span>
        <v-divider></v-divider>
      </div>
      <!-- แสดงปุ่ม Facebook เมื่อมีการส่ง URL มาจาก Facebook -->
      <v-btn
        v-if="showFacebookButton"
        block
        style="border-radius: 4px; font-size: 14px; height: 40px; background-color: rgb(26, 119, 242); color: rgb(255, 255, 255); display: flex; align-items: center; justify-content: center;"
        dark
        class="mb-3"
        @click="facebookAuth"
      >
        <v-icon left style="width: 20px; height: 20px; margin-right: 12px;">mdi-facebook</v-icon>
        ล็อกอินด้วย Facebook
      </v-btn>

      <!-- แสดงปุ่มล็อกอินอื่นๆ เมื่อไม่ได้มาจาก Facebook หรือเข้า URL โดยตรง -->
      <template v-if="!showFacebookButton">
        <v-btn
          block
          color="#FFFFFF"
          class="google-btn mb-3"
          @click="googleAuth()"
        >
          <img src="@/assets/download-icon-google+logo+new+icon-1320185797820629294_24.png" style="width: 20px; height: 20px; margin-right: 8px;" />
          ล็อกอินด้วย Google
        </v-btn>

        <v-btn
          block
          style="border-radius: 4px; font-size: 14px; height: 40px; background-color: rgb(26, 119, 242); color: rgb(255, 255, 255); display: flex; align-items: center; justify-content: center;"
          dark
          class="mb-3"
          @click="facebookAuth"
        >
          <v-icon left style="width: 20px; height: 20px; margin-right: 12px;">mdi-facebook</v-icon>
          ล็อกอินด้วย Facebook
        </v-btn>

        <v-btn
          block
          style="display: flex; align-items: center; justify-content: center; height: 40px; border-radius: 4px; background-color: #00B900; color: white;"
          @click="lineAuth"
        >
          <img
            src="@/assets/LineVector.png"
            style="width: 20px; height: 20px; margin-right: 12px;"
          />
          ล็อกอินด้วย LINE
        </v-btn>
      </template>

      <div class="text-center mt-6">
        คุณได้ลงทะเบียนแล้วหรือยัง? <a href="#" color="#1E2772">ลงทะเบียน!</a>
      </div>
    </v-card>
  </div>
</template>

<script>
import Vue from 'vue'
import VueSession from 'vue-session'
import 'firebase/auth'
import firebase from 'firebase'
import axios from 'axios'

Vue.use(VueSession)

export default {
  data () {
    return {
      load: '',
      email: '',
      password: '',
      emailRules: [
        v => !!v || 'อีเมลจำเป็น',
        v => /.+@.+\..+/.test(v) || 'อีเมลไม่ถูกต้อง'
      ],
      passwordRules: [
        v => !!v || 'รหัสผ่านจำเป็น',
        v => v.length >= 6 || 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
      ],
      emailErrors: [],
      passwordErrors: [],
      errorMessage: '',
      valid: false,
      loading: false,
      urlAPI: 'http://localhost:5005',
      showFacebookButton: false,
      urlSource: ''
    }
  },
  created () {
    this.checkLoginStatus()
    this.checkUrlSource()
  },
  methods: {
    checkUrlSource () {
      const urlParams = new URLSearchParams(window.location.search)
      const source = urlParams.get('source')

      if (source) {
        this.urlSource = source
        if (source.toLowerCase() === 'facebook') {
          this.showFacebookButton = true
        } else {
          this.showFacebookButton = false
        }
      } else {
        this.showFacebookButton = false
        this.urlSource = ''
      }
    },
    async checkLoginStatus () {
      try {
        const user = firebase.auth().currentUser
        if (user) {
          const uId = user.uid
          const response = await axios.get(`${this.urlAPI}/getMembers/${uId}`)
          const memberData = response.data

          if (Array.isArray(memberData) && memberData.length > 0) {
            const validMember = memberData.find(member => member.userName && member.birthday)
            if (validMember) {
              // เก็บข้อมูลผู้ใช้ใน localStorage
              localStorage.setItem('user', JSON.stringify({
                uId: user.uid,
                email: user.email,
                loginWith: this.getLoginProvider(user.providerData[0].providerId)
              }))
              // นำทางไปยังหน้า /Message/test
              this.$router.push({ path: '/Message/test' })
            } else {
              // ถ้าไม่มีข้อมูลที่สมบูรณ์ ให้นำทางไปยังหน้ากรอกข้อมูลเพิ่มเติม
              this.$router.push({ path: '/Message/UserForm', query: { uId: user.uid, email: user.email } })
            }
          } else {
            // ถ้าไม่มีข้อมูลสมาชิก ให้นำทางไปยังหน้ากรอกข้อมูลเพิ่มเติม
            this.$router.push({ path: '/Message/UserForm', query: { uId: user.uid, email: user.email } })
          }
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการตรวจสอบสถานะการล็อกอิน:', error)
        this.errorMessage = 'เกิดข้อผิดพลาดในการตรวจสอบสถานะการล็อกอิน'
      }
    },
    getLoginProvider (providerId) {
      switch (providerId) {
        case 'google.com':
          return 'Google'
        case 'facebook.com':
          return 'Facebook'
        case 'line.me':
          return 'Line'
        default:
          return 'Unknown'
      }
    },
    async handleAuth (provider, loginWith) {
      this.$session.start()
      try {
        let authProvider
        switch (provider) {
          case 'google':
            authProvider = new firebase.auth.GoogleAuthProvider()
            break
          case 'facebook':
            authProvider = new firebase.auth.FacebookAuthProvider()
            // เพิ่มขอบเขตการเข้าถึงที่ต้องการ
            authProvider.addScope('email')
            authProvider.addScope('public_profile')
            break
          case 'line':
            // สำหรับ Line อาจต้องใช้วิธีการเฉพาะ ตัวอย่างนี้เป็นเพียงตัวอย่างเท่านั้น
            authProvider = new firebase.auth.OAuthProvider('line.me')
            break
          default:
            throw new Error('ไม่รองรับผู้ให้บริการนี้')
        }

        const result = await firebase.auth().signInWithPopup(authProvider)
        const user = result.user
        const uId = user.uid
        const email = user.email
        const displayName = user.displayName
        const accessToken = result.credential.accessToken
        const shopId = 'U63f4a14fe78b8bf8414c1d197e432954'

        // เพิ่มการบันทึกข้อมูลลงใน localStorage
        localStorage.setItem('user', JSON.stringify({
          uId,
          email,
          displayName,
          accessToken,
          loginWith,
          shopId
        }))

        const response = await axios.get(`${this.urlAPI}/getMembers/${uId}`)
        const memberData = response.data

        const commonParams = { shopId, uId, loginWith }

        if (Array.isArray(memberData) && memberData.length > 0) {
          const validMember = memberData.find(member => member.userName !== null && member.birthday !== null)

          if (validMember) {
            console.log('Redirecting to /Message/test')
            this.$router.push({ path: '/Message/test', query: commonParams })
          } else {
            console.log('Redirecting to /Message/UserForm')
            this.$router.push({ path: '/Message/UserForm', query: { ...commonParams, displayName } })
          }
        } else {
          console.log('Redirecting to /Message/UserForm')
          this.$router.push({ path: '/Message/UserForm', query: { ...commonParams, displayName } })
        }
      } catch (error) {
        console.error(`Error during ${loginWith} login or fetching member data:`, error)
        this.errorMessage = 'เกิดข้อผิดพลาดในการล็อกอิน'
      }
    },
    async googleAuth () {
      const provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('profile')
      provider.addScope('email')

      try {
        const result = await firebase.auth().signInWithPopup(provider)
        console.log('Google sign-in result:', result)

        if (result.user) {
          const user = result.user
          const uId = user.uid
          const email = user.email
          const displayName = user.displayName
          const photoURL = user.photoURL || ''
          const accessToken = result.credential.accessToken
          const shopId = 'U63f4a14fe78b8bf8414c1d197e432954' // เพิ่มค่า shopId ตรงนี้

          // บันทึกข้อมูลลงใน localStorage
          localStorage.setItem('userInfoGoogle', JSON.stringify({
            uId,
            email,
            displayName,
            photoURL,
            accessToken,
            loginWith: 'Google',
            shopId // บันทึก shopId ใน localStorage
          }))

          // เพิ่ม shopId ใน query parameters เมื่อ redirect
          this.$router.push({
            path: '/Message/test',
            query: {
              shopId,
              uId,
              loginWith: 'Google' // เพิ่มค่า shopId ที่นี่
            }
          })
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการล็อกอิน Google:', error)
        this.errorMessage = 'เกิดข้อผิดพลาดในการล็อกอิน Google'
      }
    },
    // เพิ่มฟังก์ชัน checkMemberDataAndRedirect ที่นี่
    async checkMemberDataAndRedirect (uId, loginWith, displayName) {
      try {
        const response = await axios.get(`${this.urlAPI}/getMembers/${uId}`)
        const memberData = response.data

        console.log('Member data:', memberData) // เพิ่ม log เพื่อตรวจสอบข้อมูลที่ได้รับ

        const commonParams = { uId, loginWith }

        if (Array.isArray(memberData) && memberData.length > 0) {
          const validMember = memberData.find(member => member.userName && member.birthday)

          if (validMember) {
            console.log('Valid member found, redirecting to /Message/test')
            this.navigateTo('/Message/test', commonParams)
          } else {
            console.log('No valid member found, redirecting to /Message/UserForm')
            this.navigateTo('/Message/UserForm', { ...commonParams, displayName })
          }
        } else {
          console.log('No member data found, redirecting to /Message/UserForm')
          this.navigateTo('/Message/UserForm', { ...commonParams, displayName })
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการตรวจสอบข้อมูลสมาชิก:', error)
        this.errorMessage = 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูลสมาชิก'
      }
    },

    navigateTo (path, query) {
      if (this.$route.path !== path) {
        this.$router.push({ path, query }).catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            throw err
          }
        })
      }
    },

    facebookAuth () {
      this.handleAuth('facebook', 'Facebook')
    },

    lineAuth () {
      this.handleAuth('line', 'Line')
    },

    // เพิ่มเมธอดใหม่สำหรับการล็อกเอาท์
    logout () {
      localStorage.removeItem('user')
      // ทำการล็อกเอาท์จาก Firebase ด้วย
      firebase.auth().signOut()
      // นำผู้ใช้กลับไปยังหน้าล็อกอิน
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('../../assets/BG2.png') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
}

.login-card {
  max-width: 400px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.v-btn {
  text-transform: none;
  font-weight: 500;
}

.text-h, .kanit-semibold {
  color: #00276e;
}

.google-btn {
  border: 1px solid #ccc;
}
</style>
