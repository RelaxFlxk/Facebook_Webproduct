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
      <v-container>
      <v-row>
        <v-col  cols="12" md="12" sm="12">
          <h3 class="text-center" :style="'color:' + DarkModefont + ';'">
            นัดหมายเข้ารับบริการเรียบร้อยแล้ว
          </h3>
          <h5 class="text-center" :style="'color:' + DarkModefont + ';'">
            เงื่อนไขการให้บริการ
          </h5>
          <br>
          <v-card class="p-3"  min-height="60vh">
          <br>
          <div>
            <v-tabs
              v-model="tab"
              background-color="#E1E1E1"
              centered
              slider-color="primary"
            >
              <v-tab
                v-for="(item, index) in dataCondition" :key="index" style="color: #000000;"
              >
               เงื่อนไขที่ {{ index + 1 }}
              </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item
                v-for="(item, index) in dataCondition" :key="index"
              >
              <v-card-text>
              <center>
                <br>
                <v-img
                  contain
                  max-height="350"
                  max-width="250"
                  :src="item.image"
                ></v-img>
              </center>
              <br>
              <v-textarea
              v-model="item.text"
              auto-grow
              row="1"
              label="รายละเอียด"
              outlined
            ></v-textarea>
              <!-- <h6>{{item.text}}</h6> -->

            </v-card-text>
              </v-tab-item>
            </v-tabs-items>
          </div>
          </v-card>
            <v-footer
            padless
            fixed
            height="85px"
            :color="DarkModeBackground"
             v-if="dataLineConfig.checkConfig === false"
            >
            <v-col
              class="text-center"
              cols="12"
            >
            <h6 class="text-center" :style="'color:' + DarkModefont +';'">ต้องการรับการแจ้งเตือน กรุณาคลิ้ก </h6>
                    <div class="text-center">
                      <v-btn
                      v-if="this.$route.query.shopId"
                      elevation="10"
                      color="green"
                      dark
                      :disabled="!valid"
                      @click="getBotinfo()"
                    >รับการแจ้งเตือนผ่าน Line OA</v-btn>
                  </div>
                  <br>
            </v-col>
            </v-footer>
        </v-col>
      </v-row>
    </v-container>
    </v-card>
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
      tab: null,
      valid: true,
      GroupId: this.$route.query.GroupId,
      userName: '',
      userPassword: '',
      shopId: '',
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
      ColorByShop: [],
      dataCondition: [],
      shop: [],
      LoGo: [],
      DarkModefont: '',
      DarkMode: '',
      DarkModeStatus: null,
      DarkModeButton: '',
      DarkModeBackground: '',
      ImgCover: '',
      dataLineConfig: {}
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
    this.dataLineConfig = await this.getDataLineConfig(checkShopId)
    await this.getShop()
    await this.getCondition()
  },
  methods: {
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
              } else {
                this.DarkMode = ''
                this.DarkModefont = '#173053'
              }
            })
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
    getCondition () {
      if (this.$route.query.flowId) {
        axios.get(this.DNS_IP + '/flow/get?flowId=' + this.$route.query.flowId + '&shopId=' + this.$route.query.shopId).then(response => {
          let rs = response.data
          if (rs.length > 0) {
            if (rs[0].showCondition === 'แสดง') {
              this.dataCondition = JSON.parse(rs[0].dataCondition.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t'))
            } else {
              this.dataCondition = []
            }
          } else {
            this.dataCondition = []
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.main{
  padding: 0px;
  background-color: #FFFFFF;
  height: 100vh;
}
.content{
  overflow:auto;
  white-space: normal;
  padding: 20px, 20px, 20px, 20px;
}
.a{
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  max-height: 350px;
}
</style>
