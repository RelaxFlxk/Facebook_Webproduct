<template>
  <div>
    <div class="col-md-12">
      <div
        style="display: flex; justify-content: center; align-items: center;flex-wrap: wrap;"
      >
        <!-- <div>ประเมินการบริการ</div> -->
        <div style="padding-top: 0px">
          <form class="col-sm-12 col-md-12" style="min-width: 347px !important">
            <img src="../../assets/review-01.jpg" width="100%" />
            <div v-if="formData.length > 0">
              <div v-for="(data, index) in formData" :key="index">
                <p class="padding-left" v-if="formData.length > 0">
                  {{ index + 1 }}. {{ data.answer }}
                  <v-text-field
                    style="display: none;"
                    v-model="formadd[index].answerId"
                    :value="data.id"
                  ></v-text-field>
                </p>
                <p class="padding-left" v-if="formData.length === 1">
                  {{ data.answer }}
                  <v-text-field
                    style="display: none;"
                    v-model="formadd[index].answerId"
                    :value="data.id"
                  ></v-text-field>
                </p>
                <div class="rating-margin">
                  <v-rating
                    v-model="formadd[index].rating"
                    color="#FFB461"
                    background-color="#EAEAEF"
                    empty-icon="$ratingFull"
                    :length="formadd[index].ratingMax"
                    :size="100"
                    hover
                    large
                    fab
                    rounded
                  >
                  </v-rating>
                  <v-text-field
                    style="display: none;"
                    v-model="formadd[index].ratingMax"
                  ></v-text-field>
                  <br />
                </div>
              </div>
            </div>
            <div class="padding-left" v-else>
              <br />
              <div>
                <div class="rating-margin text-center">
                  <v-rating
                    v-model="formadd[0].rating"
                    color="#FFB461"
                    background-color="#EAEAEF"
                    empty-icon="$ratingFull"
                    length="5"
                    :size="100"
                    hover
                    large
                  >
                  </v-rating>
                  <v-text-field
                    style="display: none;"
                    v-model="formadd[0].ratingMax"
                  ></v-text-field>
                  <p class="padding-left text-center">
                    ขอบคุณที่เข้ารับบริการกับเรา
                    <v-text-field
                      style="display: none;"
                      value="ความประทับใจการใช้บริการ"
                    ></v-text-field>
                  </p>
                </div>
              </div>
            </div>

            <!-- <hr class="style-hr" /> -->
            <v-col cols="12" md="12">
              <label class="text-bold">ข้อเสนอแนะ</label>
              <v-textarea
                v-model="formadd[0].comment"
                outlined
                flat
                name="input-7-4"
                clear-icon="mdi-close-circle"
              >
              </v-textarea>
            </v-col>
            <v-checkbox
              v-model="formadd[0].callBackStatus"
              color="success"
              label="ฉันยอมรับให้ พนักงานติดต่อกลับ"
              :on-icon="'mdi-check-circle'"
              :off-icon="'mdi-checkbox-blank-circle-outline'"
              class="padding-left"
              style="border-radius: 100%;margin: -30px 0 -15px 0;"
            >
              <template v-slot:label>
                <div>ฉันยอมรับให้ พนักงานติดต่อกลับ</div>
              </template>
            </v-checkbox>
            <div
              class="padding-left"
              align="center"
              style="padding: 12px 0 0 12px;"
            >
              <v-btn
                :loading="loading2"
                :disabled="loading2"
                color="#1B437C"
                class="white--text"
                @click="confirm"
                x-large
                style="width: -webkit-fill-available;border-radius: 16px;font-weight: bold;"
              >
                ส่งแบบประเมิน
              </v-btn>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import draggable from 'vuedraggable'
