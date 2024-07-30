<template>
  <v-main>
    <v-container>
      <v-form ref="formadd">
        <v-container>
          <div class="center" style="padding-bottom: 40px;">
            <h5>ลงทะเบียน</h5>
          </div>
          <div>
            <v-col
              v-for="(item, i) in inputData"
              :key="i"
              class="pb-0 pt-0"
              cols="12"
              md="12"
            >
              <!-- <v-img
            src='https://firebasestorage.googleapis.com/v0/b/database-78471.appspot.com/o/upload%2F965527229524Strategy_Board.gif?alt=media&token=41cc6640-65d6-4970-b3c7-3a747fb775fb'
            max-height='150'
            cover
            class='grey darken-4'
          ></v-img>
          <div style="padding-top: 80px;"></div> -->
              <div v-for="(item, index) in dataFilter" :key="index">
                <div v-if="item.showitem == true">
                  <div
                    v-if="
                      item.conditionField === '' || item.conditionField === null
                    "
                  >
                    <div v-if="item.fieldType == 'text'">
                      <v-text-field
                        v-if="item.fieldName === 'เบอร์โทร'"
                        v-mask="'###-###-####'"
                        v-model="item.fieldValue"
                        :label="
                          languageSelect === 0
                            ? item.fieldName
                            : item.fieldNameEn
                        "
                        outlined
                        dense
                        required
                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        v-model="item.fieldValue"
                        :label="
                          languageSelect === 0
                            ? item.fieldName
                            : item.fieldNameEn
                        "
                        outlined
                        required
                        dense
                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                      ></v-text-field>
                    </div>
                    <div v-if="item.fieldType == 'number'">
                      <v-text-field
                        v-if="item.fieldName === 'เบอร์โทร'"
                        v-mask="'###-###-####'"
                        v-model="item.fieldValue"
                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                        :label="
                          languageSelect === 0
                            ? item.fieldName
                            : item.fieldNameEn
                        "
                        outlined
                        required
                        dense
                      ></v-text-field>
                      <v-text-field
                        v-else
                        v-model="item.fieldValue"
                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                        :label="
                          languageSelect === 0
                            ? item.fieldName
                            : item.fieldNameEn
                        "
                        outlined
                        required
                        dense
                      ></v-text-field>
                    </div>
                    <div v-if="item.fieldType == 'Autocompletes'">
                      <v-autocomplete
                        v-model="item.fieldValue"
                        :items="JSON.parse(item.optionField)"
                        outlined
                        :label="
                          languageSelect === 0
                            ? item.fieldName
                            : item.fieldNameEn
                        "
                        required
                        dense
                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                      ></v-autocomplete>
                    </div>
                    <div v-if="item.fieldType == 'Selects'">
                      <v-select
                        v-model="item.fieldValue"
                        :items="JSON.parse(item.optionField)"
                        menu-props="auto"
                        :label="
                          languageSelect === 0
                            ? item.fieldName
                            : item.fieldNameEn
                        "
                        required
                        outlined
                        dense
                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                      ></v-select>
                    </div>
                    <div v-if="item.fieldType == 'Radio'" style="padding:0px;">
                      <v-container fluid style="padding:0px;">
                        <v-radio-group
                          column
                          v-model="item.fieldValue"
                          style="margin:0px;"
                          dense
                        >
                          <template v-slot:label> </template>
                          <div
                            v-for="radios in JSON.parse(item.optionField)"
                            :key="radios.toISOString"
                          >
                            <v-radio
                              :label="radios.text"
                              :value="radios.value"
                            ></v-radio>
                          </div>
                        </v-radio-group>
                      </v-container>
                    </div>
                  </div>
                  <div
                    v-if="
                      item.conditionField !== '' &&
                        Fielditem.filter(row => {
                          return row.fieldId === parseInt(item.conditionField);
                        }).length > 0
                    "
                  >
                    <div
                      v-if="
                        item.conditionValue ===
                          Fielditem.filter(row => {
                            return (
                              row.fieldId === parseInt(item.conditionField)
                            );
                          })[0].fieldValue
                      "
                    >
                      <div v-if="item.fieldType == 'text'">
                        <v-text-field
                          v-if="item.fieldName === 'เบอร์โทร'"
                          v-mask="'###-###-####'"
                          v-model="item.fieldValue"
                          :label="
                            languageSelect === 0
                              ? item.fieldName
                              : item.fieldNameEn
                          "
                          outlined
                          required
                          dense
                          :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                        ></v-text-field>
                        <v-text-field
                          v-else
                          v-model="item.fieldValue"
                          :label="
                            languageSelect === 0
                              ? item.fieldName
                              : item.fieldNameEn
                          "
                          outlined
                          required
                          :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                        ></v-text-field>
                      </div>
                      <div v-if="item.fieldType == 'number'">
                        <v-text-field
                          v-if="item.fieldName === 'เบอร์โทร'"
                          v-mask="'###-###-####'"
                          v-model="item.fieldValue"
                          :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                          :label="
                            languageSelect === 0
                              ? item.fieldName
                              : item.fieldNameEn
                          "
                          outlined
                          required
                          dense
                        ></v-text-field>
                        <v-text-field
                          v-else
                          v-model="item.fieldValue"
                          :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                          :label="
                            languageSelect === 0
                              ? item.fieldName
                              : item.fieldNameEn
                          "
                          outlined
                          required
                          dense
                        ></v-text-field>
                      </div>
                      <div v-if="item.fieldType == 'Autocompletes'">
                        <v-autocomplete
                          v-model="item.fieldValue"
                          :items="JSON.parse(item.optionField)"
                          outlined
                          :label="
                            languageSelect === 0
                              ? item.fieldName
                              : item.fieldNameEn
                          "
                          required
                          dense
                          :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                        ></v-autocomplete>
                      </div>
                      <div v-if="item.fieldType == 'Selects'">
                        <v-select
                          v-model="item.fieldValue"
                          :items="JSON.parse(item.optionField)"
                          menu-props="auto"
                          :label="
                            languageSelect === 0
                              ? item.fieldName
                              : item.fieldNameEn
                          "
                          required
                          outlined
                          dense
                          :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                        ></v-select>
                      </div>
                      <div
                        v-if="item.fieldType == 'Radio'"
                        style="padding:0px;"
                      >
                        <v-container fluid style="padding:0px;">
                          <v-radio-group
                            row
                            v-model="item.fieldValue"
                            style="margin:0px;"
                          >
                            <template v-slot:label> </template>
                            <div
                              v-for="radios in JSON.parse(item.optionField)"
                              :key="radios.toISOString"
                            >
                              <v-radio
                                :label="radios.text"
                                :value="radios.value"
                              ></v-radio>
                            </div>
                          </v-radio-group>
                        </v-container>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
          </div>
          <v-row class="text-center">
            <v-btn
              :loading="loading"
              :disabled="loading"
              @click="confirm"
              depressed
              rounded
              color="primary"
            >
              <template v-slot:loader>
                <span>กำลังบันทึก...</span>
              </template>
              <template v-slot:default>
                บันทึก
              </template>
            </v-btn>
          </v-row>
        </v-container>
      </v-form>
    </v-container>
  </v-main>
