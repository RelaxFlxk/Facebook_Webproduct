<template>
  <v-main>
    <v-card
    :ripple="false"
    :img="ImgCover"
    height="240px"
    width="100%"
    >
    </v-card>
    <v-card class="pa-6 px-3 pb-10 mt-n10"
          :color="DarkModeBackground"
          :style="'background-color:'+ DarkModeBackground +';min-height: 100vh;border-radius: 45px 45px 0px 0px;'"
          >
        <v-row>
          <v-col class="text-center">
            <v-avatar class="mt-n16 pa-1" style="" :color="DarkModeBackground" size="150">
            <img
              :src="LoGo"
            >
          </v-avatar>
          </v-col>
         </v-row>
      <v-sheet
        class="mx-auto mt-5 pa-0 pt-5 pb-5"
        min-height="60vh"
        rounded
        :style="'background-color:' + '#FFFFFF' +';border-radius: 15px 15px 15px 15px;'"
      >
      <div style="display:flex;justify-content: center;" class="ma-3">
            <v-chip
              class="mr-1 font-weight-black"
              :style="'background-color:' + (languageSelect === 0 ? DarkModeButton : 'rgb(103 103 103 / 18%)') + ';font-size:20px'"
              dark
              @click="languageSelect = 0"
              >
              <v-avatar left>
                <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fflag-TH.png?alt=media&token=e4bd7ffa-aed9-47e3-9240-4dcb9d8d284e"></v-img>
              </v-avatar>
                TH
            </v-chip>
            <v-chip
              class="ml-1 font-weight-black"
              :style="'background-color:' + (languageSelect === 1 ? DarkModeButton : 'rgb(103 103 103 / 18%)') + ';font-size:20px'"
              dark
              @click="languageSelect = 1">
              <v-avatar left>
                <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fflag-USA1.png?alt=media&token=a83dd820-f576-457a-8d08-1009cea9d70b"></v-img>
              </v-avatar>
                EN
            </v-chip>
          </div>
       <h2
          class="text-center mt-1 font-weight-bold"
          :style="'color:' + '#000000' + ';'"
          v-if="shop.length > 0"
        >
        {{ languageSelect === 0 ? "ตรวจสอบคิวนัดหมาย" : "Check queue" }}
        </h2>
        <h4
          class="text-center mt-1 font-weight-bold"
          :style="'color:' + '#000000' + ';'"
          v-if="shop.length > 0 && shop[0].showShopName === 'True'"
        >
          {{ shop[0].shopName }}
        </h4>
        <v-row align="center" class="pa-4 pl-7">
          <v-col cols="12" >
            <v-select
            v-if="branch.length > 1"
              v-model="formSelect.masBranchID"
              :label="languageSelect === 0 ? 'สาขา *' : 'Branch *'"
              dense
              outlined
              :item-text="languageSelect === 0 ? 'text' : 'textEn'"
              :items="branch"
              attach
            :menu-props="{ bottom: true, offsetY: true }"
              @change="selectBranch()"
            ></v-select>
            <v-select
            v-if="formSelect.masBranchID !== '' && formSelect.masBranchID !== null"
              v-model="formSelect.flowId"
              :label="languageSelect === 0 ? 'ประเภทบริการ *' : 'Sevice *'"
              :item-text="languageSelect === 0 ? 'text' : 'textEn'"
              dense
              outlined
              :items="DataFlow"
              attach
            :menu-props="{ bottom: true, offsetY: true }"
              @change="checkBranch(),checkTitleEmp()"
            >
            <template slot="item" slot-scope="data">
              <p class="text-wrap" >{{languageSelect === 0 ? data.item.text : data.item.textEn}}</p>
          </template></v-select>
          <v-select
              :item-text="languageSelect === 0 ? 'text' : 'textEng'"
              item-value="value"
              v-if="customerTimeSlot === 'True' && timeSlotbyCustomer.length > 1"
              v-model="fromAddTimeCus"
              :items="timeSlotbyCustomer"
              :label="languageSelect === 0 ? 'จำนวนชั่วโมง *' : 'number of hours *'"
              :background-color="DarkMode"
              color="#000000"
              outlined
              required
              dense
              attach
              :menu-props="{ bottom: true, offsetY: true }"
              :rules ="[rules.required]"
              @change="selectflowByCustomer()"
            >
            </v-select>
            <!-- <v-select
            v-if="(formSelect.flowId !== '' || formSelect.masBranchID !== '') &&  branch.length > 1"
              v-model="formSelect.masBranchID"
              :label="languageSelect === 0 ? 'สาขา *' : 'Branch *'"
              dense
              outlined
              :item-text="languageSelect === 0 ? 'text' : 'textEn'"
              :items="branch"
              attach
            :menu-props="{ bottom: true, offsetY: true }"
              @change="getEmp(),checkTitleEmp()"
            ></v-select> -->
            <!-- <v-select
              v-if="formSelect.masBranchID !== '' && dataEmp.length > 1"
              v-model="formSelect.empId"
              :label="languageSelect === 0 ? empTitleTh + ' *' : empTitleEng + ' *'"
              dense
              outlined
              :items="dataEmp"
              attach
            :menu-props="{ bottom: true, offsetY: true }"
              @change="fromAddTimeCus = '',checkCustomerTimeSlot()"
            ></v-select> -->
            <!-- <v-select
              :item-text="languageSelect === 0 ? 'text' : 'textEng'"
              item-value="value"
              v-if="customerTimeSlot === 'True' && formSelect.empId !== '' && timeSlotbyCustomer.length > 1"
              v-model="fromAddTimeCus"
              :items="timeSlotbyCustomer"
              :label="languageSelect === 0 ? 'จำนวนชั่วโมง *' : 'number of hours *'"
              :background-color="DarkMode"
              color="#000000"
              outlined
              required
              dense
              attach
              :menu-props="{ bottom: true, offsetY: true }"
              :rules ="[rules.required]"
              @change="selectflow()"
            >
            </v-select> -->
          </v-col>
        </v-row>
        <div class="pa-0 mb-2 mt-n10">
          <v-row>
            <v-col cols="2" class="text-center">
              <v-icon
                class="mr-n13"
                v-if="previous"
                large
                color="#000000"
                @click="setMonthCarousel('previous')"
              >
                mdi-skip-previous
              </v-icon>
            </v-col>
            <v-col cols="8" class="text-center">
            <v-menu
              ref="menupicker"
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="-80"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                  <h4
                  class="pa-1 text-center mt-0 font-weight-bold"
                  :style="'color:'+ '#000000' +';'"
                  v-bind="attrs"
                  v-on="on">
                  {{languageSelect === 0 ? defaultMonth.filter((v , k) => (k + 1) === parseInt(momenDate_MM(date)))[0] + ' ' + ' ' + (parseInt(momenDate_YYYY(date)) + 543) : defaultMonthEng.filter((v , k) => (k + 1) === parseInt(momenDate_MM(date)))[0] + ' ' + ' ' + (parseInt(momenDate_YYYY(date))) }}
                  </h4>
              </template>
              <v-date-picker
                v-model="date"
                type="month"
                no-title
                scrollable
                @input="menu2 = false"
                :min="currentMonth"
                :locale="languageSelect === 0 ? 'th': 'sv-se'"
                @change="setMonthCarousel()"
              ></v-date-picker>
            </v-menu>
            </v-col>
            <v-col cols="2" class="text-center">
              <v-icon
                class="ml-n13"
                large
                color="#000000"
                @click="setMonthCarousel('next')"
              >
                mdi-skip-next
              </v-icon>
            </v-col>
          </v-row>
        </div>
        <v-slide-group
          v-if="dateSelect.length > 0"
          v-model="model"
          center-active
          class="pa-4 pt-0 mt-n1"
          color="primary"
        >
          <v-slide-item
            v-for="(item, n) in dateSelect"
            :key="n"
          >
            <v-card
              :color="item.active ? '#0D47A1' : item.color"
              :style="'border-radius: 15px 15px 15px 15px;'"
              class="ma-1"
              height="65px"
              width="50px"
              v-on:click="item.active? item.active = false: item.active = true  ,getDetails(item,n)"
              v-if="dayoff(item)"
            >
              <v-row
                class="fill-height"
                align="center"
                justify="center"
              >
              <v-col cols="12" class="pa-0 " v-if="languageSelect === 0">
                <p class="text-center pa-0 ma-0 mt-5 font-weight-bold" :style="'color:'+ (item.active ? '#FFFFFF' : item.colortext)" >{{item.text + '.'}}</p>
              </v-col>
              <v-col cols="12" class="pa-0 " v-else>
                <p class="text-center pa-0 ma-0 mt-5 font-weight-bold" :style="'color:'+ (item.active ? '#FFFFFF' : item.colortext)" >{{dateEng.filter(el => { return el.text === item.text })[0].textEn + '.'}}</p>
              </v-col>
              <v-col cols="12" class="pa-0" >
                <h4 class="text-center pa-0 ma-0 mt-n1 font-weight-bold" :style="'color:'+ (item.active ? '#FFFFFF' : item.colortext)" >{{item.value}}</h4>
              </v-col>
              </v-row>
            </v-card>
            <v-sheet
            :color="item.active ? '#000000' : '#FFFFFF'"
              :style="'border-radius: 15px 15px 15px 15px;'"
              class="ma-1"
              height="65px"
              width="50px"
              readonly
              v-else
            >
              <v-row
                class="fill-height"
                align="center"
                justify="center"
              >
              <v-col cols="12" class="pa-0 " v-if="languageSelect === 0">
                <p class="text-center pa-0 ma-0 mt-5 font-weight-bold" :style="'color:'+ (item.active ? '#FFFFFF' : item.colortext)" >{{item.text + '.'}}</p>
              </v-col>
              <v-col cols="12" class="pa-0 " v-else>
                <p class="text-center pa-0 ma-0 mt-5 font-weight-bold" :style="'color:'+ (item.active ? '#FFFFFF' : item.colortext)" >{{dateEng.filter(el => { return el.text === item.text })[0].textEn + '.'}}</p>
              </v-col>
              <v-col cols="12" class="pa-0" >
                <h4 class="text-center pa-0 ma-0 mt-n1 font-weight-bold" :style="'color:'+ (item.active ? '#FFFFFF' : item.colortext)" >{{item.value}}</h4>
              </v-col>
              </v-row>
            </v-sheet>
          </v-slide-item>
        </v-slide-group>
        <v-row class="ma-4" v-if="timeavailable.length > 0 && dateSelect.filter((aa) => aa.active === true).length > 0">
          <v-col cols="4" class="pa-1 text-center">
            <p class="ma-0"><v-icon color="rgb(235, 87, 87)" class="mr-2">mdi-checkbox-multiple-blank</v-icon>{{languageSelect === 0 ? 'เต็ม': 'FULL'}}</p>
          </v-col>
          <v-col cols="4" class="pa-1 text-center">
            <p class="ma-0"><v-icon color="rgb(13, 71, 161)" class="mr-2">mdi-checkbox-multiple-blank</v-icon>{{languageSelect === 0 ? 'ว่าง': 'READY'}}</p>
          </v-col>
          <v-col cols="4" class="pa-1 text-center">
            <p class="ma-0"><v-icon class="mr-1">mdi-checkbox-multiple-blank</v-icon>{{languageSelect === 0 ? 'เกินเวลา': 'OVERTIME'}}</p>
          </v-col>
          <v-col cols="4" class="pa-1" v-for="(item,index) in timeavailable" :key="index" >
            <!-- <v-sheet
               v-if="item.status === true"
              class="font-weight-bold text-center"
              :color="item.color"
              width="100%"
              height="36px"
              elevation="1"
              rounded
              style="display: flex;justify-content: center;align-items: center;"
              @click="getDataAutoSetTime(item)"
              >
            <p class="ma-0" style="word-wrap: break-word;color: #FFFFFF;font-size:small;">{{item.text + item.status}}</p>
            </v-sheet>
            <v-sheet
               v-else
              class="font-weight-bold text-center"
              :color="item.color"
              width="100%"
              height="36px"
              rounded
              style="display: flex;justify-content: center;align-items: center;"
              >
            <p class="ma-0" style="word-wrap: break-word;color: #FFFFFF;font-size:small;">{{item.text+ item.status}}</p>
            </v-sheet> -->
          <v-btn
            block
            style="word-wrap: break-word;color: #FFFFFF;font-size:11px;width: 100px;"
            v-if="item.status === true"
            :color="item.color"
            @click="getDataAutoSetTime(item)"
          ><strong style="word-wrap: break-word;">{{item.text}}</strong></v-btn>
          <v-btn
            block
            style="word-wrap: break-word;color: #FFFFFF;font-size:11px;width: 100px;"
            v-else
            :color="item.color"
          ><strong style="word-wrap: break-word;">{{item.text}}</strong></v-btn>
          </v-col>
        </v-row>
        <v-row class="ma-4" v-if="loaderCheck">
          <v-col cols="12" class="mt-10 text-center">
            <v-progress-circular
            :size="70"
            :width="7"
            color="rgb(13, 71, 161)"
            indeterminate
          ></v-progress-circular>
          </v-col>
        </v-row>
      </v-sheet>
    </v-card>
    <v-dialog
      v-model="dialogSelectGoto"
      max-width="100%"
      persistent
    >
      <v-card style="background: linear-gradient(180deg, #ffffff 10%, #e1f3ff 100%);" height="auto">
        <v-container fluid class="pa-4">
          <!-- <div class="mb-2" style="text-align: end;">
            <v-card-title style="justify-content: space-between;"><div class="pl-3">กรุณาเลือก</div> <v-avatar color="#FAD4D4" size="35">
                  <span style="color:red;padding-bottom: 4px;"><v-icon class="iconify" color="red" data-icon="fluent:receipt-add-20-regular"></v-icon></span>
            </v-avatar></v-card-title>
          </div> -->
          <v-row dense>
            <v-col cols="6" style="border-right: 2px solid #ccd1e4;">
              <div style="text-align: center;" @click="dialogSelectGoto = false">
                <v-avatar color="#9A9897" size="50">
                  <span><span><v-icon class="iconify" color="white" style="font-size: 30px;" data-icon="fa:calendar"></v-icon></span></span>
                </v-avatar>
                <div>นัดหมายใหม่</div>
                <div>Boooking</div>
              </div>
            </v-col>
            <v-col cols="6" v-if="statusCheckDiposit">
              <div height="200px" style="text-align: center;" @click="gotoCheckUser('upload')">
                <v-avatar color="#9A9897" size="50">
                  <span><v-icon class="iconify" color="white" style="font-size: 40px;" data-icon="fluent:receipt-add-20-regular"></v-icon></span>
                </v-avatar>
                <div>แนบหลักฐานโอนเงิน</div>
                <div>Uploaded file</div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script>
