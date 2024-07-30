<template>
  <div>
    <v-container>
      <v-form>
        <!-- <div class="dialog-load">
          <div class="load-gif"></div>
        </div> -->
        <div align="center" class="rowcustom magin-card" style="display: block;">
          <div class="card_photo">
            <div class="img_photo">
          </div>
        </div>
        </div>
        <div class="rowcustom card-bt-br30" style="filter: drop-shadow(2px 4px 6px #bbbbbb);">
          <!-- <img src="../../assets/PhotoMessage/vecteezy_3d-set-of-bell-reminder-notification-// alert-or-alarm_9847894_318.png" class="img-iconc"> -->
          <div class="" align="center">
            <h3 class="form-signin padding-title bold color-white">
              SIGN IN
            </h3>
            <!-- <p>userInfoFacebook=  {{ userInfoFacebook }}</p> -->
            <!-- <p>userInfoGoogle=  {{userInfoGoogle }}</p> -->
            <div class="form-signin">
              <v-text-field
                class="br-10"
                solo
                label="User or Phone">
              </v-text-field>
            </div>
            <div class="form-signin">
              <v-text-field
                class="br-10"
                solo
                label="User or Phone">
              </v-text-field>
              <div align="right" style="margin: 0px 0px 30px;">
                <span class="color-white signUp">forgot password?</span>
              </div>
            </div>
            <div class="form-signin">
              <v-btn class="br-10 bgcolor-red-pst color-white bold" block large>SIGN IN</v-btn>
            </div>
            <div align="center" class="pa-7 form-signin">
              <span class="color-white text-decoration-underline signUp">sign up</span>
            </div>
          </div>
        </div>
        <div align="center" class="color-gray pt-5 pd-bt-15">
          social sign in
        </div>
        <div v-if="load !== 'Click'" class="rowcustom">
          <div align="center" @click="googleAuth()" class="google-login-button" style="display: none;">
            <div class="center magin-card card-social color-black">
              <img src="../../assets/PhotoMessage/google-icone-symbole-png-logo-rouge.png" heigth="25" width="25"
                class="img-icon">
              <div class="bold-opacity color-white">Sign In With Gmail</div>
            </div>
          </div>
          <div align="center" @click="facebookAuth()">
            <div class=" center magin-card card-social">
              <img src="../../assets/PhotoMessage/facebook (1).png" heigth="25" width="25" class="img-icon">
              <div class="bold-opacity">Sign In With Facebook</div>
            </div>
          </div>
        </div>
        <div v-else class="rowcustom">
          <div class="center">กรุณา รอสักครู่</div>
          <div class="center">please wait ...</div>
          <div class="load-gif"></div>
        </div>
      </v-form>
    </v-container>
    <v-overlay v-if="registUser !== false" style="z-index: 1;" :opacity="80" ></v-overlay>
    <transition name="slide">
       <div v-if="registUser !== false" class="card-edit-address">
         <div class="center" style="padding-top: 1rem;">
          <div class="hr-top"></div>
         </div>
         <div >
         <div class="space-between">
           <h5 style="color:#000;font-weight: bold;"></h5>
           <div class="ml-6 bold close-paper-btn" @click="regist_user(false, 'EDIT')">
             <v-icon color="#000">mdi-close</v-icon>
           </div>
           </div>
         </div>
         <div class="container-m">
         <h5 style="color:#000;font-weight: bold;padding-bottom: 2rem;">สมัคร BELINK</h5>
         </div>
         <v-form ref="form" lazy-validation>
           <div class="container-m">
            <div class="form-user-regist">
               <div class="py-0">
                 <v-text-field
                   prepend-icon="mdi-account"
                   v-model="user"
                   label="กรอก USER"
                   outlined
                   dense
                   required
                 ></v-text-field>
               </div>
            </div>
            </div>
           <div class="container-m">
            <div class="form-user-regist">
               <div class="py-0">
                <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="auto"
                outlined
                   dense
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    label="เลือก วันเกิด"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                   dense
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="menu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu.save(date)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
               </div>
            </div>
            </div>
            <div class="container-m">
            <div class="form-user-regist" align="center">
               <v-btn
                 @click="InsertUid(eventBTN)"
                 class="py-0"
                 rounded
                 color="#0088ff9e"
                 dark
                 submit
                 :loading="loading"
                 :disabled="loading"
               >
               {{eventBTN === 'Google' ? 'Sign Up With Google' : 'Sign Up With FaceBook'}}
               </v-btn>
            </div>
           </div>
         </v-form>
       </div>
     </transition>
    </div>
