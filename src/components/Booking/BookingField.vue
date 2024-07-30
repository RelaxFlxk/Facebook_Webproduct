<template>
  <div>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-stepper
                value="2"
                class="mt-12"
              >
                <v-stepper-header>
                  <v-stepper-step
                    step="1"
                    complete
                  >
                    ลงทะเบียนเข้าใช้งาน
                  </v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step step="2">
                    ตัวอย่าง นัดหมายเข้ารับบริการ
                  </v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step step="3">
                    เลือก Line OA
                  </v-stepper-step>

                   <v-divider></v-divider>

                  <v-stepper-step step="4">
                    Log In เข้าใช้งาน
                  </v-stepper-step>
                </v-stepper-header>
              </v-stepper>
          </v-col>
          <v-col cols="12" md="4" sm="4" class="main">
            <div class="Bar">
              <v-card class="content p-3" height="700px" style="background: linear-gradient(180deg, #FFFFFF 0%, #E1F3FF 100%);">
                <h5 class="text-center" style="color:red;">(ตัวอย่าง)</h5>
                <h4 class="text-center">นัดหมายเข้ารับบริการ</h4>
                <v-select
                  v-model="fromAdd.flowId"
                  :items="DataFlowName"
                  label="ประเภทบริการ"
                  solo
                  required
                ></v-select>
                <v-select
                  v-model="fromAdd.masBranchID"
                  :items="branch"
                  label="สาขา"
                  solo
                  required
                ></v-select>
                <!-- <input type="time" id="appt" name="appt"
              required> -->
                <v-row>
                  <v-col cols="12">
                    <v-row>
              <v-col cols="6">
            <v-menu
              ref="menu"
              v-model="menuDate"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              required
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="วันที่"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  required
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                no-title
                scrollable
                :min="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="menuDate = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="time"
                  label="เวลา"
                  type="time"
                  suffix=""
                  required
                ></v-text-field>
              </v-col>
            </v-row>
                  </v-col>
                </v-row>
                <form class="Review">
                  <div v-if="Fielditem">
                    <div v-for="(item, index) in Fielditem" :key="index">
                    <div v-if="item.showCard == true">
                      <v-text-field
                        :label="item.fieldName"
                        outlined
                        readonly
                      ></v-text-field>
                    </div>
                  </div>
                  </div>
                </form>
                <div class="text-center">
                  <v-btn elevation="10" color="#173053" dark readonly small block
                    >ทำการนัดหมาย</v-btn
                  >
                  <!-- <v-btn elevation="10" color="#1B437C" outlined readonly small
                    >CANCEL</v-btn
                  > -->
                </div>
              </v-card>
            </div>
          </v-col>
          <v-col cols="12" md="8" sm="8" class="main">
            <v-row>
              <v-col cols="12" md="12" sm="12">
                <v-card min-height="50%">
                    <v-col cols="12" class="text-center">
                      <h4 class="text-center">โปรดเลือกข้อมูลที่ต้องการแสดง</h4>
                      <v-data-table
                        v-model="itemdetell"
                        :headers="FieldSelect"
                        :items="Fielditem"
                        rounded="xl"
                        hide-default-footer
                        class="elevation-10"
                      >
                        <template v-slot:[`item.showCard`]="{ item }">
                          <v-simple-checkbox
                            v-model="item.showCard"
                          ></v-simple-checkbox>
                        </template>
                      </v-data-table>
                    </v-col>
                    <v-col cols="12" class="text-center">
                      <v-btn elevation="5" color="#173053" @click="addBooking()" dark
                        >บันทึก</v-btn
                      >
                      <v-btn elevation="5" color="#173053" outlined
                        >ยกเลิก</v-btn
                      >
                    </v-col>
                  </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12" sm="12">
                <div v-if="Redirect !== ''">
                  <v-card class="p-3" height="200px">
                  <h3 class="text-center">ลิ้งสำหรับลูกค้า</h3>
                  <v-card-text>
                    <v-row align-content="center">
                      <v-col cols="10">
                        <v-text-field
                        v-model="Redirect"
                        id="myInput"
                        label="Plese Copy"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="2" class="text-center" style="margin-top:1rem;" align="left">
                        <v-btn
                          small
                          fab
                          @click="FunCopy()"
                        >
                          <v-icon>mdi-content-copy</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <v-row justify="center">
  </v-row>
    </v-main>
    <v-dialog
      v-model="dialog"
      width="700"
    >
      <v-card class="p-3">
        <v-card-text>
        <v-row align-content="center">
          <v-col cols="10">
            <v-text-field
            v-model="Redirect"
            id="myInput"
            label="Plese Copy"
            >
            </v-text-field>
          </v-col>
          <v-col cols="2" class="text-center" style="margin-top:1rem;" align="left">
            <v-btn
              small
              fab
              @click="FunCoppy()"
            >
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios' // api
export default {
  components: {},
  data () {
    return {
      Redirect: '',
      moduleLink: `https://manager.line.biz/module/auth/v1/authorize?client_id=1656250423&redirect_uri=https://betask-linked.web.app/ManageShop?productName=link${this.$route.query.shopId}&response_type=code&scope=account:manage%20message:mark_as_read%20message:receive%20message:send%20profile:read&state=register`,
      menuDate: false,
      dialog: false,
      dialogConfirm: false,
      itemdetell: [],
      DataFlowName: [],
      branch: [],
      date: '',
      time: '',
      fromAdd: {
        flowId: null,
        masBranchID: null
      },
      shopId: this.$route.query.shopId,
      bookingField: [],
      Fielditem: [],
      showCard: false,
      FieldSelect: [
        {
          text: 'Field Id',
          value: 'fieldId'
        },
        {
          text: 'Field Name',
          value: 'fieldName'
        },
        { text: 'AC', value: 'showCard' }
      ]
    }
  },
  async mounted () {
    this.getBookingField()
    this.getDataFlow()
    this.getDataBranch()
  },
  methods: {
    async getDataFlow () {
      this.DataFlowName = []
      // console.log('DataFlowName', this.DataFlowName)
      axios.get(this.DNS_IP + '/flow/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            let s = {}
            s.text = d.flowName
            s.value = d.flowId
            this.DataFlowName.push(s)
            // console.log('this.DataFlowName', this.DataFlowName)
          }
        } else {
          this.DataFlowName = []
        }
      })
    },
    async getDataBranch () {
      this.branch = []
      // console.log('branch', this.branch)
      axios.get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            let s = {}
            s.text = d.masBranchName
            s.value = d.masBranchID
            this.branch.push(s)
            // console.log('dtdtdtdt', this.branch)
          }
        } else {
          this.branch = []
        }
      })
    },
    async getBookingField () {
      this.bookingField = []
      axios
        .get(this.DNS_IP + '/BookingField/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          console.log('rs', rs)
          if (rs.status === false) {
            this.itemdetell = []
            this.getCustomField()
          } else {
            this.dialogConfirm = true
            this.$swal('คุณได้ตั้งค่าข้อมูลไว้แล้ว', 'ระบบจะนำคุณไปยังหน้าต่อไป', 'info').then(() => {
              window.location.href = this.moduleLink
            })
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    async getCustomField () {
      this.Fielditem = []
      await axios
        .get(this.DNS_IP + '/customField/get?shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            let s = {}
            s.fieldId = d.fieldId
            s.fieldName = d.fieldName
            s.showCard = true
            this.Fielditem.push(s)
          }
          console.log('flowfield', this.Fielditem)
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    async addBooking () {
      let booking = {}
      let UpdateField = []
      // this.Redirect = this.DNS_IP + '/booking?shopId=' + this.$route.query.shopId
      for (let i = 0; i < this.Fielditem.length; i++) {
        let d = this.Fielditem[i]
        if (d.showCard === true) {
          UpdateField.push({
            fieldId: d.fieldId
          })
        }
      }
      booking.flowfieldName = JSON.stringify(UpdateField)
      booking.shopId = this.shopId
      booking.typeJob1 = 'บริการปกติ'
      booking.typeJob2 = 'Extra Job'
      booking.typeJob3 = 'Fast Track'
      booking.typeProcess1 = 'รอโทรยืนยัน'
      booking.typeProcess2 = 'ยืนยันแล้ว'
      booking.typeProcess3 = 'ยกเลิก'
      booking.typeProcess4 = 'รับรถแล้ว'
      console.log('dtbooking', booking)
      this.$swal({
        title: 'ต้องการ บันทึกข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async result => {
          axios
            .post(this.DNS_IP + '/BookingField/add', booking)
            .then(response => {
              // this.dialog = true
              // this.$router.push(this.moduleLink)
              window.location.href = this.moduleLink
              // location.replace('https://betask-linked.web.app/ManageShop')
              console.log('addDataGlobal DNS_IP + /job/add', response)
            })
            .catch(error => {
              console.log('error function addData : ', error)
            })
        })
        .catch(error => {
          console.log('Cencel : ', error)
        })
    },
    FunCoppy () {
      var copyText = document.getElementById('myInput')
      copyText.select()
      copyText.setSelectionRange(0, 99999)
      navigator.clipboard.writeText(copyText.value)
      this.$swal({
        title: 'ต้องการไปหน้านัดหมายลูกค้าหรือไม่',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      }).then(() => { this.$router.push('/booking?shopId=' + this.shopId) })
    },
    FunCopy () {
      var copyText = document.getElementById('myInput')
      copyText.select()
      copyText.setSelectionRange(0, 99999)
      navigator.clipboard.writeText(copyText.value)
    }
  }
}
</script>

<style scoped>
.main {
  margin-top: 1rem;
  min-height: 700px;
}
.Bar {
  padding: 20px;
  background-color: #FFFFFF;
  height: 100%;
}
.Review {
  padding: 20px, 20px, 20px, 20px;
}
.content {
  overflow: auto;
  white-space: normal;
}
</style>