import axios from 'axios' // api
import QrcodeVue from 'qrcode.vue'
import moment from 'moment'
export default {
  components: {
    name: '',
    QrcodeVue
  },
  watch: {
    async model (newQuestion, oldQuestion) {
      let year = moment(this.date).format('YYYY')
      this.itemMonth.forEach((v, k) => {
        if (k === newQuestion) {
          // console.log('moment', moment(year + v.value, 'YYYY-MM').format('YYYY-MM'))
          this.date = moment(year + v.value, 'YYYY-MM').format('YYYY-MM')
        }
      })
      // await this.DefaultDay(this.date)
      // await this.DefaultDay()
    }
  },
  data () {
    return {
      model: 0,
      previous: false,
      itemMonth: [],
      dateEng: [{text: 'อา', textEn: 'Sun'}, {text: 'จ', textEn: 'Mon'}, {text: 'อ', textEn: 'Tue'}, {text: 'พ', textEn: 'Wed'}, {text: 'พฤ', textEn: 'Thu'}, {text: 'ศ', textEn: 'Fri'}, {text: 'ส', textEn: 'Sat'}],
      defaultMonth: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
      defaultMonthEng: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      menu2: false,
      date: moment(moment().format('YYYY-MM'), 'YYYY-MM').format('YYYY-MM'),
      currentDate: moment().format('YYYY-MM-DD'),
      currentMonth: moment().format('YYYY-MM'),
      showDetails: [],
      allDetails: [],
      LimitBooking: [],
      dateSelect: [],
      formSelect: {
        flowId: '',
        empId: '',
        masBranchID: '',
        datemonth: '',
        dateday: '',
        time: ''
      },
      value: '',
      size: 200,
      foreground: '#000000',
      valid: true,
      userName: '',
      userPassword: '',
      shopId: this.$route.query.shopId,
      profile: null,
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
      },
      dialog: false,
      ColorByShop: [],
      DarkMode: '',
      DarkModeStatus: null,
      DarkModeButton: '',
      DarkModeBackground: '',
      DarkModefont: '',
      shop: [],
      LoGo: [],
      ImgCover: '',
      bookingthankText: null,
      redirectBy: null,
      DataFlow: [],
      DataFlowNameAll: [],
      languageSelect: 0,
      dateDayCustom: [],
      dateDayoffValue: [],
      statusChek: false,
      dataEmp: [],
      dataEmpAll: [],
      EmpItemLimit: [],
      branchData: [],
      branch: [],
      timeavailable: [],
      empTitleTh: '',
      empTitleEng: '',
      timeSlotbyCustomer: [],
      customerTimeSlot: 'False',
      fromAddTimeCus: '',
      loaderCheck: false,
      statusCheckDiposit: false,
      dialogSelectGoto: false,
      empTime: [],
      setTimeError: true
    }
  },
  async mounted () {
    // let checkShopId = ''
    // if (this.$route.query.shopId) {
    //   checkShopId = this.$route.query.shopId
    // } else {
    //   const queryString = decodeURIComponent(window.location.search).replace(
    //     '?liff.state=',
    //     ''
    //   )
    //   console.log('queryString', queryString)
    //   const params = new URLSearchParams(queryString)
    //   checkShopId = params.get('shopId')
    // }
    // let dataLineConfig = await this.getDataLineConfig(checkShopId)
    // await this.checkLiffLogin(dataLineConfig)
    // await this.checkBanUserId(this.profile.userId, checkShopId)
    await this.getShop()
    // await this.getDataFlow()
    await this.getDataBranch()
    // await this.checkUserId()
    if (this.$route.query.empId) {
      this.formSelect.empId = parseInt(this.$route.query.empId)
      this.formSelect.flowId = parseInt(this.$route.query.flowId)
      this.formSelect.masBranchID = parseInt(this.$route.query.masBranchID)
      await this.checkBranch()
    }
    // await this.setMonthCarousel()
    // await this.setDataDefault()
  },
  created () {
    window.addEventListener('resize', this.myEventHandler)
  },
  destroyed () {
    window.removeEventListener('resize', this.myEventHandler)
  },
  methods: {
    async checkUserId () {
      this.statusCheckDiposit = false
      await axios
        .get(
          this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.$route.query.shopId +
            '&userId=' +
            this.profile.userId +
            '&checkOnsite=is null&statusBt=null&checkDeposit=True&depositStatus=null'
        )
        .then(async response => {
          let rs = response.data
          console.log('response.data', rs)
          if (rs.status === false) {
            this.dialogSelectGoto = false
          } else {
            let checkDepositStatus = rs.filter(el => { return moment(el.dueDate).format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD') })
            // console.log('response.data', checkDepositStatus)
            if (checkDepositStatus.length > 0) {
              this.statusCheckDiposit = true
              this.dialogSelectGoto = true
            } else {
              this.statusCheckDiposit = false
              this.dialogSelectGoto = false
            }
          }
        })
    },
    gotoCheckUser (text) {
      if (text === 'history') {
        this.$router.push('/CheckBookingNext?shopId=' + this.$route.query.shopId)
      } else {
        this.$router.push('/PaymentUpload?shopId=' + this.$route.query.shopId + '&languageSelect=' + this.languageSelect)
      }
    },
    async checkTitleEmp () {
      console.log('ONE')
      let checkDataEmpTitle = this.DataFlowNameAll.filter(el => { return el.flowId === this.formSelect.flowId })
      if (checkDataEmpTitle.length > 0) {
        this.empTitleTh = checkDataEmpTitle[0].empTitleTh || 'พนักงานช่าง'
        this.empTitleEng = checkDataEmpTitle[0].empTitleEng || 'Employee'
      } else {
        this.empTitleTh = 'พนักงานช่าง'
        this.empTitleEng = 'Employee'
      }
    },

    async checkBranch () {
      let checkFlow = this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId)[0].customerTimeSlot
      console.log('checkFLow', checkFlow)
      if (checkFlow === 'True') {
        await this.getEmpCheck()
        await this.checkSlot()
        if (this.setTimeError) {
          if (this.formSelect.masBranchID !== '' && this.formSelect.flowId !== '') {
            await this.getEmp()
          }
        } else {
          this.$swal({
            title: 'ผิดพลาด',
            text: 'เนื่องจากบริการนี้ไม่สามารถใช้งานได้ กรุณาติดต่อร้านค้า',
            type: 'info',
            timer: 5000,
            showConfirmButton: false
          })
          this.formSelect.flowId = ''
          this.customerTimeSlot = 'False'
          this.dateSelect = []
        }
      } else {
        console.log('TWO')
        if (this.formSelect.masBranchID !== '' && this.formSelect.flowId !== '') {
          await this.getEmp()
        }
      }
    },
    dayCustom (item) {
      let dateDayCustom = this.dataEmpAll.filter((a) => a.empId === this.formSelect.empId)[0].dateDayCustom || '[]'
      let d = JSON.parse(dateDayCustom).filter((b) => b === item)
      return d
    },
    dayoff (dt) {
      // คำนวนวันหยุด กรณีช่างหลายคน
      let item = dt.date
      let newDate = new Date(item)
      let day = newDate.getDay()
      let dateOffitem = []
      let dateOnitem = []
      // console.log('!!!', this.dataEmpAll)
      for (let i = 0; i < this.dataEmpAll.length; i++) {
        let item = this.dataEmpAll[i]
        if (item.typeDayCustom === 'off') {
          if (JSON.parse(item.dateDayoffValue).filter((f) => f === day).length > 0) {
            dateOffitem.push(dt.date)
          } else {
            if (JSON.parse(item.dateDayCustom).filter((f) => f === dt.date).length > 0) {
              dateOffitem.push(dt.date)
            }
          }
        }
        if (item.typeDayCustom === 'on') {
          if (JSON.parse(item.dateDayCustom).filter((f) => f === dt.date).length > 0) {
            dateOnitem.push(dt.date)
          }
        }
      }
      // console.log('dateOffitem', dateOffitem)
      // console.log('dateOnitem', dateOnitem)
      let status = true
      if (dateOffitem.filter((f) => f === dt.date).length > 0 && dateOffitem.length === this.dataEmpAll.filter((f) => f.typeDayCustom === 'off').length) {
        status = false
      }
      if (dateOnitem.filter((f) => f === dt.date).length > 0) {
        status = true
      }
      // คำนวนวันหยุด กรณีช่างหลายคน
      // let item = dt.date
      // let typeDayCustom = []
      // let dayValue = []
      // let dayCustom = []
      // let dayCustomAll = []
      // let newDate = new Date(item)
      // let day = newDate.getDay()
      // this.dataEmpAll.forEach((ii) => {
      //   typeDayCustom.push(ii.typeDayCustom)
      //   // หาวันหยุดประจำสัปดาห์
      //   let Dvalu = JSON.parse(ii.dateDayoffValue)
      //   Dvalu.forEach((Di) => {
      //     if (Di === day) {
      //       // console.log('Dvalu', Di)
      //       dayValue.push({
      //         date: Di,
      //         typeDayCustom: ii.typeDayCustom
      //       })
      //     }
      //   })
      //   // หาวัดหยุดเพิ่มเติม
      //   let Dcustom = JSON.parse(ii.dateDayCustom)
      //   Dcustom.forEach((Di) => {
      //     if (item === Di) {
      //       // console.log('Dcustom', Di)
      //       // Di.typeDayCustom = ii.typeDayCustom
      //       // dayCustom.push(Di)
      //       dayCustom.push({
      //         date: Di,
      //         typeDayCustom: ii.typeDayCustom
      //       })
      //     }
      //     dayCustomAll.push({
      //       date: Di,
      //       typeDayCustom: ii.typeDayCustom
      //     })
      //   })
      // })
      // // console.log('CHECKON', newDate, '-', dayCustom.filter((ii) => ii.typeDayCustom === 'on'))
      // // ทำการตรวจสอบว่าช่าง เป็นวัดที่เปิดหรือวันที่ปิด โดยการ For หน้าเจอวันที่ ปิด 1 คนจะถือว่า เป็นวันปิดทุกคน
      // if (typeDayCustom.filter((tD) => tD === 'off').length > 0) {
      //   // console.log('IF-typeDayCustom', dayValue.length, dayCustom.length)
      //   let status = []
      //   dayValue.forEach((dV) => {
      //     if (dV.date === day && (dayCustom === undefined || dayCustom.filter((ii) => ii.typeDayCustom === 'on').length === 0)) {
      //       if (this.dataEmpAll.length > 1 && (dayCustomAll.filter((ii) => (item === ii.date) && ii.typeDayCustom === 'on').length > 0 || dayCustomAll.length === 0)) {
      //         // console.log('IFdayValue')
      //         if (dayValue.length === this.dataEmpAll.length || ((dayValue.length + dayCustom.length) === this.dataEmpAll.length)) {
      //           status.push(true)
      //         } else {
      //           status.push(false)
      //         }
      //       } else {
      //         status.push(true)
      //       }
      //     } else {
      //       // console.log('ELSE')
      //       status.push(false)
      //     }
      //   })
      //   dayCustom.forEach((dC) => {
      //     // console.log('IF TWO', dC.date)
      //     if (dC.date === item && dayCustom.filter((ii) => ii.typeDayCustom === 'on').length === 0) {
      //       // console.log('IFdayCustom', ii, '=', dC, item)
      //       if (this.dataEmpAll.length > 1 && (dayCustomAll.filter((ii) => (item === ii.date) && ii.typeDayCustom === 'on').length > 0 || dayCustomAll.length === 0)) {
      //         // console.log('IFdayCustom')
      //         if (dayCustom.length === this.dataEmpAll.length || ((dayValue.length + dayCustom.length) === this.dataEmpAll.length)) {
      //           status.push(true)
      //         } else {
      //           status.push(false)
      //         }
      //       } else {
      //         status.push(true)
      //       }
      //     } else {
      //       status.push(false)
      //     }
      //   })
      //   // ทำการเช็ค status ถ้ามีค่า true ให้ถือว่าวันนี้มีข่างรับงานอยู้
      //   // if (item === '2023-05-30') {
      //   //   console.log('status', status, status.filter((st) => st === true).length)
      //   // }
      //   if (status.filter((st) => st === true).length === 0) {
      //     return true
      //   } else {
      //     return false
      //   }
      // } else {
      //   let status = []
      //   dayCustom.forEach((dC) => {
      //     if (dC.date !== item) {
      //       status.push(false)
      //     } else {
      //       status.push(true)
      //     }
      //   })
      //   // ทำการเช็ค status ถ้ามีค่า true ให้ถือว่าวันนี้มีข่างรับงานอยู้
      //   if (status.filter((st) => st === true).length > 0) {
      //     return true
      //   } else {
      //     return false
      //   }
      // }
      return status
    },
    async DefaultDay () {
      // console.log('dateSelect*****', this.dateSelect)
      let count = 0
      this.dateSelect.forEach((v, k) => {
        if (count === 0) {
          if (this.dayoff(v)) {
            v.active = true
            this.getDetails(v, k)
            count = 1
            // console.log('kkkkkkkkelse', k)
            // console.log('kkkkkkkkelse', v)
          }
          // v.active = true
          // this.getDetails(v, k)
          // count = 1
        }
      })
    },
    // async setDataDefault () {
    //   this.formSelect.flowId = this.DataFlow[0].value
    //   await this.setQueue(this.date)
    //   await this.DefaultDay()
    // },
    async setMonthCarousel (item) {
      // console.log('//////////////////////////', moment(this.date, 'YYYY-MM').format('YYYY-MM'))
      // console.log('currentMonth', moment(this.currentMonth, 'YYYY-MM').format('YYYY-MM'))
      if (item === 'next') {
        this.date = moment(this.date).add(1, 'months').format('YYYY-MM')
      } else if (item === 'previous') {
        this.date = moment(this.date).add(-1, 'months').format('YYYY-MM')
      } else {

      }
      if (moment(this.date, 'YYYY-MM').format('YYYY-MM') > moment(this.currentMonth, 'YYYY-MM').format('YYYY-MM')) {
        this.previous = true
        // console.log('true')
      } else {
        this.previous = false
        // console.log('false')
      }
      // console.log('******************', this.date)
      await this.setQueue(moment(this.date, 'YYYY-MM').format('YYYY-MM'))
      await this.DefaultDay()
    },
    async setMonthCarousel_Check (item) {
      // console.log('//////////////////////////', moment(this.date, 'YYYY-MM').format('YYYY-MM'))
      // console.log('currentMonth', moment(this.currentMonth, 'YYYY-MM').format('YYYY-MM'))
      if (item === 'next_bookingNowCheckCount_month') {
        this.date = moment(this.date).add(1, 'months').format('YYYY-MM')
      }
      if (moment(this.date, 'YYYY-MM').format('YYYY-MM') > moment(this.currentMonth, 'YYYY-MM').format('YYYY-MM')) {
        if (this.next_bookingNowCheckCount_month === 'False') {
          this.previous = true
          console.log('true')
        }
        // console.log('true')
      } else {
        this.previous = false
        // console.log('false')
      }
    },
    async addBooking () {
      // console.log('formSelect', this.formSelect)
      // console.log(', this.timeSlotbyCustomer', this.fromAddTimeCus)
      this.$swal({
        title: this.languageSelect === 0 ? 'ต้องการนัดหมาย ใช่หรือไม่?' : 'Want to make an appointment?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: this.languageSelect === 0 ? 'ใช่' : 'Yes',
        cancelButtonText: this.languageSelect === 0 ? 'ไม่' : 'No'
      })
        .then(async result => {
          this.$router.push('/BookingFormAutoEmpNoLine?shopId=' + this.shopId + '&source=CalendarBookingAutoEmpNoLine&time=' +
          this.formSelect.time + '&flowId=' + this.formSelect.flowId + '&date=' +
          this.formSelect.dateday + '&empId=' + this.formSelect.empId + '&masBranchID=' + this.formSelect.masBranchID + '&languageSelect=' + this.languageSelect +
           '&fromAddTimeCus=' + this.fromAddTimeCus + '&customerTimeSlot=' + this.customerTimeSlot)
        })
    },
    async getDataAutoSetTime (item) {
      // console.log('item', item.value)
      // console.log('formSelect', this.formSelect)
      let dueDate = this.formSelect.dateday
      let getDay = new Date(this.formSelect.dateday).getDay()
      let Time = item.value
      let flowId = this.formSelect.flowId
      let empId = this.timeavailable.filter((a) => a.value === item.value)[0].empId
      // console.log('Time', empId)
      await axios.get(this.DNS_IP + '/Booking/getAutoSetTime?shopId=' + this.shopId + '&dueDate=' + dueDate + '&getDay=' + getDay + '&Time=' + Time + '&flowId=' + flowId + '&empId=' + empId)
        .then(async (response) => {
          let rs = response.data
          // console.log('RS', rs)
          if (rs.length > 0) {
            this.formSelect.empId = rs[0].empId
            this.formSelect.time = item.value
            this.addBooking()
          } else {
            this.formSelect.empId = ''
          }
        }).catch((error) => console.log(error))
    },
    async getLimitBookingAutoEmp (dateDay) {
      // let LimitBooking = axios.get(this.DNS_IP + '/LimitBookingDateEmp/get?shopId=' + this.shopId + '&bookingDate=' + this.date).then(async (response) => {
      //   let rs = response.data
      //   return rs
      // })
      let LimitBooking = axios.get(this.DNS_IP + '/LimitBookingDateEmp/getConcat?shopId=' + this.shopId + '&bookingDate=' + dateDay).then(async (response) => {
        let rs = response.data
        let Data = []
        if (rs.length > 0) {
          // console.log('rs', rs)
          await rs.forEach((item) => {
            let Time = JSON.parse(item.LimitBookingEpm)
            // console.log('TIME', Time)
            Time.forEach((timeItem) => {
              let s = {}
              s.empId = item.empId
              s.bookingTime = timeItem.bookingTime
              s.timeSlotCustomer = timeItem.timeSlotCustomer
              Data.push(s)
            })
          })
          // console.log('DATA', Data)
        }
        return Data
      })
      return LimitBooking
    },
    async autoSetTime (item) {
      this.loaderCheck = true
      this.timeavailable = []
      this.formSelect.dateday = item
      let dateDay = item

      // console.log('!!!!!', new Date(this.date).getDay())
      // console.log('!!!!!', new Date(this.date).getDay())

      // ไม่ได้ใช้ตัวแปร
      // let getDay = new Date(dateDay).getDay()
      // let LimitBookingGet = await this.getLimitBookingAutoEmp(dateDay)
      // let LimitBookingData = LimitBookingGet.length > 0 ? LimitBookingGet : []

      // console.log('LimigBooking', LimitBookingGet)
      // forEach พนักงานทั้งหมดที่รับผิดชอบประเภทบริการนี้
      // console.log('!!!!!', this.EmpItemLimit.length)
      // ทำการตรวจสอบ เวลาที่มีการจองแล้ว
      await this.ForLoopTime(item)
      // await this.timeavailable.sort(this.compare)
      // เรียงเวลาจากน้อยไปมาก
      await this.SortTimeavailable()
      // ตัดเวลาในกรณีที่เป็นวันปัจจุบัน เพื่อตัดเวลาที่ผ่านมาแล้วออก
      await this.setTimeToday(dateDay)
      // let DD = [...new Set(this.timeavailable.map((el) => el.value))]
      // console.log('TIME!!!', this.timeavailable)
      this.loaderCheck = false
    },
    async ForLoopTime (item) {
      const startTime = new Date()
      let dateDay = item
      let getDay = new Date(dateDay).getDay()
      let LimitBookingGet = await this.getLimitBookingAutoEmp(dateDay)
      let LimitBookingData = LimitBookingGet.length > 0 ? LimitBookingGet : []
      await this.EmpItemLimit.forEach(async (item) => {
        // console.log('item', item)
        // ตรวจสอบว่าพนักงานตั้งค่าเวลาไม่เหมือนกันรึป่าว
        // console.log('this.dataEmpAll.filter((a) => a.empId === item.empId)[0].typeDayCustom', this.dataEmpAll)
        let typeDayCustom = await this.dataEmpAll.filter((a) => a.empId === item.empId)[0].typeDayCustom
        // console.log('typeDayCustom****', typeDayCustom)
        let dateDayoff = JSON.parse(this.dataEmpAll.filter((a) => a.empId === item.empId)[0].dateDayoffValue) || []
        let dateDayCustom = JSON.parse(this.dataEmpAll.filter((a) => a.empId === item.empId)[0].dateDayCustom) || []
        if (typeDayCustom === 'off') {
          if (dateDayoff.filter((offItem) => offItem === getDay).length === 0 && dateDayCustom.filter((CusItem) => CusItem === dateDay).length === 0) {
            if (item.setTimebyday === 'True') {
              let TimeJson = JSON.parse(item.setTime)
              // forEach เวลาของพนักงานตามเงื่อนไข IF ว่าวันที่เลือกตรงกับวันไหน จ-อา
              await TimeJson.forEach(async (Titem) => {
                // เงือนไขวัน จ-อา
                if (Titem.value === getDay) {
                  let ddTime = []
                  if (LimitBookingData.length > 0) {
                  // console.log('Tiem.setTime', Titem)
                    ddTime = await this.AutosetlimitBooking(LimitBookingData, item.empId, Titem.setTime)
                  // console.log('DDTIME', ddTime)
                  } else {
                    LimitBookingData = []
                    ddTime = await this.AutosetlimitBooking(LimitBookingData, item.empId, Titem.setTime)
                  // ddTime = Titem.setTime
                  }
                  // console.log('ddTime', ddTime)
                  // นำเงื่อนไขเวลาที่ตรงกับวัน จ-อา แล้ว นำมา forEach ต่อ
                  await ddTime.forEach(async (setTimeItem, key) => {
                  // เช็คเวลาต้องไม่ซ้ำกัน
                    if (setTimeItem.status === undefined) {
                      setTimeItem.status = true
                      setTimeItem.color = '#0ACF83'
                    }
                    // console.log('setTimeItem', this.timeavailable.filter((d) => d.value === setTimeItem.value).length, setTimeItem.value)
                    let dataFilter = this.timeavailable.filter((d) => d.value === setTimeItem.value)
                    let IndexOf = this.timeavailable.findIndex((k) => k.value === setTimeItem.value)
                    if (dataFilter.length === 0) {
                      setTimeItem.empId = item.empId
                      // console.log('setTimeItem!!', setTimeItem.text)
                      this.timeavailable.push(setTimeItem)
                    } else {
                      if (dataFilter[0].status === false && setTimeItem.status === true) {
                      // console.log('aa', dataFilter[0].value, setTimeItem.value)
                        this.timeavailable[IndexOf].empId = item.empId
                        this.timeavailable[IndexOf].text = setTimeItem.text
                        this.timeavailable[IndexOf].value = setTimeItem.value
                        this.timeavailable[IndexOf].status = setTimeItem.status
                        this.timeavailable[IndexOf].color = setTimeItem.color
                      }
                    }
                  })
                }
              })
            } else {
              let TimeJson = JSON.parse(item.setTime)
              // console.log('TimeJson', TimeJson)
              let ddTime = []
              if (LimitBookingData.length > 0) {
                ddTime = await this.AutosetlimitBooking(LimitBookingData, item.empId, TimeJson)
              // console.log('DDTIME', ddTime)
              } else {
                LimitBookingData = []
                ddTime = await this.AutosetlimitBooking(LimitBookingData, item.empId, TimeJson)
              // ddTime = TimeJson
              }
              // console.log('ddTime_ELSE', ddTime)
              // นำเงื่อนไขเวลาที่ตรงกับวัน จ-อา แล้ว นำมา forEach ต่อ
              await ddTime.forEach(async (setTimeItem, key) => {
                // เช็คเวลาต้องไม่ซ้ำกัน
                if (setTimeItem.status === undefined) {
                  setTimeItem.status = true
                  setTimeItem.color = '#0D47A1'
                }
                // console.log('setTimeItem', this.timeavailable.filter((d) => d.value === setTimeItem.value).length, setTimeItem.value)
                let dataFilter = this.timeavailable.filter((d) => d.value === setTimeItem.value)
                let IndexOf = this.timeavailable.findIndex((k) => k.value === setTimeItem.value)
                if (dataFilter.length === 0) {
                  setTimeItem.empId = item.empId
                  // console.log('setTimeItem!!', setTimeItem)
                  // console.log('setTimeItem!2', setTimeItem.text)
                  this.timeavailable.push(setTimeItem)
                } else {
                // console.log('setTimeItem!2', setTimeItem.text)
                  if (dataFilter[0].status === false && setTimeItem.status === true) {
                  // console.log('IF!!!!!', setTimeItem.text)
                    this.timeavailable[IndexOf].empId = item.empId
                    this.timeavailable[IndexOf].text = setTimeItem.text
                    this.timeavailable[IndexOf].value = setTimeItem.value
                    this.timeavailable[IndexOf].status = setTimeItem.status
                    this.timeavailable[IndexOf].color = setTimeItem.color
                  }
                }
              })
            }
          }
        } else {
          // console.log('dateDayCustom.filter((CusItem) => CusItem === dateDay)', dateDayCustom.filter((CusItem) => CusItem === dateDay))
          if (dateDayCustom.filter((CusItem) => CusItem === dateDay).length > 0) {
            if (item.setTimebyday === 'True') {
              let TimeJson = JSON.parse(item.setTime)
              // forEach เวลาของพนักงานตามเงื่อนไข IF ว่าวันที่เลือกตรงกับวันไหน จ-อา
              await TimeJson.forEach(async (Titem) => {
                // เงือนไขวัน จ-อา
                if (Titem.value === getDay) {
                  let ddTime = []
                  if (LimitBookingData.length > 0) {
                  // console.log('Tiem.setTime', Titem)
                    ddTime = await this.AutosetlimitBooking(LimitBookingData, item.empId, Titem.setTime)
                  // console.log('DDTIME', ddTime)
                  } else {
                    LimitBookingData = []
                    ddTime = await this.AutosetlimitBooking(LimitBookingData, item.empId, Titem.setTime)
                  // ddTime = Titem.setTime
                  }
                  // console.log('ddTime', ddTime)
                  // นำเงื่อนไขเวลาที่ตรงกับวัน จ-อา แล้ว นำมา forEach ต่อ
                  await ddTime.forEach(async (setTimeItem, key) => {
                  // เช็คเวลาต้องไม่ซ้ำกัน
                    if (setTimeItem.status === undefined) {
                      setTimeItem.status = true
                      setTimeItem.color = '#0ACF83'
                    }
                    // console.log('setTimeItem', this.timeavailable.filter((d) => d.value === setTimeItem.value).length, setTimeItem.value)
                    let dataFilter = this.timeavailable.filter((d) => d.value === setTimeItem.value)
                    let IndexOf = this.timeavailable.findIndex((k) => k.value === setTimeItem.value)
                    if (dataFilter.length === 0) {
                      setTimeItem.empId = item.empId
                      // console.log('setTimeItem!!', setTimeItem.text)
                      this.timeavailable.push(setTimeItem)
                    } else {
                      if (dataFilter[0].status === false && setTimeItem.status === true) {
                      // console.log('aa', dataFilter[0].value, setTimeItem.value)
                        this.timeavailable[IndexOf].empId = item.empId
                        this.timeavailable[IndexOf].text = setTimeItem.text
                        this.timeavailable[IndexOf].value = setTimeItem.value
                        this.timeavailable[IndexOf].status = setTimeItem.status
                        this.timeavailable[IndexOf].color = setTimeItem.color
                      }
                    }
                  })
                }
              })
            } else {
              let TimeJson = JSON.parse(item.setTime)
              // console.log('TimeJson', TimeJson)
              let ddTime = []
              if (LimitBookingData.length > 0) {
                ddTime = await this.AutosetlimitBooking(LimitBookingData, item.empId, TimeJson)
              // console.log('DDTIME', ddTime)
              } else {
                LimitBookingData = []
                ddTime = await this.AutosetlimitBooking(LimitBookingData, item.empId, TimeJson)
              // ddTime = TimeJson
              }
              // console.log('ddTime_ELSE', ddTime)
              // นำเงื่อนไขเวลาที่ตรงกับวัน จ-อา แล้ว นำมา forEach ต่อ
              await ddTime.forEach(async (setTimeItem, key) => {
                // เช็คเวลาต้องไม่ซ้ำกัน
                if (setTimeItem.status === undefined) {
                  setTimeItem.status = true
                  setTimeItem.color = '#0D47A1'
                }
                // console.log('setTimeItem', this.timeavailable.filter((d) => d.value === setTimeItem.value).length, setTimeItem.value)
                let dataFilter = this.timeavailable.filter((d) => d.value === setTimeItem.value)
                let IndexOf = this.timeavailable.findIndex((k) => k.value === setTimeItem.value)
                if (dataFilter.length === 0) {
                  setTimeItem.empId = item.empId
                  // console.log('setTimeItem!!', setTimeItem)
                  // console.log('setTimeItem!2', setTimeItem.text)
                  this.timeavailable.push(setTimeItem)
                } else {
                // console.log('setTimeItem!2', setTimeItem.text)
                  if (dataFilter[0].status === false && setTimeItem.status === true) {
                  // console.log('IF!!!!!', setTimeItem.text)
                    this.timeavailable[IndexOf].empId = item.empId
                    this.timeavailable[IndexOf].text = setTimeItem.text
                    this.timeavailable[IndexOf].value = setTimeItem.value
                    this.timeavailable[IndexOf].status = setTimeItem.status
                    this.timeavailable[IndexOf].color = setTimeItem.color
                  }
                }
              })
            }
          }
        }
      })
      const endTime = new Date()
      const executionTime = endTime - startTime
      console.log(`เวลาการทำงาน: ${executionTime} มิลลิวินาที`)
    },
    async setTimeToday (dateDay) {
      let bookingNowCheck = this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheck
      // let bookingNowCheckCount = this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheckCount || 1
      let bookingNowCheckTimeStatus = this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheckTimeStatus || 'False'
      let currentDateBybookingNowCheckTimeStatus = moment().format('YYYY-MM-DD')
      if (bookingNowCheck === 'True' && bookingNowCheckTimeStatus === 'True') {
        currentDateBybookingNowCheckTimeStatus = this.currentDate
      }
      if (moment(dateDay).format('YYYY-MM-DD') === moment(currentDateBybookingNowCheckTimeStatus).format('YYYY-MM-DD')) {
        this.timeavailable.forEach(item => {
          if (moment().format(item.value) < moment().format('HH:mm')) {
            item.status = false
            item.color = 'rgb(126 126 126)'
          }
        })
      }
    },
    async SortTimeavailable () {
      // console.log('SortTimeavailable')
      this.timeavailable.sort((a, b) => {
        // console.log('SortTimeavailable', a)
        return a.value.localeCompare(b.value)
        // return a.value.localeCompare(b.value)
      })
      // console.log('!!!', this.timeavailable)
    },
    async AutosetlimitBooking (LimitBookingGet, empId, setTime) {
      this.time = ''
      let DATAtimeavailable = setTime
      // เช็คว่า เวลาในแต่ละวันเหมือนกันรึป่าว
      let slotByflow = null
      if (this.customerTimeSlot === 'False') {
        slotByflow = this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId)[0].timeSlot
      } else {
        slotByflow = this.fromAddTimeCus
      }
      console.log('slotByflow', slotByflow)
      let overTime = this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId)[0].overTime
      // console.log('overTime', overTime)
      if (DATAtimeavailable.length >= slotByflow) {
        // console.log('123123123', LimitBookingGet.filter((BookingGetItem) => BookingGetItem.empId === empId))
        let LimitBooking = LimitBookingGet.filter((BookingGetItem) => BookingGetItem.empId === empId)
        // console.log('LimitBooking', LimitBooking)
        // เซ็ต Status True ให้แต่ละช่วงเวลา
        DATAtimeavailable.forEach((v, k) => {
          if (typeof v.status === 'undefined') {
            v.status = true
            if (v.limitBooking === '0') {
              v.status = false
            }
          }
        })
        // เซ็ต Status False ให้กับช่วงเวลาที่มีคนจองแล้ว
        if (LimitBooking.status !== false) {
          if (LimitBooking.length > 0) {
            DATAtimeavailable.forEach((v, k) => {
              let bookingTarget = LimitBooking.filter((a) => a.bookingTime === v.value)
              // console.log('booking', bookingTarget)
              if (bookingTarget.length > 0) {
                v.status = false
                let bookingTargetSlot = bookingTarget[0].timeSlotCustomer || bookingTarget[0].timeSlot
                for (let bT = 0; bT < bookingTargetSlot; bT++) {
                  if (DATAtimeavailable[k + bT] !== undefined) {
                    DATAtimeavailable[k + bT].status = false
                  }
                }
              }
            })
          }
        }

        // จับคู่เวลาตาม slotbyFlow
        let Newtimeavailable = []
        let slotCheck = slotByflow
        for (let i = 0; i < DATAtimeavailable.length; i++) {
          let num = i + (slotCheck - 1)
          let checkitem = DATAtimeavailable.filter((item, key) => (key >= i && key <= num))
          Newtimeavailable.push(checkitem)
        }
        // console.log('Newtimeavailable', Newtimeavailable)
        DATAtimeavailable = []

        //  ตัดเวลาที่มีค่า False ออก
        Newtimeavailable.forEach((v, k) => {
          // if (overTime === 'True') {
          //   if (v.filter((v) => v.status === false).length <= 0) {
          //     DATAtimeavailable.push(v[0])
          //   }
          // } else {
          //   // ปิดเวลาสุดท้ายในกรณีที่ ไม่ต้องการให้จองเลยเวลา
          //   if (v.filter((v) => v.status === false).length <= 0 && v.length >= slotCheck) {
          //     DATAtimeavailable.push(v[0])
          //   }
          // }
          if (overTime === 'True') {
            // console.log('True')
            if (v.filter((v) => v.status === false).length <= 0) {
              v[0].color = '#0D47A1'
              DATAtimeavailable.push(v[0])
            } else {
              v[0].status = false
              v[0].color = '#EB5757'
              DATAtimeavailable.push(v[0])
            }
          } else {
            // console.log('False')
            if (v.filter((v) => v.status === false).length <= 0 && v.length === slotCheck) {
              v[0].color = '#0D47A1'
              DATAtimeavailable.push(v[0])
            } else {
              // console.log('VALUE', v[0].value, k, Newtimeavailable.length)
              v[0].status = false
              v[0].color = '#EB5757'
              DATAtimeavailable.push(v[0])
            }
          }
        })
        // console.log('DAAAA', DATAtimeavailable)
        return DATAtimeavailable
      } else {
        DATAtimeavailable = []
        return DATAtimeavailable
      }
    // await this.chekSlotTime()
    },
    checkCustomerTimeSlot () {
      this.statusChek = false
      // console.log('DataFlowNameAll', this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId))
      this.timeSlotbyCustomer = []
      this.customerTimeSlot = this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId)[0].customerTimeSlot
      let timeSLOT = this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId)[0].timeSlot
      let coutTimeSlot = 1
      console.log('TIMESLOTBYFLOW_____', this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId)[0].timeSlot)
      let allTime = []
      if (this.customerTimeSlot === 'True') {
        // console.log('EmpItemLimit', this.EmpItemLimit)
        for (let i = 0; i < this.EmpItemLimit.length; i++) {
          let dt = this.EmpItemLimit[i]
          if (dt.setTimebyday === 'True') {
            let timeJson = JSON.parse(dt.setTime)
            let dataTime = []
            timeJson.forEach((itemTime, index) => {
              // console.log('item', itemTime)
              allTime = itemTime.setTime
              allTime.forEach((item, key) => {
                let ss = {}
                if (allTime.length === 1) {
                  ss.text = 'ไม่ระบุ (มีเวลาเดียว)'
                  ss.value = key + 1
                  dataTime.push(ss)
                } else {
                  if (key > 0) {
                    let start = allTime.filter((i, k) => k === 0)[0].value
                    let end = item.value
                    ss.text = this.calculateTime(start, end)
                    ss.textEng = this.calculateTimeEng(start, end)
                    ss.value = key
                    // console.log('TIMEEEE', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value)
                    // console.log('TIMEEEE2', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value, 'coutTime', coutTimeSlot)
                    if (coutTimeSlot === timeSLOT) {
                      dataTime.push(ss)
                      coutTimeSlot = 1
                    } else {
                      coutTimeSlot = coutTimeSlot + 1
                    }
                  // this.timeSlotbyCustomer.push(ss)
                  }
                }
                if ((key + 1) === allTime.length) {
                  coutTimeSlot = 1
                }
              })
            })
            dataTime.forEach((i, n) => {
            // console.log('TTTTTT', this.timeSlotbyCustomer.filter((item) => item.text === i.text && item.value === i.value).length === 0)
              if (this.timeSlotbyCustomer.filter((item) => item.text === i.text && item.value === i.value).length === 0) {
                // console.log('n', n)
                this.timeSlotbyCustomer.push(i)
              }
            })
          // console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
          } else {
            allTime = JSON.parse(dt.setTime)
            allTime.forEach((item, key) => {
              let ss = {}
              if (allTime.length === 1) {
                ss.text = item.value
                // ss.value = key + 1
                // this.timeSlotbyCustomer.push(ss)
                this.fromAddTimeCus = key + 1
                // this.selectflow()
                this.selectflowByCustomer()
              } else {
                if (key > 0) {
                  let start = allTime.filter((i, k) => k === 0)[0].value
                  let end = item.value
                  ss.text = this.calculateTime(start, end)
                  ss.textEng = this.calculateTimeEng(start, end)
                  ss.value = key
                  // console.log('____', ss.value, timeSLOT, '-', ss.value / timeSLOT)
                  // console.log('TIMEEEE', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value, 'coutTime', coutTimeSlot)
                  if (coutTimeSlot === timeSLOT) {
                    this.timeSlotbyCustomer.push(ss)
                    coutTimeSlot = 1
                  } else {
                    coutTimeSlot = coutTimeSlot + 1
                  }
                }
              }
            })
          }
        }
      } else {
        this.selectflowByCustomer()
      }
      console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
    },
    calculateTime (start, end) {
      let countTime = null
      // if (end > start) {
      //   let time = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
      //   let h = parseInt(time.split(':')[0])
      //   let m = parseInt(time.split(':')[1])
      //   countTime = (h * 60) + m
      // } else {
      //   countTime = 0
      // }
      if (end > start) {
        let genTime = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
        let h = parseInt(genTime.split(':')[0])
        let m = parseInt(genTime.split(':')[1])
        if (h === 0 && m !== 0) {
          countTime = m + ' นาที'
        } else if (h !== 0 && m === 0) {
          countTime = h + ' ชม.'
        } else {
          countTime = h + ' ชม. ' + m + ' นาที'
        }
      } else {
        countTime = 'No Data'
      }
      return countTime
    },
    calculateTimeEng (start, end) {
      let countTime = null
      // if (end > start) {
      //   let time = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
      //   let h = parseInt(time.split(':')[0])
      //   let m = parseInt(time.split(':')[1])
      //   countTime = (h * 60) + m
      // } else {
      //   countTime = 0
      // }
      if (end > start) {
        let genTime = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
        let h = parseInt(genTime.split(':')[0])
        let m = parseInt(genTime.split(':')[1])
        if (h === 0 && m !== 0) {
          countTime = m + ' min.'
        } else if (h !== 0 && m === 0) {
          countTime = h + ' h.'
        } else {
          countTime = h + ' h. ' + m + ' min.'
        }
      } else {
        countTime = 'No Data'
      }
      return countTime
    },
    async getDetails (item, key, a) {
      console.log('item', this.dayoff(item))
      this.showDetails = []
      // console.log('imte', item)
      // console.log('key', key)
      if (item.active === true) {
        await this.autoSetTime(item.date)
      }
      this.dateSelect.filter((item, n) => n !== key).forEach((i, u) => { i.active = false })
      this.model = key
      // if (this.dateSelect.filter((item) => item.active === true).length > 0) {
      //   this.showDetails = this.allDetails.filter((d) => d.date === item.date)
      // } else {
      //   this.showDetails = []
      // }
    },
    async selectflow () {
      await this.checkCustomerTimeSlot()
      console.log('selectflow')
      if (this.customerTimeSlot === 'False') {
        // await this.AddallowedDatesBysetTimebyday()
        await this.setQueue(this.date)
        await this.DefaultDay()
      }
    },
    async selectflowByCustomer () {
      await this.setQueue(this.date)
      await this.DefaultDay()
    },
    async setQueue (month) {
      this.dateSelect = []
      // console.log('setQueue')
      console.log()
      await this.setDayofMounth()

      // console.log('month', month)
      if (this.formSelect.empId) {
        // console.log('getLimitBooking')
        // await this.getLimitBooking(month)
        this.dateSelect.sort(this.compare)
        // console.log('sortCompare', this.dateSelect)
        // await this.setLimit(month)
      } else {
        // this.$swal('กรุณาเลือกประเภทบริการ', 'ผิดพลาด', 'error')
      }
    },
    async getLimitBooking (month) {
      const result = await axios.get(this.DNS_IP + '/LimitBookingDateEmp/get?shopId=' + this.shopId + '&empId=' + this.formSelect.empId + '&bookingDate=' + month)
      if (!result.data.status) {
        if (result.data.length > 0) {
          console.log('result1', result.data)
          this.LimitBooking = result.data
          await this.setLimit(month)
          await this.DefaultDay()
        } else {
          this.LimitBooking = []
          console.log('result2', result.data)
          await this.setLimit(month)
          await this.DefaultDay()
        }
      }
    },
    compare (a, b) {
      if (parseInt(a.value) < parseInt(b.value)) {
        return -1
      }
      if (parseInt(a.value) > parseInt(b.value)) {
        return 1
      }
      return 0
    },
    async GetbookingNowCheck () {
      let bookingNowCheck = this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheck
      let bookingNowCheckCount = this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheckCount || 1
      // let bookingNowCheckTimeStatus = this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheckTimeStatus || 'False'
      if (bookingNowCheck === 'True') {
        // console.log('test', this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheckCount || 1)
        let CheckMonth = moment().add(bookingNowCheckCount, 'days').format('YYYY-MM')
        // console.log('CheckMonth', CheckMonth)
        if (CheckMonth !== this.currentMonth) {
          console.log('IF')
          this.next_bookingNowCheckCount_month = 'True'
          this.setMonthCarousel_Check('next_bookingNowCheckCount_month')
        } else {
          this.next_bookingNowCheckCount_month = 'False'
          console.log('ELSE')
        }
        this.currentDate = moment().add(bookingNowCheckCount, 'days').format('YYYY-MM-DD')
        this.currentMonth = moment(this.currentDate, 'YYYY-MM').format('YYYY-MM')
      } else {
        this.currentDate = moment().format('YYYY-MM-DD')
      }
    },
    async setDayofMounth () {
      // console.log('this.currentMonth', this.currentMonth)
      await this.GetbookingNowCheck()
      // console.log('this.currentMonth', this.currentMonth)
      let month = moment(this.date).format('MM')
      let year = moment(this.date).format('YYYY')
      // เซ็ตวันที่และวัน เช่น 1-จ
      let data = this.getDaysArray(year, month)
      // console.log('data', data)
      await data.forEach(async (v, k) => {
        let s = {}
        s.text = v.split('-')[1]
        s.value = v.split('-')[0]
        // s.checkLimit = null
        // s.color = ''
        s.active = false
        s.date = moment(this.date + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
        s.checkLimit = true
        s.color = '#FFFFFF'
        s.colortext = '#000000'
        // เซ็ตวันที่เป็นปัจจุบัน
        if (moment(this.date, 'YYYY-MM').format() <= moment(this.currentMonth, 'YYYY-MM').format()) {
          if (parseInt(s.value) >= parseInt(this.currentDate.split('-')[2])) {
            // console.log('s', s)
            this.dateSelect.push(s)
          }
        } else {
          // console.log('s', JSON.stringify(s))
          this.dateSelect.push(s)
        }
      })
    },
    getDaysArray (year, month) {
      // console.log('result', result)
      var monthIndex = month - 1 // 0..11 instead of 1..12
      var names = [ 'อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส' ]
      var date = new Date(year, monthIndex, 1)
      var result = []
      while (date.getMonth() === monthIndex) {
        result.push(date.getDate() + '-' + names[date.getDay()])
        date.setDate(date.getDate() + 1)
      }
      console.log('result', result)
      return result
    },
    async checkLiffLogin (dataLineConfig) {
      await this.$liff
        .init({
          liffId: dataLineConfig.liffMainID
        })
        .then(async () => {
          if (process.env.NODE_ENV === 'development') {
            this.getProfile_dev()
          } else {
            if (!this.$liff.isLoggedIn()) {
              this.$liff.login({ redirectUri: window.location.href })
            } else {
              await this.getProfile()
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
      this.profile = this.$profile_dev
      console.log('dev', this.profile)
    },
    async getBotinfo () {
      if (this.$route.query.shopId) {
        const url = `${this.DNS_IP}/line/getOa`
        // const url = 'http://localhost:81/Api/vgroupl_api/v1/Zoom/Login/getData?'
        const config = {
          headers: {
            'botId': this.$route.query.shopId
          }
        }
        await axios.get(url, config).then((response) => {
          let rs = response.data
          console.log('rs1', rs)
          window.location.href = 'line://ti/p/' + rs.basicId
        })
      }
    },
    getShop () {
      if (this.$route.query.shopId) {
        axios.get(this.DNS_IP + '/sys_shop/get?shopId=' + this.$route.query.shopId).then(response => {
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
                this.LoGo = require('@/assets/Thank.svg')
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
                this.DarkModefont = '#000000'
                this.DarkModeStatus = true
              } else {
                this.DarkMode = '#ffffff00'
                this.DarkModefont = '#FFFFFF'
                this.DarkModeStatus = false
              }
            })
            this.bookingthankText = rs[0].bookingthankText
            console.log('this.bookingthankText', this.bookingthankText)
          } else {
            this.shop = null
          }
        })
      } else {
        this.ColorByShop.push('#E1F3FF', '#FFFFFF')
        this.LoGo = require('@/assets/Thank.svg')
        this.DarkMode = '#ffffff00'
        this.DarkModefont = '#173053'
      }
    },
    async selectBranch () {
      this.formSelect.flowId = ''
      this.dateSelect = []
      this.timeavailable = []
      await this.getDataFlow()
    },
    async getDataFlow () {
      this.DataFlowName = []
      this.DataFlowNameAll = []
      this.DataFlow = []
      let dataFlow = []
      let dataFlowName = []
      let dataFlowNameAll = []
      // console.log('DataFlowName', this.DataFlowName)
      await axios.get(this.DNS_IP + '/flow/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            let checkBranchByFlow = d.masBranchID || 'All'
            if ((checkBranchByFlow === this.formSelect.masBranchID.toString()) || checkBranchByFlow === 'All') {
              // console.log('eeeeeee', d.flowName)
              d.text = d.flowName
              d.textEn = d.flowNameEn
              d.value = d.flowId
              dataFlowName.push(d)
              dataFlowNameAll.push(d)
              dataFlow.push(d)
            }
            // let s = rs[i]
            // s.dateDayCustom = JSON.parse(s.dateDayCustom)
            // s.flowId = s.flowId
            // this.dateDayCustom.push(JSON.parse(s.dateDayCustom))
            // let a = rs[i]
            // a.dateDayCustom = JSON.parse(s.dateDayCustom)
            // a.flowId = s.flowId
            // this.dateDayoffValue.push(JSON.parse(s.dateDayoffValue))
          }
          this.DataFlowName = dataFlowName
          // this.DataFlowName = dataFlowName.sort((a, b) => {
          //   if (a.text < b.text) return -1
          //   return a.text > b.text ? 1 : 0
          // })
          this.DataFlowNameAll = dataFlowNameAll
          // this.DataFlowNameAll = dataFlowNameAll.sort((a, b) => {
          //   if (a.text < b.text) return -1
          //   return a.text > b.text ? 1 : 0
          // })
          this.DataFlow = dataFlow
          if (this.DataFlow.length === 1) {
            this.formSelect.flowId = this.DataFlow[0].value
            this.checkBranch()
            this.checkTitleEmp()
          }
          // this.DataFlow = dataFlow.sort((a, b) => {
          //   if (a.text < b.text) return -1
          //   return a.text > b.text ? 1 : 0
          // })
        } else {
          this.DataFlow = []
          this.DataFlowName = []
          this.DataFlowNameAll = []
        }
        // console.log('this.DataFlow', this.DataFlow)
        // console.log('this.dateDayCustom', this.dateDayCustom)
        // console.log('this.dateDayoffValue', this.dateDayoffValue)
      })
    },
    async getDataBranch () {
      this.branch = []
      this.branchData = []
      await axios.get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        console.log('rs', rs)
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            let s = {}
            s.text = d.masBranchName
            s.textEn = d.masBranchNameEn
            s.value = d.masBranchID
            this.branch.push(s)
            this.branchData.push(d)
            // console.log('dtdtdtdt', this.branch)
          }
          if (this.branch.length === 1) {
            this.formSelect.masBranchID = this.branch[0].value
            this.selectBranch()
            // this.checkTime()
            // this.getEmp()
          }
        }
      })
      // console.log('branchData', this.branchData)
    },
    async getEmp () {
      this.EmpItemLimit = []
      this.dataEmp = []
      this.dataEmpAll = []
      this.dateSelect = []
      this.showDetails = []
      this.timeSlotbyCustomer = []
      this.fromAddTimeCus = ''
      this.customerTimeSlot = 'False'
      await axios.get(this.DNS_IP + '/empSelect/get?privacyPage=bookingform&masBranchID=' + this.formSelect.masBranchID).then(async (response) => {
        let rs = response.data
        console.log('rssssssssssssss', rs)
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            if (d.flowId !== null && d.flowId !== '') {
              let checkFlowId = JSON.parse(d.flowId)
              if (checkFlowId.filter((a) => parseInt(a) === this.formSelect.flowId).length > 0) {
                if (d.setTime !== null && d.setTime !== '[]' && d.setTime !== '') {
                  let s = {}
                  s.text = d.empFull_NameTH
                  s.textEng = d.empFull_NameTH
                  s.value = d.empId
                  this.dataEmp.push(s)
                  this.dataEmpAll.push(d)
                  let limit = {}
                  limit.empId = d.empId
                  limit.limitBookingCheck = d.limitBookingCheck || 'False'
                  limit.setTime = d.setTime || '[]'
                  limit.setTimebyday = d.setTimebyday
                  this.EmpItemLimit.push(limit)
                }
              }
            }
          }
          if (this.dataEmp.length === 0) {
            this.$swal(
              this.languageSelect === 0 ? 'ไม่มี' + this.empTitleTh + 'สำหรับประเภทบริการนี้' : 'There is no ' + this.empTitleEng + ' for this type of service.',
              this.languageSelect === 0 ? 'กรุณาเลือกประเภทบริการอื่นๆ' : 'Please select another type of service.',
              'info'
            )
            this.formSelect.flowId = ''
            this.dateSelect = []
          }
          if (this.dataEmp.length === 1) {
            this.formSelect.empId = this.dataEmp[0].value
            // this.checkCustomerTimeSlot()
          }
          if (this.dataEmp.length > 0) {
            this.selectflow()
          }
          console.log('EmpItemLimit', this.EmpItemLimit)
        } else {
          this.dataEmp = []
          this.dataEmpAll = []
          this.EmpItemLimit = []
        }
      })
      // await this.setDayofMounth()
      console.log('dataEmp', this.dataEmpAll)
    },
    checkDateToTime (dateItem) {
      let dt = this.LimitBooking.filter((item) => moment(item.bookingDate).format('YYYY-MM-DD') === moment(dateItem, 'YYYY-MM-DD').format('YYYY-MM-DD'))
      if (dt.length > 0) {
        return dt
      } else {
        return 'False'
      }
    },
    async checkSlot () {
      this.setTimeError = true
      if (this.empTime.length > 1) {
        let allTime = []
        for (let i = 0; i < this.empTime.length; i++) {
          let d = this.empTime[i]
          allTime.push(...d.Duplicates)
        }
        console.log('allTime', allTime)
        // console.log('allTime.every(value => value === allTime[0])', allTime.every(value => value === allTime[0]))
        if (allTime.every(value => value === allTime[0]) === false) {
          this.setTimeError = false
        }
      } else if (this.empTime.length === 1) {
        if (this.empTime[0].statusEmp === false) {
          this.setTimeError = false
        }
      } else {
        console.log('ไม่มีช่าง')
      }
    },
    async getEmpCheck () {
      this.empTime = []
      await axios.get(this.DNS_IP + '/empSelect/get?privacyPage=bookingform&shopId=' + this.shopId).then(async (response) => {
        let rs = response.data
        // console.log('rssssssssssssss', rs)
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            if (d.flowId !== null && d.flowId !== '') {
              let checkFlowId = JSON.parse(d.flowId)
              if (checkFlowId.filter((a) => parseInt(a) === this.formSelect.flowId).length > 0) {
                if (d.setTime !== null && d.setTime !== '[]' && d.setTime !== '') {
                  if (d.setTimebyday === 'True') {
                    let dt = JSON.parse(d.setTime) || []
                    let TimeDifference = []
                    console.log('dt', dt)
                    for (let b = 0; b < dt.length; b++) {
                      let dtTime = dt[b]
                      // console.log('TEST', await this.calculateTimeDifference(dtTime.setTime))
                      if (dtTime.setTime) {
                        TimeDifference.push(...await this.calculateTimeDifference(dtTime.setTime))
                      }
                    }
                    console.log('TimeDifference', TimeDifference)
                    d.slotTimeCheck = TimeDifference
                    d.checkFlowId = checkFlowId
                    d.Duplicates = await this.removeDuplicates(TimeDifference)
                    d.statusEmp = TimeDifference.every(value => value === TimeDifference[0])
                    this.empTime.push(d)
                  } else {
                    let TimeDifference = await this.calculateTimeDifference(JSON.parse(d.setTime))
                    d.slotTimeCheck = TimeDifference
                    d.checkFlowId = checkFlowId
                    d.Duplicates = await this.removeDuplicates(TimeDifference)
                    d.statusEmp = TimeDifference.every(value => value === TimeDifference[0])
                    this.empTime.push(d)
                  }
                }
              }
            }
          }
        }
      })
      console.log('this.empTime', this.empTime)
    },
    removeDuplicates (array) {
      // ใช้ filter เพื่อสร้างอาร์เรย์ใหม่ที่มีเฉพาะค่าที่ไม่ซ้ำ
      const uniqueArray = array.filter((value, index, self) => {
        // ใช้ indexOf เพื่อตรวจสอบว่าค่าอยู่ในอาร์เรย์เพียงครั้งเดียว
        return self.indexOf(value) === index
      })

      return uniqueArray
    },
    calculateTimeDifference (timeData) {
      // แปลงข้อมูลเวลาเป็นวินาที
      const timesInSeconds = timeData.map(item => this.convertToSeconds(item.value))

      // คำนวณระยะห่างระหว่างเวลา
      const differences = []
      for (let i = 0; i < timesInSeconds.length - 1; i++) {
        const difference = timesInSeconds[i + 1] - timesInSeconds[i]
        differences.push(difference)
      }

      // แปลงระยะห่างเป็นนาที
      const differencesInMinutes = differences.map(difference => Math.floor(difference / 60))
      // console.log(differencesInMinutes)
      return differencesInMinutes
    },

    // แปลงเวลาจาก HH:mm เป็นวินาที
    convertToSeconds (time) {
      const [hours, minutes] = time.split(':')
      return parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60
    }
  }
}
</script>

<style scoped>
.cardradius {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
}
.button {
  width: 45%;
  color: #fff;
  font-weight: 150;
  letter-spacing: 1px;
  margin: 6px 3px;
  padding: 10px 28px;
  border-radius: 25px !important;
  background-color: #0047a5;
}
.main{
  background-color: #FFFFFF;
  height: 100vh;
}
.content{
  overflow:auto;
  white-space: normal;
}
.a{
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  max-height: 350px;
}
.my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #1867c0;
  color: #ffffff;
  border: 1px solid #1867c0;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
  left: 4px;
  margin-right: 8px;
  position: relative;
}

.my-event.with-time {
  position: absolute;
  right: 4px;
  margin-right: 0px;
}
</style>
