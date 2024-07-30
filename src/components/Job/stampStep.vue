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
      <v-card elevation="0" class="p-3" v-if="jobItem.length > 0">
      <div v-if="profile && jobItem">

      <br>
        <!-- <h5 class="text-center" style="font-weight: 900;color:#000000;">นัดหมายเข้ารับบริการเรียบร้อย</h5> -->
        <h5 class="text-center" style="font-weight: 900;color:#000000;">รายการนัดหมาย</h5>
        <h6 class="text-center" style="font-weight: 900;color:#000000;">รายละเอียดการนัดหมาย</h6>
        <br>
          <div class="avatar text-center">
          <v-avatar size="120" style="border:5px solid #FFFFFF;">
              <img :src= profile.pictureUrl>
          </v-avatar>
          <!-- <p class="text-center">{{profile.displayName}}</p> -->
          </div>
          <br>
            <h3 class="text-center" style="color:#000000;"   >{{cusName}}</h3>
          <p class="text-center textcontent" style="color:#000000;margin-bottom: 0px;">วันที่ / เวลานัดหมาย</p>
          <p class="text-center" style="color:#ABA3A3;">{{jobItem[0].dueDate}}</p>
            <v-row>
              <v-col cols="6">
                <p class="text-center textcontent" style="color:#000000;margin-bottom: 0px;">ชื่อร้าน</p>
                <p class="text-center" style="color:#ABA3A3;">{{shopName}}</p>
              </v-col>
              <v-col cols="6">
                <p class="text-center textcontent" style="color:#000000;margin-bottom: 0px;">สาขา</p>
                <p class="text-center" style="color:#ABA3A3;">{{jobItem[0].masBranchName}}</p>
              </v-col>
            </v-row>
            <v-row v-if="jobItem.length > 0">
              <v-col cols="6">
                <p class="text-center textcontent" style="color:#000000;margin-bottom: 0px;">ประเภทบริการ</p>
                <p class="text-center" style="color:#ABA3A3;">{{jobItem[0].flowName}}</p>
              </v-col>
              <v-col cols="6" v-for="(item, index) in jobItem.filter(el => { return el.fieldName !== 'ชื่อ' })" :key="index">
                <p class="text-center textcontent" style="color:#000000;margin-bottom: 0px;">{{item.fieldName}}</p>
                <p class="text-center" style="color:#ABA3A3;">{{item.fieldValue}}</p>
              </v-col>
            </v-row>
          </div>
          <br>
          <v-btn
          :color="DarkModeButton"
          block
          dark
          large
          class="footer"
          @click="changeStep()"
          >
            ยืนยันขั้นตอน > {{stepName}}
          </v-btn>
      </v-card>
      <v-card elevation="0" class="p-3" v-else>
        <h5 class="text-center" style="font-weight: 900;color:#000000;">กรุณาเลือกบริการ</h5>
        <v-card-text>
            <v-select
                item-text="stepTitle"
                item-value="jobId"
                v-model="jobId"
                :items="dataUserJob"
                label="บริการและขั้นตอน"
                outlined
                :background-color="DarkMode"
                @change="clikJob()"
            ></v-select>
        </v-card-text>
      </v-card>
    </v-card>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-main>
</template>

<script>
import axios from 'axios' // api

