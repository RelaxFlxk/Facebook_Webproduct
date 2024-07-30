<template>
  <div>
    <v-toolbar
      :height="widthScreen >= 855 ? '120' : '80'"
      :style="widthScreen > 375 ? 'padding-left:10px;' : 'padding-left:0px;'"
    >
      <!-- <v-app-bar-nav-icon><v-img :width="widthScreen > 375 ? '100%' : '60%'" :src="require('@/assets/Logo_betask copy.png')" /></v-app-bar-nav-icon> -->

      <v-toolbar-title>
        <v-img
          :width="widthScreen >= 855 ? '90%' : '70%'"
          src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FLogo_betask.png?alt=media&token=e0627396-a4f4-4778-9653-d813ab1aeb91"/>
        <!-- <v-img
          :width="widthScreen >= 855 ? '90%' : '70%'"
          :src="require('@/assets/Logo_betask.png')"/> -->
          </v-toolbar-title>

      <ul v-if="widthScreen >= 855">
        <li><a href="https://betaskthai.com/">หน้าหลัก</a></li>
        <li><a href="https://betaskthai.com/about_us/">เกี่ยวกับเรา</a></li>
        <li><a href="https://betaskthai.com/be_linked/">บริการของเรา</a></li>
        <li><a href="https://betaskthai.com/blog/">บทความ</a></li>
        <li><a href="https://betaskthai.com/contact_us/">ติดต่อเรา</a></li>
      </ul>
      <v-menu offset-y v-if="widthScreen < 855">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            x-large
            icon
            v-if="widthScreen <= 855"
          >
            <v-icon class="iconify" data-icon="heroicons-outline:menu"></v-icon>
          </v-btn>
        </template>
        <v-card class="mx-auto" width="250" tile>
          <v-list rounded>
            <v-subheader>BETASK</v-subheader>
            <v-list-item-group color="primary">
              <v-list-item v-for="(item, i) in items" :key="i">
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content @click="toPage(item)">
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-menu>
    </v-toolbar>
  </div>
</template>
<script>
// import axios from 'axios'
// import moment from 'moment-timezone'
import PrivacyNotice from '../Welcome/PrivacyNotice.vue'
export default {
  components: {
    name: '',
    PrivacyNotice
  },
  data () {
    return {
      selectedItem: 1,
      items: [
        { text: 'หน้าหลัก', icon: 'mdi-home', href: 'https://betaskthai.com/' },
        { text: 'เกี่ยวกับเรา', icon: 'mdi-information-outline', href: 'https://betaskthai.com/about_us/"' },
        { text: 'บริการของเรา', icon: 'mdi-flag', href: 'https://betaskthai.com/be_linked/' },
        { text: 'บทความ', icon: 'mdi-book-open-blank-variant', href: 'https://betaskthai.com/blog/' },
        { text: 'ติดต่อเรา', icon: 'mdi-card-account-mail', href: 'https://betaskthai.com/contact_us/' }
      ],
      device: 'browser',
      widthScreen: window.screen.width,
      dialogPrivacyNotice: true,
      overlay: false,
      form: {
        nameCompany: '',
        email: '',
        tel: '',
        category: ''
      },
      selected: ['ซ่อมทั่วไป'],
      category: [
        { text: 'ธุรกิจรถยนต์', value: 'ธุรกิจรถยนต์' },
        { text: 'ธุรกิจอื่นๆ', value: 'ธุรกิจอื่นๆ' }
      ],
      rules: {
        numberRules: (value) =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        counterTel: (value) => value.length <= 10 || 'Max 10 characters',
        IDcardRules: (value) =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        required: (value) => !!value || 'กรุณากรอก.',
        resizeImag: (value) =>
          !value ||
          value.size < 2000000 ||
          'Avatar size should be less than 2 MB!',
        counterIDcard: (value) => value.length <= 13 || 'Max 13 characters',
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      shopIdGoto: '',
      shopId: '',
      dataReady: true,
      validAdd: true,
      dialog: false,
      dialogEnd: false,
      privacyConfigDetail:
        '<h6 class="ql-align-center">เรื่อง นโยบายความเป็นส่วนตัว</h6><p class="ql-align-center"><br></p><p class="ql-align-center">บริษัท บีแทสก์ คอนซัลติ้ง จำกัด เห็นความสำคัญ ในการปกป้องข้อมูลส่วนบุคคล  เพื่อเป็นให้เป็นไปตาม<a href="http://www.ratchakitcha.soc.go.th/DATA/PDF/2562/A/069/T_0052.PDF" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 123, 255);">พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562</a></p><hr class="ql-align-center"><p class="ql-align-center">ผู้ให้บริการให้มี สิทธิการเข้าถึงข้อมูล <code style="color: rgb(232, 62, 140);">(Personal Data Protection Act : PDPA)</code></p><hr><p><strong><u>สำคัญ</u></strong></p><ol><li>ในการใช้บริการนี้ ผู้ใช้ต้องตรวจสอบว่าได้ดำเนินการผ่าน V-LINK ผู้ให้บริการนี้ไม่ ต้องรับผิดชอบต่อความเสียหายใดๆ ที่เกิดจากการใช้บริการจาก แหล่งอื่นที่ไม่ใช่ผู้ให้บริการอย่างเป็นทางการ</li><li>ข้อมูลส่วนบุคคลที่มอบให้แก่บริการนี้และข้อมูลส่วนบุคคลที่ รวบรวมใหม่จะถูกนำไปใช้ภายใต้ความรับผิดชอบของผู้ใช้บริการ นี้ โปรดตรวจสอบรายละเอียดในข้อกำหนดการใช้บริการและ นโยบายความเป็นส่วนตัวของผู้ให้บริการ</li><li>ข้อมูลโปรไฟล์ประกอบด้วย ชื่อ-นามสกุล,วันเกิด ,อีเมลล์</li><li>โปรดตรวจสอบว่า ชื่อ-นามสกุลของท่าน ไม่มีเนื้อหาที่ละเมิดในสิทธิ์ของผู้ใด เช่น ละเมิดลิขสิทธิ์ ละเมิด ความเป็นส่วนตัว ตามที่ระบุในข้อกำหนดการใช้บริการ บริษัท บีแทสก์ คอนซัลติ้ง จำกัด</li></ol><p><br></p>'
    }
  },
  created () {
    window.addEventListener('resize', this.myEventHandler)
  },
  destroyed () {
    window.removeEventListener('resize', this.myEventHandler)
  },
  async mounted () {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.device = 'phone'
    }
  },
  methods: {
    myEventHandler (e) {
      this.getSceenSize()
    },
    getSceenSize () {
      this.widthScreen = window.innerWidth
    },
    toPage (item) {
      // window.location = item.href
      window.open(item.href, '_blank').focus()
    }
  }
}
</script>
<style scoped>
.main {
  padding: 0px;
  background: #ffffff;
  min-height: 100vh;
  background: linear-gradient(180deg, #ffffff 10%, #e1f3ff 100%);
}
ul li {
  display: inline-block !important;
  padding: 10px 30px !important;
  color: white !important;
  /* background-color: #1b437c !important; */
  border-radius: 50px !important;
  margin-left: 25px !important;
}
ul li a {
  text-decoration: none !important;
  font-weight: bold !important;
}
.v-toolbar__content {
  display: flex !important;
  justify-content: space-around !important;
}
a {
  color: #1b437c !important;
  font-size: 20px !important;
}
</style>
