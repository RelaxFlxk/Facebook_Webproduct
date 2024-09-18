// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vuetify from '@/plugins/vuetify'
import VueSession from 'vue-session'
import VueMask from 'v-mask'
import 'bootstrap/dist/css/bootstrap.css'
import vueXlsxTable from 'vue-xlsx-table'
import axios from 'axios'
import moment from 'moment' // แปลง date
import Nl2br from 'vue-nl2br'
import VueSweetAlert from 'vue-sweetalert'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueRecaptcha from 'vue-recaptcha'
import VueGtm from 'vue-gtm'
import firebase from 'firebase'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC_tZSHkiE5xkAwTfKhu3hFFOvybv8tUgY',
  authDomain: 'api-intern-978ba.firebaseapp.com',
  projectId: 'api-intern-978ba',
  storageBucket: 'api-intern-978ba.appspot.com',
  messagingSenderId: '357974285385',
  appId: '1:357974285385:web:249fb55622540761eff398'
}

firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()

export { auth }
Vue.config.productionTip = false
// import store from './store'
// import Swal from 'sweetalert2'
Vue.use(VueGtm, {
  id: 'GTM-TK7ZPCD', // Your GTM single container ID, array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy'] or array of objects [{id: 'GTM-xxxxxx', queryParams: { gtm_auth: 'abc123', gtm_preview: 'env-4', gtm_cookies_win: 'x'}}, {id: 'GTM-yyyyyy', queryParams: {gtm_auth: 'abc234', gtm_preview: 'env-5', gtm_cookies_win: 'x'}}], // Your GTM single container ID or array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy']
  queryParams: {
    // Add URL query string when loading gtm.js with GTM ID (required when using custom environments)
    // gtm_auth: 'AB7cDEf3GHIjkl-MnOP8qr',
    // gtm_preview: 'env-4',
    // gtm_cookies_win: 'x'
  },
  defer: false, // Script can be set to `defer` to speed up page load at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible). Defaults to false, so the script is loaded `async` by default
  compatibility: false, // Will add `async` and `defer` to the script tag to not block requests for old browsers that do not support `async`
  nonce: '2726c7f26c', // Will add `nonce` to the script tag
  enabled: true, // defaults to true. Plugin can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie (optional)
  debug: true, // Whether or not display console logs debugs (optional)
  loadScript: true, // Whether or not to load the GTM Script (Helpful if you are including GTM manually, but need the dataLayer functionality in your components) (optional)
  vueRouter: router, // Pass the router instance to automatically sync with router (optional)
  ignoredViews: ['Login', 'EmClose', 'UserSubmit', 'ManageShop', 'rating', 'OnsiteRating', 'jobConfirm', 'Booking', 'BookingForm', 'BookingAddress', 'ConditionFlow', 'UserHistory', 'BookingQrcode', 'BookingField', 'Thank', 'PaymentUpload', 'ConfirmUser', 'CheckBookingLatest', 'CheckBookingNext'], // Don't trigger events for specified router names (optional)
  trackOnNextTick: false // Whether or not call trackView in Vue.nextTick
})

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCnDosnYWNnKQxLbsI5Cy_iw_VC5oyc1Ck',
    libraries: 'places' // This is required if you use the Autocomplete plugin
    // region: 'TH',
    // language: 'th'
  },
  installComponents: true
})
Vue.config.productionTip = false
Vue.component('nl2br', Nl2br)
Vue.component('vue-recaptcha', VueRecaptcha)
Vue.use(VueSession)
Vue.use(VueSweetAlert)
Vue.use(VueRecaptcha)

Vue.use(VueMask)
Vue.use(vueXlsxTable, {rABS: false})

Vue.prototype.$profile_dev = {
  'displayName': 'Pamorn Trivorrarat',
  'pictureUrl': 'https://profile.line-scdn.net/0heYkOVB2MOnZGNizwjMlECTZmORxlR2NkYlMmRXNhZhF8USomP1knFSZjN0N9ACh1OlR9QnozbBNKJU0QWGDGQkEGZEF_AXkpall0lQ',
  // 'pictureUrl': 'https://profile.line-scdn.net/0hehdTWCiWOkdZLRKhl6VFEGVoNCouAzwPIUl2JX4pNnQnSHsUMRx8dCgoNCUmTS1BMRhzKHQpMyN9',
  'statusMessage': 'ใช้ไลน์อันนี้นะคร้าบ',
  'userId': 'Ue01d1c3ed36b2aa0c4c40826f8b9a329'
  // Uec015abe09c4b00b0dfd25dc882866f4 - GOT
  // 'userId': 'Ubb981ed38ad6dd18734560d2203df255'
}

