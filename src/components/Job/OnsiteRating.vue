<template>
  <v-main>
    <v-card class="content p-3"
    min-height="100vh"
    >
    <br>
    <div class="p-3" v-if="Jobdata.length > 0">
    <div class="text-center mb-4">
      <v-avatar size="90" >
      <img
        :src="Jobdata[0].memberPicture"
        alt="John"

      >
    </v-avatar>
    </div>
    <h5 style="color:#000000" class="text-center font-weight-black mb-3" >
      {{Jobdata[0].flowName}}
    </h5>
    <!-- <v-row>
      <v-col cols="6">
        <h5 style="color:#000000" class="text-left font-weight-black mb-3 ml-3" >
      {{Jobdata.filter((item) => item.fieldName === 'ชื่อ')[0].fieldValue}}
        </h5>
      </v-col>
    </v-row> -->
    <!-- <p class="font-weight-bold mb-1 ml-2" style="font-size:20px">{{"test"}}</p> -->
    <p class="font-weight-bold mb-1" style="font-size:14px"><v-icon color="#F48686" class="mx-1 mr-2">mdi-account-circle</v-icon>{{Jobdata.filter((item) => item.fieldName === 'ชื่อ')[0].fieldValue}}</p>
    <p class="font-weight-medium mb-1" style="font-size:14px"><v-icon color="#F48686" class="mx-1 mr-2">mdi-map-marker-radius</v-icon>{{Jobdata[0].address}}</p>
    <p class="font-weight-medium mb-1" style="font-size:14px"><v-icon  color="#24C74D" class="mx-2 mr-2 mt-1 iconify"  data-icon="el:phone-alt"></v-icon>{{Jobdata.filter((item) => item.fieldName === 'เบอร์โทร')[0].fieldValue}}</p>
    <p class="font-weight-bold mb-1 text-center" style="font-size:14px"><v-icon large color="#F48686" class="mx-1 mr-2 iconify" data-icon="ic:twotone-access-time"></v-icon>{{momentThaiTextClose(Jobdata[0].dueDate)}}</p>
            <v-row>
              <v-col cols="6">
                <p class="font-weight-bold mb-1 text-center" style="font-size:14px">{{'เวลาเริ่มงาน ' + momenTime(Jobdata[0].dueDate) + ' น.'}}</p>
              </v-col>
              <v-col cols="6">
                <p class="font-weight-bold mb-1 text-center" style="font-size:14px">{{'เวลาจบงาน ' + momenTime(Jobdata[0].LAST_DATE) + ' น.'}}</p>
              </v-col>
            </v-row>
    <!-- <p style="color:#000000" class="font-weight-medium mb-0"  v-for="(item , i) in Jobdata" :key="i">
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
    </p> -->
    </div>
    <h6 class="font-weight-bold ml-6">Before</h6>
    <v-slide-group
        v-if="ImgBF && checkImg === true"
          class="pa-4 pt-0 mt-n1"
          color="primary"
        >
          <v-slide-item
            v-for="(itemImg2, i2) in ImgBF"
            :key="i2"
          >
            <v-card width="150px" class="ma-2">
              <v-img
                      :src="itemImg2.beforeImage"
                      max-height="130"
                      aspect-ratio="1.7"
                      contain
                      @click="SelectImg(itemImg2.beforeImage)"
                    ></v-img>
            </v-card>
          </v-slide-item>
        </v-slide-group>
    <h6 class="font-weight-bold ml-6">After</h6>
    <v-slide-group
    v-if="ImgBF && checkImg === true"
          class="pa-4 pt-0 mt-n1"
          color="primary"
        >
          <v-slide-item
            v-for="(itemImg, i) in ImgBF"
            :key="i"
          >
            <v-card width="150px" class="ma-2">
              <v-img
                      :src="itemImg.afterImage"
                      max-height="130"
                      aspect-ratio="1.7"
                      contain
                      @click="SelectImg(itemImg.afterImage)"
                    ></v-img>
            </v-card>
          </v-slide-item>
        </v-slide-group>
    <!-- <v-carousel
        height="150"
        hide-delimiters
        v-if="ImgBF && checkImg === true"
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
                  <p style="color:#000000" class="font-weight-black text-center pt-3">
                    Before
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
                    After
                  </p>
                </v-col>
              </v-row>
          </v-sheet>
        </v-carousel-item>
      </v-carousel> -->
    <GmapMap
      v-if="center !== null && CheckRating === true"
      :center="center"
      :zoom="15"
      style="width: 100%; height: 200px"
      :options="{ disableDefaultUI: true, fullscreenControl: true, zoomControl: true }"
    >
      <GmapMarker :position="center"/>
    </GmapMap>
<v-card-text v-if="CheckRating === false">
<div class="text-center mt-3">
  <div>
    <h5 v-if="rating === 1" style="color:#173053;">ปรับปรุง</h5>
    <h5 v-if="rating === 2" style="color:#173053;">พอใช้</h5>
    <h5 v-if="rating === 3" style="color:#173053;">ปานกลาง</h5>
    <h5 v-if="rating === 4" style="color:#173053;">ดี</h5>
    <h5 v-if="rating === 5" style="color:#173053;">ดีมาก</h5>
  </div>
  <v-rating
    v-model="rating"
    color="yellow darken-3"
    background-color="grey darken-1"
    empty-icon="$ratingFull"
    hover
    large
  ></v-rating>
  <br>
  <h6 style="color:#173053;">ขอบคุณที่เข้ารับบริการกับเรา</h6>
</div>
<br>
  <v-textarea
    v-model="fromAdd.comment"
    label="ความคิดเห็น(เพิ่มเติม)"
    auto-grow
    outlined
    rows="3"
    row-height="25"
    shaped
  ></v-textarea>
