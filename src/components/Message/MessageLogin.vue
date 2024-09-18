<template>
  <div class="login-container">
    <v-card class="login-card pa-6">
      <v-card-title class="kanit-title text-center kanit-semibold mb-2 justify-center">
        เข้าสู่ระบบ Wakimbooking
      </v-card-title>
      <v-card-subtitle class="text-center">
        ลงชื่อเข้าใช้บัญชีของคุณ
      </v-card-subtitle>
      <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="login">
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

        <v-alert v-if="errorMessage" type="error" dismissible>
          {{ errorMessage }}
        </v-alert>

        <v-btn type="submit" block color="#00276E" dark large class="mt-4 mb-2">
          เข้าสู่ระบบ
        </v-btn>
        <div class="text-right">
          <a href="#" color="#1E2772">ลืมรหัสผ่าน?</a>
        </div>

        <div class="d-flex align-center my-4">
          <v-divider></v-divider>
          <span class="mx-2 grey--text text--darken-1">หรือ</span>
          <v-divider></v-divider>
        </div>

        <v-btn
          block
          color="#FFFFFF"
          class="google-btn mb-3"
          @click="loginWithGoogle"
        >
          <img src="@/assets/download-icon-google+logo+new+icon-1320185797820629294_24.png" style="width: 20px; height: 20px; margin-right: 8px;" />
          ล็อกอินด้วย Google
        </v-btn>

        <v-btn
          block
          style="border-radius: 4px; font-size: 14px; height: 40px; background-color: rgb(26, 119, 242); color: rgb(255, 255, 255); display: flex; align-items: center; justify-content: center;"
          dark
          class="mb-3"
        >
          <v-icon left style="width: 20px; height: 20px; margin-right: 12px;">mdi-facebook</v-icon>
          ล็อกอินด้วย Facebook
        </v-btn>

        <v-btn
          block
          color="#06C755"
          dark
          style="display: flex; align-items: center; justify-content: center; height: 40px; border-radius: 4px;"
        >
          <img
            src="@/assets/LineVector.png"
            style="width: 20px; height: 20px; margin-right: 12px;"
          />
          ล็อกอินด้วย LINE
        </v-btn>

        <div class="text-center mt-6">
          คุณได้ลงทะเบียนแล้วหรือยัง? <a href="#" color="#1E2772">ลงทะเบียน!</a>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import Vue from 'vue'
import VueSession from 'vue-session'
import firebase from 'firebase/app'
import 'firebase/auth'
import { auth } from '../../main'

Vue.use(VueSession)

export default {
  data () {
    return {
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
      loading: false
    }
  },
  methods: {
    async login () {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const userCredential = await auth.signInWithEmailAndPassword(this.email, this.password)
          await this.setUserData(userCredential.user)
          this.$router.push('/message/test')
        } catch (error) {
          console.error('Login Error:', error)
          this.errorMessage = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
        } finally {
          this.loading = false
        }
      }
    },
    async loginWithGoogle () {
      this.loading = true
      const provider = new firebase.auth.GoogleAuthProvider()
      try {
        await auth.signInWithRedirect(provider)
      } catch (error) {
        console.error('Google Login Error:', error)
        this.errorMessage = 'เกิดข้อผิดพลาดในการล็อกอินด้วย Google'
        this.loading = false
      }
    },
    async handleRedirectResult () {
      try {
        const result = await auth.getRedirectResult()
        if (result.user) {
          await this.setUserData(result.user)
          this.$router.push('/message/test')
        }
      } catch (error) {
        console.error('Redirect Result Error:', error)
        this.errorMessage = 'เกิดข้อผิดพลาดในการล็อกอินด้วย Google'
      } finally {
        this.loading = false
      }
    },
    setUserData (user) {
      return new Promise((resolve) => {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }
        this.$session.set('user', userData)
        localStorage.setItem('user', JSON.stringify(userData))
        resolve()
      })
    },
    checkSessionOrStorage () {
      const sessionUser = this.$session.get('user')
      const storedUser = JSON.parse(localStorage.getItem('user'))

      if (sessionUser || storedUser) {
        this.$router.push('/message/test')
      }
    },
    clearError () {
      this.errorMessage = ''
    },
    setupAuthStateListener () {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          await this.setUserData(user)
          this.$router.push('/message/test')
        }
      })
    }
  },
  created () {
    this.checkSessionOrStorage()
    this.setupAuthStateListener()
  },
  mounted () {
    this.handleRedirectResult()
  },
  watch: {
    email () {
      this.clearError()
    },
    password () {
      this.clearError()
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