// axios.defaults.baseURL = "http://localhost:5004/"
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
export default {
  data () {
    return {
      DNS_IP: 'http://localhost:5004',
      rating: 0,
      loader: null,
      loading2: false,
      formadd: [
        {
          answerId: null,
          displayName: '',
          pictureUrl: '',
          refId: '',
          rating: 0,
          ratingMax: 5,
          comment: '',
          typeWork: '',
          callBackStatus: false,
          shopId: ''
        }
      ],
      formData: [],
      disabled: true,
      enabled: true,
      dragging: false,
      dragOptions: {
        animation: 150
      },
      swasuccess: {
        title: 'ทุกความคิดเห็นมีค่า',
        text: 'เพื่อการพัฒนาการให้บริการ',
        type: 'success',
        icon: 'success'
      },
      typeWork: '',
      shopId: '',
      refId: '',
      masBranchID: '',
      profile: null,
      dataLineConfig: {}
    }
  },
  components: {
    draggable
  },
  async mounted () {
    if (
      // ถ้ากดยดยอมรับ หรือ ไม่ยอมรับ
      this.$route.query.error === 'ACCESS_DENIED' ||
      this.$route.query.error === 'access_denied'
    ) {
      // ให้ ?liff.state=
      const queryString = decodeURIComponent(window.location.search).replace(
        '?liff.state=',
        ''
      )
      // console.log('queryString', queryString)
      // ดึงค่าใส่ตัวแปร
      const params = new URLSearchParams(queryString)
      this.typeWork = params.get('typeWork')
      this.shopId = params.get('shopId')
      this.refId = params.get('refId')
      this.masBranchID = params.get('masBranchID')
      this.flowId = params.get('flowId')
      // console.log('typeWorkif', this.typeWork)
      // console.log('shopIdif', this.shopId)
    } else {
      // console.log('typeWorkelse', this.$route.query.typeWork)
      // console.log('shopIdelse', this.$route.query.shopId)
      if (
        this.$route.query.typeWork !== undefined &&
        this.$route.query.shopId !== undefined &&
        this.$route.query.refId !== undefined &&
        this.$route.query.masBranchID !== undefined &&
        this.$route.query.flowId !== undefined
      ) {
        this.typeWork = this.$route.query.typeWork
        this.shopId = this.$route.query.shopId
        this.refId = this.$route.query.refId
        this.masBranchID = this.$route.query.masBranchID
        this.flowId = this.$route.query.flowId
      } else {
        const queryString = decodeURIComponent(window.location.search).replace(
          '?liff.state=',
          ''
        )
        // console.log('queryString', queryString)
        const params = new URLSearchParams(queryString)
        this.typeWork = params.get('typeWork')
        this.shopId = params.get('shopId')
        this.refId = params.get('refId')
        this.masBranchID = params.get('masBranchID')
        this.flowId = params.get('flowId')
      }
      this.dataLineConfig = await this.getDataLineConfig(this.shopId)
      await this.checkLiffLogin(this.dataLineConfig)
      await this.getData()
      await this.getRating()
    }
  },
  methods: {
    async getRating () {
      await axios.get(this.DNS_IP + '/rating/get?refId=' + this.refId + '&shopId=' + this.shopId).then(async (response) => {
        let rs = response.data
        console.log('rs', rs)
        if (rs.status !== false) {
          this.$swal('', 'ให้คะแนนแล้ว', 'success').then(result => {
            this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=ratingDuplicate')
          }).catch((error) => {
            console.log('error function addData : ', error)
            this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=ratingNoData')
          })
        }
      })
    },
    async checkLiffLogin (dataLineConfig) {
      console.log('dataLineConfig', dataLineConfig)
      // console.log('dataLineConfig', dataLineConfig)
      await this.$liff
        .init({
          liffId: dataLineConfig.liffMainID // ตัวเทส
          // liffId: '1660658626-l0Y4rkD6'
        })
        .then(async () => {
          if (process.env.NODE_ENV === 'development') {
            this.getProfile_dev()
          } else {
            if (!this.$liff.isLoggedIn()) {
              this.$liff.login({ redirectUri: window.location.href })
            } else {
              await this.getProfile()
              // await this.liffSendMessages()
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
          // console.log('prod', _this.profile)
        })
        .catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
    },
    getProfile_dev () {
      this.profile = {
        displayName: 'Pamorn Trivorrarat',
        pictureUrl:
          'https://profile.line-scdn.net/0heYkOVB2MOnZGNizwjMlECTZmORxlR2NkYlMmRXNhZhF8USomP1knFSZjN0N9ACh1OlR9QnozbBNKJU0QWGDGQkEGZEF_AXkpall0lQ',
        // 'pictureUrl': 'https://profile.line-scdn.net/0hehdTWCiWOkdZLRKhl6VFEGVoNCouAzwPIUl2JX4pNnQnSHsUMRx8dCgoNCUmTS1BMRhzKHQpMyN9',
        statusMessage: 'ใช้ไลน์อันนี้นะคร้าบ',
        userId: 'U987fbf72d4f0b37b07c1625f7f6b27b1'
        // 'userId': 'Ud2e630e20bb8597b90d4908a46fbc4e9p'
        // 'userId': 'Ubb981ed38ad6dd18734560d2203df255' // ตัวเทส
      }
      // console.log('dev', this.profile)
    },
    checkMove (e) {
      // console.log('Future index:', e.draggedContext.futureIndex)
      this.formData.splice(
        e.draggedContext.futureIndex,
        0,
        this.formData.splice(e.draggedContext.index, 1)[0]
      )
      this.formData.forEach((item, index) => {
        item.sort = index + 1
      })
    },
    async getData () {
      try {
        const payload = {
          shopId: this.shopId,
          masBranchID: this.masBranchID,
          flowId: this.flowId
        }
        await axios.get(this.DNS_IP + '/ratingformat/get', { params: payload }).then(respone => {
          // console.log('formData', payload)
          console.log('ratingformat', respone.data)
          this.formData = respone.data
          if (respone.data.status !== false) {
            this.formadd = this.formData.map(data => ({
              answerId: data.id,
              displayName: this.profile.displayName,
              pictureUrl: this.profile.pictureUrl,
              refId: this.refId,
              rating: 0,
              ratingMax: respone.data[0].rating,
              comment: '',
              typeWork: this.typeWork,
              callBackStatus: false,
              shopId: this.shopId
            }))
            this.formData = respone.data
          } else {
            this.formData = []
            this.formadd = [
              {
                answerId: null,
                displayName: this.profile.displayName,
                pictureUrl: this.profile.pictureUrl,
                refId: this.refId,
                rating: 0,
                ratingMax: respone.data[0].rating,
                comment: '',
                typeWork: this.typeWork,
                callBackStatus: false,
                shopId: this.shopId
              }
            ]
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    confirm () {
      try {
        this.loading2 = true
        let payload = {}
        if (this.formData.length > 0) {
          for (let i = 0; i < this.formadd.length; i++) {
            let d = this.formadd[i]
            d.comment = this.formadd[0].comment
            d.callBackStatus = this.formadd[0].callBackStatus
          }
          // this.formadd.forEach(item, index => {
          //   item.comment = this.formadd[index].comment
          //   item.callBackStatus = this.formadd.callBackStatus
          //   item.displayName = this.formadd.displayName
          //   item.pictureUrl = this.formadd.pictureUrl
          // })
          payload = {
            data: this.formadd
          }
        } else {
          payload = {
            data: this.formadd
          }
        }
        console.log('this.formadd', payload)
        axios
          .post(this.DNS_IP + '/ratingcommit/add', payload)
          .then(respone => {
            this.$swal(this.swasuccess).then(result => {
              this.getRating()
            }).catch((error) => {
              console.log(error)
              this.getRating()
            })
            this.loading = false
            // console.log(respone)
            this.inputText = ''
          })
      } catch (error) {
        console.error(error)
      } finally {
        this.loading2 = false
      }
    }
  }
}
</script>
<style scoped>
p {
  color: #77808d;
}
.v-rating {
  padding: 0 12px 0 12px;
}
.v-rating .v-icon {
  padding: 2px !important;
}
.v-application--is-ltr
  .v-textarea.v-text-field--enclosed
  .v-text-field__slot
  textarea {
  padding: 0 12px;
}
.v-application--is-ltr .v-textarea.v-text-field--enclosed .v-text-field__slot {
  margin-right: 0px;
}
.v-text-field.v-text-field--enclosed .v-text-field__details,
.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)
  > .v-input__control
  > .v-input__slot {
  padding: 0 0 !important;
}
.theme--light.v-text-field--solo > .v-input__control > .v-input__slot {
  background: #ffffff00;
}
.padding-left {
  padding: 12px 15px;
}
.text-bold {
  font-weight: bold;
}
.v-input__slot {
  align-items: stretch !important;
}
.v-application--wrap {
  background-color: #fff;
}
.card {
  padding: 10px;
  border: solid #e3e3e3;
  border-radius: 20px;
  margin-bottom: 20px;
}
.respons_mobie {
  display: flex;
  justify-content: center;
}
.body_mobie {
  background-color: #000000;
  min-width: 334px;
  height: 760px;
  border-radius: 20px;
  box-shadow: 3px 4px 10px #bdbdbd;
  filter: drop-shadow(2px 4px 6px #f9f9f9);
  display: flex;
  justify-content: center;
  align-items: center;
}
.screen_mobye {
  width: 367px;
  height: 730px;
  border-radius: 10px;
  /* background-color: #f4f4f4; */
  background-color: #fff;
  display: flex;
  justify-content: center;
  overflow: scroll;

  /* background-image: url(https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?cs=srgb&dl=pexels-matheus-bertelli-799443.jpg&fm=jpg); */
}
.camera {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #000000;
  margin-top: -15px;
  position: fixed;
  z-index: 1;
}
.card-title {
  padding-top: 40px;
  border-radius: 25px;
  background-color: #797979;
  display: flex;
  align-items: center;
  background: #000000;
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(3.4px);
  -webkit-backdrop-filter: blur(3.4px);
}
.title-1 {
  font-weight: bold !important;
  color: #fff;
  filter: drop-shadow(0px 1px 2px #828282);
  font-size: 20px;
}
.style-hr {
  background-color: #ffffff00;
  border-top: 2px dotted #8c8b8b;
  margin: 15px;
}
.draggable-item {
  background-color: lightgray;
  padding: 10px;
  margin-bottom: 10px;
}
.round {
  position: relative;
}

.round label {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  cursor: pointer;
  height: 28px;
  left: 0;
  position: absolute;
  top: 0;
  width: 28px;
}

.round label:after {
  border: 2px solid #fff;
  border-top: none;
  border-right: none;
  content: "";
  height: 6px;
  left: 7px;
  opacity: 0;
  position: absolute;
  top: 8px;
  transform: rotate(-45deg);
  width: 12px;
}

.round input[type="checkbox"] {
  visibility: hidden;
}

.round input[type="checkbox"]:checked + label {
  background-color: #66bb6a;
  border-color: #66bb6a;
}

.round input[type="checkbox"]:checked + label:after {
  opacity: 1;
}

.bubbles {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  top: 0;
  left: 0;
}
.bubble {
  position: absolute;
  bottom: -100px;
  width: 40px;
  height: 40px;
  background: #f1f1f1;
  border-radius: 50%;
  opacity: 0.5;
  animation: rise 10s infinite ease-in;
}
.bubble:nth-child(1) {
  width: 40px;
  height: 40px;
  left: 10%;
  animation-duration: 8s;
}
.bubble:nth-child(2) {
  width: 20px;
  height: 20px;
  left: 20%;
  animation-duration: 5s;
  animation-delay: 1s;
}
.bubble:nth-child(3) {
  width: 50px;
  height: 50px;
  left: 35%;
  animation-duration: 7s;
  animation-delay: 2s;
}
.bubble:nth-child(4) {
  width: 80px;
  height: 80px;
  left: 50%;
  animation-duration: 11s;
  animation-delay: 0s;
}
.bubble:nth-child(5) {
  width: 35px;
  height: 35px;
  left: 55%;
  animation-duration: 6s;
  animation-delay: 1s;
}
.bubble:nth-child(6) {
  width: 45px;
  height: 45px;
  left: 65%;
  animation-duration: 8s;
  animation-delay: 3s;
}
.bubble:nth-child(7) {
  width: 90px;
  height: 90px;
  left: 70%;
  animation-duration: 12s;
  animation-delay: 2s;
}
.bubble:nth-child(8) {
  width: 25px;
  height: 25px;
  left: 80%;
  animation-duration: 6s;
  animation-delay: 2s;
}
.bubble:nth-child(9) {
  width: 15px;
  height: 15px;
  left: 70%;
  animation-duration: 5s;
  animation-delay: 1s;
}
.bubble:nth-child(10) {
  width: 90px;
  height: 90px;
  left: 25%;
  animation-duration: 10s;
  animation-delay: 4s;
}
.rating-margin {
  margin: -20px 0px -30px 12px;
}
@keyframes rise {
  0% {
    bottom: -100px;
    transform: translateX(0);
  }
  50% {
    transform: translate(100px);
  }
  100% {
    bottom: 1080px;
    transform: translateX(-200px);
  }
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