export default {
  components: {
  },
  created () {
  },
  data () {
    return {
      overlay: false,
      PK: '',
      path: '/Job/',
      pathToweb: 'https://betask-linked-admin.web.app/JobConfirm?jobId=',
      userId: '',
      profile: [],
      jobId: '',
      jobItem: [],
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
      value: '',
      size: 200,
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
      stepName: '',
      dataUserJob: [],
      stepId: '',
      flowId: '',
      stepNo: this.$route.query.stepNo
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
    // await this.getStepName()
    // if (this.$route.query.stepId === undefined && this.$route.query.flowId === undefined) {
    //   this.$swal('ผิดพลาด', 'กรุณาติดต่อร้านค้า', 'warning')
    // } else {
    //   await this.getDataJob()
    // }
    await this.getDataJob()
  },
  methods: {
    async getStepName (flowId) {
      console.log('this..flowId3', flowId)
      await axios
        .get(this.DNS_IP + '/flowStep/get?flowId=' + this.flowId)
        .then(async response => {
          let rs = response.data
          console.log('rs', rs)
          if (rs.filter((v) => v.sortNo === parseInt(this.stepNo)).length === 0) {
            this.$swal('ผิดพลาด', 'ประเภทบริการของท่าน ไม่มีขั้นตอนนี้', 'warning')
            this.$router.push('/Thank?shopId=' + this.$route.query.shopId + '&redirectBy=stampStepNoStep')
          } else {
            this.stepId = rs.filter((v) => v.sortNo === parseInt(this.stepNo))[0].stepId
            this.stepName = rs.filter((v) => v.sortNo === parseInt(this.stepNo))[0].stepTitle
          }
        })
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
          liffId: dataLineConfig.liffMainID,
          withLoginOnExternalBrowser: true
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
    async clikJob () {
      await this.selectDataJob()
      await this.getStepName(this.flowId)
      console.log('this.stepId2', this.stepId)
      if (this.jobItem[0].stepId === this.stepId) {
        this.$swal('ผิดพลาด', 'ขั้นตอนที่ท่านแสกน อยู่ขั้นตอนเดียวกันกับขั้นตอนปัจจุบัน', 'warning')
        this.$router.push('/Thank?shopId=' + this.$route.query.shopId + '&redirectBy=stampStepDuplicateStep')
      }
    },
    async selectDataJob () {
      await axios.get(this.DNS_IP + '/job/get?jobId=' + this.jobId).then((response) => {
        let rs = response.data
        this.flowId = rs[0].flowId
        for (let i = 0; i < rs.length; i++) {
          let d = rs[i]
          // console.log('dddd', d.fieldName)
          // if (d.fieldName === 'ชื่อ') {
          if (d.fieldName === 'ชื่อ') {
            this.cusName = d.fieldValue
          }
          let s = {}
          s.fieldName = d.fieldName
          s.fieldValue = d.fieldValue
          s.dueDate = d.dueDate
          s.masBranchName = d.masBranchName
          s.flowName = d.flowName
          s.flowId = d.flowId
          s.stepId = d.stepId
          this.jobItem.push(s)
          // }
        }
        console.log(this.jobItem[0].stepId, this.$route.query.stepId)
      })
    },
    getDataJob () {
      this.dataUserJob = []
      this.jobItem = []
      axios.get(this.DNS_IP + '/job/getList?userId=' + this.profile.userId + '&shopId=' + this.$route.query.shopId).then((response) => {
        let rs = response.data
        if (rs.status === false) {
          this.$swal('ผิดพลาด', 'ท่านยังไม่ได้รับบริการ กรุณาติดต่อเจ้าหน้าที่', 'warning')
          this.$router.push('/Thank?shopId=' + this.$route.query.shopId + '&redirectBy=stampStepNoService')
        } else {
          console.log('rs', rs)
          if (rs.length === 1) {
            this.jobId = rs[0].jobId
            this.dataUserJob = []
            this.clikJob()
          } else {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              d.stepId = d.stepId || ''
              if (parseInt(this.$route.query.stepId) !== d.stepId && d.stepId !== '') {
                d.stepTitle = d.flowName + ' : ' + d.stepTitle
                this.dataUserJob.push(d)
              }
            }
            if (this.dataUserJob.length === 1) {
              this.jobId = this.dataUserJob[0].jobId
              this.dataUserJob = []
              this.clikJob()
            }
          }
        }
      })
    },
    async changeStep () {
      this.overlay = true
      let dt = {
        'flowId': this.flowId,
        'stepId': this.stepId,
        'LAST_USER': this.profile.userId,
        'shopId': this.$route.query.shopId
      }
      console.log('DT', dt)
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + '/job/edit/' + this.jobId,
          dt
        )
        .then(async response => {
          await this.pushmessage(this.jobId)
          this.$swal('เรียบร้อย', 'เปลี่ยนขั้นตอนเรียบร้อย', 'success')
          this.overlay = false
          this.$router.push('/Thank?shopId=' + this.$route.query.shopId + '&redirectBy=stampStep')
        }).catch(error => {
          console.log('error function addData : ', error)
          this.overlay = false
        })
    },
    async pushmessage (jobId) {
      if (this.$route.query.shopId === 'U9084920b3005bd1dcb57af1ae6bdba32' || this.$route.query.shopId === 'Uc2e4a30c385816316eb1bfe25740cd4d') {
        let updateStatusSend = { updateStatusSend: 'false' }
        await axios
          .post(this.DNS_IP + '/job/pushMsg/' + jobId, updateStatusSend)
          .then(console.log(jobId))
      } else {
        let updateStatusSend = { updateStatusSend: 'false' }
        await axios
          .post(this.DNS_IP + '/job/pushMsgRealTimeQueue/' + jobId, updateStatusSend)
          .then(console.log(jobId))
      }
    }
  }
}

</script>
<style scope>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 90%;
  text-align: center;
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
