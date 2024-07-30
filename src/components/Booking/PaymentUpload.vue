<template>
  <v-main>
    <v-overlay :value="overlay"></v-overlay>
    <v-card
    :ripple="false"
    :img="ImgCover"
    height="240px"
    width="100%"
    >
    </v-card>
    <v-card class="pa-3 pb-10 mt-n10"
          :color="DarkModeBackground"
          v-if="shop.length > 0"
          :style="'background-color:'+ DarkModeBackground +';min-height: 100vh;border-radius: 45px 45px 0px 0px;'"
          >
        <v-row>
          <v-col class="text-center">
            <v-avatar v-if="shop.length > 0" class="mt-n16 pa-1" style="" :color="DarkModeBackground" size="180">
            <img
              :src="LoGo"
            >
          </v-avatar>
          </v-col>
         </v-row>
      <!-- <h3 class="text-center mt-3" :style="'color:' + DarkModefont + ';'">
        {{ languageSelect === 0 ? "โอนเงินมัดจำ" : "Booking deposit" }}
      </h3> -->
      <h5
        class="text-center mt-5"
        :style="'color:' + DarkModefont + ';'"
        v-if="shop.length > 0 && shop[0].showShopName === 'True'"
      >
        {{ shop[0].shopName }}
      </h5>
      <v-card
        v-if="checkStatus === true"
        class="pa-5 mt-5 "
        :style="'border-radius: 15px 15px 15px 15px;'"
      >
      <h6 class="mt-3 mb-6">{{ languageSelect === 0 ? "กรุณาเลือกรายการที่ยังไม่ได้ชำระค่ามัดจำ" : "Please select an item for which the deposit has not yet been paid." }}</h6>
       <v-select
          v-model="bookNo"
          :item-text="SelectBookingData.text"
          :items="SelectBookingData"
          :label="languageSelect === 0 ? 'รายการที่ยังไม่ได้ชำระค่ามัดจำ' : 'Item for which the deposit has not yet been paid.'"
          @change="getbookingData(),getbooking()"
          attach
          :menu-props="{ bottom: true, offsetY: true }"
          outlined
        ></v-select>
      <!-- <div class="text-center mt-5">
        <v-btn
          class="button"
          :color="DarkModeButton"
          dark
          large
          @click="UploadImg()"
          >{{ languageSelect === 0 ? "ยืนยัน" : "Confirm" }}</v-btn
        >
      </div> -->
      </v-card>
      <v-card
        v-if="BookingData.length > 0"
        class="pa-5 mt-5 "
        :style="'border-radius: 15px 15px 15px 15px;'"
      >
      <v-form >
      <h4 v-if="!couponStatus" class="text-center font-weight-black mb-10" >{{ languageSelect === 0 ? "แนบหลักฐานการโอนเงิน" : "Please attach the transfer file" }}</h4>
      <h4 v-if="couponStatus" class="text-center font-weight-black mb-10" >{{ languageSelect === 0 ? "แนบภาพคูปองหรือส่วนลด" : "Please attach coupon or discount file" }}</h4>

        <div v-for="(item , key) in BookingData" :key="key">
          <v-row>
            <v-col cols="6" class="py-0">
              <p class="font-weight-black">{{ languageSelect === 0 ? item.fieldName : item.fieldNameEn }}</p>
            </v-col>
            <v-col cols="6" class="py-0">
              <p class="font-weight-black">{{item.fieldValue}}</p>
            </v-col>
          </v-row>
          <!-- <v-text-field
            v-model="item.fieldValue"
            :label="item.fieldName"
            disabled
            outlined
            :background-color="DarkMode"
          ></v-text-field> -->
        </div>
        <v-row>
          <v-col cols="12" class="text-center pa-2 mt-6">
            <v-img
            v-if="formUpload.depositImge !== ''"
            class="pa-3"
            contain
              max-height="100%"
              max-width="100%"
              :src="formUpload.depositImge"
            ></v-img>
            <v-avatar
             v-else
              tile
              color="#FFFFFF"
              size="180"
            >
              <v-img
              v-if="!couponStatus"
              aspect-ratio="6"
              contain
              src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FUploadicon.png?alt=media&token=39383860-d16e-49ca-81cb-a3ad888df095"
              ></v-img>
              <v-img
              v-if="couponStatus"
              aspect-ratio="6"
              contain
              :src="require('@/assets/coupon.png')"
              ></v-img>
              <!-- <v-img
              aspect-ratio="6"
              contain
              :src="require('@/assets/Uploadicon.png')"
              ></v-img> -->
            </v-avatar>
            <v-file-input
            class="mt-6 mb-6"
              required
              counter
              show-size
              :rules="[rules.resizeImag]"
              accept="image/png, image/jpeg, image/bmp"
              prepend-icon="mdi-paperclip"
              label="Upload"
              @change="selectImgCoverUpdate"
              v-model="filesUpdateImgCover"
            ></v-file-input>
          </v-col>
        </v-row>
      </v-form>
      <div class="text-center">
        <v-btn
          class="button"
          :color="DarkModeButton"
          dark
          large
          @click="gotoThank()"
          >{{ languageSelect === 0 ? "กลับไปหน้าชำระเงิน" : "Back to payment" }}
          </v-btn >
          <v-btn
          class="button"
          :color="DarkModeButton"
          dark
          large
          @click="UploadImg()"
          >{{ languageSelect === 0 ? "ยืนยัน" : "Confirm" }}
          </v-btn >
      </div>
      </v-card>
    </v-card>
  </v-main>
