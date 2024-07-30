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
          {{ languageSelect === 0 ? shop[0].shopId === "SD_1694686349583" ? "จองคิวนัดหมาย" : "ตรวจสอบคิวนัดหมาย"  : shop[0].shopId === "SD_1694686349583" ? "Reservation" : "Check queue" }}
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
              @change="selectBranch()"
            :menu-props="{ bottom: true, offsetY: true }"
            ></v-select>
            <v-select
            v-if="formSelect.masBranchID !== '' && formSelect.masBranchID !== null"
              :item-text="languageSelect === 0 ? 'text' : 'textEn'"
              v-model="formSelect.flowId"
              :label=" $route.query.shopId === 'Uae49536fd2fcc69bee9852e92db30098' ? languageSelect === 0 ? 'เลือกช่าง *' : 'Employee *' : languageSelect === 0 ? 'ประเภทบริการ *' : 'Service *'"
              dense
              outlined
              :items="DataFlow"
              @change="checkFlowBranch()"
              attach
              :menu-props="{ bottom: true, offsetY: true }"
            ></v-select>
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
          v-if="dateSelect.length > 0 "
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
              v-if="DataFlow.filter((a) => a.flowId === formSelect.flowId)[0].typeDayCustom === 'off' && dayCustom(item.date).length === 0 && dayoffvalue(item.date).length === 0"
              :color="item.active ? shop[0].shopId === 'SD_1694686349583' ? '#956c53' : '#1F6FEB' : item.color"
              :style="'border-radius: 15px 15px 15px 15px;'"
              class="ma-1"
              height="65px"
              width="50px"
              v-on:click="item.active? item.active = false: item.active = true  ,getDetails(item,n)"
            >
              <v-row
                class="fill-height"
                align="center"
                justify="center"
              >
              <v-col cols="12" class="pa-0 " v-if="languageSelect === 0">
                <p class="text-center pa-0 ma-0 mt-5 font-weight-bold" :style="'color:'+ item.colortext" >{{item.text + '.'}}</p>
              </v-col>
              <v-col cols="12" class="pa-0 " v-else>
                <p class="text-center pa-0 ma-0 mt-5 font-weight-bold" :style="'color:'+ item.colortext" >{{dateEng.filter(el => { return el.text === item.text })[0].textEn + '.'}}</p>
              </v-col>
              <v-col cols="12" class="pa-0" >
                <h4 class="text-center pa-0 ma-0 mt-n1 font-weight-bold" :style="'color:'+ item.colortext" >{{item.value}}</h4>
              </v-col>
              </v-row>
            </v-card>
            <v-card
              v-else-if="DataFlow.filter((a) => a.flowId === formSelect.flowId)[0].typeDayCustom === 'on' && dayCustom(item.date).length > 0 "
              :color="item.active ? '#1F6FEB' : item.color"
              :style="'border-radius: 15px 15px 15px 15px;'"
              class="ma-1"
              height="65px"
              width="50px"
              v-on:click="item.active? item.active = false: item.active = true  ,getDetails(item,n)"
            >
              <v-row
                class="fill-height"
                align="center"
                justify="center"
              >
              <v-col cols="12" class="pa-0 " v-if="languageSelect === 0">
                <p class="text-center pa-0 ma-0 mt-5 font-weight-bold" :style="'color:'+ item.colortext" >{{item.text + '.'}}</p>
              </v-col>
              <v-col cols="12" class="pa-0 " v-else>
                <p class="text-center pa-0 ma-0 mt-5 font-weight-bold" :style="'color:'+ item.colortext" >{{dateEng.filter(el => { return el.text === item.text })[0].textEn + '.'}}</p>
              </v-col>
              <v-col cols="12" class="pa-0" >
                <h4 class="text-center pa-0 ma-0 mt-n1 font-weight-bold" :style="'color:'+ item.colortext" >{{item.value}}</h4>
              </v-col>
              </v-row>
            </v-card>
            <v-sheet
              v-else
              :color="item.active ? '#FFFFFF' : '#FFFFFF'"
              :style="'border-radius: 15px 15px 15px 15px;'"
              class="ma-1"
              height="65px"
              width="50px"
              readonly
            >
              <v-row
                class="fill-height"
                align="center"
                justify="center"
              >
              <v-col cols="12" class="pa-0 " v-if="languageSelect === 0">
                <p class="text-center pa-0 ma-0 mt-5 font-weight-bold" :style="'color:'+ '#000000'" >{{item.text + '.'}}</p>
              </v-col>
              <v-col cols="12" class="pa-0 " v-else>
                <p class="text-center pa-0 ma-0 mt-5 font-weight-bold" :style="'color:'+ '#000000'" >{{dateEng.filter(el => { return el.text === item.text })[0].textEn + '.'}}</p>
              </v-col>
              <v-col  cols="12" class="pa-0" >
                <h4 class="text-center pa-0 ma-0 mt-n1 font-weight-bold"  :style="'color:'+ '#000000'" >{{item.value}}</h4>
              </v-col>
              <!-- #9E9E9E -->
              </v-row>
            </v-sheet>
          </v-slide-item>
        </v-slide-group>

        <v-expand-transition>
          <v-sheet
            v-if="showDetails.length > 0"
            min-height="200"
            tile
            class="pa-3 px-5 ml-2 mr-2"
          >
          <v-row>
            <v-col cols="4" class="pa-0">
              <h5 class="mt-3 font-weight-bold text-center" >
                {{languageSelect === 0 ? 'เวลา': 'Time'}}
              </h5>
              <div v-for="(item , index) in showDetails" :key="index">
                <h5  class="mt-3 font-weight-bold text-center" >
                  <div v-if="(item.countBooking < parseInt(item.limitBooking)) && !item.Overtime">
                    <!-- <v-btn
                      dark
                      class="font-weight-bold  text-center"
                      color="#0D47A1"
                      width="80%"
                      >{{item.time}}
                    </v-btn> -->
                    <v-sheet
                      class="font-weight-bold text-center"
                      :color="shop[0].shopId === 'SD_1694686349583' ? '#1d3430' : '#0D47A1'"
                      width="100%"
                      height="36px"
                      elevation="2"
                      rounded
                      style="display: flex;justify-content: center;align-items: center;"
                      >
                    <p class="ma-0" style="word-wrap: break-word;color: #FFFFFF;font-size: small;">{{item.time}}</p>
                    </v-sheet>
                  </div>
                  <div v-else-if="item.Overtime">
                    <!-- <v-btn
                      disabled
                      class="font-weight-bold  text-center"
                      color="#000000"
                      width="80%"
                      >{{item.time}}
                    </v-btn> -->
                    <v-sheet
                      class="font-weight-bold text-center"
                      color="rgb(224 224 224)"
                      width="100%"
                      height="36px"
                      elevation="0"
                      rounded
                      style="display: flex;justify-content: center;align-items: center;"
                      >
                    <p class="ma-0" style="word-wrap: break-word;color: rgb(166 166 166);font-size: small;">{{item.time}}</p>
                    </v-sheet>
                  </div>
                  <div v-else>
                    <!-- <v-btn
                      disabled
                      class="font-weight-bold  text-center"
                      color="#000000"
                      width="80%"
                      >{{item.time}}
                    </v-btn> -->
                    <v-sheet
                      class="font-weight-bold text-center"
                      color="rgb(224 224 224)"
                      width="100%"
                      height="36px"
                      elevation="0"
                      rounded
                      style="display: flex;justify-content: center;align-items: center;"
                      >
                    <p class="ma-0" style="word-wrap: break-word;color: rgb(166 166 166);font-size: small;">{{item.time}}</p>
                    </v-sheet>
                  </div>
                </h5>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <h6 class="mt-4 font-weight-bold text-center" v-if="shop[0].shopId === 'SD_1694686349583' && languageSelect === 1">
                Availabilities
              </h6>
              <h5 class="mt-3 font-weight-bold text-center" v-if="shop[0].shopId === 'SD_1694686349583' && languageSelect === 0">
                จำนวนคิว
              </h5>
              <h5 class="mt-3 font-weight-bold text-center" v-if="shop[0].shopId !== 'SD_1694686349583'">
                {{languageSelect === 0 ? 'จำนวนคิว': 'Queues'}}
              </h5>
              <div v-for="(item , index) in showDetails" :key="index">
                <h5  class="mt-3 font-weight-bold text-center" >
                  <div v-if="(item.countBooking < parseInt(item.limitBooking)) && !item.Overtime">
                    <v-btn
                      dark
                      class="font-weight-bold  text-center"
                      :color="shop[0].shopId === 'SD_1694686349583' ? '#956c53' : '#0ACF83'"
                      width="80%"
                      >{{item.countBooking + ' / ' + item.limitBooking}}
                    </v-btn>
                  </div>
                  <div v-else-if="item.Overtime">
                    <v-btn
                      disabled
                      class="font-weight-bold  text-center"
                      color="#000000"
                      width="80%">
                      <strong v-if="languageSelect === 0">เกินเวลา</strong>
                      <strong style="font-size: 10px" v-else>Unavailable</strong>
                    </v-btn>
                  </div>
                  <div v-else>
                    <v-btn
                    dark
                      readonly
                      class="font-weight-bold  text-center"
                      color="#EB5757"
                      width="80%"
                      >{{languageSelect === 0 ? 'เต็ม': 'Full'}}
                    </v-btn>
                  </div>
                </h5>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <h5 class="mt-3 font-weight-bold text-center" >
                {{languageSelect === 0 ? 'จองคิว': shop[0].shopId === "SD_1694686349583" ? "Reserve" : "Booking"}}
              </h5>
              <div v-for="(item , index) in showDetails" :key="index">
                <h5  class="mt-3 font-weight-bold text-center" >
                  <div v-if="(item.countBooking < parseInt(item.limitBooking)) && !item.Overtime">
                    <v-btn
                      dark
                      class="font-weight-bold  text-center"
                      :color="shop[0].shopId === 'SD_1694686349583' ? '#1d3430' : '#0D47A1'"
                      width="100%"
                      @click="addBooking(item)"
                      >
                      <v-icon left class="ml-1">
                        mdi-calendar-month
                      </v-icon>
                      {{languageSelect === 0 ? 'นัดหมาย': shop[0].shopId === 'SD_1694686349583' ? 'Reserve' : 'Booking'}}
                    </v-btn>
                  </div>
                  <div v-else-if="item.Overtime">
                    <v-btn
                      disabled
                      class="font-weight-bold  text-center"
                      color="#000000"
                      width="100%"
                      >
                      <v-icon left class="ml-1">
                        mdi-calendar-month
                      </v-icon>
                      {{languageSelect === 0 ? 'นัดหมาย': shop[0].shopId === 'SD_1694686349583' ? 'Reserve' : 'Booking'}}
                    </v-btn>
                  </div>
                  <div v-else>
                    <v-btn
                      disabled
                      class="font-weight-bold  text-center"
                      color="#000000"
                      width="100%"
                      >
                      <v-icon left class="ml-1">
                        mdi-calendar-month
                      </v-icon>
                      {{languageSelect === 0 ? 'นัดหมาย': 'Booking'}}
                    </v-btn>
                  </div>
                </h5>
              </div>
            </v-col>
          </v-row>
          </v-sheet>
        </v-expand-transition>
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
      console.log('newQuestion', newQuestion)
      console.log('oldQuestion', oldQuestion)
      // let year = moment(this.date).format('YYYY')
      // this.itemMonth.forEach((v, k) => {
      //   if (k === newQuestion) {
      //     // console.log('moment', moment(year + v.value, 'YYYY-MM').format('YYYY-MM'))
      //     this.date = moment(year + v.value, 'YYYY-MM').format('YYYY-MM')
      //   }
      // })
      // await this.setQueue(this.date)
      // await this.DefaultDay()
    }
  },
  data () {
    return {
      model: 0,
      previous: false,
      itemMonth: [],
      defaultMonth: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
      defaultMonthEng: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      dateEng: [{text: 'อา', textEn: 'Sun'}, {text: 'จ', textEn: 'Mon'}, {text: 'อ', textEn: 'Tue'}, {text: 'พ', textEn: 'Wed'}, {text: 'พฤ', textEn: 'Thu'}, {text: 'ศ', textEn: 'Fri'}, {text: 'ส', textEn: 'Sat'}],
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
        datemonth: '',
        dateday: '',
        masBranchID: ''
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
      branchData: [],
      branch: [],
      languageSelect: 0,
      dateDayCustom: [],
      dateDayoffValue: [],
      statusCheckDiposit: false,
      dialogSelectGoto: false,
      dataLineConfig: {},
      next_bookingNowCheckCount_month: 'False'
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
    // this.dataLineConfig = dataLineConfig
    // await this.checkLiffLogin(dataLineConfig)
    // await this.checkBanUserId(this.profile.userId, checkShopId)
    await this.getShop()
    // await this.getDataFlow()
    await this.getDataBranch()
    await this.setMonthCarousel()
    // await this.setDataDefault()
    // await this.checkUserId()
  },
  created () {
    window.addEventListener('resize', this.myEventHandler)
  },
  destroyed () {
    window.removeEventListener('resize', this.myEventHandler)
  },
  methods: {
    async selectBranch () {
      this.formSelect.flowId = ''
      this.dateSelect = []
      this.showDetails = []
      await this.getDataFlow()
    },
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
    dayCustom (item) {
      let dateDayCustom = this.DataFlow.filter((a) => a.flowId === this.formSelect.flowId)[0].dateDayCustom || '[]'
      let d = JSON.parse(dateDayCustom).filter((b) => b === item)
      return d
    },
    dayoffvalue (item) {
      let newDate = new Date(item)
      let day = newDate.getDay()
      let dateDayoffValue = this.DataFlow.filter((a) => a.flowId === this.formSelect.flowId)[0].dateDayoffValue || '[]'
      let d = JSON.parse(dateDayoffValue).filter((b) => b === day)
      return d
    },
    async DefaultDay () {
      // console.log('dateSelect', this.dateSelect)
      let count = 0
      this.dateSelect.forEach((v, k) => {
        let typeDayCustom = this.DataFlow.filter((a) => a.flowId === this.formSelect.flowId)[0].typeDayCustom
        if (typeDayCustom === 'off') {
          if (this.dayCustom(v.date).length === 0 && this.dayoffvalue(v.date).length === 0) {
            if (count === 0) {
              v.active = true
              this.getDetails(v, k)
              count = 1
              // console.log('kkkkkkkk', k)
              // console.log('kkkkkkkk', v)
            }
          }
        } else {
          if (this.dayCustom(v.date).length > 0) {
            if (count === 0) {
              v.active = true
              this.getDetails(v, k)
              count = 1
              // console.log('kkkkkkkk', k)
              // console.log('kkkkkkkk', v)
            }
          }
        }
      })
    },
    async setDataDefault () {
      this.formSelect.flowId = this.DataFlow[0].value
      // await this.setQueue(this.date)
      // await this.DefaultDay()
      if (this.formSelect.flowId !== '' && this.formSelect.masBranchID !== '') {
        this.selectflow()
      }
    },
    async setMonthCarousel (item) {
      // console.log('//////////////////////////', moment(this.date, 'YYYY-MM').format('YYYY-MM'))
      // console.log('currentMonth', moment(this.currentMonth, 'YYYY-MM').format('YYYY-MM'))
      if (item === 'next') {
        this.date = moment(this.date).add(1, 'months').format('YYYY-MM')
      } else if (item === 'next_bookingNowCheckCount_month') {
        this.date = moment(this.date).add(1, 'months').format('YYYY-MM')
      } else if (item === 'previous') {
        this.date = moment(this.date).add(-1, 'months').format('YYYY-MM')
      } else {

      }
      if (moment(this.date, 'YYYY-MM').format('YYYY-MM') > moment(this.currentMonth, 'YYYY-MM').format('YYYY-MM')) {
        if (this.next_bookingNowCheckCount_month === 'False') {
          this.previous = true
          console.log('true')
        }
      } else {
        this.previous = false
        console.log('false')
      }
      // console.log('******************', this.date)
      await this.setQueue(moment(this.date, 'YYYY-MM').format('YYYY-MM'))
      await this.DefaultDay()
    },
    async addBooking (item) {
      console.log('test', item)
      console.log('formSelect', this.formSelect)
      this.$swal({
        title: this.languageSelect === 0 ? 'ต้องการนัดหมาย ใช่หรือไม่?' : 'Do you want to make a reserve?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: this.languageSelect === 0 ? 'ใช่' : 'Yes',
        cancelButtonText: this.languageSelect === 0 ? 'ไม่' : 'No'
      })
        .then(async result => {
          window.location = this.ADMIN_IP + '/BookingFormNoLine?shopId=' + this.shopId + '&source=CalendarBookingNoLine&time=' +
      item.timeValue + '&flowId=' + this.formSelect.flowId + '&masBranchID=' + this.formSelect.masBranchID + '&date=' + item.date + '&languageSelect=' + this.languageSelect
          //     this.$router.push('/BookingForm?shopId=' + this.shopId + '&source=CalendarBooking&time=' +
          // item.timeValue + '&flowId=' + this.formSelect.flowId + '&masBranchID=' + this.formSelect.masBranchID + '&date=' + item.date + '&languageSelect=' + this.languageSelect)
        })
    },
    async getDetails (item, key, a) {
      this.showDetails = []
      // console.log('imte', item)
      // console.log('key', key)
      this.dateSelect.filter((item, n) => n !== key).forEach((i, u) => { i.active = false })
      if (this.dateSelect.filter((item) => item.active === true).length > 0) {
        this.showDetails = this.allDetails.filter((d) => d.date === item.date)
      } else {
        this.showDetails = []
      }
      console.log('key', key)
      this.model = key
      console.log('showDetail', this.showDetails)
    },
    async checkFlowBranch () {
      console.log('!!!!!', this.formSelect.flowId, this.formSelect.masBranchID)
      if (this.formSelect.flowId !== '' && this.formSelect.masBranchID !== '') {
        this.selectflow()
      }
    },
    async selectflow () {
      await this.setQueue(this.date)
      await this.DefaultDay()
    },
    async setQueue (month) {
      this.dateSelect = []
      this.allDetails = []
      this.showDetails = []
      // console.log('month', month)
      if (this.formSelect.flowId) {
        await this.getLimitBooking(month)
        // await this.setLimit(month)
      } else {
        // this.$swal('กรุณาเลือกประเภทบริการ', 'ผิดพลาด', 'error')
      }
    },
    async getLimitBooking (month) {
      const result = await axios.get(this.DNS_IP + '/LimitBookingDate/get?shopId=' + this.shopId + '&flowId=' + this.formSelect.flowId + '&masBranchID=' + this.formSelect.masBranchID + '&bookingDate=' + month)
      if (!result.data.status) {
        if (result.data.length > 0) {
          console.log('result', result.data)
          this.LimitBooking = result.data
          await this.setLimit(month)
        } else {
          this.LimitBooking = []
          // console.log('result', result.data)
          await this.setLimit(month)
        }
      }
    },
    async setLimit (item) {
      this.dateSelect = []
      this.allDetails = []
      let month = moment(item).format('MM')
      let year = moment(item).format('YYYY')
      // เซ็ตวันที่และวัน เช่น 1-จ
      // console.log('month', month, year)
      let data = this.getDaysArray(year, month)
      // console.log('data!!!""', data)
      let limitTime = JSON.parse(this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].setTime) || []
      // console.log('consoletest', this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0])
      let bookingNowCheck = this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheck
      let bookingNowCheckCount = this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheckCount || 1
      let bookingNowCheckTimeStatus = this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheckTimeStatus || 'False'
      if (bookingNowCheck === 'True') {
        // console.log('test!!!', this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheck)
        let CheckMonth = moment().add(bookingNowCheckCount, 'days').format('YYYY-MM')
        // console.log('CheckMonth', CheckMonth)
        if (CheckMonth !== this.currentMonth) {
          // console.log('IF')
          this.next_bookingNowCheckCount_month = 'True'
          this.setMonthCarousel('next_bookingNowCheckCount_month')
        } else {
          this.next_bookingNowCheckCount_month = 'False'
          // console.log('ELSE')
        }
        this.currentDate = moment().add(bookingNowCheckCount, 'days').format('YYYY-MM-DD')
        this.currentMonth = moment(this.currentDate, 'YYYY-MM').format('YYYY-MM')
        // console.log('this.currentDate', moment().format('YYYY-MM-DD'), moment().add(bookingNowCheckCount, 'days').format('YYYY-MM-DD'))
        // console.log('this.currentMonth', this.currentMonth)
      } else {
        this.currentDate = moment().format('YYYY-MM-DD')
      }
      // console.log('bookingNowCheck', bookingNowCheck)
      data.forEach((v, k) => {
        let s = {}
        s.text = v.split('-')[1]
        s.value = v.split('-')[0]
        s.checkLimit = null
        s.color = ''
        s.active = false
        s.date = moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
        // console.log('dayyyyy', moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD'))
        // เช็คว่า เวลาในแต่ละวันเหมือนกันรึป่าว
        let NewDate = moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
        if (this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].setTimebyday === 'True') {
          let timeJson = JSON.parse(this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].setTime).filter((items) => items.value === new Date(NewDate).getDay())
          limitTime = timeJson[0].setTime || []
          // console.log('IF')
        } else {
          // console.log('ELSE')
          limitTime = JSON.parse(this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].setTime) || []
        }
        // let countBooking = 0
        let stasutColorDate = false
        // let totalLimit = limitTime.reduce((x, y) => { return x + parseInt(y.limitBooking) }, 0)
        limitTime.forEach((a, b) => {
          // console.log('type')
          // console.log('aaaa', thi?s.LimitBooking.filter((limitItem) => moment(limitItem.bookingDate, 'YYYY-MM-DD').format('YYYY-MM-DD') === moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')))
          let cheklimit = this.LimitBooking.filter((limitItem) => { return (a.value === limitItem.bookingTime && moment(limitItem.bookingDate).format('YYYY-MM-DD') === moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')) && limitItem.countBooking >= 0 }).map((d) => d.countBooking)[0] || 0
          let ss = {}
          let currentDateBybookingNowCheckTimeStatus = moment().format('YYYY-MM-DD')
          if (bookingNowCheckTimeStatus === 'True') {
            currentDateBybookingNowCheckTimeStatus = this.currentDate
          }
          if (moment(this.date + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD') === currentDateBybookingNowCheckTimeStatus) {
            // console.log('cheklimit', cheklimit, cheklimit > 0)
            if (moment().format(a.value) > moment().format('HH:mm')) {
              ss.date = moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
              ss.time = a.text
              ss.timeValue = a.value
              ss.countBooking = cheklimit > 0 ? cheklimit : 0
              ss.limitBooking = a.limitBooking
              ss.Overtime = false
              this.allDetails.push(ss)
            } else {
              ss.date = moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
              ss.time = a.text
              ss.timeValue = a.value
              ss.countBooking = cheklimit > 0 ? cheklimit : 0
              ss.limitBooking = a.limitBooking
              ss.Overtime = true
              this.allDetails.push(ss)
            }
          } else {
            // console.log('cheklimit', cheklimit, cheklimit > 0)
            ss.date = moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
            ss.time = a.text
            ss.timeValue = a.value
            ss.countBooking = cheklimit > 0 ? cheklimit : 0
            ss.limitBooking = a.limitBooking
            ss.Overtime = false
            this.allDetails.push(ss)
          }
          // console.log('s', s.date, a.value + ' ', cheklimit, parseInt(a.limitBooking), cheklimit >= parseInt(a.limitBooking))
          if (cheklimit < parseInt(a.limitBooking)) {
            stasutColorDate = true
          }
        })
        if (stasutColorDate === false) {
          s.checkLimit = false
          s.color = this.DarkMode
          s.colortext = '#000000'
          // console.log('aaaa' + s.date + ' ' + a.value + '-', cheklimit)
          // console.log('cheklimitIF', v, a.value, cheklimit)
        } else {
          s.checkLimit = true
          s.color = this.shop[0].shopId === 'SD_1694686349583' ? '#1d3430' : '#0D47A1'
          s.colortext = '#FFFFFF'
          // console.log('cheklimit', v, a.value, cheklimit)
        }
        // เซ็ตวันที่เป็นปัจจุบัน
        if (moment(item, 'YYYY-MM').format() <= moment(this.currentMonth, 'YYYY-MM').format()) {
          if (parseInt(s.value) >= parseInt(this.currentDate.split('-')[2])) {
            // console.log('werwerewrewrwerwerwerew', parseInt(this.currentDate.split('-')[2]), parseInt(s.value))
            this.dateSelect.push(s)
          }
        } else {
          this.dateSelect.push(s)
        }
      })
      // console.log('val', this.dateSelect)
      // console.log('allDetails', this.allDetails)
    },
    getDaysArray (year, month) {
      var monthIndex = month - 1 // 0..11 instead of 1..12
      var names = [ 'อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส' ]
      var date = new Date(year, monthIndex, 1)
      var result = []
      while (date.getMonth() === monthIndex) {
        result.push(date.getDate() + '-' + names[date.getDay()])
        date.setDate(date.getDate() + 1)
      }
      return result
    },
    async checkLiffLogin (dataLineConfig) {
      console.log('dataLineConfig', dataLineConfig)
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
    async getDataFlow () {
      this.DataFlow = []
      let dataFlow = []
      await axios.get(this.DNS_IP + '/flow/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            let checkBranchByFlow = d.masBranchID || 'All'
            if ((checkBranchByFlow === this.formSelect.masBranchID.toString()) || checkBranchByFlow === 'All') {
              if (d.limitBookingCheck === 'True') {
                console.log('eeeeeee', d.flowName)
                d.text = d.flowName
                d.textEn = d.flowNameEn
                d.value = d.flowId
                dataFlow.push(d)
              }
            }
          }
          this.DataFlow = dataFlow
        } else {
          this.DataFlow = []
        }
        if (this.DataFlow.length === 1) {
          this.formSelect.flowId = this.DataFlow[0].value
          this.checkFlowBranch()
          // this.checkTime()
          // this.getEmp()
        }
        console.log('this.DataFlow', this.DataFlow)
        // console.log('this.dateDayCustom', this.dateDayCustom)
        // console.log('this.dateDayoffValue', this.dateDayoffValue)
      })
    },
    async getDataBranch () {
      this.branch = []
      this.branchData = []
      await axios.get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        console.log('branch', rs)
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
    }
  }
}
</script>

<style scoped>
.v-sheet.v-card:not(.v-sheet--outlined) {
  -webkit-box-shadow: 0 3px 1px -2px rgb(255, 255, 255), 0 2px 2px 0 rgb(255 255 255), 0 1px 5px 0 rgb(255 255 255) !important;
    box-shadow: 0 3px 1px -2px rgb(255, 255, 255), 0 2px 2px 0 rgb(255 255 255), 0 1px 5px 0 rgb(255 255 255) !important;
}
.cardBox {
  box-shadow: 0 3px 1px -2px rgb(255, 255, 255), 0 2px 2px 0 rgb(255 255 255), 0 1px 5px 0 rgb(255 255 255);
}
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
