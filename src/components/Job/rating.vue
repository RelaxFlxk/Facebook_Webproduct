<template>
  <v-main>
    <v-card class="content pa-3"
    min-height="100vh"
    :style="'background-color:'+ DarkModeBackground +';'">
        <v-card class="content p-3"
    min-height="80vh"
    >
    <br>
      <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FRating.png?alt=media&token=afd4a3b9-acff-4bb4-bf18-09edad98388f" class="a" style="width:272.79px;height:203px"></v-img>
      <!-- <v-img :src="require('@/assets/Rating.png')" class="a" style="width:272.79px;height:203px"></v-img> -->
      <v-card-title>
</v-card-title>
<v-card-text>
<div class="text-center mt-12">
  <div>
    <h5 v-if="rating === 1" style="color:#000000;">ปรับปรุง</h5>
    <h5 v-if="rating === 2" style="color:#000000;">พอใช้</h5>
    <h5 v-if="rating === 3" style="color:#000000;">ปานกลาง</h5>
    <h5 v-if="rating === 4" style="color:#000000;">ดี</h5>
    <h5 v-if="rating === 5" style="color:#000000;">ดีมาก</h5>
  </div>
  <v-rating
    v-model="rating"
    :color="DarkModeButton"
    background-color="grey darken-1"
    empty-icon="$ratingFull"
    hover
    large
  ></v-rating>
  <br>
  <h6 style="color:#000000;">ขอบคุณที่เข้ารับบริการกับเรา</h6>
</div>
<br>
  <v-checkbox
    label="ให้เจ้าหน้าที่ติดต่อกลับ"
    false-value="False"
    :on-icon="'mdi-check-circle'"
    :off-icon="'mdi-checkbox-blank-circle-outline'"
    color="#1B437C"
    true-value="True"
    style="display: flex;align-items: flex-start;"
    v-model="fromAdd.callBackStatus"
  ></v-checkbox>
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
<v-card-actions class="justify-center">
        <v-btn
        class="button"
        :color="DarkModeButton"
        dark
        large
        @click="addRating ('true')"
      >ยืนยัน</v-btn>
      <v-btn
      class="button"
        :color="DarkModeButton"
        dark
        large
        @click="addRating ('false')"
      >ยกเลิก</v-btn>
</v-card-actions>
    </v-card>
    </v-card>
  </v-main>
</template>
<script>
import axios from 'axios'
// import axios from 'axios' // api

export default {
  components: {

  },
  data () {
    return {
      jobitem: [],
      refId: this.$route.query.refId,
      shopId: this.$route.query.shopId,
      typeWork: this.$route.query.typeWork,
      profile: null,
      fromAdd: {
        refId: '',
        rating: '',
        comment: '',
        typeWork: '',
        shopId: '',
        displayName: '',
        pictureUrl: '',
        callBackStatus: 'False'
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
      shop: []
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
  },
  methods: {
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
          console.log('rs', rs)
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
          this.$swal('', 'ให้คะแนนแล้ว', 'success').then(result => {
            this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=ratingDuplicate')
          }).catch((error) => {
            console.log('error function addData : ', error)
            this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=ratingNoData')
          })
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
            this.fromAdd.pictureUrl = this.profile.pictureUrl
            this.fromAdd.displayName = this.profile.displayName
            console.log('this.fromAdd', this.fromAdd)
            axios.post(this.DNS_IP + '/rating/add', this.fromAdd).then(response => {
              this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success').then(result => {
                this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=rating')
              }).catch((error) => {
                console.log('error function addData : ', error)
                this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=ratingNoSave')
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
          this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=rating')
        }).catch((error) => {
          console.log('error function addData : ', error)
        })
      }
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
  background-color: #0047A5;
}
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
