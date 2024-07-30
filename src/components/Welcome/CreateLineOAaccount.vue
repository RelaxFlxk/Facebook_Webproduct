<template>
  <main class="main">
    <NavbarRegister />
    <div style="padding: 25px">
    <div>
      <div v-if="resCol === '6'" style="display: flex; margin: 0 auto; width: 700px">
        <div style="text-align: center">
          <v-avatar color="#1C3879" size="70">
            <span class="white--text text-h4">1</span>
          </v-avatar>
          <div style="white-space: nowrap; margin-top: 20px; font-size: 19px">
            สมัครสมาชิกบริษัท/ ร้าน
          </div>
        </div>
        <hr />
        <div style="text-align: center">
          <v-avatar color="#1C3879" size="70">
            <span class="white--text text-h4">2</span>
          </v-avatar>
          <div style="white-space: nowrap; margin-top: 20px; font-size: 19px">
            สร้างบัญชี Line Official Account
          </div>
        </div>
        <hr />
        <div style="text-align: center; margin-left: 30px">
          <v-avatar color="grey" size="70">
            <span class="white--text text-h4">3</span>
          </v-avatar>
          <div style="white-space: nowrap; margin-top: 20px; font-size: 19px">
            เข้าสู่ระบบ
          </div>
        </div>
      </div>
      <div v-if="resCol === '12'" style="display: flex; margin: 0 auto; width: 300px;">
        <div style="text-align: center;">
          <v-avatar color="#1C3879" size="50">
            <span class="white--text text-h7">1</span>
          </v-avatar>
          <div style="white-space: nowrap; margin-top: 10px; font-size: 14px">
            สมัครสมาชิก
          </div>
        </div>
        <hr style="margin-top: 20px;"/>
        <div style="text-align: center">
          <v-avatar color="#1C3879" size="50">
            <span class="white--text text-h7">2</span>
          </v-avatar>
          <div style="white-space: nowrap; margin-top: 10px; font-size: 14px">
            สร้าง Line OA
          </div>
        </div>
        <hr style="margin-top: 20px;"/>
        <div style="text-align: center;margin-left: 10px">
          <v-avatar color="grey" size="50">
            <span class="white--text text-h7">3</span>
          </v-avatar>
          <div style="white-space: nowrap; margin-top: 10px; font-size: 14px">
            เข้าสู่ระบบ
          </div>
        </div>
      </div>
    </div>
    <div
      class="mt-15"
      style="
        text-align: center;
        font-weight: bolder;
        color: #1c3879;
        font-size: 2.5rem;
      "
    >
      <p>เชื่อมต่อ LINE Official Account กับ BeTask</p>
    </div>
    <div class="mb-15" style="text-align: center; font-size: 1.5rem">
      <p>
        บริษัท/ร้านค้าจําเป็นต้องสมัคร LINE Official Account
        กรุณาทําตามขั้นตอนดังนี้
      </p>
    </div>
    <div>
      <v-row>
        <v-col
          :cols="resCol"
          :style="
          (resCol === '6'
            ? 'text-align: center;border-right: 2px solid #ccd1e4;height: 340px;'
            : 'text-align: center;border-bottom: 3px solid #ccd1e4;height: 246px;')
          "
        >
          <div
            style="
              font-weight: bolder;
              color: #1c3879;
              font-size: 2rem;
              margin-bottom: 10px;
            "
          >
            กรณีมีบัญชีแล้ว
          </div>
          <div style="font-size: 1.2rem; margin-bottom: 20px">
            กรุณาคลิกที่ปุ่ม เชื่อมต่อ LINE OA ด้านล่างนี้
          </div>
          <div style="width: 300px; margin: 0 auto">
            <v-btn
              color="#001D6E"
              style="font-size: 20px"
              dark
              x-large
              block
              @click="configLineOa()"
            >
              เชื่อมต่อ LINE OA
            </v-btn>
          </div>
        </v-col>
        <v-col :cols="resCol" style="text-align: center">
          <div
            style="
              font-weight: bolder;
              color: #1c3879;
              font-size: 2rem;
              margin-bottom: 10px;
            "
          >
            กรณียังไม่มีบัญชี
          </div>
          <div style="font-size: 1.2rem; margin-bottom: 20px">
            กรุณาคลิกที่ปุ่ม สมัครบัญชี LINE OA ด้านล่างนี้และทำตามขั้นตอน
          </div>
          <div style="width: 300px; margin: 0 auto">
            <v-btn
              color="#001D6E"
              style="font-size: 20px"
              dark
              x-large
              block
              @click="linkToLineOa()"
            >
              สมัครบัญชี LINE OA
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    </div>
  </main>