</v-card-text>
<v-divider></v-divider>
<v-row class="mt-5 mb-1 px-14" v-if="CheckRating === false">
            <v-col cols="6" class="text-center pa-1">
              <v-btn
                color="#1DBF73"
                rounded
                dark
                block
                @click="addRating ('true')"
              >ยืนยัน</v-btn>
            </v-col>
            <v-col cols="6" class="text-center pa-1">
              <v-btn
                color="#F38383"
                rounded
                dark
                block
                @click="addRating ('false')"
              >
              ยกเลิก</v-btn>
            </v-col>
           </v-row>
<!-- <v-card-actions class="justify-center" v-if="CheckRating === false">
        <v-btn
        elevation="10"
        :color="DarkModeButton"
        dark
        round
        large
        @click="addRating ('true')"
      >ยืนยัน</v-btn>
      <v-btn
        elevation="10"
        :color="DarkModeButton"
        dark
        large
        @click="addRating ('false')"
      >ยกเลิก</v-btn>
</v-card-actions> -->
    </v-card>
    <v-dialog
      v-model="dialogImg"
      max-width="80%"
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
import axios from 'axios'
import moment from 'moment-timezone' // แปลง date
// import axios from 'axios' // api

export default {
  components: {

  },
  data () {
    return {
      dialogImg: false,
      jobitem: [],
      refId: this.$route.query.refId,
      shopId: this.$route.query.shopId,
      typeWork: this.$route.query.typeWork,
      jobNo: this.$route.query.refId,
      profile: null,
      fromAdd: {
        refId: '',
        rating: '',
        comment: '',
        typeWork: '',
        shopId: ''
      },
      job: null,
      rating: 0,
      DarkMode: '',
      DarkModeStatus: null,
      DarkModeButton: '',
      DarkModeBackground: '',
      DarkModefont: '',
      ColorByShop: [],
      LoGo: [],
      shop: [],
      model: 0,
      colors: [
        'primary',
        'secondary',
        'yellow darken-2',
        'red',
        'orange'
      ],
      Jobdata: [],
      ImgBF: [],
      showImg: '',
      CheckRating: false,
      center: null,
      checkImg: null
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
    await this.getRating()
    await this.getJob()
  },
  methods: {
    momentThaiText (item) {
      let dt = moment(item).locale('th').format('LLLL')
      return dt
    },
    momentThaiTextClose (item) {
      let dt = 'วัน' + moment(item).locale('th').format('dddd') + 'ที่ ' + moment(item).locale('th').format('LL')
      return dt
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
        this.ColorByShop.push('#E1F3FF', '#FFFFFF')
        this.DarkMode = '#ffffff00'
        this.DarkModefont = '#173053'
      }
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
    async getRating () {
      await axios.get(this.DNS_IP + '/rating/get?refId=' + this.refId + '&shopId=' + this.shopId).then((response) => {
        let rs = response.data
        console.log('rs', rs)
        if (rs.length > 0) {
          this.CheckRating = true
        }
      })
    },
    async addRating (item) {
      if (item === 'true') {
        if (this.rating === 0) {
          this.$swal('ผิดพลาด', 'กรุณาให้คะแนน', 'error').then(result => {
          }).catch((error) => {
            console.log('error function addData : ', error)
          })
        } else {
          this.$swal({
            title: 'ต้องการ บันทึกข้อมูล ใช่หรือไม่?',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#b3b1ab',
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ไม่'
          }).then(async (result) => {
            this.fromAdd.refId = this.refId
            this.fromAdd.rating = this.rating
            this.fromAdd.typeWork = this.typeWork
            this.fromAdd.shopId = this.shopId
            console.log('this.fromAdd', this.fromAdd)
            axios.post(this.DNS_IP + '/rating/add', this.fromAdd).then(response => {
              this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success').then(result => {
                this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=OnsiteRating')
              }).catch((error) => {
                console.log('error function addData : ', error)
                this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=OnsiteRating')
              })
            })
              .catch((error) => {
                console.log('error function addData : ', error)
              })
          })
        }
      } else if (item === 'false') {
        this.$swal({
          title: 'คุณไม่ต้องการให้คะแนน ใช่หรือไม่?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#b3b1ab',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ไม่'
        }).then(async (result) => {
          this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=OnsiteRating')
        }).catch((error) => {
          console.log('error function addData : ', error)
        })
      }
    },
    async getJob () {
      await axios.get(this.DNS_IP + '/job/getRating?jobNo=' + this.jobNo + '&shopId=' + this.shopId).then((response) => {
        let rs = response.data
        if (rs.length > 0) {
          this.Jobdata = rs
          // center
          this.center = JSON.parse(rs[0].addressLatLong)
          this.getjobImg(rs[0].jobId)
        }
        console.log('test', rs)
      }).catch((error) => {
        console.log('error function addData : ', error)
      })
    },
    async getjobImg (jobId) {
      await axios.get(this.DNS_IP + '/jobBeforeAfter/get?jobId=' + jobId).then((response) => {
        let rs = response.data
        if (rs.length > 0) {
          this.ImgBF = rs
          if (rs.filter(item => (item.afterImage || item.beforeImage !== null) && (item.afterImage || item.beforeImage !== '')).length > 0) {
            this.checkImg = true
          } else {
            this.checkImg = false
          }
          console.log('ImgBF', this.ImgBF)
        }
      }).catch((error) => {
        console.log('error function addData : ', error)
      })
    },
    SelectImg (Imgitem) {
      this.showImg = Imgitem
      this.dialogImg = true
    }
  }
}
</script>

<style scoped>
.main{
  padding: 0px;
  background: #FFFFFF;
  height: 100vh;
}
.content{
  overflow:auto;
  white-space: normal;
  margin-top: 0px;
}
.a{
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
}
</style>