</template>
<script>
import Vue from 'vue'
import VueSession from 'vue-session'
import axios from 'axios'
import firebase from 'firebase'
Vue.use(VueSession)

export default {
  components: {
    // GoogleSigninButton
  },
  data () {
    return {
      data: '',
      selectedLine: true,
      selectedFacebook: true,
      selectedEmail: true,
      selectedSMS: true,
      userInfo: null,
      userInfoFacebook: null,
      userInfoGoogle: null,
      registUser: false,
      loading: false,
      user: '',
      providerGoogle: null,
      providerFacebook: null,
      eventBTN: '',
      date: '',
      // date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
      redirect: '',
      source: '',
      shopId: '',
      typeSocaillogin: '',
      load: ''
    }
  },
  async mounted () {
    try {
      await this.cheklogin()
      // firebase.auth().signInWithRedirect(provider)
      const queryString = decodeURIComponent(window.location.search)
      const params = new URLSearchParams(queryString)
      this.redirect = params.get('redirect')
      this.source = params.get('source')
      this.shopId = params.get('shopId')
      localStorage.setItem('shopId', this.shopId)
      window.fbAsyncInit = function () {
      // eslint-disable-next-line no-undef
        FB.init({
          appId: '237505309262020',
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v18.0'
        })
      };

      (function (d, s, id) {
      // eslint-disable-next-line one-var
        var js, fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) {
          return
        }
        js = d.createElement(s)
        js.id = id
        js.src = 'https://connect.facebook.net/en_US/sdk.js'
        fjs.parentNode.insertBefore(js, fjs)
      })(document, 'script', 'facebook-jssdk')

      // await this.cheklogin()
    } catch (error) {
      console.error('Error during fetching user data:', error)
    }
  },
  methods: {
    async cheklogin () {
      console.log('cheklogin')
      if (localStorage.getItem('providerGoogle') === 'Click') {
        this.load = localStorage.getItem('providerGoogle')
        console.log('Log in google plase')
        if (!localStorage.getItem('userInfoGoogle')) {
          firebase.auth().getRedirectResult().then(async result => {
            if (result.credential) {
              await localStorage.setItem('userInfoGoogle', JSON.stringify(result.user))
              this.userInfoGoogle = result.user
              await this.getMember(this.userInfoGoogle.providerData[0].uid, 'Google')
            }
          }).catch((error) => {
            console.log('error เข้าไม่ได้', error)
          })
        } else {
          this.userInfoGoogle = await JSON.parse(localStorage.getItem('userInfoGoogle'))
          console.log('else', this.userInfoGoogle.providerData[0].uid)
          await this.getMember(this.userInfoGoogle.providerData[0].uid, 'Google')
        }
      }
      if (localStorage.getItem('providerFacebook') === 'Click') {
        this.load = localStorage.getItem('providerGoogle')
        console.log('Log in facebook plase')
        if (!localStorage.getItem('userInfoFacebook')) {
          firebase.auth().getRedirectResult().then(async result => {
            if (result.credential) {
              await localStorage.setItem('userInfoFacebook', JSON.stringify(result.user))
              this.userInfoFacebook = result.user
              await this.getMember(this.userInfoFacebook.providerData[0].uid, 'Facebook')
            }
          }).catch((error) => {
            console.log('error เข้าไม่ได้', error)
          })
        } else {
          this.userInfoFacebook = await JSON.parse(localStorage.getItem('userInfoFacebook'))
          console.log('else', this.userInfoFacebook.providerData[0].uid)
          await this.getMember(this.userInfoFacebook.providerData[0].uid, 'Facebook')
        }
      }
      // } else if (checkFacebook === '') {
      // console.log('check', checkFacebook)
      // if (localStorage.getItem('providerFacebook') === 'Click') {
      //   console.log('Log in facebook plase')
      //   if (checkFacebook === null) {
      //     firebase.auth().getRedirectResult().then(async result => {
      //       if (result.credential) {
      //         await localStorage.setItem('userInfoFacebook', JSON.stringify(result.user))
      //         this.userInfoFacebook = result.user
      //         await this.getMember(this.userInfoFacebook.providerData[0].uid, 'Facebook')
      //       }
      //     }).catch((error) => {
      //       console.log('error เข้าไม่ได้', error)
      //     })
      //   }
      // } else {
      //   this.userInfoFacebook = localStorage.getItem('userInfoFacebook')
      //   this.getMember(this.userInfoFacebook.providerData[0].uid, 'Facebook')
      // }
      // }
    },
    async Clearsession (typeclear) {
      if (typeclear === 'Google') {
        localStorage.removeItem('providerFacebook')
      } else {
        localStorage.removeItem('providerGoogle')
      }
    },
    async googleAuth () {
      try {
        this.source = 'Google'
        console.log('this.source', this.source)
        this.typeSocaillogin = 'Google'
        await this.Clearsession(this.typeSocaillogin)
        this.providerGoogle = new firebase.auth.GoogleAuthProvider()
        localStorage.setItem('providerGoogle', 'Click')
        console.log('provider', this.providerGoogle)
        let data = firebase.auth().signInWithRedirect(this.providerGoogle)
        localStorage.setItem('userInfoGoogle', JSON.stringify(data))
        localStorage.setItem('shopId', this.shopId)
        // await this.cheklogin()
      } catch (error) {
        console.log('error', error)
      }
    },
    async facebookAuth () {
      try {
        this.source = 'Facebook'
        console.log('this.source', this.source)
        this.typeSocaillogin = 'Facebook'
        await this.Clearsession(this.typeSocaillogin)
        this.providerFacebook = new firebase.auth.FacebookAuthProvider()
        localStorage.setItem('providerFacebook', 'Click')
        console.log('provider', this.providerFacebook)
        let data = firebase.auth().signInWithRedirect(this.providerFacebook)
        localStorage.setItem('userInfoFacebook', JSON.stringify(data))
        localStorage.setItem('shopId', this.shopId)
        // await this.cheklogin()
      } catch (error) {
        console.log('error', error)
      }
    },
    sendMessage (data) {
      // สร้าง URL สำหรับ Messenger ที่มีข้อความต้อนรับ
      // const pageId = '110743157238372' // ระบุ ID ของเพจของคุณ
      // const pageAccessToken = 'EAADYAoOXQMQBOxHflrJBD999YmcnvYl0pjL7rjsXxLxxWn7MSa3eHvFMtyKyDzZAT7JZBBvwJMksksYvarxTbhn6FYhYQVIOURSY6QNZCHBQBcy6bU0mZCLYq5YdZAlmwr6WKq6DyvIDNESsZBauDujn5blt6mWxhmmZC2eDwDEZBXamUnAfRNUgJP96gcQgaAYROyPdqkZBoaNKZCDTvWdOBX6rdT' // ใส่ Page Access Token ของคุณที่นี่
      // const welcomeMessage = `ลูกค้า FBID: ${data.id} เปิดแจ้งเตือนผ่าน Messenger`

      // const messengerUrl = `https://www.messenger.com/t/${pageId}?ref=${pageId}&text=${encodeURIComponent(welcomeMessage)}`

      // ส่งผู้ใช้ไปยัง Messenger ด้วย URL
      // window.location.href = messengerUrl
      // window.open(messengerUrl, '_blank')
      // const interval = setInterval(() => {
      //   if (window.location.pathname !== '/t/') {
      //     const pathSegments = window.location.pathname.split('/')
      //     const receivedPSID = pathSegments[2] // PSID จะอยู่ในตำแหน่งที่ 2 ของ URL path
      //     if (receivedPSID) {
      //       this.PSID = receivedPSID
      //       // eslint-disable-next-line no-undef
      //       commit('SET_PSID', data.id)
      //       clearInterval(interval)
      //     }
      //   }
      // }, 1000)
    },
    regist_user (status, events) {
      this.registUser = status
    },
    emailClick () {
      if (this.selectedEmail === true) {
        window.location.href = 'https://www.google.com/?&bih=963&biw=1920&rlz=1C5CHFA_enTH1056TH1056&hl=en'
        console.log('Double-clicked!')
      } else {
        console.log('Double-click functionality disabled because selectedLine is false.')
      }
    },
    smsClick () {
      if (this.selectedSMS === true) {
        window.location.href = 'https://www.google.com/?&bih=963&biw=1920&rlz=1C5CHFA_enTH1056TH1056&hl=en'
        console.log('Double-clicked!')
      } else {
        console.log('Double-click functionality disabled because selectedLine is false.')
      }
    },
    updateStatus () {
      console.log('update')
    },
    async getMember (account, social, type) {
      console.log('response', account)
      await axios.get(this.DNS_IP + `/getMembers/${account}`)
        .then(async (response) => {
          console.log('response', response)
          if (response.data.message !== 'No data found') {
            console.log('responseIf', response)
            if (this.shopId !== null && this.source !== null) {
              console.log('(this.shopId !== null && this.source !== null', this.shopId)
              this.$router.push(`/MessageLogin?shopId=${this.shopId}&source=${this.source}&uuid=${account}`)
            } else {
              this.$router.push(`/MessageLogin?shopId=${this.shopId}&source=${this.source}&uuid=${account}`)
            }
          } else {
            console.log('responseelse', response)
            console.log('this.userInfoGoogle', this.userInfoGoogle)
            this.account = account
            this.registUser = true
            this.eventBTN = social
            this.user = this.userInfoGoogle.providerData[0].displayName
          }
        }).catch((error) => {
          console.log(error)
        })
    },
    async InsertUid (social) {
      let data = {}
      if (social === 'Google') {
        data = {
          connectId: this.userInfoGoogle.providerData[0].uid,
          name: this.userInfoGoogle.providerData[0].displayName,
          // uId: this.userInfoGoogle.uid,
          userName: this.user,
          birthday: this.date,
          loginWith: social,
          // email: this.userInfoGoogle.providerData[0].email,
          token: this.userInfoGoogle.apiKey
        }
      } else {
        data = {
          connectId: this.userInfoFacebook.providerData[0].uid,
          name: this.userInfoFacebook.providerData[0].displayName,
          userName: this.user,
          birthday: this.date,
          loginWith: social,
          token: this.userInfoFacebook.stsTokenManager.apiKey
        }
      }

      this.source = social
      await axios
        .post(
          this.DNS_IP + `/postMembers`, data
        )
        .then(async (response) => {
          if (!response) {
            console.log('No Data')
          } else {
            console.log('response Post Member', response)
            this.registUser = false
            if (response.statusText === 'OK') {
              this.$router.push(`/MessageLogin?shopId=${this.shopId}&source=${this.source}&uuid=${this.account}`)
            } else {
              this.$router.push(`/MessageLogin?shopId=${this.shopId}&source=${this.source}&uuid=${this.account}`)
            }
          }
        }).catch(() => {})
    }
  }
}
</script>
<style scoped>
.card_photo{
  max-width: 600px;
  height: 200px !important;
  margin: 0px 0px 0 0px;
  overflow: hidden;
  border-radius: 10px !important;
}
.img_photo{
  object-fit: cover;
  width: 100%;
  height: -webkit-fill-available;
  height: inherit;
  background-repeat: no-repeat;
  background: url('https://i.pinimg.com/736x/8a/c6/2f/8ac62f0662474440cf73e237b4fd1ab6.jpg') no-repeat top center;
}
.signUp:hover {
  color: #ffffffbb;
  cursor: pointer;
}

