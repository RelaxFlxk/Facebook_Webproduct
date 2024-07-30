<template>
  <v-main>
    <v-card class="content p-3" min-height="100vh"
      :style="'background-color:'+ DarkModeBackground +';'"
    >
    <br>
    <br>
    <v-card class="p-3 " min-height="70vh" rounded>
      <div class="avatar text-center">
        <v-avatar size="120" style="border:5px solid #FFFFFF;">
        <img
          :src="profile.pictureUrl"
          alt="John"
        >
      </v-avatar>
      <br>
        <v-card-text class="text-h6">{{profile.displayName}}</v-card-text>
      </div>
      <br>
      <v-select
        v-model="Carnumber"
        :items="Carnumberitem"
        label="ค้นหาทะเบียนรถ"
        dense
        solo
        attach
        :menu-props="{ bottom: true, offsetY: true }"
        @change="SelectData"
      ></v-select>
    <v-timeline
    align-top
    dense
    v-if="Carnumber.length > 0"
    >
          <v-timeline-item
          :background-color="ColorByShop[1]"
          :color="ColorByShop[0]"
          v-for="(item , index) in HistoryData[0]" :key="index"
        >
          <template v-slot:icon>
            <v-icon
            small
            :color="ColorByShop[1]">
            event</v-icon>
          </template>
        <div v-for="(item2 , index2) in item" :key="index2">
        <v-card-text class="text-start"><h6 class="font-weight-bold">{{momenDate_2(item2[0].dueDate)}}</h6></v-card-text>
        <v-card-text class="text-start"><h6 class="font-weight-bold">{{item2[0].flowName}}</h6></v-card-text>
        <v-card-text class="text-start"><h6 class="font-weight-bold">{{item2[0].masBranchName}}</h6></v-card-text>
        <div v-for="(item3 , index3) in item2" :key="index3">
              <v-card-text class="text-start" v-if="item3.fieldValue !== ''"><strong>{{item3.fieldName}} : </strong> {{item3.fieldValue}}</v-card-text>
        </div>
        <v-card-actions v-if="item2[0].checkOnsite === 'True' && item2[0].jobNo">
          <v-btn
            elevation="6"
            :color="ColorByShop[0]"
            dark
            small
            @click="getjobId(item2[0].bookNo) , Jobdataitem = false"
          >รายละเอียดเพิ่มเติม</v-btn>
        </v-card-actions>
        </div>
          </v-timeline-item>
    </v-timeline>
    </v-card>
    </v-card>
    <v-dialog
    v-model="dialogMain"
    width="100%"
    max-height="70%"
    persistent
    >
    <v-card  class="content pa-3" max-height="90vh" :style="'background: linear-gradient(180deg, ' + ColorByShop[0] + ' 40%,' +  ColorByShop[1] + ' 100%);'">
            <v-col class="text-right pa-0 pb-2">
              <v-btn
                small
                color="#E0E0E0"
                @click="(dialogMain = false)"
              >
                <v-icon color="#173053">mdi-close</v-icon>
              </v-btn>
            </v-col>
    <v-card v-if="!Jobdataitem">
      <v-skeleton-loader
      class="mx-auto"
       max-height="700px"
      type="card"
      ></v-skeleton-loader>
    </v-card>
      <v-card class="content p-3"
          max-height="700px"
          v-if="Jobdataitem"
          >
          <br>
          <div class="p-3" v-if="Jobdata.length > 0">
          <h5 style="color:#000000" class="text-center font-weight-black mb-3" >
            {{Jobdata[0].flowName}}
          </h5>
          <v-carousel
              height="150"
              hide-delimiters
              v-if="ImgBF.length > 0 && checkImg === true"
              >
              <v-carousel-item
              v-for="(itemImg, i) in ImgBF" :key="i"
              >
                <v-sheet
                  color="#FFFFFF"
                  height="100%"
                >
                    <v-row class="p-1">
                      <v-col cols="6" class="pr-0">
                        <v-card  color="#ffffff" class="p-1" >
                          <v-img
                            :src="itemImg.afterImage"
                            max-height="130"
                            aspect-ratio="1.7"
                            contain
                            @click="SelectImg(itemImg.afterImage)"
                          ></v-img>
                        </v-card>
                        <!-- <h6  style="color:#000000" class="text-center pt-3">before</h6> -->
                        <p style="color:#000000" class="font-weight-black text-center pt-3">
                          before
                        </p>
                      </v-col>
                      <v-col cols="6" class="pl-0">
                        <v-card  color="#ffffff" class="p-1">
                          <v-img
                            :src="itemImg.beforeImage"
                            max-height="130"
                            aspect-ratio="1.7"
                            contain
                            @click="SelectImg(itemImg.beforeImage)"
                          ></v-img></v-card>
                        <p style="color:#000000" class="font-weight-black text-center pt-3">
                          after
                        </p>
                        <!-- <h6 style="color:#000000" class="text-center pt-3">after</h6> -->
                      </v-col>
                    </v-row>
                </v-sheet>
              </v-carousel-item>
            </v-carousel>
          <p style="color:#000000" class="font-weight-medium mb-0"  v-for="(item , i) in Jobdata" :key="i">
            {{item.fieldName}} : {{item.fieldValue}}
          </p>
          <br>
          <p style="color:#000000" class="font-weight-medium mb-0" v-if="Jobdata[0].onsiteStartDate">
            วันที่ - เวลาเริ่มงาน  :   {{format_date(Jobdata[0].onsiteStartDate)}}
          </p>
          <p style="color:#000000" class="font-weight-medium mb-0" v-if="Jobdata[0].onsiteEndDate">
            วันที่ - เวลาเสร็จงาน  :   {{format_date(Jobdata[0].onsiteEndDate)}}
          </p>
          <br>
          <p style="color:#000000" class="font-weight-medium mb-0" v-if="Jobdata[0].address">
            ที่อยู่  :   {{Jobdata[0].address}}
          </p>
          </div>
          <GmapMap
            v-if="center !== null"
            :center="center"
            :zoom="15"
            style="width: 100%; height: 200px"
            :options="{ disableDefaultUI: true, fullscreenControl: true, zoomControl: true }"
          >
            <GmapMarker :position="center"/>
          </GmapMap>
        </v-card>
    </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogImg"
      max-width="100%"
    >
      <v-card>
        <v-img
          :lazy-src="showImg"
          :src="showImg"
        ></v-img>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script>
