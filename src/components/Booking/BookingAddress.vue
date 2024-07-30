<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col class="main" col="12" md="12" sm="12">
          <v-card class="content p-3"
          height="100vh"
          :style="'background: linear-gradient(180deg, ' + ColorByShop[1] + ' 40%,' +  ColorByShop[0] + ' 100%);'"
          >
          <br>
            <v-card class="p-3" v-if="bookingitem.length > 0">
            <div v-if="profile && bookingitem">
            <br>
             <h5 class="text-center" style="font-weight: 900;color:#173053;">ตรวจสอบข้อมูลและ กรอกที่อยู่</h5>
             <br>
                <div class="avatar text-center">
                <v-avatar size="120" style="border:5px solid #FFFFFF;">
                    <img :src= profile.pictureUrl>
                </v-avatar>
                <!-- <p class="text-center">{{profile.displayName}}</p> -->
                </div>
                <br>
                  <h3 class="text-center" style="color:#173053;"   >{{bookingitem[0].fieldValue}}</h3>
                <p class="text-center textcontent" style="color:#173053;margin-bottom: 0px;">วันที่ / เวลานัดหมาย</p>
                <p class="text-center" style="color:#ABA3A3;">{{bookingitem[0].dueDate}}</p>
                  <v-row>
                    <v-col cols="6">
                      <p class="text-center textcontent" style="color:#173053;margin-bottom: 0px;">ประเภทบริการ</p>
                      <p class="text-center" style="color:#ABA3A3;">{{bookingitem[0].flowName}}</p>
                    </v-col>
                    <v-col cols="6">
                      <p class="text-center textcontent" style="color:#173053;margin-bottom: 0px;">สาขา</p>
                      <p class="text-center" style="color:#ABA3A3;">{{bookingitem[0].masBranchName}}</p>
                    </v-col>
                  </v-row>
                </div>
                <br>
                <v-form ref="form" v-model="valid" lazy-validation>
                <div class="text-center">
                      <v-col class="InputData pb-0 pt-0" cols="12">
                          <v-text-field
                          v-model="address"
                          label="รายละเอียดที่อยู่ต้นทาง"
                          outlined
                          required
                          :rules ="[rules.required]"
                          ></v-text-field>
                    </v-col>
                    <v-col class="InputData" cols="12">
                      <v-card class="p-3">
                        <!-- <GmapAutocomplete @place_changed="updatePlace" /> -->
                        <!-- <vue-google-autocomplete
                          ref="address"
                          id="map"
                          classname="form-control"
                          placeholder="ค้นหาที่อยู่"
                          v-on:placechanged="getAddressData"
                          country="th"
                        >
                        </vue-google-autocomplete> -->
                        <!-- <GmapAutocomplete class="form-control" @place_changed="updatePlace"> </GmapAutocomplete> -->
                        <GmapMap
                          v-if="center !== null"
                          :center="center"
                          :zoom="15"
                          style="width: 100%; height: 200px"
                          :options="{ disableDefaultUI: true, fullscreenControl: true, zoomControl: true }"
                        >
                          <GmapMarker :position="center" :draggable="true" @drag="updateCoordinates" />
                        </GmapMap>
                      </v-card>
                    </v-col>
                </div>
                <h6 class="text-center" style="font-weight: 900; color:#ABA3A3">{{bookNo}}</h6>
                <v-btn
                  color="#173053"
                  block
                  dark
                  @click="close ()"
                  >
                    เพิ่มที่อยู่
                  </v-btn>
                </v-form>
            </v-card>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import axios from 'axios' // api
export default {
  components: {

  },
  created () {
    // setInterval(this.getNowGlobal, 1000)
  },
  data () {
    return {
      center: null,
      address: '',
      PK: '',
      path: '/Job/',
      userId: '',
      profile: [],
      bookNo: this.$route.query.bookNo,
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
      background: '#E1F3FF',
      DarkMode: '',
      DarkModeStatus: null,
      DarkModefont: '',
      ColorByShop: [],
      LoGo: [],
      shop: [],
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
      valid: true
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
    await this.getbooking()
    await this.getShop()
    await this.geolocate()
  },
  methods: {
    // getAddressData: function (addressData, placeResultData, id) {
    //   // this.address = addressData
    //   console.log(addressData)
    //   this.updateCoordinates(addressData, 'search')
    // },
    updatePlace (place) {
      console.log(place)
      console.log(place.geometry.location)
      this.updateCoordinates(place.geometry.location)
    },
    validate () {
      this.$refs.form.validate()
    },
    updateCoordinates (location, text) {
      if (text === 'search') {
        this.center = {
          lat: location.latitude,
          lng: location.longitude
        }
      } else {
        this.center = {
          lat: location.latLng.lat(),
          lng: location.latLng.lng()
        }
      }
    },
    async geolocate () {
      await navigator.geolocation.getCurrentPosition(
        async (position) => {
          const center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          if (center) {
            this.center = center
          }
        },
        (error) => {
          this.center = null
          // this.center.lat = null
          // this.center.lng = null
          console.log('error map :', error.message)
        }
      )
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
              } else {
                this.ColorByShop.push('#E1F3FF', '#FFFFFF')
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
    async checkLiffLogin (dataLineConfig) {
      await this.$liff.init({
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
            console.log('dddd', d.fieldName)
            if (d.fieldName === 'ชื่อ') {
              let s = {}
              s.fieldValue = d.fieldValue
              s.dueDate = d.dueDate
              s.masBranchName = d.masBranchName
              s.flowName = d.flowName
              s.address = d.address || ''
              s.addressLatLong = d.addressLatLong
              this.bookingitem.push(s)
            }
          }
          this.address = this.bookingitem[0].address
          this.center = JSON.parse(this.bookingitem[0].addressLatLong) || null
          console.log('booking', this.bookingitem)
        })
      }
    },
    async close () {
      await this.validate()
      // console.log('this.', this.valid)
      if (this.valid !== false) {
        this.$swal({
          title: 'ต้องการ บันทึกข้อมูล ใช่หรือไม่?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#b3b1ab',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ไม่'
        })
          .then(async (result) => {
            var dt = {
              address: this.address,
              addressLatLong: JSON.stringify(this.center),
              userId: this.profile.userId
            }
            console.log('editStatus', dt)
            axios
              .post(this.DNS_IP + '/Booking/editStatus/' + this.bookNo, dt)
              .then(async response1 => {
                this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=BookingAddress')
              })
          })
          .catch((error) => {
            console.log('Cencel : ', error)
          })
      }
    }
  }
}

</script>
<style scope>
.pac-target-input {
  padding: 10px;
  width: 100%;
  border-style: solid;
  border-radius: 10px;
}
.main{
  padding: 0px;
  background: #FFFFFF;
}
.content{
  align-items: center;
  border-radius: 50px;
}
</style>
