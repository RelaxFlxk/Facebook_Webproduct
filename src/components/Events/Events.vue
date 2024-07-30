<template>
  <v-main>
    <v-card style="margin: 20px;color:#fff" color="#183966">
      <div
        class="row"
        style="display: flex; align-items: center;flex-wrap: nowrap;"
      >
        <div class="col-5">
          <img
            src="../../assets/LogoDefault.jpg"
            style="width: 100px;
            object-fit: scale-down;
            filter: drop-shadow(0px 0px 4px #fff);
            border-radius: 13px;
            "
          />
        </div>
        <div class="col-7" align="left">
          <!-- <div>ขอบคุณที่สนใจในโปรแกรมของเรา</div>
          <div>เราจะติดต่อกลับโดยเร็ว</div> -->
          <div>ขอบคุณครับ</div>
          <p style="font-size: 14px;">เราจะติดต่อกลับโดยเร็ว</p>
        </div>
      </div>
    </v-card>
  </v-main>
</template>
<script>
// import axios from 'axios'
export default {
  components: {},
  data () {
    return {
      // imgEvent: require('@/assets/events/cover-FLEX-nail2023-01.png'),
      imgEvent:
        'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/event%2Fbanner.png?alt=media&token=4c2d2f7a-395b-44fc-8a35-5996fb08384c',
      loader: null,
      loading: false,
      overlay: true,
      swalConfig: {
        title: null,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      },
      swasuccess: {
        title: 'สำเร็จ',
        text: 'คุณได้ลงทะเบียนเรียบร้อยแล้ว',
        type: 'success',
        showConfirmButton: false
      },
      path: 'http://192.168.1.213:5001',
      formadd: {
        id: '',
        name: '',
        tel: '',
        eventId: '',
        bicTypeId: 0,
        userLineId: '',
        lineDisplayName: ''
      },
      bicTypeText: [
        {
          id: 1,
          text: 'ร้านอาหาร'
        },
        {
          id: 2,
          text: 'ร้านเสริมความงาม'
        },
        {
          id: 3,
          text: 'โรงพยาบาล & คลินิค'
        },
        {
          id: 4,
          text: 'สุขภาพ กีฬา'
        },
        {
          id: 5,
          text: 'Event'
        },
        {
          id: 6,
          text: 'อื่นๆ'
        }
      ],
      datefomat: '',
      profile: null,
      valid: true,
      nameRules: [v => !!v || 'กรุณากรอกชื่อ'],
      phoneRules: [
        v => !!v || 'กรุณากรอกเบอร์',
        v => (!isNaN(parseFloat(v)) && isFinite(v)) || 'ต้องกรอกเฉพาะตัวเลข',
        v => (v && v.length === 10) || 'เบอร์ 10 หลัก'
      ]
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
      this.bicTypeId = params.get('bicTypeId')
      this.eventId = params.get('eventId')
      this.titleName = params.get('titleName')
      // console.log('bicTypeIdif', this.bicTypeId)
      // console.log('eventIdif', this.eventId)
    } else {
      // console.log('bicTypeIdelse', this.$route.query.bicTypeId)
      // console.log('eventIdelse', this.$route.query.eventId)
      if (this.$route.query.bicTypeId !== undefined) {
        this.bicTypeId = this.$route.query.bicTypeId
      } else {
        const queryString = decodeURIComponent(window.location.search).replace(
          '?liff.state=',
          ''
        )
        // console.log('queryString', queryString)
        const params = new URLSearchParams(queryString)
        this.bicTypeId = params.get('bicTypeId')
      }
      await this.checkLiffLogin()
    }
  },
  methods: {
    async liffSendMessages (textitem) {
      try {
        await this.$liff.sendMessages([
          {
            type: 'text',
            text: textitem
          }
        ])
        this.$liff.closeWindow()
      } catch (error) {
        this.$liff.closeWindow()
        console.log('error', error)
      }
    },
    async checkLiffLogin () {
      // console.log('dataLineConfig', dataLineConfig)
      await this.$liff
        .init({
          // liffId: '1661452125-jAAoBBol' ตัวเทส
          liffId: '1660658626-GWYnx5Ng'
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
        .then(async function (profile) {
          _this.profile = profile
          let typetext = []
          if (_this.bicTypeId === 'booking') {
            typetext = 'สนใจระบบจองโต๊ะ'
          } else if (_this.bicTypeId === 'bookingQ') {
            typetext = 'สนใจระบบบัตรคิว'
          } else if (_this.bicTypeId === 'loyalty') {
            typetext = 'สนใจระบบสะสมแต้ม'
          }
          await _this.liffSendMessages(typetext)
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
.v-main__wrap {
  background-color: #ffffff;
}
.v-application .grey.darken-4 {
  background-color: #ffffff00 !important;
  border-color: #ffffff00 !important;
  padding-bottom: 20px;
}
.v-card {
  padding: 40px 40px !important;
  border-radius: 30px;
  /* background-image: url('https://firebasestorage.googleapis.com/v0/b/database-78471.appspot.com/o/upload%2F965527229524Strategy_Board.gif?alt=media&token=41cc6640-65d6-4970-b3c7-3a747fb775fb');
    backdrop-filter: blur(15px); */
}
.text-center {
  display: flex;
  justify-content: center;
}
.title {
  text-shadow: 0px 2px 3px #bababa;
  color: #1976d2;
  padding-bottom: 20px;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
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
</style>