import axios from 'axios' // api

export default {
  components: {
    name: ''
  },
  data () {
    return {
      profile: [],
      DarkMode: '',
      DarkModeStatus: null,
      DarkModeButton: '',
      DarkModeBackground: '',
      DarkModefont: '',
      valid: true,
      time: '',
      branch: [],
      fieldNameItem: [],
      shop: [],
      shopId: this.$route.query.shopId,
      DataFlowName: [],
      DataflowId: '',
      date: '',
      showTime: '',
      menuDate: false,
      modal2: false,
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
      branchData: [],
      ColorByShop: [],
      LoGo: [],
      HistoryData: [],
      defaultData: [],
      Carnumber: [],
      Carnumberitem: [],
      Jobdata: [],
      ImgBF: [],
      center: null,
      showImg: '',
      dialogMain: false,
      dialogImg: false,
      checkImg: null,
      Jobdataitem: null
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
    await this.getShop()
    // this.pushMsglineGroup()
    await this.getDataHistory()
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
                this.LoGo = require('@/assets/Booking.png')
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
            })
          } else {
            this.shop = null
          }
          console.log('this.LoGo', this.LoGo)
        })
      } else {
        this.$swal('พบความผิดพลาดระหว่างดำเนินการ', 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่', 'info').then(result => {
          location.reload()
        }).catch((error) => {
          console.log('error function addData : ', error)
          location.reload()
        })
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
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    async getDataHistory () {
      const BookingData = await axios.get(this.DNS_IP + '/BookingData/get_history?shopId=' + this.shopId + '&userId=' + this.profile.userId)
        .then(async (response) => {
          return response.data
        })
        .catch((error) => {
          console.log('error function addData : ', error)
          return null
        })
      await this.ConvertHistoryData(BookingData)
    },
    async ConvertHistoryData (BookingData) {
      this.HistoryData = []
      // console.log('BookingData', BookingData)
      if (BookingData !== null) {
        if (BookingData.length > 0) {
          this.defaultData = BookingData.reduce((r, a) => {
            let bookNo = a.bookNo
            let filter = (a.fieldName === 'เลขทะเบียน') ? a.fieldValue : null
            if (filter !== null) {
              r[filter] = r[filter] || {}
              r[filter][bookNo] = r[filter][bookNo] || []
              r[filter][bookNo].push(BookingData.filter(item => item.bookNo === a.bookNo))
              this.Carnumberitem.push(filter)
            }
            return r
          }, Object.create(null))

          console.log(this.defaultData)
        } else if (BookingData.status === false) {
          this.$swal('ไม่พบประวัติการเข้ารับบริการ', 'กรูณาตรวจสอบข้อมูล', 'info')
        }
      } else {
        this.$swal('พบความผิดพลาดระหว่างดำเนินการ', 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่', 'info').then(result => {
          location.reload()
        }).catch((error) => {
          console.log('error function addData : ', error)
          location.reload()
        })
      }

      // console.log('this.HistoryData', this.HistoryData)
    },
    async SelectData () {
      this.HistoryData = []
      this.HistoryData.push(this.defaultData[this.Carnumber])
      console.log('this.HistoryData', this.HistoryData)
    },
    async getjobId (bookNo) {
      this.dialogMain = true
      await axios.get(this.DNS_IP + '/booking_view/get?bookNo=' + bookNo).then((response) => {
        let rs = response.data
        if (rs.length > 0) {
          console.log('rs', rs)
          let jobNo = rs[0].jobNo
          if (jobNo) {
            this.getJob(jobNo)
          }
        }
      }).catch((error) => {
        console.log('error function addData : ', error)
      })
    },
    async getJob (jobNo) {
      await axios.get(this.DNS_IP + '/job/get?jobNo=' + jobNo + '&shopId=' + this.shopId).then((response) => {
        let rs = response.data
        if (rs.length > 0) {
          this.Jobdata = rs
          // console.log('------------', rs)
          // center
          this.center = JSON.parse(rs[0].addressLatLong)
          this.getjobImg(rs[0].jobId)
        }
      }).catch((error) => {
        console.log('error function addData : ', error)
      })
    },
    async getjobImg (jobId) {
      await axios.get(this.DNS_IP + '/jobBeforeAfter/get?jobId=' + jobId).then((response) => {
        let rs = response.data
        console.log('******', rs.length)
        if (rs.length > 0) {
          this.ImgBF = rs
          if (rs.filter(item => (item.afterImage || item.beforeImage !== null) && (item.afterImage || item.beforeImage !== '')).length > 0) {
            this.checkImg = true
          } else {
            this.checkImg = false
          }
          console.log('ImgBF', this.ImgBF)
        } else {
          this.ImgBF = []
        }
        this.Jobdataitem = true
      }).catch((error) => {
        console.log('error function addData : ', error)
      })
    },
    async SelectImg (Imgitem) {
      this.showImg = Imgitem
      this.dialogImg = true
    }

  }
}
</script>

<style scoped>
.main{
  padding: 0px;
  background: #ffffff;
}
.content{
  border-radius: 0px;
}
.a{
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0px;
}
.InputData{
  margin: 0px !important;
  padding: 0px !important;

}
.content{
  overflow:auto;
  white-space: normal;
  margin-top: 0px;
}

</style>
