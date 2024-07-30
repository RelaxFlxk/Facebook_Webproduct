/* eslint-disable vue/return-in-computed-property */
<template>
  <v-main>
    <v-card :ripple="false" :img="ImgCover" height="240px" width="100%">
    </v-card>
    <v-card
      class="pa-2 pb-10 mt-n10"
      :color="DarkModeBackground"
      :style="
        'background-color:' +
          DarkModeBackground +
          ';min-height: 100vh;border-radius: 45px 45px 0px 0px;'
      "
    >
      <v-row>
        <v-col class="text-center">
          <v-avatar
            class="mt-n16 pa-1"
            style=""
            :color="DarkModeBackground"
            size="150"
          >
            <img :src="LoGo" />
          </v-avatar>
        </v-col>
      </v-row>
      <v-card elevation="0" class="p-3" v-if="bookingitem.length > 0">
      <div v-if="profile && bookingitem">

      <br>
        <!-- <h5 class="text-center" style="font-weight: 900;color:#000000;">นัดหมายเข้ารับบริการเรียบร้อย</h5> -->
        <div class="text-center mb-3" v-if="shopId === 'Ude8aa51427e3e205fbc46d953c4c78bc'">
          <v-btn
          color="error"
          dark
          @click="printPDF()"
          >
           <v-icon class="mr-2">mdi-file-pdf</v-icon>
           Download
          </v-btn>
        </div>
        <h5 class="text-center" style="font-weight: 900;color:#000000;">รายการนัดหมาย</h5>
        <h6 class="text-center" style="font-weight: 900;color:#000000;">รายละเอียดการนัดหมาย</h6>
        <br>
          <div class="avatar text-center">
          <v-avatar size="120" style="border:5px solid #FFFFFF;">
              <img :src= profile.pictureUrl>
          </v-avatar>
          <!-- <p class="text-center">{{profile.displayName}}</p> -->
          </div>
          <br>
            <h3 class="text-center" style="color:#000000;"   >{{cusName}}</h3>
          <p class="text-center textcontent" style="color:#000000;margin-bottom: 0px;">วันที่ / เวลานัดหมาย</p>
          <p class="text-center" style="color:#ABA3A3;">{{bookingitem[0].dueDate}}</p>
            <v-row>
              <v-col cols="6">
                <p class="text-center textcontent" style="color:#000000;margin-bottom: 0px;">{{$route.query.shopId === 'Uc72d3f8e7d23c3e989cfcd7ba943fdc9' ? 'หน่วยงาน':'ชื่อร้าน' }}</p>
                <p class="text-center" style="color:#ABA3A3;">{{shopName}}</p>
              </v-col>
              <v-col cols="6">
                <p class="text-center textcontent" style="color:#000000;margin-bottom: 0px;">สาขา</p>
                <p class="text-center" style="color:#ABA3A3;">{{bookingitem[0].masBranchName}}</p>
              </v-col>
            </v-row>
            <v-row v-if="bookingitem.length > 0">
              <v-col cols="6">
                <p class="text-center textcontent" style="color:#000000;margin-bottom: 0px;">ประเภทบริการ</p>
                <p class="text-center" style="color:#ABA3A3;">{{bookingitem[0].flowName}}</p>
              </v-col>
              <v-col cols="6" v-for="(item, index) in bookingitem.filter(el => { return el.fieldName !== 'ชื่อ' })" :key="index">
                <p class="text-center textcontent" style="color:#000000;margin-bottom: 0px;">{{item.fieldName}}</p>
                <p class="text-center" style="color:#ABA3A3;">{{item.fieldValue}}</p>
              </v-col>
              <v-col cols="12" v-if="bookingitem[0].bookingEmpFlowName !== ''">
                <p class="text-center textcontent" style="color:#000000;margin-bottom: 0px;">{{bookingitem[0].empTitleTh}}</p>
                <p class="text-center" style="color:#ABA3A3;">{{bookingitem[0].bookingEmpFlowName}}</p>
              </v-col>
            </v-row>
          </div>
          <br>
          <div class="text-center">
            <qrcode-vue  :value="value" :size="size" level="H" :foreground="foreground" />
          </div>
          <h6 class="text-center" style="font-weight: 900; color:#ABA3A3">{{bookNo}}</h6>
          <v-btn
          :color="DarkModeButton"
          block
          dark
          @click="close ()"
          >
            ปิด
          </v-btn>
      </v-card>
    </v-card>
  </v-main>