.br-10 {
  border-radius: 5px;
}

.padding-text-field {
  padding: 20px 60px;
}

.pd-bt-15 {
  padding: 0px 0px 15px 0px;
}

.container {
  padding: 0px !important;
}

.card-bt-br30 {
  background-color: #352390;
  padding: 40px 0px 40px 0px;
  border-radius: 0 0 30px 30px;
  margin-bottom: 30px;
  display: none !important;
}

.col-sm-12 {
  padding: 0px !important;
}

.card-social {
  padding: 15px !important;
  border: solid 1px #91919199;
  border-radius: 5px;
  /* min-width: 330px !important; */
  margin: 10px 35px !important;
  max-width: 335px;
}

.card-social:hover {
  filter: opacity(75%);
  cursor: pointer;
  background-color: #6f6f6f65;
}

.form-signin {
  /* min-width: 300px !important; */
  /* margin: 1px 35px !important; */
  max-width: 335px;
}
.form-user-regist {
  /* min-width: 300px !important; */
  margin: 1px 35px !important;
  max-width: 335px;
}
.container-m{
  padding-top: 10px ;
  display: flex;
  justify-content: center;
  align-items: baseline;
}

.color-black {
  background-color: #000000c9;
}

.color-white {
  color: #fff;
}

.color-gray {
  color: #b4b4b4 !important;
}

