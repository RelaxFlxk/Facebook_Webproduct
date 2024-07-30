<template>
    <v-main>
      <v-container>
        <v-form ref="formadd">
          <v-container>
            <div class="center" style="padding-bottom: 40px;">
              <h5>ลงทะเบียน</h5>
            </div>
            <div>

            </div>
          </v-container>
        </v-form>
      </v-container>
    </v-main>
  </template>

<script>
import axios from 'axios'
export default {
  components: {},
  data () {
    return {
      DNS_IPS: 'http://localhost:5001/',
      data: '',
      inputData: [],
      Fieldite: [],
      dataFilter: [],
      languageSelect: 0,
      overlay: false,
      formadd: [],
      item: [],
      date_now: new Date().toISOString().slice(0, 10),
      swasuccess: {
        title: 'สำเร็จ',
        text: 'คุณได้ลงทะเบียนเรียบร้อยแล้ว',
        type: 'success',
        showConfirmButton: false
      },
      loader: null,
      loading: false,
      rules: {
        numberRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999) ||
            'กรุณากรอกตัวเลข 0 ถึง 9',
        counterTel: value => value.length <= 10 || 'Max 10 characters',
        IDcardRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999999) ||
            'กรุณากรอกตัวเลข 0 ถึง 9',
        required: value => !!value || 'กรุณากรอก.',
        resizeImag: value =>
          !value ||
            value.size < 2000000 ||
            'Avatar size should be less than 2 MB!',
        counterIDcard: value => value.length <= 13 || 'Max 13 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  async mounted () {
    if (
    // ถ้ากดยดยอมรับ หรือ ไม่ยอมรับ
      this.$route.query.error === 'ACCESS_DENIED' ||
        this.$route.query.error === 'access_denied'
    ) {
      // ให้ ?liff.state=
      const queryString = decodeURIComponent(window.location.search).replace(
        '?liff.state=',
        ''
      )
      // console.log('queryString', queryString)
      // ดึงค่าใส่ตัวแปร
      const params = new URLSearchParams(queryString)
      this.stepNo = params.get('stepNo')
      this.bookingNo = params.get('bookingNo')
      this.date = params.get('date')
      // console.log('statusTitleif', this.statusTitle)
      // console.log('shopIdif', this.shopId)
    } else {
      // console.log('idelse', this.$route.query.id)
      // console.log('shopIdelse', this.$route.query.shopId)
      if (
        this.$route.query.stepNo !== undefined &&
          this.$route.query.bookingNo !== undefined &&
          this.$route.query.dueDate !== undefined
      ) {
        this.stepNo = this.$route.query.stepNo
        this.bookingNo = this.$route.query.bookingNo
        this.dueDate = this.$route.query.dueDate
      } else {
        const queryString = decodeURIComponent(window.location.search).replace(
          '?liff.state=',
          ''
        )
        // console.log('queryString', queryString)
        const params = new URLSearchParams(queryString)
        this.stepNo = params.get('stepNo')
        this.bookingNo = params.get('bookingNo')
        this.dueDate = params.get('dueDate')
      }
      this.dataLineConfig = await this.getDataLineConfig(this.shopId)
      await this.checkLiffLogin(this.dataLineConfig)
      await this.getForm()
      await this.getStepData()
    }
  },
  computed: {
    endDate () {
      const endDate = new Date(this.date_now)
      endDate.setDate(endDate.getDate() + parseInt(this.inputData[0].date))
      return endDate.toISOString().slice(0, 10)
    }
  },
  methods: {
    async getData () {
      await axios.get(this.DNS_IP + '/ShopPartner/get').then(async (response) => {
        let rsn = response.data
        console.log('rsn', rsn)
      }).catch((error) => {
        this.$swal('', 'โปรดติดต่อเจ้าหน้าที่', 'info')
        console.log('error function addData : ', error)
      })
    },
    async liffSendMessages (textitem) {
      try {
        await this.$liff.sendMessages([
          {
            type: 'text',
            text: textitem
          }
        ])
      } catch (error) {
        console.log('error', error)
      }
    },
    async checkLiffLogin (data) {
      // console.log('dataLineConfig', dataLineConfig)
      await this.$liff
        .init({
          // liffId: '1661452125-jAAoBBol' ตัวเทส
          // liffId: '1660658626-l0Y4rkD6'
          liffId: data.liffMainID
        })
        .then(async () => {
          if (process.env.NODE_ENV === 'development') {
            this.getProfile_dev()
          } else {
            if (!this.$liff.isLoggedIn()) {
              this.$liff.login({ redirectUri: window.location.href })
            } else {
              await this.getProfile()
              // await this.liffSendMessages()
            }
          }
        })
        .catch(err => {
          // this.$router.push({ name: '404' })
          console.log(err.code, err.message)
        })
        // this.$liff.init({ 'liffId': liffId }, function (data) {})
    },
    async getProfile () {
      let _this = this
      await this.$liff
        .getProfile()
        .then(function (profile) {
          _this.profile = profile
          console.log('prod', _this.profile)
        })
        .catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
    },
    getProfile_dev () {
      this.profile = {
        displayName: 'Pamorn Trivorrarat',
        pictureUrl:
            'https://profile.line-scdn.net/0heYkOVB2MOnZGNizwjMlECTZmORxlR2NkYlMmRXNhZhF8USomP1knFSZjN0N9ACh1OlR9QnozbBNKJU0QWGDGQkEGZEF_AXkpall0lQ',
        // 'pictureUrl': 'https://profile.line-scdn.net/0hehdTWCiWOkdZLRKhl6VFEGVoNCouAzwPIUl2JX4pNnQnSHsUMRx8dCgoNCUmTS1BMRhzKHQpMyN9',
        statusMessage: 'ใช้ไลน์อันนี้นะคร้าบ',
        // 'userId': 'U987fbf72d4f0b37b07c1625f7f6b27b1'
        userId: 'Ud2e630e20bb8597b90d4908a46fbc4e9p'
        // 'userId': 'Ubb981ed38ad6dd18734560d2203df255'ตัวเทส
      }
      // console.log('dev', this.profile)
    }
  }
}
</script>

  <style scoped>
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .text-center {
    display: flex;
    justify-content: center;
  }
  </style>