</template>

<script>
import axios from 'axios' // api
import moment from 'moment'
export default {
  components: {
  },
  data () {
    return {
      overlay: false,
      valid: true,
      GroupId: this.$route.query.GroupId,
      bookNo: '',
      userName: '',
      userPassword: '',
      shopId: this.$route.query.shopId,
      profile: null,
      fromAdd: {
        GroupId: '',
        shopId: '',
        bookingStatus: 'N'
      },
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
      BookingData: [],
      formUpload: {
        bookNo: '',
        depositImge: '',
        depositStatus: null,
        depositPrice: this.$route.query.depositPrice
      },
      filesUpdateImgCover: null,
      SelectBookingData: [],
      checkStatus: true,
      SelectBooking: '',
      userId: '',
      languageSelect: 0,
      checkStatusBooking: '',
      DataFlowNameAll: [],
      bookingDataSelect: [],
      couponStatus: false
    }
  },
  async mounted () {
    await this.checkbookNo()
    if (this.$route.query.languageSelect) {
      this.languageSelect = parseInt(this.$route.query.languageSelect)
    } else {
      this.languageSelect = 0
    }
    // เลคถ้าเป็น คูปองหรืออื่นๆ
    if (this.$route.query.coupon) {
      this.couponStatus = true
      console.log('คูปองหรืออื่นๆ')
    }
  },
  methods: {
    gotoThank () {
      let flowId = this.BookingData.filter((item) => item.bookNo === this.bookNo)[0].flowId
      this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=BookingForm&flowId=' + flowId + '&bookNo=' + this.formUpload.bookNo)
    },
    async checkbookNo () {
      this.BookingData = []
      this.SelectBookingData = []
      if (this.$route.query.bookNo) {
        this.bookNo = this.$route.query.bookNo
        this.checkStatus = false
        await this.getShop()
        await this.getbookingData()
        await this.getbooking()
        await this.getDataFlow()
      } else {
        if (this.$route.query.error === 'ACCESS_DENIED' || this.$route.query.error === 'access_denied') {
          this.$swal({
            title: 'ผิดพลาด กรุณากดยอมรับเพื่อ ทำรายการต่อ',
            type: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#b3b1ab',
            confirmButtonText: 'ยอมรับ',
            cancelButtonText: 'ไม่ยอมรับ'
          })
            .then(async result => {
              this.$router.go()
            }).catch(function (error) {
              console.log('Error getting profile: ' + error)
              this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=PaymentUpload&languageSelect=' + this.languageSelect)
            })
        } else {
          console.log('test')
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
          this.shopId = checkShopId
          await this.checkLiffLogin(dataLineConfig)
          await this.getBookingView()
          await this.getShop()
          await this.getDataFlow()
        }
      }
    },
    async getDataFlow () {
      this.DataFlowNameAll = []
      // console.log('DataFlowName', this.DataFlowName)
      let path = ''
      if (this.$route.query.flowId) {
        path = '/flow/get?shopId=' + this.shopId + '&flowId=' + this.$route.query.flowId
      } else {
        path = '/flow/get?shopId=' + this.shopId
      }
      await axios.get(this.DNS_IP + path).then(response => {
        let rs = response.data
        console.log('rssssssssssssssFlow', rs)
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            this.DataFlowNameAll.push(d)
          }
        } else {
          this.DataFlowNameAll = []
        }
      })
    },
    selectImgCoverUpdate () {
      if (this.filesUpdateImgCover) {
        this.formUpload.depositImge = URL.createObjectURL(
          this.filesUpdateImgCover
        )
      } else {
        this.formUpload.depositImge = ''
      }
      // console.log(event)
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
    async checkBooking (bookNo) {
      await axios.get(this.DNS_IP + '/booking_view/get?bookNo=' + bookNo)
        .then(async (response) => {
          let rs = response.data
          console.log('RSTESTTTTTT', rs)
          if (rs[0].statusBt === 'cancel') {
            console.log('RSTESTTTTTTee')
            this.checkStatusBooking = 'False'
          } else {
            this.checkStatusBooking = 'True'
          }
        }).catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
    },
    async UploadImg () {
      this.overlay = true
      console.log('this.overlay', this.overlay)
      if (this.formUpload.depositImge !== '') {
        this.$swal({
          title: this.languageSelect === 0 ? 'ยืนยันการบันทึกข้อมูล' : 'Please confirm your information',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#b3b1ab',
          confirmButtonText: this.languageSelect === 0 ? 'ใช่' : 'Yes',
          cancelButtonText: this.languageSelect === 0 ? 'ไม่' : 'No'
        })
          .then(async result => {
            await this.checkBooking(this.formUpload.bookNo)
            if (this.checkStatusBooking === 'False') {
              console.log('IF')
              await this.$swal(this.languageSelect === 0 ? 'ผิดพลาด' : 'Error', this.languageSelect === 0 ? 'เนื่องจากไม่ชำระเงินตามระยะเวลาที่กำหนด' : 'Due to non-payment on time', 'error')
                .then(async result => {
                  this.$router.push('/PaymentUpload?shopId=' + this.shopId)
                  location.reload()
                }).catch(async result => {
                  this.$router.push('/PaymentUpload?shopId=' + this.shopId)
                  location.reload()
                })
            } else if (this.checkStatusBooking === 'True') {
              if (this.filesUpdateImgCover) {
                const _this = this
                let params = new FormData()
                let configDepositUpload = {
                  headers: {
                    'bookNo': this.formUpload.bookNo
                  }
                }
                params.append('file', this.filesUpdateImgCover)
                await axios
                  .post(this.DNS_IP + `/file/upload/deposit`, params, configDepositUpload)
                  .then(function (response) {
                    _this.formUpload.depositImge = response.data
                    console.log('url Pic', response.data)
                  })
              } else {
                this.formUpload.depositImge = this.filesUpdateImgCover
              }
              this.formUpload.depositStatus = 'True'
              this.formUpload.paymentType = this.$route.query.coupon ? 'other' : 'payment'
              console.log('*************', this.formUpload)
              await axios.post(this.DNS_IP + '/Booking/edit/' + this.formUpload.bookNo, this.formUpload).then(async (response) => {
              // await this.$swal('เรียบร้อย', 'บันทึกข้อมูลสำเร็จ', 'success')
              // await this.checkbookNo()
                // console.log('response', response)
                let flowId = this.BookingData.filter((item) => item.bookNo === this.bookNo)[0].flowId
                let checkDataFlow = []
                if (this.$route.query.flowId) {
                  checkDataFlow = this.DataFlowNameAll.filter((item) => item.flowId === this.bookingDataSelect[0].flowId)
                } else {
                  checkDataFlow = this.DataFlowNameAll.filter((item) => item.flowId === flowId)
                }
                console.log('checkDataFlow', checkDataFlow)
                await this.pushMsgLineNotifyGroup(this.formUpload.bookNo)
                // await this.pushMsgCustomer(this.formUpload.bookNo, flowId)
                if (checkDataFlow[0].updateStatusConfirm === 'True') {
                  await this.pushMsgConfirm(this.formUpload.bookNo, flowId)
                } else {
                  await this.pushMsgCustomer(this.formUpload.bookNo, flowId)
                }
                await this.$swal({
                  title: this.languageSelect === 0 ? 'สำเร็จ' : 'Success',
                  text: this.languageSelect === 0 ? 'อัพโหลดสลิปสำเร็จ' : 'The slip has been successfully uploaded.',
                  type: 'success',
                  timer: 1500,
                  showConfirmButton: false
                })
                // this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=PaymentUpload&bookNo=' + this.formUpload.bookNo)

                // await this.$swal('สำเร็จ', 'อัพโหลดสลิปสำเร็จ', 'success')
                //   .then(async result => {
                //     this.overlay = true
                //     let flowId = this.BookingData.filter((item) => item.bookNo === this.bookNo)[0].flowId
                //     await this.pushMsgLineNotifyGroup(this.formUpload.bookNo)
                //     await this.pushMsgCustomer(this.formUpload.bookNo, flowId)
                //     this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=PaymentUpload&bookNo=' + this.formUpload.bookNo)
                //   }).catch(async result => {
                //     this.overlay = true
                //     let flowId = this.BookingData.filter((item) => item.bookNo === this.bookNo)[0].flowId
                //     await this.pushMsgLineNotifyGroup(this.formUpload.bookNo)
                //     await this.pushMsgCustomer(this.formUpload.bookNo, flowId)
                //     this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=PaymentUpload&bookNo=' + this.formUpload.bookNo)
                //   })
              })
            }
          })
          .catch(error => {
            console.log('Cencel : ', error)
            this.overlay = false
          })
      } else {
        this.$swal(this.languageSelect === 0 ? 'ผิดพลาด' : 'Error', this.languageSelect === 0 ? 'กรุณาอัพโหลดหลักฐานการโอนเงิน' : 'Please upload proof of payment.', 'error')
        this.overlay = false
        console.log('this.overlay', this.overlay)
      }
    },
    getShop () {
      if (this.$route.query.redirectBy) {
        let check = this.$route.query.redirectBy
        if (check === 'rating') {
          this.redirectBy = check
        } else if (check === 'BookingForm') {
          this.redirectBy = check
        } else {
          this.redirectBy = 'N'
        }
        console.log('redirectBy', check)
      } else {
        this.redirectBy = null
      }
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
    },
    async getbookingData () {
      this.BookingData = []
      if (this.bookNo !== '') {
        axios.get(this.DNS_IP + '/BookingData/get?bookNo=' + this.bookNo).then((response) => {
          let rs = response.data
          console.log('rs1', rs)
          console.log('this.bookNo', this.bookNo)
          if (rs.length > 0) {
            // for (let i = 0; i < rs.length; i++) {
            //   let d = rs[i]
            //   if (this.languageSelect === 0) {
            //     d.fieldName = d.fieldName
            //   } else {
            //     d.fieldName = d.fieldNameEn
            //   }
            // }
            this.BookingData = rs
          }
        }).catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
      }
    },
    async getbooking () {
      if (this.bookNo !== '') {
        axios.get(this.DNS_IP + '/Booking/get?bookNo=' + this.bookNo).then((response) => {
          let rs = response.data
          console.log('getbooking ', rs)
          if (rs.length > 0) {
            this.formUpload.bookNo = rs[0].bookNo
            this.formUpload.depositImge = rs[0].depositImge || ''
            this.formUpload.depositStatus = rs[0].depositImge || 'False'
            this.userId = rs[0].userId
            this.bookingDataSelect = rs
          }
        }).catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
      }
    },
    async getBookingView () {
      this.SelectBookingData = []
      await axios.get(this.DNS_IP + '/booking_view/get?shopId=' + this.shopId + '&userId=' + this.profile.userId + '&depositStatus=null&checkDeposit=True').then((response) => {
        let rs = response.data
        console.log('rsๅ', rs)
        if (rs.length > 0) {
          // console.log('test11')
          rs.forEach((v, k) => {
            console.log('test13', moment(v.dueDate).format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD'))
            // if (moment(v.dueDate).format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD')) {
            // console.log('test122', v)
            if (moment(v.dueDate).format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD')) {
              if (v.depositStatus === 'False' || v.depositStatus === null) {
              // console.log('test1')
                let s = {}
                if (this.languageSelect === 0) {
                  v.flowName = v.flowName
                } else {
                  v.flowName = v.flowNameEn
                }
                s.text = `${v.flowName}
                ${v.dueDate}`
                s.value = v.bookNo
                this.SelectBookingData.push(s)
              } else {
              // console.log('test12')
                this.SelectBookingData = []
              }
            }
            if (this.SelectBookingData.length === 1) {
              // console.log('test14')
              this.bookNo = this.SelectBookingData[0].value
              this.getbookingData()
              this.getbooking()
            }
            // }
          })
        }
        console.log('this.SelectBookingData', this.SelectBookingData)
      }).catch(function (error) {
        console.log('Error getting profile: ' + error)
      })
    },
    async pushMsgCustomer (bookNo, flowId) {
      let UserId = ''
      if (this.profile === null) {
        UserId = this.userId
      } else {
        UserId = this.profile.userId
      }
      const result = await axios.get(
        this.DNS_IP +
          '/member/get?shopId=' +
          this.shopId +
          '&liffUserId=' +
          UserId
      )
      console.log('result', result.data.status)
      if (result.data.status === false) {
        let statusSend = {
          statusSend: 'false'
        }
        await axios.post(this.DNS_IP + '/Booking/edit/' + bookNo, statusSend)
        console.log('statusSend', 'false')
        if (this.$liff.isInClient()) {
          // if (this.profile.userId === 'U29e920c9ca4411b09b8c1704f37197c3' || this.profile.userId === 'U35b246f2825895f3fdcc09b72d589f92') {
          //   alert('isInClient')
          // }
          this.$liff
            .sendMessages([
              {
                type: 'text',
                text: 'เปิดรับการแจ้งเตือน'
              }
            ])
            .then(() => {
              console.log('message sent')
              // alert('message sent')
              // this.$liff.closeWindow()
            })
            .catch((err) => {
              console.log('error', err)
              // alert('error:' + err)
            })
        }
        await this.getCondition(flowId, 'Thank', bookNo)
      } else {
        let statusSend = {
          statusSend: 'true'
        }
        await axios.post(this.DNS_IP + '/Booking/edit/' + bookNo, statusSend)
        // let lineUserId = result.data[0].lineUserId
        console.log('statusSend', 'true')
        let updateStatusSend = {
          updateStatusSend: 'false'
        }
        axios
          .post(
            this.DNS_IP + '/Booking/pushMsgCustomer/' + bookNo,
            updateStatusSend
          )
          .then(async response => {
            await this.getCondition(flowId, 'Thank', bookNo)
          })
      }
      // this.clearData()
    },
    async pushMsgConfirm (bookNo, flowId) {
      await axios
        .post(this.DNS_IP + '/Booking/pushMsgConfirm/' + bookNo)
        .then(async response => {
          await this.getCondition(flowId, 'Thank', bookNo)
        }).catch(error => {
          console.log('error function pushMsgQueue : ', error)
        })
    },
    async pushMsgLineNotifyGroup (bookNo) {
      await axios
        .post(this.DNS_IP + '/Booking/pushMsgLineNotifyGroup/' + bookNo)
        .then(response => {
        })
    },
    async getCondition (flowId, text, bookNo) {
      console.log('test', text)
      await axios
        .get(
          this.DNS_IP + '/flow/get?flowId=' + flowId + '&shopId=' + this.shopId
        )
        .then(response => {
          let rs = response.data
          if (rs.status === false) {
            if (text === 'BookingQrcode') {
              this.$router.push(
                '/BookingQrcode?bookNo=' + bookNo + '&shopId=' + this.shopId
              )
            } else {
              this.$router.push(
                '/Thank?shopId=' + this.shopId + '&redirectBy=PaymentUpload&flowId=' + flowId + '&bookNo=' + bookNo + '&languageSelect=' + this.languageSelect)
            }
          } else {
            if (rs[0].showCondition === 'แสดง') {
              this.$router.push(
                '/ConditionFlow?shopId=' + this.shopId + '&flowId=' + flowId
              )
            } else {
              if (text === 'BookingQrcode') {
                this.$router.push(
                  '/BookingQrcode?bookNo=' + bookNo + '&shopId=' + this.shopId
                )
              } else {
                this.$router.push(
                  '/Thank?shopId=' + this.shopId + '&redirectBy=PaymentUpload&flowId=' + flowId + '&bookNo=' + bookNo + '&languageSelect=' + this.languageSelect)
              }
            }
          }
        })
    }
  }
}
</script>

<style scoped>
.button {
  width: 45%;
  color: #fff;
  font-weight: 200;
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

</style>