</template>

<script>
import axios from 'axios' // api
// import adminLeftMenu from '../Sidebar.vue' // เมนู
import QrcodeVue from 'qrcode.vue'
import pdfMake from 'pdfmake/build/pdfmake'
// import pdfFonts from 'pdfmake/build/vfs_fonts'
import pdfFonts from '../../assets/custom-fonts'
// import JsonExcel from 'vue-json-excel' // https://www.npmjs.com/package/vue-json-excel
// import XLSX from 'xlsx' // import xlsx
// import readXlsxFile from 'read-excel-file'
// import moment from 'moment' // แปลง date
// const app = Vue.createApp({})

export default {
  components: {
    QrcodeVue
    // downloadExcel: JsonExcel,
    // XLSX,
    // readXlsxFile
  },
  created () {
    // setInterval(this.getNowGlobal, 1000)
  },
  data () {
    return {
      PK: '',
      path: '/Job/',
      pathToweb: 'https://betask-linked-admin.web.app/JobConfirm?jobId=',
      userId: '',
      profile: [],
      bookNo: this.$route.query.bookNo,
      shopId: this.$route.query.shopId || '',
      bookingitem: [],
      skip: {
        userId: 'user-skip'
      },
      jobitem: [],
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        }
      ],
      session: this.$session.getAll(),
      value: '',
      size: 200,
      foreground: '#000000',
      background: '#E1F3FF',
      DarkMode: '',
      DarkModeStatus: null,
      DarkModeButton: '',
      DarkModeBackground: '',
      DarkModefont: '',
      ColorByShop: [],
      LoGo: [],
      shop: [],
      cusName: '',
      shopName: '',
      ImgCover: ''
    }
  },
  async mounted () {
    let checkShopId = ''
    if (this.$route.query.shopId) {
      checkShopId = this.$route.query.shopId
    } else {
      const queryString = decodeURIComponent(window.location.search).replace(
        '?liff.state=',
        ''
      )
      console.log('queryString', queryString)
      const params = new URLSearchParams(queryString)
      checkShopId = params.get('shopId')
    }
    let dataLineConfig = await this.getDataLineConfig(checkShopId)
    await this.checkLiffLogin(dataLineConfig)
    console.log('value', this.value)
    await this.getShop()
    await this.getbooking()
    // this.printPDF()
  },
  methods: {
    async getShop () {
      if (this.$route.query.shopId) {
        await axios.get(this.DNS_IP + '/sys_shop/get?shopId=' + this.$route.query.shopId).then(response => {
          let rs = response.data
          if (rs.length > 0) {
            this.shop = rs
            rs.forEach(v => {
              if (v.primaryColor) {
                this.ColorByShop.push(v.primaryColor, v.secondaryColor)
                this.DarkModeBackground = v.primaryColor
                this.DarkModeButton = v.secondaryColor
              } else {
                this.ColorByShop.push('#E1F3FF', '#FFFFFF')
                this.DarkModeBackground = '#FFFFFF'
                this.DarkModeButton = '#E1F3FF'
              }
              if (v.shopImge) {
                this.LoGo = v.shopImge
              } else {
                this.LoGo = require('@/assets/LogoDefault.jpg')
              }
              if (v.shopImageCover) {
                this.ImgCover = v.shopImageCover
              } else {
                if (v.category === 'ธุรกิจรถยนต์') {
                  this.ImgCover = require('@/assets/Cover2.jpg')
                } else {
                  this.ImgCover = require('@/assets/Cover2.jpg')
                }
              }
              if (v.darkMode === 'True') {
                this.DarkMode = '#FFFFFF'
                this.DarkModefont = '#FFFFFF'
                this.DarkModeStatus = true
              } else {
                this.DarkMode = '#ffffff00'
                this.DarkModefont = '#173053'
                this.DarkModeStatus = false
              }
              this.shopName = v.shopName
            })
          } else {
            this.shop = null
          }
          console.log('this.LoGo', this.LoGo)
          console.log('this.shop', this.shop)
        })
      } else {
        this.ColorByShop.push('#E1F3FF', '#FFFFFF')
        this.DarkMode = '#ffffff00'
        this.DarkModefont = '#173053'
      }
    },
    async checkLiffLogin (dataLineConfig) {
      console.log('dataLineConfig', dataLineConfig)
      await this.$liff
        .init({
          liffId: dataLineConfig.liffMainID
        }).then(async () => {
          if (process.env.NODE_ENV === 'development') {
            this.getProfile_dev()
          } else {
            if (!this.$liff.isLoggedIn()) {
              this.$liff.login({redirectUri: window.location.href})
            } else {
              await this.getProfile()
            }
          }
        }).catch((err) => {
        // this.$router.push({ name: '404' })
          console.log(err.code, err.message)
        })
      // this.$liff.init({ 'liffId': liffId }, function (data) {})
    },
    async getProfile () {
      let _this = this
      await this.$liff.getProfile().then(function (profile) {
        _this.profile = profile
        console.log('prod', _this.profile)
      }).catch(function (error) {
        console.log('Error getting profile: ' + error)
      })
    },
    getProfile_dev () {
      this.profile = this.$profile_dev
      console.log('dev', this.profile)
    },
    getbooking () {
      this.bookingitem = []
      if (this.bookNo !== '') {
        axios.get(this.DNS_IP + '/BookingData/get?bookNo=' + this.bookNo).then((response) => {
          let rs = response.data
          console.log('rs', rs)
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            // console.log('dddd', d.fieldName)
            // if (d.fieldName === 'ชื่อ') {
            if (d.fieldName === 'ชื่อ') {
              this.cusName = d.fieldValue
            }
            let s = {}
            s.fieldName = d.fieldName
            s.fieldValue = d.fieldValue
            s.dueDate = d.dueDate
            s.masBranchName = d.masBranchName
            s.flowName = d.flowName
            s.empTitleTh = d.empTitleTh || 'พนักงานช่าง'
            s.bookingEmpFlowName = d.bookingEmpFlowName || ''
            this.bookingitem.push(s)
            // }
          }
          if (this.shop[0].category === 'ธุรกิจรถยนต์') {
            this.value = 'https://betask-linked-admin.web.app/Master/BookingList?bookNo=' + this.$route.query.bookNo + '&shopId=' + this.$route.query.shopId + '&type=job'
          } else {
            this.value = 'https://betask-linked-admin.web.app/BookingMobileConfirmJob?bookNo=' + this.$route.query.bookNo + '&shopId=' + this.$route.query.shopId
          }
          console.log('booking', this.bookingitem)
          console.log('value', this.value)
        })
      }
    },
    close () {
      this.$router.push('/Thank?shopId=' + this.$route.query.shopId + '&redirectBy=BookingQrcode')
    },
    async printPDF () {
      console.log('shopName', this.bookingitem)
      console.log('this.LoGo', this.LoGo)
      let content = []
      if (this.shop[0].imageBase64) {
        content.push(
          {
            image: this.shop[0].imageBase64,
            width: 80,
            height: 80,
            style: 'shopImage'
          })
      }
      content.push(
        {
          text: this.shopName,
          style: 'header'
        },
        {
          text: 'สาขา ' + this.bookingitem[0].masBranchName,
          style: 'branch'
        },
        {
          text: this.bookingitem[0].flowName,
          style: 'branch'
        }
      )
      content.push({
        columns: [
          { width: '50%', text: 'วันที่ / เวลานัดหมาย', style: 'columnLeft' },
          { width: '50%', text: this.bookingitem[0].dueDate, style: 'columnRight' }
        ]
      })
      // content.push({
      //   text: 'วันที่ / เวลานัดหมาย',
      //   style: 'fieldMain'
      // })
      // content.push({
      //   text: this.bookingitem[0].dueDate,
      //   style: 'fieldMain'
      // })
      let count = 0
      let columnData = []
      for (let index = 0; index < this.bookingitem.length; index++) {
        const element = this.bookingitem[index]
        if (element.fieldName === 'เบอร์โทร' || element.fieldName === 'ผู้ดำเนินการ') {
          content.push({
            text: `${element.fieldName} : ${element.fieldValue}`,
            style: 'fieldMain'
          })
        } else if (element.fieldName === 'ชื่อ' || element.fieldName === 'นามสกุล') {
          // content.push({
          //   text: `${count}.  ${element.fieldValue}`,
          //   style: 'fieldValue'
          // })
        } else {
          count++
          columnData.push(`${count}.  ${element.fieldValue}`)
        }
      }
      // สร้างคอลัมน์จากข้อมูลที่ได้
      let columnCount = Math.ceil(columnData.length / 2) // จำนวนคอลัมน์

      for (let i = 0; i < columnCount; i++) {
        let column = columnData.slice(i * 2, (i + 1) * 2) // แบ่งข้อมูลออกเป็นกลุ่มคอลัมน์
        content.push({
          columns: [
            { width: '50%', text: column[0] || '' },
            { width: '50%', text: column[1] || '' }
          ],
          style: 'fieldValue'
        })
      }
      const data = {
        content: content,
        styles: {
          shopImage: {
            margin: [0, 10], // กำหนดระยะห่างของรูปภาพ (top, bottom)
            alignment: 'center' // กำหนดการจัดวางรูปภาพ (left, center, right)
            // สามารถเพิ่ม style อื่น ๆ ตามต้องการได้เช่นเดียวกับการกำหนด style ของข้อความ
          },
          columnLeft: {
            fontSize: 13,
            alignment: 'left',
            margin: [0, 0, 0, 10] // top, right, bottom, left
          },
          columnRight: {
            fontSize: 13,
            alignment: 'right',
            margin: [0, 0, 0, 0] // top, right, bottom, left
          },
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 10] // top, right, bottom, left
          },
          branch: {
            fontSize: 15,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 10] // top, right, bottom, left
          },
          fieldMain: {
            fontSize: 13,
            alignment: 'left',
            margin: [0, 0, 0, 10] // top, right, bottom, left
          },
          fieldValue: {
            fontSize: 13,
            alignment: 'left',
            margin: [10, 0, 0, 10] // top, right, bottom, left
          }
        },
        defaultStyle: { // 4. default style 'KANIT' font to test
          font: 'Kanit'
        }
      }

      // กำหนด vfs และ fonts
      pdfMake.vfs = pdfFonts.pdfMake.vfs
      pdfMake.fonts = {
        Roboto: {
          normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
          bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
          italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
          bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
        },
        Kanit: {
          normal: 'Kanit-Regular.ttf',
          bold: 'Kanit-Medium.ttf',
          italics: 'Kanit-Italic.ttf',
          bolditalics: 'Kanit-MediumItalic.ttf'
        }
      }
      console.log('data', data)
      // สร้าง PDF
      pdfMake.createPdf(data).download('example.pdf')
    }
  }
}

</script>
<style scope>
.main{
  padding: 0px;
  background: #FFFFFF;
}
.content{
  align-items: center;
  border-radius: 50px;
}
</style>
