<template>
  <div class="login-container">
    <v-card class="login-card pa-6">
      <v-card-title class="kanit-title text-center kanit-semibold mb-2 justify-center">
        กรอกข้อมูลผู้ใช้
      </v-card-title>
      <v-card-subtitle class="text-center">
        กรุณากรอกข้อมูลให้ครบถ้วน
      </v-card-subtitle>
      <v-form @submit.prevent="submitForm" ref="form">
        <v-text-field
          v-model="userName"
          label="ชื่อผู้ใช้"
          prepend-icon="mdi-account"
          outlined
          dense
          :rules="usernameRules"
          :error-messages="userNameErrors"
          required
          :class="{'red-border': userNameErrors.length > 0}"
        ></v-text-field>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="birthday"
              label="วันเกิด"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              outlined
              dense
              :rules="[birthdayRule]"
              :error-messages="birthdayErrors"
              required
            ></v-text-field>
          </template>
          <v-date-picker v-model="birthday" @input="menu = false"></v-date-picker>
        </v-menu>

        <v-btn
          @click="submitForm()"
          block
          color="#00276E"
          dark
          large
          class="mt-4 mb-2"
          prepend-icon="mdi-check"
          :loading="loading"
        >
          ยืนยัน
        </v-btn>
      </v-form>
      <v-snackbar
        v-model="snackbar"
        :timeout="timeout"
        :color="snackbarColor"
        top
      >
        {{ snackbarText }}
        <template v-slot:action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            ปิด
          </v-btn>
        </template>
      </v-snackbar>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      userName: '',
      menu: false,
      birthday: '',
      userId: null,
      userInfoGoogle: null,
      urlAPI: 'http://localhost:5001',
      loading: false,
      userNameErrors: [],
      birthdayErrors: [],
      snackbar: false,
      snackbarText: '',
      snackbarColor: '',
      timeout: 3000
    }
  },
  mounted () {
    this.userId = this.$route.params.uid
    this.getGoogleUserInfo()
  },
  computed: {
    usernameRules () {
      return [
        v => !!v || 'ชื่อผู้ใช้ห้ามว่าง',
        v => v.length >= 3 || 'ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร',
        v => this.validateUsername(v) || 'ชื่อผู้ใช้สามารถใช้เฉพาะภาษาอังกฤษ ตัวเลข และอักขระพิเศษ'
      ]
    },
    birthdayRule () {
      return v => !!v || 'วันเกิดห้ามว่าง'
    }
  },
  methods: {
    validateUsername (username) {
      // ตรวจสอบว่ามีเฉพาะภาษาอังกฤษ ตัวเลข และอักขระพิเศษ
      const regex = /^[A-Za-z0-9!@#$%^&*()_+={}:;"'<>,.?~`-]*$/ // ไม่มีการหลบที่ไม่จำเป็น
      return regex.test(username)
    },
    async submitForm () {
      this.userNameErrors = []
      this.birthdayErrors = []

      if (!this.userName) {
        this.userNameErrors.push('ชื่อผู้ใช้ห้ามว่าง')
      } else if (this.userName.length < 3) {
        this.userNameErrors.push('ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร')
      } else if (!this.validateUsername(this.userName)) {
        this.userNameErrors.push('ชื่อผู้ใช้สามารถใช้เฉพาะภาษาอังกฤษ ตัวเลข และอักขระพิเศษ')
      }

      if (!this.birthday) {
        this.birthdayErrors.push('วันเกิดห้ามว่าง')
      }

      if (this.userNameErrors.length || this.birthdayErrors.length) {
        return
      }
      const provider = JSON.parse(localStorage.getItem('userInfoGoogle'))
      console.log('providerLog', provider)
      const data = {
        name: provider.displayName,
        userName: this.userName,
        birthday: this.birthday,
        connectId: provider.uId,
        email: provider.email,
        uId: provider.uId,
        token: provider.accessToken,
        loginWith: 'Google',
        RECORD_STATUS: 'N',
        CREATE_DATE: new Date(),
        LAST_DATE: new Date()
      }
      this.loading = true
      console.log('dataLog', data)
      try {
        const res = await axios.post(`${this.urlAPI}/postMembers`, data)
        console.log('User data inserted successfully:', res)

        // แสดง snackbar แทน alert
        this.showSnackbar('กรอกข้อมูลเสร็จสิ้น ระบบกำลังพาท่านไปยังหน้า Dashboard', 'success')

        // หน่วงเวลาสักครู่ก่อนที่จะ redirect (เช่น 3 วินาที)
        setTimeout(() => {
          this.$router.push('/Message/test')
        }, 3000)
      } catch (error) {
        console.error('Error inserting user data:', error)
        this.showSnackbar('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง', 'error')
      } finally {
        this.loading = false
      }
    },
    showSnackbar (text, color = 'success') {
      this.snackbarText = text
      this.snackbarColor = color
      this.snackbar = true
    },
    getGoogleUserInfo () {
      this.userInfoGoogle = localStorage.getItem('wakimbooking_google_userinfo')
      console.log('getGoogleUserInfo', this.userInfoGoogle)
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('../../assets/BG2.png') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  background-position: center center;
  background-repeat: no-repeat;
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

.text-h,
.kanit-semibold {
  color: #00276e;
}

.red-border .v-input__control {
  border: 1px solid red;
}
</style>
