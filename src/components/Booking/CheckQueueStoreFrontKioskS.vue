<template>
  <v-main>
    <v-card
    :ripple="false"
    :img="ImgCover"
    height="240px"
    width="100%"
    >
    </v-card>
    <v-card class="pa-6 pb-10 px-0 mt-n10 mb-10"
    :color="DarkModeBackground"
          :style="'background-color:'+ DarkModeBackground +';min-height: 100vh;'"
          >
          <!-- :style="'background-color:'+ DarkModeBackground +';min-height: 100vh;border-radius: 45px 45px 0px 0px;'" -->
        <v-row>
          <v-col class="text-center">
            <v-avatar class="mt-n16 pa-1" style="" :color="DarkModeBackground" size="150">
            <img
              :src="LoGo"
            >
          </v-avatar>
          </v-col>
         </v-row>
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
        <v-row v-if="source === 'kiosk' && userId === 'No Line'">
          <v-col cols="12" class="text-right pl-10 pr-10">
            <v-btn
              v-if="shopId"
              elevation="10"
              color="green"
              dark
              block
              @click="getBotinfo()"
            ><v-icon left color="white">mdi-bell-ring</v-icon> {{ languageSelect === 0 ? "Line OA" : "LINE OA" }}</v-btn>
          </v-col>
        </v-row>
    <v-sheet class="pa-3 pt-5 mt-3" :style="'background-color:'+ DarkModeBackground +';border-radius: 0px 0px 0px 0px;'" >
      <div v-if="dataBookingData.length > 0 && dataBookingData[0].storeFrontQueue" class="pa-3" :style="'background-color:#FFFFFF;min-height: 180px;'">
        <h4 class="text-center font-weight-bold mt-5" style="color:#092C4C">{{ shop[0].shopName }}</h4>
        <h4 class="text-center font-weight-bold mt-5"  v-if="dataBookingData[0].flowName" style="color:#092C4C">{{ languageSelect === 0 ? dataBookingData[0].flowName : (dataBookingData[0].flowNameEn || dataBookingData[0].flowName)}}</h4>
        <v-row>
          <v-col cols="6" >
            <div class="text-left ml-6 mt-3">
              <p class="font-weight-bold" style="color:#092C4C">{{ languageSelect === 0 ? "วันที่นัดหมาย" : "Date" }}</p>
              <p style="color:#092C4C" v-if="showTime === 'แสดง'" class="font-weight-bold">{{ languageSelect === 0 ? "เวลา" : "Time of issue" }}</p>
              <p style="color:#092C4C" v-if="dataBookingData[0].servicePoint" class="font-weight-bold">{{ languageSelect === 0 ? "Counter" : "Counter" }}</p>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="text-right mr-6 mt-3">
              <p class="font-weight-bold"  style="color:#092C4C">{{momenDate_2(dataBookingData[0].dueDate)}}</p>
              <p style="color:#092C4C" class="font-weight-bold" v-if="showTime === 'แสดง'">{{momenTime(dataBookingData[0].dueDate)}}{{ languageSelect === 0 ? "  น." : "" }}</p>
              <p style="color:#092C4C" v-if="dataBookingData[0].servicePoint" class="font-weight-bold">{{ languageSelect === 0 ? dataBookingData[0].servicePoint : JSON.parse(dataBookingData[0].servicePointCount).filter(el => { return el.textTh === dataBookingData[0].servicePoint}).length > 0 ? JSON.parse(dataBookingData[0].servicePointCount).filter(el => { return el.textTh === dataBookingData[0].servicePoint})[0].textEn:dataBookingData[0].servicePoint}}</p>
            </div>
          </v-col>
        </v-row>
        <v-row v-for="(item, index) in dataBookingDataUse" :key="index">
          <v-col class="text-left pb-0 pt-0" cols="6" v-if="item.fieldValue"><p class="font-weight-bold ml-6"  style="color:#092C4C">{{ languageSelect === 0 ? item.fieldName:item.fieldNameEn}}</p></v-col>
          <v-col class="text-right pb-0 pt-0" cols="6" v-if="item.fieldValue"><p class="font-weight-bold mr-6"  style="color:#092C4C">{{item.fieldValue}}</p></v-col>
        </v-row>
      </div>
      <v-sheet v-if="dataBookingData.length > 0 && dataBookingData[0].storeFrontQueue" class="pa-3" :style="'background-color:#FFFFFF;min-height: 180px;border-radius: 0px 0px 45px 45px;border-top: 2px dotted '+ DarkModeBackground + ';position:relative'">
        <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? "หมายเลขคิวของคุณ" : "Your Number" }}</h5>
        <p style="color:#092C4C;font-size: 80px;" class="text-center font-weight-black mt-n5 mb-n5">{{dataBookingData[0].storeFrontQueue}}</p>
        <div style="display:flex;justify-content: center;" v-if="beforQueue > 0">
          <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? "มีคิวก่อนหน้าคุณ" : "At the front of the queue" }}</h5>
          <h5 style="color:#FFFFFF;background-color:#092C4C;min-height: 30px;width:30px;border-radius: 80px 80px 80px 80px;display: flex;justify-content: center;align-items: center;" class="text-center font-weight-black ml-2 mr-2 mt-2">{{beforQueue}}</h5>
          <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? "คิว" : "Queue" }}</h5>
        </div>
        <div v-else>
          <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? "ตอนนี้คุณอยู่คิวแรกแล้ว" : "You are now in the first queue." }}</h5>
          <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? "กรุณารอเจ้าหน้าที่เรียกคิว" : "Please wait for the staff to call the queue." }}</h5>
        </div>

      </v-sheet>
    </v-sheet>
    <!-- <div class="pa-3">
      <v-row no-gutters>
            <v-col cols="12">
              <v-sheet
                :color="'#f9ffe9'"
                elevation="1"
                width="100%"
                dark
                style="border-bottom: 1px solid #695988 !important;border-radius: 10px 10px 0px 0px;"
              >
                <v-container>
                  <v-row>
                    <v-col cols="6" class="pt-0">
                      <br>
                      <v-row class="text-center">
                        <v-col cols="12" :style="'font-weight: 700;font-size: 20px' + ';line-height: 24px;color:black'">
                          {{languageSelect === 0 ?"หมายเลขคิว": "Number"}}
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="6" class="pt-0">
                      <br>
                      <v-row class="text-center">
                        <v-col  cols="12" :style="'font-weight: 700;font-size:20px' + ';line-height: 24px;color:black'">
                          {{languageSelect === 0 ?"ช่องบริการ": "Counter"}}
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-sheet>
              <v-sheet
                elevation="1"
                height="85%"
                width="100%"
                style="border-radius: 0px 0px 10px 10px;"
              >
                <v-container>
                  <v-row v-for="(items, id) in itemBookingUse" :key="id">
                    <v-col cols="6" class="pt-2">
                      <v-row class="text-center">
                        <v-col cols="12" :style="'font-weight: 700;font-size:17px' + ';color:black'">
                          {{items.storeFrontQueue}}
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="6" class="pt-2" style="border-left: 1px solid #695988 !important">
                      <v-row class="text-center">
                        <v-col cols="12" :style="'font-weight: 700;font-size: 17px;color:black'">
                          {{items.servicePoint === '' ? (items.statusBt === 'confirmJob' ? 'เรียกคิว' : '') : items.servicePoint}}
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-sheet>
            </v-col>
          </v-row>
    </div> -->
    </v-card>
    <v-footer padless fixed>
        <v-col
          class="text-center"
          cols="12"
        >
        <strong style="color:#092C4C;">{{ languageSelect === 0 ? "* ทางบริษัทขอสงวนสิทธิ์ในการข้ามคิว กรณีลูกค้าไม่แสดงตน" : "Note: Please be ready 5 minutes before the queue is coming." }}</strong>
        </v-col>
        <!-- <v-col
          class="text-center pt-0"
          cols="12"
          v-if="languageSelect === 1"
        >
          <strong style="color:#092C4C;">If after 15 minutes the queue will be cancelled.</strong>
        </v-col> -->
      </v-footer>
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
  data () {
    return {
      validSearch: true,
      dateStartShow: '',
      itemBookingUse: [],
      dateStart: '',
      textCheckQueue: '',
      textCheckQueueEng: '',
      languageSelect: 0,
      checkMemberId: '',
      value: '',
      size: 200,
      foreground: '#000000',
      profile: null,
      ColorByShop: [],
      DarkMode: '',
      DarkModeStatus: null,
      DarkModeButton: '',
      DarkModeBackground: '',
      DarkModefont: '',
      shop: [],
      LoGo: [],
      ImgCover: '',
      dataBookingList: [],
      dataBooking: [],
      dataBookingData: [],
      dataBookingDataUse: [],
      sequenceNo: 0,
      shopId: '',
      bookNo: this.$route.query.bookNo,
      beforQueue: '',
      checkQueue: null,
      dataLineConfig: {},
      showTime: '',
      source: '',
      checkRef: false,
      checkStatusEdit: true,
      userId: ''
    }
  },
  async mounted () {
    this.source = 'kiosk'
    // this.shopId = 'Ue9f527da07ff2da05246ea3f62671493'
    this.dateStart = moment().format('YYYY-MM-DD')
    console.log('this.profile', this.profile)
    if (this.$route.query.bookNo) {
      await this.getBookingData()
      await this.getBookingField()
      await this.getShop()
      await this.getDataDef()
      // await this.getFirestore()
    } else {
      this.$swal(
        'พบความผิดพลาดระหว่างดำเนินการ',
        'กรุณาติดต่อเจ้าหน้าที่',
        'info'
      )
    }
  },
  methods: {
    async getDataDef () {
      await this.getBookingData()
      await this.getBookingDataUse()
      await this.searchBooking()
    },
    async getFirestore () {
      console.log('getFirestore')
      this.firestore = this.$firebase.firestore()
      const FieldPath = this.$firebase.firestore.FieldPath
      this.firestore.collection('ProcessOhrichUpdate')
        .where(FieldPath.documentId(), '==', this.$route.query.bookNo)
        .onSnapshot(async (snapshot) => {
          if (snapshot.empty) {
            this.updateProcessOhrichUpdate()
            await this.getDataDef()
          } else {
            snapshot.docChanges().forEach(async (change) => {
              if (this.checkRef === false) {
                this.checkRef = true
                this.updateProcessOhrichUpdate()
                await this.getDataDef()
              } else {
                if (change.doc.data().active === '1' && change.doc.id === this.$route.query.bookNo) {
                  console.log(change)
                  console.log(change.doc.id)
                  console.log(change.doc.data())
                  this.updateProcessOhrichUpdate()
                  await this.getDataDef()
                }
              }
            })
          }
        })
    },
    updateProcessOhrichUpdate (item) {
      let params = {
        userName: this.$route.query.bookNo
      }
      axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/Pepsico-ProcessOhrichUseNew', params)
    },
    async GroupArrayQueue (dataArray) {
      // ใช้ Map เพื่อจัดกลุ่มตาม flowId
      let dataConfirm = []
      let data = []
      let dataB = []
      for (let i = 0; i < dataArray.length; i++) {
        let d = dataArray[i]
        if (d.statusBt === 'confirmJob') {
          dataConfirm.push(d)
        } else {
          if (d.storeFrontText === 'B') {
            dataB.push(d)
          } else {
            data.push(d)
          }
        }
      }
      // console.log('dataConfirm', dataConfirm)
      // console.log('data', data)
      // console.log('dataB', dataB)
      let mergedData = [...dataB, ...data.slice(0)]
      dataConfirm.push(...mergedData)

      console.log(dataConfirm)
      return dataConfirm
    },
    async searchBooking () {
      if (this.validSearch === true) {
        console.log('searchBooking')
        // this.dateStartShow = moment(this.dateStart).locale('th').format('LLLL')
        this.dateStartShow = 'วัน' + moment(this.dateStart).locale('th').format('dddd') + 'ที่ ' + moment(this.dateStart).locale('th').format('D MMMM ') + (parseInt(moment(this.dateStart).format('YYYY')) + 543).toString()
        // await this.getBookingDataList(this.dateStart)
        console.log('searchBooking', this.shopId)
        console.log('searchBooking', this.dataBookingData[0].masBranchID)
        console.log('searchBooking', this.dateStart)
        let urlApi = this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.shopId +
            '&masBranchID=' +
            this.dataBookingData[0].masBranchID +
            // '&flowId=' +
            // this.flowSelect +
            '&dueDate=' +
            this.dateStart + '&storeFrontQueue=is not null&statusBt=confirm and confirmJob'
        // '&dueDate=' +
        // this.dateStart + ' ' + this.time + '&storeFrontQueue=is not null&statusBt=confirm and confirmJob'
        await axios
          .get(urlApi)
          .then(async response => {
            console.log('getData', response.data)
            let rs = response.data
            if (rs.length > 0) {
              // let sortData = rs.sort((a, b) => {
              //   if (a.storeFrontQueue < b.storeFrontQueue) return -1
              //   return a.storeFrontQueue > b.storeFrontQueue ? 1 : 0
              // })
              let sortData = await this.GroupArrayQueue(rs)
              this.itemBooking = []
              for (let i = 0; i < sortData.length; i++) {
                let d = sortData[i]
                // if (this.BookingDataList[d.bookNo] !== undefined) {
                //   d.servicePoint = d.servicePoint || ''
                //   this.itemBooking.push(d)
                // }
                d.servicePoint = d.servicePoint || ''
                this.itemBooking.push(d)
              }
              let dataCon = this.itemBooking.filter(el => { return el.statusBt === 'confirmJob' })
              let dataWain = this.itemBooking.filter(el => { return el.statusBt === 'confirm' })
              console.log(dataCon, dataWain)
              let sortDataDataCon = dataCon.sort((a, b) => {
                if (a.LAST_DATE > b.LAST_DATE) return -1
                return a.LAST_DATE < b.LAST_DATE ? 1 : 0
              })
              this.countConfirm = dataWain.length
              this.countConfirmList = dataWain.filter((el, ind) => { return ind <= 11 })
              this.itemBookingUse = [ ...sortDataDataCon, ...dataWain ].filter((el, ind) => { return ind <= 5 })
            } else {
              this.itemBookingUse = []
              this.countConfirm = 0
            }
          })
        console.log('this.languageSelect', this.languageSelect)
      }
    },
    async getBookingField () {
      this.showTime = ''
      await axios
        .get(this.DNS_IP + '/BookingField/get?shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.status === false) {
            this.showTime = 'แสดง'
          } else {
            this.showTime = rs[0].showTime || 'แสดง'
          }
        })
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
              this.$liff.login({ redirectUri: window.location.href + '&checkLineLogin=T' })
              // this.$liff.login({ redirectUri: 'https://https://liff.line.me/' + dataLineConfig.liffMainID + '/CheckQueueStoreFrontOhrich?bookNo=BK101354421703415970135' + '&checkLineLogin=T' })
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
        .then(async function (profile) {
          _this.profile = profile
          console.log('prod', _this.profile)
          await _this.checkMemberOhrich()
        })
        .catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
    },
    getProfile_dev () {
      this.profile = this.$profile_dev
      console.log('dev', this.profile)
    },
    async getShop () {
      if (this.shopId) {
        await axios.get(this.DNS_IP + '/sys_shop/get?shopId=' + this.shopId).then(response => {
          let rs = response.data
          console.log('rs', rs)
          if (rs.length > 0) {
            this.shop = rs
            console.log('this.shop', this.shop)
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
                this.DarkModefont = '#FFFFFF'
              } else {
                this.DarkMode = ''
                this.DarkModefont = '#173053'
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
        this.DarkMode = ''
        this.DarkModefont = '#173053'
      }
      console.log('this.shop', this.shop)
    },
    async getBookingList () {
      this.dataBookingList = []
      await axios
        .get(
          this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.shopId +
            '&dueDate=' +
            this.momenDate_1(new Date()) +
            '&checkOnsite=is null&statusBt=confirm'
            // '&checkOnsite=is null&statusBt=wait and confirm'
        )
        .then(async response => {
          let rs = response.data
          if (rs.status === false) {
            this.dataBookingList = []
          } else {
            let rsUse = rs.sort((a, b) => {
              if (a.dueDate > b.dueDate) return -1
              return a.dueDate < b.dueDate ? 1 : 0
            })
            console.log('rsUse', rsUse)
            this.dataBookingList = rsUse
          }
        })
    },
    async searchAny () {
      this.dataBooking = []
      this.dataBookingData = []
      await axios
        .get(
          this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.shopId +
            '&userId=' +
            this.profile.userId +
            '&dueDate=' +
            this.momenDate_1(new Date()) +
            '&checkOnsite=is null&statusBt=confirm'
            // '&checkOnsite=is null&statusBt=wait and confirm'
        )
        .then(async response => {
          let rs = response.data
          console.log('rsUse', rs)
          if (rs.status === false) {
            await axios
              .get(
                this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.shopId +
            '&userId=' +
            this.profile.userId +
            '&checkOnsite=is null&statusBt=confirm'
            // '&checkOnsite=is null&statusBt=wait and confirm'
              )
              .then(async responses => {
                let rsUse = responses.data
                if (rsUse.status !== false) {
                  this.dataBooking = rsUse[0]
                  this.value = 'https://betask-linked-admin.web.app/BookingMobile?bookNo=' + rsUse[0].bookNo + '&shopId=' + rsUse[0].shopId
                  this.getBookingData(rsUse[0])
                  this.sequenceNo = 0
                } else {
                  this.sequenceNo = 0
                  this.$swal(
                    'ผิดพลาด',
                    'ไม่พบข้อมูลนัดหมาย',
                    'error'
                  )
                }
              })
          } else {
            let rsUse = rs.sort((a, b) => {
              if (a.dueDate > b.dueDate) return -1
              return a.dueDate < b.dueDate ? 1 : 0
            })
            if (this.dataBookingList.length > 0) {
              let rsUseNo = this.dataBookingList.sort((a, b) => {
                if (a.dueDate < b.dueDate) return -1
                return a.dueDate > b.dueDate ? 1 : 0
              })
              console.log('rsUseNo', rsUseNo)
              this.sequenceNo = rsUseNo.findIndex(x => x.bookNo === rsUse[0].bookNo) + 1
              console.log('sequenceNo', this.sequenceNo)
            }
            this.value = 'https://betask-linked-admin.web.app/BookingMobile?bookNo=' + rsUse[0].bookNo + '&shopId=' + rsUse[0].shopId
            this.dataBooking = rsUse[0]
            this.getBookingData(rsUse[0])
          }
        })
    },
    async getBookingQueue () {
      // if (text === 'confirmJob') {
      //   this.textCheckQueue = 'ถึงคิวของคุณแล้ว'
      //   this.textCheckQueueEng = 'You are in the queue'
      // } else {
      //   this.textCheckQueue = 'กรุณารอเจ้าหน้าที่เรียกคิว'
      //   this.textCheckQueueEng = 'Please wait for the staff to call the queue.'
      // }
      await axios
        .get(this.DNS_IP + '/booking_view/get?shopId=' + this.shopId + '&dueDate=' + this.dataBookingData[0].dueDateDay + '&masBranchID=' + this.dataBookingData[0].masBranchID + '&flowId=' + this.dataBookingData[0].flowId + '&storeFrontQueue=is not null&statusBt=confirm')
        // .get(this.DNS_IP + '/booking_view/get?shopId=' + this.shopId + '&dueDate=' + this.dataBookingData[0].dueDateDay + '&storeFrontQueue=is not null&statusBt=confirm')
        .then(async response => {
          let rs = response.data
          console.log('test', rs)
          if (rs.length > 0) {
            if (rs.filter((item, key) => item.storeFrontQueue === this.dataBookingData[0].storeFrontQueue).length > 0) {
              let findIndex = rs.findIndex((item, key) => item.storeFrontQueue === this.dataBookingData[0].storeFrontQueue)
              // console.log('findIndex', findIndex)
              this.beforQueue = rs.filter((item, key) => key < findIndex).length
              // console.log('this.beforQueue', this.beforQueue)
              this.checkQueue = this.dataBookingData[0].storeFrontQueue
            } else {
              this.dataBookingData = []
              this.checkQueue = 0
              // console.log('this.beforQueue', this.beforQueue)
            }
          } else {
            this.checkQueue = 0
          }
        })
    },
    async getBookingData () {
      this.dataBookingData = []
      await axios
        // .get(this.DNS_IP + '/BookingData/get?shopId=' + this.shopId + '&bookNo=' + this.bookNo)
        .get(this.DNS_IP + '/booking_view/get?bookNo=' + this.bookNo)
        .then(async response => {
          let rs = response.data
          console.log('rsUse', rs)
          if (rs.length > 0) {
            this.dataBookingData = rs
            console.log('bookingData', rs)
            this.shopId = rs[0].shopId
            this.languageSelect = rs[0].bookingLanguage || 0
            this.userId = rs[0].userId || 'No Line'
            await this.getBookingQueue()
          }
        })
    },
    async getBookingDataUse () {
      this.dataBookingDataUse = []
      await axios
        .get(this.DNS_IP + '/BookingData/get?shopId=' + this.shopId + '&bookNo=' + this.bookNo)
        // .get(this.DNS_IP + '/booking_view/get?shopId=' + this.shopId + '&bookNo=' + this.bookNo)
        .then(async response => {
          let rs = response.data
          console.log('rsUse', rs)
          if (rs.length > 0) {
            this.dataBookingDataUse = rs
          }
        })
    },
    async checkMember (bookNo) {
      await axios.get(this.DNS_IP + '/booking_view/get?bookNo=' + bookNo)
        .then(async (response) => {
          let rs = response.data
          console.log('RSTESTTTTTT', response)
          if (rs[0].lineUserId === null || rs[0].lineUserId === '') {
            this.checkMemberId = 'memberNo'
          } else {
            this.checkMemberId = 'memberTrue'
          }
          console.log('this.checkMemberId', this.checkMemberId)
        }).catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
    },
    async getBotinfo () {
      if (this.source === 'kiosk') {
        this.dataLineConfig = await this.getDataLineConfig(this.shopId)
        window.location.href = 'https://liff.line.me/' + this.dataLineConfig.liffUpdateNotiLinaOA + '?bookNo=' + this.$route.query.bookNo
        // this.dataLineConfig = await this.getDataLineConfig(this.shopId)
        // await this.checkLiffLogin(this.dataLineConfig)
      } else {
        if (this.shopId) {
          const url = `${this.DNS_IP}/line/getOa`
          // const url = 'http://localhost:81/Api/vgroupl_api/v1/Zoom/Login/getData?'
          const config = {
            headers: {
              'botId': this.shopId
            }
          }
          await this.checkMember(this.$route.query.bookNo)
          await axios.get(url, config).then((response) => {
            let rs = response.data
            console.log('rs1111', rs)
            if (this.checkMemberId === 'memberNo') {
              // window.location.href = 'https://line.me/R/oaMessage/' + rs.basicId + `?เปิดรับการแจ้งเตือน ` + this.profile.userId
              window.location.href = 'https://line.me/R/oaMessage/' + rs.basicId + `/?เปิดรับการแจ้งเตือน`
            // liff.openliff.openWindow({
            //   url: 'https://line.me/R/oaMessage/' + rs.basicId + `?เปิดรับการแจ้งเตือน`,
            //   external: true
            // })
            } else {
              window.location.href = 'line://ti/p/' + rs.basicId
            }
          })
        }
      }
    },
    async checkMemberOhrich () {
      await this.saveUserId()
      await axios.get(this.DNS_IP + '/member/get?shopId=' + this.shopId + '&liffUserId=' + this.profile.userId).then(async result => {
        var lineUserIds = ''
        var liffUserIds = ''
        if (result.data.status === false) {
          await this.onSubmit()
        } else {
          lineUserIds = result.data[0].lineUserId || ''
          liffUserIds = result.data[0].liffUserId || ''
          if (lineUserIds === '' && liffUserIds !== '') {
            await this.onUpdate(result.data[0].memberId)
          }
        }
        let dttt = {
          checkGetQueue: 'False'
        }
        await axios
          .post(this.DNS_IP + '/Booking/pushMsgQueueOhrich/' + this.$route.query.bookNo, dttt)
          .then(async response => {}).catch(error => {
            console.log('error function pushMsgQueueOhrich : ', error)
          }).catch(error => {
            console.log('error function pushMsgQueueOhrich : ', error)
          })
      }).catch(error => {
        console.log('error function member get : ', error)
      })
    },
    async saveUserId () {
      let userId = {
        'userId': this.profile.userId
      }
      await axios.post(this.DNS_IP + '/Booking/edit/' + this.$route.query.bookNo, userId).then(async response => {
        console.log('response', response)
      }).catch(error => {
        console.log('error function saveUserId : ', error)
      })
    },
    async onSubmit () {
      // var idMember = 'Link_' + Date.now()
      var idMember = moment().valueOf()
      const params = {
        name: this.profile.displayName,
        picture: this.profile.pictureUrl,
        liffUserId: this.profile.userId,
        lineUserId: this.profile.userId,
        shopId: this.shopId,
        memberId: idMember,
        CREATE_USER: this.profile.userId,
        LAST_USER: this.profile.userId
      }
      const result = await this.callBeTaskAPIActivity('post', `/member/add`, params)
      console.log('result', result.status)
    },
    async onUpdate (idMember) {
      // "https://api-belinked.betaskthai.com/member/editWebhook/" + request.body.events[0].message.text.split(" ")[2]
      // window.location.replace(`https://access.line.me/dialog/bot/accountLink?linkToken=${this.$route.query.likeToken}&nonce=${idMember}-${this.profile.userId}`)
      // window.location.href = `https://access.line.me/dialog/bot/accountLink?linkToken=${this.$route.query.likeToken}&nonce=${idMember}-${this.profile.userId}`
      const params = {
        lineUserId: this.profile.userId,
        liffUserId: this.profile.userId,
        LAST_USER: this.profile.userId
      }
      const result = await this.callBeTaskAPIActivity('post', '/member/editWebhook/' + idMember, params)
      console.log('result', result.status)
    },
    async callBeTaskAPIActivity (method, url, params) {
      let result = null
      //   const token = this.$liff.getAccessToken() || '1234567890'
      await axios({
        method: method,
        // headers: {
        //   accessToken: token,
        //   lineUserId: this.profile.userId,
        //   activityId: this.formUpdate.activityId
        // },
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
    async getBotinfoChatAuto () {
      if (this.shopId) {
        const url = `${this.DNS_IP}/line/getOa`
        // const url = 'http://localhost:81/Api/vgroupl_api/v1/Zoom/Login/getData?'
        const config = {
          headers: {
            'botId': this.shopId
          }
        }
        await axios.get(url, config).then((response) => {
          let rs = response.data
          window.location.href = 'line://ti/p/' + rs.basicId
        })
      }
    }
  }
}
</script>

<style scoped>
.main {
  background-color: #ffffff;
  height: 100vh;
}
.content {
  overflow: auto;
  white-space: normal;
}
.a {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  max-height: 350px;
}
</style>