</template>

<script>
import axios from 'axios'
export default {
  components: {},
  data () {
    return {
      DNS_IPS: 'http://localhost:5001/',
      data: '',
      inputData: [],
      Fieldite: [],
      dataFilter: [],
      languageSelect: 0,
      overlay: false,
      formadd: [],
      item: [],
      date_now: new Date().toISOString().slice(0, 10),
      swasuccess: {
        title: 'สำเร็จ',
        text: 'คุณได้ลงทะเบียนเรียบร้อยแล้ว',
        type: 'success',
        showConfirmButton: false
      },
      loader: null,
      loading: false,
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
      }
    }
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
      this.stepNo = params.get('stepNo')
      this.bookingNo = params.get('bookingNo')
      this.date = params.get('date')
      // console.log('statusTitleif', this.statusTitle)
      // console.log('shopIdif', this.shopId)
    } else {
      // console.log('idelse', this.$route.query.id)
      // console.log('shopIdelse', this.$route.query.shopId)
      if (
        this.$route.query.stepNo !== undefined &&
        this.$route.query.bookingNo !== undefined &&
        this.$route.query.dueDate !== undefined
      ) {
        this.stepNo = this.$route.query.stepNo
        this.bookingNo = this.$route.query.bookingNo
        this.dueDate = this.$route.query.dueDate
      } else {
        const queryString = decodeURIComponent(window.location.search).replace(
          '?liff.state=',
          ''
        )
        // console.log('queryString', queryString)
        const params = new URLSearchParams(queryString)
        this.stepNo = params.get('stepNo')
        this.bookingNo = params.get('bookingNo')
        this.dueDate = params.get('dueDate')
      }
      this.dataLineConfig = await this.getDataLineConfig(this.shopId)
      await this.checkLiffLogin(this.dataLineConfig)
      await this.getForm()
      await this.getStepData()
    }
  },
  computed: {
    endDate () {
      const endDate = new Date(this.date_now)
      endDate.setDate(endDate.getDate() + parseInt(this.inputData[0].date))
      return endDate.toISOString().slice(0, 10)
    }
  },
  methods: {
    async getStepData () {
      await axios.get(this.DNS_IP + '/stepMessageData/get?bookNo=' + this.bookingNo + '&stepAnswesId=' + this.stepNo).then(async (response) => {
        let rsn = response.data
        console.log('rsn', rsn)
        if (rsn[0].status !== false) {
          this.$swal('', 'ลงทะเบียนรอบบนี้แล้ว', 'success').then(result => {
            this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=ratingDuplicate')
          }).catch((error) => {
            console.log('error function addData : ', error)
            this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=ratingNoData')
          })
        }
      }).catch((error) => {
        this.$swal('', 'โปรดติดต่อเจ้าหน้าที่', 'info')
        console.log('error function addData : ', error)
        this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=ratingNoData')
      })
    },
    async getForm () {
      try {
        const payload = {
          id: this.stepNo
          // shopId: this.shopId,
          // bookingNo: this.bookingNo,
          // masBranchID: this.masBranchID,
          // flowId: this.flowId,
          // status: this.status,
          // date: this.date
        }
        let dataGet = {
          itemIncustomField: [],
          itemIncustomFieldCustomer: []
        }
        axios
          .get(this.DNS_IP + '/stepMessage/get', { params: payload })
          .then(response => {
            this.inputData = response.data
            let rs = response.data
            if (response.message !== 'No data found') {
              let dataField = []
              dataField = JSON.parse(rs[0].dataField)
              for (let i = 0; i < dataField.length; i++) {
                let d = dataField[i]
                dataGet.itemIncustomField.push(d.fieldId)
              }
              console.log('dataGet', dataGet)
            }

            this.getCustomField(dataGet)

            console.log('this.inputData', response)
          })
      } catch (error) {
        this.$swal('เกิดข้อผิดพลาด', 'ทำรายการใหม่อีกครั้ง', 'warning')
      }
    },
    async getCustomField (dataGet) {
      this.Fielditem = []
      await axios
        .get(this.DNS_IP + '/customField/get?shopId=' + this.inputData[0].shopId)
        .then(response => {
          console.log('getCustomField', response)
          let dt = response.data
          for (let i = 0; i < dt.length; i++) {
            let d = dt[i]
            let s = {}
            s.fieldId = d.fieldId
            s.fieldName = d.fieldName
            s.fieldNameEn = d.fieldNameEn
            s.fieldType = d.fieldType
            s.optionField = d.optionField
            s.conditionField = d.conditionField
            s.conditionValue = d.conditionValue
            s.requiredField = d.requiredField
            s.shopId = d.shopId
            s.fieldValue = ''
            if (
              dataGet.itemIncustomField.filter(ID => ID === d.fieldId).length >
              0
            ) {
              console.log('itemIncustomField', d.fieldId)
              s.showitem = true
              console.log('s', s)
              this.dataFilter.push(s)
            } else {
              s.showitem = false
              console.log('ss', s)
              this.dataFilter.push(s)
            }
          }
          let data1 = this.Fielditem.filter(
            el => parseInt(el.conditionField || 0) > 0
          )
          // let data2 = []
          for (let i = 0; i < data1.length; i++) {
            let d = data1[i]
            let indexC = this.Fielditem.findIndex(function (o) {
              return o.fieldId === d.fieldId
            })
            let indexF = this.Fielditem.findIndex(function (o) {
              return o.fieldId === parseInt(d.conditionField)
            })
            this.Fielditem.splice(
              indexF + 1,
              0,
              this.Fielditem.splice(indexC, 1)[0]
            )
          }
          console.log('this.Fielditem', this.Fielditem)
          console.log('this.dataFilter', this.dataFilter)
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    confirm () {
      try {
        this.loading = true
        // console.log('formadd', this.formadd)
        // const newArray = []
        // let dataField = this.Fielditem[0].dataField || []
        let params = []
        // console.log('dataFieldwwww', dataField, dataField.length)
        // console.log('this.item', this.item)
        // if (dataField.length > 0) {
        this.dataFilter.forEach((item, index) => {
          // console.log('dataField', item)
          params[index] = {
            bookNo: this.bookingNo,
            dueDate: this.dueDate,
            stepAnswesId: this.inputData[0].id,
            shopId: this.inputData[0].shopId,
            flowId: this.inputData[0].flowId,
            masBranchID: this.inputData[0].masBranchID,
            fieldId: item.fieldId,
            fieldValue: item.fieldValue
          }
        })
        // }
        console.log('params', params)
        // console.log(newArray)
        axios
          .post(this.DNS_IP + '/StepMessageSubmit/post', params)
          .then(response => {
            this.dataFilter = []
            this.$swal(this.swasuccess)
            this.loading = false
          })
      } catch (error) {
        console.error(error)
        this.$swal('เกิดข้อผิดพลาด', 'ทำรายการใหม่อีกครั้ง', 'warning')
      }
    },
    async liffSendMessages (textitem) {
      try {
        await this.$liff.sendMessages([
          {
            type: 'text',
            text: textitem
          }
        ])
      } catch (error) {
        console.log('error', error)
      }
    },
    async checkLiffLogin (data) {
      // console.log('dataLineConfig', dataLineConfig)
      await this.$liff
        .init({
          // liffId: '1661452125-jAAoBBol' ตัวเทส
          // liffId: '1660658626-l0Y4rkD6'
          liffId: data.liffMainID
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
          console.log('prod', _this.profile)
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
        // 'userId': 'U987fbf72d4f0b37b07c1625f7f6b27b1'
        userId: 'Ud2e630e20bb8597b90d4908a46fbc4e9p'
        // 'userId': 'Ubb981ed38ad6dd18734560d2203df255'ตัวเทส
      }
      // console.log('dev', this.profile)
    }
  }
}
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.text-center {
  display: flex;
  justify-content: center;
}
</style>
