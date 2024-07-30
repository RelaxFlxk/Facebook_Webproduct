/* eslint-disable vue/return-in-computed-property */
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
           <h3
        class="text-center mt-5"
        :style="'color:' + DarkModefont + ';'"
        v-if="shop.length > 0 && shop[0].showShopName === 'True'"
      >
        {{ shop[0].shopName }}
      </h3>
    <v-sheet class="pa-0 pt-0 pb-6 mt-5" max-height="100%" style="border-radius: 20px 20px 20px 20px;" v-if="jobItem.length">
      <v-sheet class="mb-5" color="#1C457C" width="100%" min-height="200px" style="border-radius: 20px 20px 0px 0px;">
        <h2 class="text-center pt-3" style="color:#FFFFFF">{{jobItem[0].flowName}}</h2>
        <div v-for="(title,index) in jobDataItem" :key="index">
          <h3 class="text-center pt-1" style="color:#FFA610" v-if="title.fieldName === 'ชื่อ'">{{title.fieldValue}}</h3>
          <v-row class="mt-3" >
          <v-col cols="6" class="pa-0 pl-8 ma-0">
            <h5 class="text-left pt-1" style="color:#FFFFFF" v-if="title.fieldName !== 'ชื่อ'">{{title.fieldName}}</h5>
          </v-col>
          <v-col cols="6" class="pa-0 pr-8 ma-0">
            <h5 class="text-left pt-1" style="color:#FFFFFF" v-if="title.fieldName !== 'ชื่อ'">{{title.fieldValue}}</h5>
          </v-col>
        </v-row>
        </div>
        <v-row class="mt-3">
          <v-col cols="6" class="pa-0 pl-8 ma-0">
            <h5 class="text-left pt-1" style="color:#FFFFFF" >วันที่นัดหมาย</h5>
          </v-col>
          <v-col cols="6" class="pa-0 pr-8 ma-0">
            <h5 class="text-left pt-1" style="color:#FFFFFF" >{{jobItem[0].dueDateProgess}}</h5>
          </v-col>
        </v-row>
      </v-sheet>
      <v-timeline
      align-top
        dense>
        <v-timeline-item
        small
        v-for="(item,index) in flowStepitem"
        :key="index"
        :color="jobItem[0].stepId === item.stepId?'#FFA610':'#1C457C'"
        >
          <v-row class="pt-1">
            <v-col cols="3">
              <strong >
                {{item.Time}}
              </strong>
            </v-col>
            <v-col>
              <strong>{{item.stepTitle}}</strong>
              <div class="text-caption">
                <strong > </strong>
              </div>
              <div class="text-caption" v-if="jobItem[0].stepId === item.stepId">
                <strong style="color:#757575">{{queueText}}</strong>
              </div>
            </v-col>
          </v-row>
          </v-timeline-item>
       </v-timeline>
       <div class="pa-3 px-5 mt-5">
        <v-btn
        color="#FFA610"
          elevation="2"
          block
          @click="click()"
        >ตรวจสอบคิว</v-btn>
        </div>
    </v-sheet>
    <v-sheet class="pa-0 pt-0 pb-6 mt-5" max-height="100%" style="border-radius: 20px 20px 20px 20px;" v-else>
      <v-sheet class="mb-5" color="#1C457C" width="100%" min-height="200px" style="border-radius: 20px 20px 0px 0px;">
        <h2 class="text-center pt-10" style="color:#FFFFFF">เสร็จงานแล้ว</h2>
      </v-sheet>
      <!-- <v-timeline
      align-top
        dense>
        <v-timeline-item
        small
        v-for="(item,index) in flowStepitem"
        :key="index"
        :color="jobItem[0].stepId === item.stepId?'#FFA610':'#1C457C'"
        >
          <v-row class="pt-1">
            <v-col cols="3">
              <strong >
                {{item.Time}}
              </strong>
            </v-col>
            <v-col>
              <strong>{{item.stepTitle}}</strong>
              <div class="text-caption">
                <strong > </strong>
              </div>
              <div class="text-caption" v-if="jobItem[0].stepId === item.stepId">
                <strong style="color:#757575">{{queueText}}</strong>
              </div>
            </v-col>
          </v-row>
          </v-timeline-item>
       </v-timeline> -->
    </v-sheet>
    </v-card>
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
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
      ImgCover: '',
      jobItem: [],
      jobDataItem: [],
      flowStepitem: [],
      jobLogItem: [],
      queueText: '',
      overlay: false
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
    await this.getFlowstep()
    await this.getJobLog()
    await this.getJob()
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
    async getJob () {
      this.jobDataItem = []
      await axios.get(this.DNS_IP + '/job/get?jobNo=' + this.$route.query.jobNo).then(async (response) => {
        let rs = response.data
        if (rs.length > 0) {
          console.log('Job', rs)
          this.jobItem = rs
          rs.forEach((v, k) => {
            this.jobDataItem.push(v)
          })
          await this.queueRealtime()
        } else {
          this.jobDataItem = []
          this.jobDataItem = []
        }
      }).catch((error) => console.log(error))
    },
    async getFlowstep () {
      await axios.get(this.DNS_IP + '/flowStep/get?flowId=' + this.$route.query.flowId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          console.log('getFlowstep', rs)
          rs.forEach((v, k) => {
            if (this.jobLogItem.filter((a) => a.stepId === v.stepId).length > 0) {
              v.Time = this.momenTime(this.jobLogItem.filter((a) => a.stepId === v.stepId)[0].CREATE_DATE) || ' '
              v.Date = this.momenDate_2(this.jobLogItem.filter((a) => a.stepId === v.stepId)[0].CREATE_DATE) || ' '
            } else {
              v.Time = ' '
              v.Date = ' '
            }
          })
          this.flowStepitem = rs
        }
      }).catch((error) => console.log(error))
    },
    async getJobLog () {
      await axios.get(this.DNS_IP + '/job_log/get?jobNo=' + this.$route.query.jobNo).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          console.log('rs', rs)
          this.jobLogItem = rs
        }
      }).catch((error) => console.log(error))
    },
    async queueRealtime () {
      let stepId = this.jobItem[0].stepId
      let shopId = this.$route.query.shopId
      let flowId = this.$route.query.flowId
      let masBranchID = this.jobItem[0].masBranchID
      let myQueue = this.jobItem[0].queue
      await axios.get(this.DNS_IP + '/job/getqueueRealtime?shopId=' + shopId + '&stepId=' + stepId + '&flowId=' + flowId + '&masBranchID=' + masBranchID + '&myQueue=' + myQueue).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          console.log('totalTime', rs)
          if (rs[0].prevQueue === 0) {
            this.queueText = 'ถึงคิวของคุณแล้ว'
          } else {
            let getTime = this.flowStepitem.filter(async (v) => v.stepId === this.jobItem[0].stepId)[0].finishTime || '00:00'
            let totalTime = getTime.split(':')
            let hoursTime = parseInt(totalTime[0]) === 0 ? 0 : parseInt(totalTime[0]) * 60
            let minTime = parseInt(totalTime[1])
            let countTime = hoursTime + minTime === 0 ? ' ' : '(ประมาณ ' + (hoursTime + minTime) + ' นาที)'
            this.queueText = `รออีก ${rs[0].prevQueue} คิว ${countTime}`
            console.log('queueText', this.queueText)
          }
        }
      }).catch((error) => console.log(error))
    },
    async click () {
      this.overlay = true
      await this.getJob()
      await this.getJobLog()
      await this.getFlowstep()
      await this.queueRealtime()
      this.overlay = false
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