Vue.prototype.$weburl = 'https://betask-linked.web.app/'
// Vue.prototype.$liffId = '1655981910-KjVRlgdb'
Vue.prototype.$liffIdMain = '1656581804-7KRQyqo5'
Vue.prototype.$liffIdForm = '1656581804-32mk7OgE'
Vue.prototype.$liffIdFormEmp = '1656581804-b09WBwkP'
Vue.prototype.$liff = window.liff
// Vue.prototype.$omise_public_key = 'pkey_test_5whiufc1mlwlxlql1rr'
Vue.prototype.$OmiseCard = window.OmiseCard

Vue.config.productionTip = false
Vue.mixin({
  computed: {
    themeStyle: {
      get: function () {
        return {
          '--color_headline1': this.master_theme['color1'],
          '--color_subheadline1': this.master_theme['color3'],
          '--color_icon1': this.master_theme['color2'],
          '--color_headline2': this.master_theme['color4'],
          '--color_subheadline2': this.master_theme['color5'],
          '--color_icon2': this.master_theme['color6'],
          '--color_picture': this.master_theme['color7'],
          '--coin_img': "url('/static/img/coin.svg')"
        }
      },
      set: function (newValue) {
        this.master_theme = newValue
      }
    }
  },
  data: function () {
    return {
      master_theme: {
        'color1': '',
        'color2': '',
        'color3': '',
        'color4': '',
        'color5': '',
        'color6': '',
        'color7': ''
      },
      globalVar: 'global',
      DNS_IP: '',
      DNS_IP_Loyalty: '',
      ADMIN_IP: '',
      PK: '', // Primary Key
      ApplicationKey: '', // Token
      IPPotocalENV_Production: 'https://api-belinked.betaskthai.com',
      IPPotocalENV_ProductionLoyalty: 'https://api-beloyalty-productions.betaskthai.com',
      IPPotocalENV_Developer: 'http://localhost',
      IPPotocalENV_DeveloperLoyalty: 'http://localhost:5001',
      ADMIN_URL_Production: 'https://betask-linked.web.app/',
      ADMIN_URL_Developer: 'http://localhost',
      profile: {
        userId: '',
        displayName: '',
        pictureUrl: '',
        statusMessage: ''
      },
      member: null
    }
  },
  async mounted () {
    if (process.env.NODE_ENV === 'development') {
      this.DNS_IP = this.IPPotocalENV_Developer + ':5001'
      this.ADMIN_IP = this.ADMIN_URL_Developer + ':8080'
      this.DNS_IP_Loyalty = this.IPPotocalENV_DeveloperLoyalty
    } else {
      this.DNS_IP = this.IPPotocalENV_Production
      this.ADMIN_IP = this.ADMIN_URL_Production
      this.DNS_IP_Loyalty = this.IPPotocalENV_ProductionLoyalty
    }
  },
  methods: {
    async checkBanUserId (userId, shopId) {
      let datacheckBanUserId = false
      await axios.get(this.DNS_IP + '/member/get?shopId=' + shopId + '&liffUserId=' + userId).then(response => {
        let rs = response.data
        console.log('checkBanUserId', rs)
        if (rs.status !== false) {
          let dataCheck = rs[0].banStatus || 'False'
          if (dataCheck === 'False') {
            datacheckBanUserId = false
          } else {
            datacheckBanUserId = true
            this.$swal({
              title: '',
              type: 'warning',
              html: '<p>บัญชีของท่านถูกระงับการใช้งานชั่วคราว \n โปรดติดต่อเจ้าหน้าที่</p><p>Your account has been temporarily suspended. \n Please contact customer support for assistance.</p>',
              showConfirmButton: false,
              allowOutsideClick: false,
              allowEscapeKey: false
            })
          }
        } else {
          datacheckBanUserId = false
        }
      }).catch((error) => {
        console.log(error)
        datacheckBanUserId = false
      })
      console.log('datacheckBanUserId', datacheckBanUserId)
      return datacheckBanUserId
    },
    async getDataLineConfig (shopId) {
      let dataLineConfig = []
      await axios.get(this.DNS_IP + '/lineconfig/get?shopId=' + shopId).then(response => {
        let rs = response.data
        console.log('getDataLineConfig shopId', shopId)
        console.log('getDataLineConfig', rs)
        if (rs.status === false) {
          dataLineConfig = {
            liffMainID: '1656581804-7KRQyqo5',
            liffBookingFormID: '1656581804-32mk7OgE',
            liffBookingFormEmpID: '1656581804-b09WBwkP',
            checkConfig: false
          }
        } else {
          dataLineConfig = rs[0]
        }
      }).catch((error) => {
        console.log(error)
        dataLineConfig = {
          liffMainID: '1656581804-7KRQyqo5',
          liffBookingFormID: '1656581804-32mk7OgE',
          liffBookingFormEmpID: '1656581804-b09WBwkP',
          checkConfig: false
        }
      })
      return dataLineConfig
    },
    async getProfileAccess (token) {
      let result = null
      await axios({
        method: 'get',
        headers: {
          accessToken: token
        },
        url: this.DNS_IP + '/line/getProfileByAccess'
      }).then((response) => {
        result = response.data
      }).catch((error) => {
        console.log(error)
        result = null
      })
      return result
    },
    async callBeTaskAPI (method, url, params) {
      let result = null
      console.log(url)
      const token = await this.$liff.getAccessToken() || '1234567890'
      // console.log(this.liffId)
      // console.log(token)
      var userIdUse = ''
      if (this.profile.userId === '') {
        userIdUse = await this.getProfileAccess(token)
        this.profile.userId = userIdUse.userId
      }
      console.log(this.$session.get('shopId'))
      await axios({
        method: method,
        headers: {
          shopId: this.$session.get('shopId'),
          lineUserId: this.profile.userId,
          lineId: this.profile.userId
        },
        url: this.DNS_IP + url,
        data: params
      }).then((response) => {
        result = response.data
      }).catch((error) => {
        console.log(error)
        result = null
      })
      return result
    },
    // async checkLiffLogin () {
    //   console.log('checkLiffLogin', this.$liffId)
    //   await this.$liff.init({
    //     liffId: this.$liffId
    //   }).then(async () => {
    //     await this.getProfileMain(this.$liffId)
    //   }).catch((err) => {
    //     // this.$router.push({ name: '404' })
    //     console.log(err.code, err.message)
    //   })
    //   // this.$liff.init({ 'liffId': liffId }, function (data) {})
    // },
    // async getProfileMain () {
    //   await this.$liff.ready.then(async () => {
    //     if (process.env.NODE_ENV === 'development') {
    //       this.getProfile_dev()
    //     } else {
    //       if (!this.$liff.isLoggedIn()) {
    //         this.$liff.login({redirectUri: `${this.$weburl}?liffId=${this.$liffId}`})
    //       } else {
    //         await this.getProfile()
    //       }
    //     }
    //   })
    // },
    // async getProfile () {
    //   let _this = this
    //   await this.$liff.getProfile().then(function (profile) {
    //     _this.profile = profile
    //     console.log('prod', _this.profile)
    //   }).catch(function (error) {
    //     console.log('Error getting profile: ' + error)
    //   })
    // },
    // getProfile_dev () {
    //   this.profile = this.$profile_dev
    //   console.log('dev', this.profile)
    // },
    formatNumber (value) {
      if (value && value !== 0) {
        console.log('valuevalue', value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else {
        return 0
      }
    },
    format_date (value) {
      if (value) {
        return moment(String(value)).format('DD/MM/YYYY HH:mm')
      }
    },
    format_date1 (value) {
      if (value) {
        return moment(String(value)).format('DD/MM/YYYY') + ' เวลา ' + moment(String(value)).format('HH:mm') + 'น.'
      }
    },
    format_date2 (value) {
      if (value) {
        return moment(String(value)).format('YYYY-MM-DD HH:mm')
      }
    },
    // YYYY-MM-DD
    momenDate_1 (value) {
      if (value) {
        return moment(String(value)).format('YYYY-MM-DD')
      }
    },
    momenTime (value) {
      if (value) {
        return moment(String(value)).format('HH:mm')
      }
    },
    momenDate_2 (value) {
      if (value) {
        return moment(String(value)).format('DD-MM-YYYY')
      }
    },
    momenDate_3 (value) {
      if (value) {
        return moment(String(value)).format('DD MMM YYYY')
      }
    },
    momenDate_4 (value) {
      if (value) {
        return moment(String(value)).format('MMM YYYY')
      }
    },
    momenDate_YYYY (value) {
      if (value) {
        return moment(String(value)).format('YYYY')
      }
    },
    momenDate_MM (value) {
      if (value) {
        return moment(String(value)).format('MM')
      }
    }
  }
})

function updatePageTitle (to, from) {
  const { title, icon } = to.meta
  const pageTitleElement = document.getElementById('page-title')
  if (pageTitleElement) {
    pageTitleElement.innerText = title || 'Betask Linked'
  }

  const favicon = document.querySelector('link[rel="shortcut icon"]')
  favicon.setAttribute('type', 'image/x-icon')
  favicon.setAttribute(
    'href',
    icon || 'https://betaskthai.com/wp-content/uploads/2020/03/cropped-LOGO_BeTask-website2.png'
  )
}

router.beforeEach((to, from, next) => {
  updatePageTitle(to, from)
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  vuetify,
  router,
  components: { App },
  template: '<App/>'
})
