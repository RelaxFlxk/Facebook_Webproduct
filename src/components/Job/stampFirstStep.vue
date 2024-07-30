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
              <v-btn
              class="footer"
              :color="DarkModeButton"
              block
              dark
              large
              @click="changeStep()"
              >
                เข้ารับบริการ
              </v-btn>
      </v-card>
      <v-card elevation="0" class="p-3" v-else>
        <h5 class="text-center" style="font-weight: 900;color:#000000;">กรุณาเลือกบริการ</h5>
        <v-card-text>
            <v-select
                item-text="bookTitle"
                item-value="bookNo"
                v-model="bookNo"
                :items="dataUserBook"
                label="บริการและวันที่นัดหมาย"
                outlined
                :background-color="DarkMode"
                @change="selectDataJob()"
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
      pathToweb: 'https://betask-linked-admin.web.app/JobConfirm?bookNo=',
      userId: '',
      profile: [],
      bookNo: '',
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
      dataUserBook: [],
      editedItemSeleteField: [],
      flowfieldNameitem: [],
      swalConfig: {
        title: null,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      },
      packageId: '',
      tokenPackage: ''
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
    if (this.$route.query.shopId === undefined) {
      this.$swal('ผิดพลาด', 'กรุณาติดต่อร้านค้า', 'warning')
    } else {
      this.getCustomFieldStart()
      await this.getDataBookConfirm()
    }
    // await this.getDataBookConfirm()
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
    selectDataJob () {
      axios.get(this.DNS_IP + '/BookingData/getView?bookNo=' + this.bookNo).then((response) => {
        let rs = response.data
        for (let i = 0; i < rs.length; i++) {
          let d = rs[i]
          if (d.fieldName === 'ชื่อ') {
            this.cusName = d.fieldValue
          }
          this.jobItem.push(d)
        }
        this.getflowfield()
      })
    },
    getDataBookConfirm () {
      this.dataUserBook = []
      this.jobItem = []
      axios.get(this.DNS_IP + '/booking_view/get?statusBt=confirm&userId=' + this.profile.userId + '&shopId=' + this.$route.query.shopId).then((response) => {
        let rs = response.data
        if (rs.status === false) {
          this.$swal('ผิดพลาด', 'ท่านยังไม่ได้รับบริการ กรุณาติดต่อเจ้าหน้าที่', 'warning')
          this.$router.push('/Thank?shopId=' + this.$route.query.shopId + '&redirectBy=stampFirstStepErrorNoBook')
        } else {
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            if (d.dueDateDay === this.momenDate_1(new Date())) {
              d.bookTitle = d.flowName + ' : ' + d.dueDateText
              this.dataUserBook.push(d)
            }
          }
          if (this.dataUserBook.length === 1) {
            this.bookNo = this.dataUserBook[0].bookNo
            this.dataUserBook = []
            this.selectDataJob()
          } else if (this.dataUserBook.length === 0) {
            this.$swal('ผิดพลาด', 'วันนี้ท่านไม่มีนัดหมาย', 'warning')
            this.$router.push('/Thank?shopId=' + this.$route.query.shopId + '&redirectBy=stampFirstStepErrorNoDate')
          }
        }
      })
    },
    async changeStep () {
      this.overlay = true
      console.log('this.jobItem', this.jobItem)
      let Add = []
      let fielditem = this.flowfieldNameitem
      console.log('fielditem', fielditem)
      for (var i = 0; i < this.jobItem.length; i++) {
        var d = this.jobItem[i]
        let update = {}
        let addData = false
        var dataField = this.editedItemSeleteField.filter(el => { return parseInt(el.fieldId) === parseInt(d.fieldId) })
        if (dataField[0].conditionField === '' || dataField[0].conditionField === null) {
          addData = true
        } else {
          if (fielditem.filter(row => { return row.fieldId === parseInt(d.conditionField) }).length > 0) {
            console.log('this', fielditem)
            if (d.conditionValue === fielditem.filter(row => { return row.fieldId === parseInt(d.conditionField) })[0].fieldValue) {
              addData = true
            } else if (d.conditionField === 'flow') {
              addData = true
            }
          } else if (d.conditionField === 'flow') {
            addData = true
          }
        }
        if (addData) {
          if (d.fieldValue !== '') {
            update.masBranchID = this.jobItem[0].masBranchID || ''
            update.CREATE_USER = d.userName
            update.LAST_USER = d.userName
            update.packageId = d.packageId
            update.checkCar = ''
            update.userId = this.profile.userId
            update.endDate = ''
            update.endTime = ''
            update.fieldId = d.fieldId
            update.fieldName = d.fieldName
            update.fieldType = dataField[0].fieldType || ''
            update.fieldValue = d.fieldValue
            update.flowId = d.flowId
            update.empSelect = ''
            update.conditionField = dataField[0].conditionField || ''
            update.conditionValue = dataField[0].conditionValue || ''
            update.optionField = dataField[0].optionField || ''
            update.shopId = dataField[0].shopId || ''
            update.showCard = dataField[0].showCard || ''
            Add.push(update)
          }
        }
      }
      for (var x = 0; x < fielditem.length; x++) {
        var t = fielditem[x]
        if (Add.filter(row => { return row.fieldId === t.fieldId }).length === 0) {
          let update = {}
          let dataField = this.editedItemSeleteField.filter(el => { return parseInt(el.fieldId) === parseInt(t.fieldId) })
          update.masBranchID = this.jobItem[0].masBranchID || ''
          update.CREATE_USER = Add[0].CREATE_USER
          update.LAST_USER = Add[0].CREATE_USER
          update.packageId = Add[0].packageId
          update.checkCar = ''
          update.userId = this.profile.userId
          update.endDate = ''
          update.endTime = ''
          update.fieldId = t.fieldId
          update.fieldName = t.fieldName
          update.fieldType = dataField[0].fieldType || ''
          update.fieldValue = t.fieldValue
          update.flowId = d.flowId
          update.empSelect = ''
          update.conditionField = dataField[0].conditionField || ''
          update.conditionValue = dataField[0].conditionValue || ''
          update.optionField = dataField[0].optionField || ''
          update.shopId = dataField[0].shopId || ''
          update.showCard = dataField[0].showCard || ''
          Add.push(update)
        }
      }
      console.log('this.Add', Add)
      console.log(this.packageId, this.tokenPackage)
      this.swalConfig.title = 'ต้องการรับเข้าบริการ ใช่หรือไม่?'
      this.$swal(this.swalConfig)
        .then(async result => {
          // this.dataEditJobReady = false
          await axios
            .post(this.DNS_IP + '/job/add', Add)
            .then(async response => {
              this.statusShowDateConfiremjob = true
              if (response.data.status) {
                var dt = {
                  bookNo: this.jobItem[0].bookNo,
                  statusJob: 'job',
                  jobNo: response.data.jobNo
                }
                await axios
                  .post(
                    this.DNS_IP +
                    '/Booking/editStatus/' +
                    this.jobItem[0].bookNo,
                    dt
                  )
                  .then(async response1 => {
                    // await this.pushMsg(response.data.jobNo)
                    var dtt = {
                      bookNo: this.jobItem[0].bookNo,
                      contactDate: this.format_date2(new Date()),
                      status: 'confirmJob',
                      statusUse: 'use',
                      shopId: this.$route.query.shopId,
                      CREATE_USER: this.profile.userId,
                      LAST_USER: this.profile.userId,
                      packageId: this.packageId,
                      tokenPackage: this.tokenPackage
                    }
                    axios
                      .post(this.DNS_IP + '/booking_transaction/add', dtt)
                      .then(async responsess => {
                        this.pushmessage(response.data.jobNo)
                        this.$swal('เรียบร้อย', 'รับเข้าบริการเรียบร้อย', 'success')
                        this.overlay = false
                        this.$router.push('/Thank?shopId=' + this.$route.query.shopId + '&redirectBy=stampFirstStep')
                      })
                  })
              } else {
                this.$swal('ผิดพลาด', 'กรุณาทำรายการใหม่', 'error')
                this.chkBookingNo()
                this.overlay = false
              }
            }).catch(error => {
              setTimeout(() => this.addDataJobSubmit(), 3000)
              console.log('error function addData : ', error)
              this.overlay = false
            })
        }).catch(error => {
          console.log('error function addData : ', error)
          this.overlay = false
        })
    },
    async pushmessage (jobNo) {
      if (this.$route.query.shopId === 'U9084920b3005bd1dcb57af1ae6bdba32' || this.$route.query.shopId === 'Uc2e4a30c385816316eb1bfe25740cd4d') {
        let updateStatusSend = { updateStatusSend: 'false' }
        await axios
          .post(this.DNS_IP + '/job/pushMsgJobNo/' + jobNo, updateStatusSend)
          .then(console.log(jobNo))
      } else {
        let updateStatusSend = { updateStatusSend: 'false' }
        await axios
          .post(this.DNS_IP + '/job/pushMsgRealTimeQueueJobNo/' + jobNo, updateStatusSend)
          .then(console.log(jobNo))
      }
    },
    async getCustomFieldStart () {
      this.editedItemSeleteField = []
      axios
        .get(this.DNS_IP + '/customField/get?shopId=' + this.$route.query.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            let sortrs = rs.sort((a, b) => a.sortNoField - b.sortNoField)
            for (let i = 0; i < sortrs.length; i++) {
              let d = sortrs[i]
              let s = {}
              s.fieldId = d.fieldId
              s.fieldName = d.fieldName
              s.fieldType = d.fieldType
              s.optionField = d.optionField
              s.conditionField = d.conditionField
              s.conditionValue = d.conditionValue
              s.shopId = d.shopId
              s.showCard = d.showCard
              s.fieldValue = ''
              this.editedItemSeleteField.push(s)
            }
          }
        })
    },
    async getflowfield () {
      this.flowfieldNameitem = []
      let itemIncustomField = []
      await axios
        .get(
          this.DNS_IP +
            '/flowField/get?flowId=' +
            this.jobItem[0].flowId +
            '&shopId=' +
            this.$route.query.shopId
        )
        .then(response => {
          let tt = response.data
          console.log('tt', tt)
          if (tt.length > 0) {
            let flowId = tt[0].flowId
            let flowfieldName = []
            flowfieldName = JSON.parse(tt[0].flowfieldName)
            if (flowfieldName.length > 0) {
              for (let a = 0; a < flowfieldName.length; a++) {
                let d = flowfieldName[a]
                itemIncustomField.push(d.fieldId)
              }
              this.getCustomfieldFlow(itemIncustomField, flowId)
            }
          }
          // console.log('itemIncustomField', itemIncustomField)
        })
    },
    async getCustomfieldFlow (item, flowId) {
      let flowfieldNameitems = []
      this.flowfieldNameitem = []
      await axios
        .get(this.DNS_IP + '/customField/fieldId?fieldId=' + item)
        .then(async response => {
          let rs = response.data
          console.log('rs', rs)
          let sortrs = rs.sort((a, b) => a.sortNoField - b.sortNoField)
          for (var i = 0; i < sortrs.length; i++) {
            let d = sortrs[i]
            let s = {}
            s.fieldId = d.fieldId
            s.flowId = flowId
            s.fieldName = d.fieldName
            s.optionField = d.optionField
            s.conditionField = d.conditionField || ''
            s.fieldType = d.fieldType
            s.fieldValue = ''
            s.CREATE_USER = ''
            s.LAST_USER = ''
            s.showCard = d.showCard
            s.shopId = this.$route.query.shopId
            s.endDate = ''
            s.endTime = ''
            s.checkCar = 'False'
            s.conditionValue = d.conditionValue
            s.requiredField = d.requiredField
            flowfieldNameitems.push(s)
          }
          var data1 = flowfieldNameitems.filter(el => parseInt(el.conditionField || 0) > 0)
          // var data2 = []
          for (let i = 0; i < data1.length; i++) {
            let d = data1[i]
            let indexC = flowfieldNameitems.findIndex(function (o) {
              return o.fieldId === d.fieldId
            })
            let indexF = flowfieldNameitems.findIndex(function (o) {
              return o.fieldId === parseInt(d.conditionField)
            })
            flowfieldNameitems.splice((indexF + 1), 0, flowfieldNameitems.splice(indexC, 1)[0])
          }
          for (var x = 0; x < flowfieldNameitems.length; x++) {
            var s = flowfieldNameitems[x]
            var chk = this.BookingDataItem.filter(el => { return parseInt(el.fieldId) === s.fieldId })
            console.log('cccxxx', s)
            console.log('chk', chk)
            if (chk.length === 0) {
              this.flowfieldNameitem.push(s)
            }
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
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