.bgcolor-red-pst {
  background-color: #ed4d4d !important;
}

.rowcustom {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: column;
}

.filter {
  filter: drop-shadow(2px 2px 2px #d6d6d6);
}

.magin-card {
  margin: 5px;
  width: auto;
  padding: 10px;
}

.center {
  display: flex !important;
  align-items: center !important;
}

.bold-opacity {
  font-weight: bold;
  padding-left: 20px;
}

.padding-title {
  padding: 40px 0px 40px 0px;
  text-align: center;
}

.bold {
  font-weight: bold;
}

.img-icon {
  max-width: 18%;
  /* filter: drop-shadow(2px 2px 3px #7d7e81a6); */
}

.img-iconc {
  max-width: 150px;
  /* filter: drop-shadow(2px 2px 3px #7d7e81a6); */
}

.v-sheet.v-card {
  cursor: pointer;
  border-radius: 5px;
  padding: 15px;
}

.v-sheet.v-card:hover {
  transform: scale(1.01);
}

.img-icon:hover {
  transform: scale(1.03);
}

.v-text-field .v-input__control,
.v-text-field .v-input__slot,
.v-text-field fieldset {
  border-radius: 5px;
}

v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)>.v-input__control>.v-input__slot {
  filter: drop-shadow(2px 4px 4px #221564);
}
@media screen and (min-width: 600px) {
  .width-slide {
    min-width: 36.5rem;
  }
}
@media screen and (max-width: 599px) {
  .width-slide {
    min-width: 100vw;
  }
}
@media screen and (max-width: 400px) {
  .btn-center {
    display: flex;
    justify-content: center !important;
    flex-wrap: wrap;
    align-items: baseline;
  }
  .btn-process {
    margin: 5px;
    width: 90vw;
  }
}
.btn-center {
  display: flex;
  justify-content: space-between;
  lign-items: baseline;
}
@media screen and (min-width: 655px) {
  .hide-close {
    display: block;
  }
  .hide-close-mobile {
    display: none;
  }
}
@media screen and (max-width: 656px) {
  .hide-close {
    display: none;
  }
  .hide-close-mobile {
    display: block;
  }
}
.center {
  display: flex;
  justify-content: center;
}
.end {
  display: flex;
  justify-content: end;
  padding: 1rem;
}
.space-between {
  display: flex;
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: space-between;
  padding: 0 1rem;
  align-items: stretch;
  align-items: baseline;
}
.tipEx  {
  color: #fff;
  background-color: #2c2a28a1;
  width: fit-content;
  padding: 1px 7px;
  border-radius: 50%;
  font-size: 10px;
}
.bold {
  font-weight: bold;
}
.slide-enter,
.slide-leave-active {
  right: -100%;
}
.cus-slidein {
  padding: 1rem 1rem;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  align-items: center;
  height: 2rem;
  margin: 0px;
}
.flex-start {
  display: ruby-text;
  padding: 0.5rem 2rem;
  color: #858585 !important;
}
.flex-row {
  display: flex;
  gap: 0px;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap !important;
  justify-content: space-between;
  padding: 0.5rem 2rem;
  color: #858585 !important;
}
.label-name {
  flex: 1 0 140px;
}
.label-name-ex {
  color: hsl(0, 86%, 67%);
}
.label-address {
  padding: 0.5rem;
  color: hsl(0, 0%, 49%);
  background-color: #e4e4e4;
  border-radius: 5px;
  padding: 1rem;
  box-shadow: 1px 1px 10px #ffffff;
}
.label-address:hover {
  cursor: pointer;
  background: #acafd137;
  border-radius: 5px;
  transition: all 0.5s ease-in-out;
}
.hide-address {
  display: none;
  opacity: 0;
  transition: all 0.5s ease-in-out;
}
.show {
  display: block !important;
  transition: all 0.5s ease-in-out;
  opacity: 1;
}
hr {
  margin: 0px !important;
}
.label-price-chidname {
  flex: 1 0 120px;
  color: #4a4a4a;
  font-weight: bolder;
  text-align: end;
}
@media screen and (max-width: 895px) {
  .label-price-chidname {
    text-align: start !important;
  }
}

.btn-delete {
  /* background-color: red; */
  color: #ffffff;
  padding: 1rem;
  margin: 0rem;
}
.label {
  /* min-width: 300px; */
  padding: 2rem;
  color: #858585 !important;
}
.label-price {
  width: 200px;
  padding: 2rem;
  text-align: end;
  color: #4a4a4a;
  font-weight: bolder;
}
.order :hover {
  cursor: pointer;
  filter: drop-shadow(1px 1px 1px #d2d2d2);
}
.close-btn {
  padding: 9px 5px;
  border-radius: 49px;
}
.close-btn:hover {
  background-color: #ffffff95;
  transform: scale(1.5);
  padding: 5px 5px;
}
.close-btn > .mdi-close::before {
  color: #ffffff;
}
.close-btn:hover > .mdi-close::before {
  color: #000;
}
.close-paper-btn {
  padding: 9px 5px;
  border-radius: 49px;
  width: fit-content;
}
.close-paper-btn:hover {
  background-color: #ffffff95;
  padding: 5px 5px;
  cursor: pointer;
}
.close-paper-btn:hover > .mdi-close::before {
  padding: 5px 5px;
  width: fit-content;
  color: #000;
  cursor: pointer;
}

.btn-absolute {
  position: absolute;
  left: -80px;
  top: 10px;
}
.title {
  color: #ffffff;
  background-color: #0088ff9e;
  padding: 10px 15px;
  margin: 10px 20px 10px 0px;
  border-radius: 20px;
  width: fit-content;
  font-weight: bold;
  cursor: pointer;
}
.close {
  color: #cf5151;
  background-color: #fff;
  padding: 10px 15px;
  margin: 10px 20px 10px 0px;
  border-radius: 20px;
  width: fit-content;
  font-weight: bold;
  cursor: pointer;
}
.div-border {
  padding: 10px;
  margin: 10px 0px;
  background-color: #ffffff00;
  border: solid 2px #0088ff9e;
  border-radius: 20px;
}
.row-edit-address {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}
.EditAddres {
  right: 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  width: fit-content;
  color: #0088ff9e;
}
.btn-paper-close {
  color: #77b6ffdb;
  cursor: pointer;
  padding: 1rem;
}
.btn-paper-close:hover {
  color: #2689fbdb;
  cursor: pointer;
  padding: 1rem;
}
.btn-paper {
  color: #ffffffdb;
  background-color: #022e5d;
  cursor: pointer;
  padding: 1rem;
  margin: 0px 1rem;
}
.btn-paper:hover {
  background-color: #ffffff1c;
  cursor: pointer;
  padding: 1rem;
  margin: 0px 1rem;
  border-radius: 5px;
}
.card-botton {
  width: 100%;
  background-color: #022e5d;
  border-radius: 20px 20px 0px 0px;
  position: absolute;
  bottom: 0;
  height: fit-content;
  filter: drop-shadow(2px 4px 6px #a6a6a6db);
  margin: -16px;
  transform-origin: left bottom;
  box-shadow: 10px -1px 20px #d6d6d6;
}
.card-edit-address {
  width: 100%;
  background-color: #ffffff;
  border-radius: 20px 20px 0px 0px;
  position: absolute;
  bottom: 0;
  height: 83Vh !important;
  filter: drop-shadow(2px 4px 6px #a6a6a6db);
  margin: 0px;
  transform-origin: left bottom;
  z-index: 10 !important;
}

/* เพิ่ม transition สำหรับ animation */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease-in-out;
}

/* เพิ่ม animation delay */
.slide-enter,
.slide-leave-to {
  transform: scaleY(0);
}
.btn-invoice {
  color: #0088ff54;
  cursor: pointer;
}
.btn-invoice:hover {
  color: #0088ff9e;
}
.disabled {
  pointer-events: none;
  opacity: 0.5; /* or any other styling to indicate it's disabled */
}
.dialog-load {
  display: flex
}
.load-gif{
  /* background-image: url('https://i.pinimg.com/originals/c7/e1/b7/c7e1b7b5753737039e1bdbda578132b8.gif'); */
  width: 30px;
  height: 30px;
}
select {
  color: #000;
}
@-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .hr-top{
    background-color: #a1a1a16a;
    height: 5px;
    width: 50px;
    border-radius: 5px;
  }
  field .v-input__slot, .v-text-field fieldset {
    border-radius: 5px;
}
</style>
