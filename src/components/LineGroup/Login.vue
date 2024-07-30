<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col class="main" col="12" md="12" sm="12">
            <v-card class="content p-3"
          height="100vh"
          style="background: linear-gradient(180deg, #FFFFFF 0%, #E1F3FF 100%);"
          >
          <br>
          <br>
          <v-img :src="require('@/assets/Linegrouplogin.svg')" class="a" style="width:120px;height:170px"></v-img>
          <br>
          <br>

          <h6 class="text-center" style="color:#173053;">เข้าสู่ระบบเพื่อรับการแจ้งเตือนบริการ</h6>
                <!-- <input type="time" id="appt" name="appt"
              required> -->
              <br>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                  >
                      <v-text-field
                      v-model="userName"
                        label="username"
                        outlined
                        required
                  :rules ="[rules.required]"
                  background-color="#FFFFFF"

                      ></v-text-field>
                      <v-text-field
                      v-model="userPassword"
                        label="password"
                        outlined
                        required
                  :rules ="[rules.required]"
                  background-color="#FFFFFF"
                      ></v-text-field>
                <div class="text-center">
                  <br>
          <br>
          <br>
          <br>

                  <v-btn
                  elevation="10"
                  color="#173053"
                  dark
                  readonly
                  small
                  :disabled="!valid"
                  @click="validate ,getuserName ()"
                    >SAVE</v-btn
                  >
                  <v-btn elevation="10" color="#173053" outlined readonly small @click="reset" style="background-color:#FFFFFF"
                    >CANCEL</v-btn
                  >
                </div>
                </v-form>
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
    name: ''
  },
  data () {
    return {
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
      }
    }
  },
  async mounted () {
    this.getLineGroupShopId()
  },
  methods: {
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    async getuserName () {
      axios.get(this.DNS_IP + '/system_user/get?userName=' + this.userName + '&userPassword=' + this.userPassword)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            rs.map((item) => {
              this.fromAdd.shopId = item.shopId
            })
            console.log('shopId', this.fromAdd.shopId)
            this.AddShopId()
          } else {
            this.$swal('ข้อมูลไม่ถูกต้อง', 'กรุณากรอกข้อมูลใหม่', 'error')
            this.userName = ''
            this.userPassword = ''
          }
        })
        .catch((error) => {
          console.log('error function addData : ', error)
          this.$swal('ข้อมูลไม่ถูกต้อง', '-----------', 'error')
        })
    },
    async getLineGroupShopId () {
      this.DataFlowName = []
      // console.log('DataFlowName', this.DataFlowName)
      if (this.GroupId === undefined) {
        this.$swal('ผิดพลาด', '-----------', 'error').then(() => { window.close() })
      }
      axios.get(this.DNS_IP + '/LineGroupShopId/get?GroupId=' + this.GroupId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          this.$swal('คุณได้ผูกข้อมูลไว้แล้ว', '-----------', 'success').then(() => {
            this.$router.push('/Thank')
          })
            .catch((error) => {
              console.log('error function addData : ', error)
              this.$router.push('/Thank')
            })
        }
      })
        .catch((error) => {
          console.log('error function addData : ', error)
          this.$swal('ผิดพลาด', '-----------', 'error')
        })
    },
    async AddShopId () {
      this.validate()
      if (this.valid !== false) {
        this.fromAdd.GroupId = this.GroupId
        console.log('fromAdd', this.fromAdd)
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
            axios
              .post(
                this.DNS_IP + '/LineGroupShopId/AddNew', this.fromAdd
              )
              .then(response => {
                this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
                  .then(() => {
                    let bodyitem = {
                      'GroupId': this.fromAdd.GroupId,
                      'shopId': this.fromAdd.shopId
                    }
                    axios
                      .post(
                        this.DNS_IP + '/LineGroupFlow/default', bodyitem
                      )
                      .then(response => this.$router.push('/Thank'))
                  })
                console.log('addDataGlobal DNS_IP + /job/add', response)
              })
              .catch((error) => {
                console.log('error function addData : ', error)
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
}
</style>