</template>
<script>
import axios from 'axios' // api
// import moment from 'moment-timezone'
import PrivacyNotice from '../Welcome/PrivacyNotice.vue'
import NavbarRegister from '../Welcome/NavbarRegister.vue'
import VueRecaptcha from 'vue-recaptcha'
export default {
  components: {
    name: '',
    PrivacyNotice,
    NavbarRegister,
    'vue-recaptcha': VueRecaptcha
  },
  computed: {
    resCol () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '12'
        case 'sm':
          return '12'
        case 'md':
          return '6'
        case 'lg':
          return '6'
        case 'xl':
          return '6'
      }
      console.log(
        'this.$vuetify.breakpoint.name',
        this.$vuetify.breakpoint.name
      )
    }
  },
  data () {
    return {
      overlay: false,
      recapStatus: false,
      widthScreen: window.screen.width,
      recapchaToken: '',
      Redirect: '',
      moduleLink: '',
      menuDate: false,
      dialog: false,
      dialogConfirm: false,
      itemdetell: [],
      DataFlowName: [],
      branch: [],
      date: '',
      time: '',
      fromAdd: {
        flowId: null,
        masBranchID: null
      },
      shopId: '',
      bookingField: [],
      Fielditem: [],
      showCard: false,
      FieldSelect: [
        {
          text: 'Field Id',
          value: 'fieldId'
        },
        {
          text: 'Field Name',
          value: 'fieldName'
        },
        { text: 'AC', value: 'showCard' }
      ]
    }
  },
  created () {
    window.addEventListener('resize', this.myEventHandler)
  },
  destroyed () {
    window.removeEventListener('resize', this.myEventHandler)
  },
  async mounted () {
    if (this.$route.query.shopId) {
      this.shopId = this.$route.query.shopId
      this.moduleLink = `https://manager.line.biz/module/auth/v1/authorize?client_id=1656250423&redirect_uri=https://betask-linked.web.app/ManageShop?productName=link${this.$route.query.shopId}&response_type=code&scope=account:manage%20message:mark_as_read%20message:receive%20message:send%20profile:read&state=register`
      await this.addBookingField()
    } else {
      window.location.href = 'https://belinked.betaskthai.com/register'
    }
  },
  methods: {
    linkToLineOa () {
      window.open('https://manager.line.biz', '_blank')
    },
    myEventHandler (e) {
      this.getSceenSize()
    },
    getSceenSize () {
      this.widthScreen = window.innerWidth
    },
    async getCustomField () {
      this.Fielditem = []
      await axios
        .get(this.DNS_IP + '/customField/get?shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            let s = {}
            s.fieldId = d.fieldId
            s.fieldName = d.fieldName
            s.showCard = true
            this.Fielditem.push(s)
          }
          console.log('flowfield', this.Fielditem)
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    configLineOa () {
      window.location.href = this.moduleLink
    },
    async addBookingField () {
      let booking = {}
      let UpdateField = []
      this.overlay = true
      await axios
        .get(this.DNS_IP + '/BookingField/get?shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          console.log('rs', rs)
          if (rs.status === false) {
            await this.getCustomField()
            for (let i = 0; i < this.Fielditem.length; i++) {
              let d = this.Fielditem[i]
              if (d.showCard === true) {
                UpdateField.push({
                  fieldId: d.fieldId
                })
              }
            }
            booking.flowfieldName = JSON.stringify(UpdateField)
            booking.flowfieldNameCustomer = JSON.stringify(UpdateField)
            booking.shopId = this.shopId
            booking.typeJob1 = 'บริการปกติ'
            booking.typeJob2 = 'Extra Job'
            booking.typeJob3 = 'Fast Track'
            booking.typeProcess1 = 'รอโทรยืนยัน'
            booking.typeProcess2 = 'ยืนยันแล้ว'
            booking.typeProcess3 = 'ยกเลิก'
            booking.typeProcess4 = 'เข้าใช้บริการแล้ว'
            booking.showTime = 'แสดง'
            console.log('dtbooking', booking)
            // this.$swal({
            //   title: 'ต้องการ บันทึกข้อมูล ใช่หรือไม่?',
            //   type: 'question',
            //   showCancelButton: true,
            //   confirmButtonColor: '#3085d6',
            //   cancelButtonColor: '#b3b1ab',
            //   confirmButtonText: 'ใช่',
            //   cancelButtonText: 'ไม่'
            // })
            //   .then(async result => {

            //   })
            //   .catch(error => {
            //     this.overlay = false
            //     console.log('Cencel : ', error)
            //   })
            await axios
              .post(this.DNS_IP + '/BookingField/add', booking)
              .then(response => {
                // window.location.href = this.moduleLink
                // console.log('addDataGlobal DNS_IP + /job/add', response)
                this.overlay = false
              })
              .catch(error => {
                console.log('error function addData : ', error)
                this.overlay = false
              })
          } else {
            this.overlay = false
          }
          // } else {
          //   this.$swal('คุณได้ตั้งค่าข้อมูลไว้แล้ว', 'ระบบจะนำคุณไปยังหน้าต่อไป', 'info').then(() => {
          //     // window.location.href = this.moduleLink
          //     this.overlay = false
          //   }).catch(error => {
          //     this.overlay = false
          //     this.$router.push('/RegisterClose')
          //     console.log('Cencel : ', error)
          //   })
          // }
        })
    }
  }
}
</script>
<style scoped>
.main {
  padding: 0px;
  background: #ffffff;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(180deg, #ffffff 10%, #e1f3ff 100%);
}
.bgPage {
  background: linear-gradient(180deg, #ffffff 10%, #e1f3ff 100%);
  position: absolute;
  left: 0%;
  right: 0%;
  top: 0%;
  bottom: 0%;
}
hr {
  border: none;
  border-top: 4px dotted grey;
  color: #fff;
  background-color: #fff;
  height: 1px;
  width: 50%;
  margin-top: 30px;
}
</style>
