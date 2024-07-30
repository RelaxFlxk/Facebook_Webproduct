<template>
  <main class="main">
    <NavbarRegister />
    <v-dialog v-model="dialog" persistent scrollable max-width="600px">
      <v-card>
        <br />
        <v-card-text>
          <v-row class="mb-6" justify="center">
            <v-col md="auto">
              <h3 style="color: black">
                <strong>พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล</strong>
              </h3>
            </v-col>
          </v-row>
        </v-card-text>
        <v-row class="mb-6" justify="center">
          <v-col md="auto">
            <v-img
              src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FPDPA.svg?alt=media&token=34cc3ba0-cd90-405d-83a5-9f14dcad6c34"
              class="a"
              style="width: 198.65px; height: 194px"
            ></v-img>
            <!-- <v-img
              :src="require('@/assets/PDPA.svg')"
              class="a"
              style="width: 198.65px; height: 194px"
            ></v-img> -->
          </v-col>
        </v-row>
        <v-card-text>
          <v-row class="mb-6" justify="center">
            <v-col md="auto">
              <h5 style="color: black">
                <strong>โปรดคำนึงอย่างจริงจัง</strong>
              </h5>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text style="height: 400px">
          <v-container>
            <div v-html="privacyConfigDetail"></div>
          </v-container>
        </v-card-text>
        <br />
        <v-card-text>
          <v-row class="mb-6" justify="center">
            <v-col md="auto">
              <v-btn dark color="#1B437C" x-large @click="closeDialog">
                ยอมรับ
              </v-btn>
            </v-col>
            <v-col md="auto">
              <v-btn
                dark
                color="#E53935"
                x-large
                @click="$router.push('/close')"
              >
                ไม่ยอมรับ
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col :cols="resCol">
        <v-row>
          <v-col cols="12" align="center">
            <div class="pt-7">
              <div
                v-if="resCol === '6'"
                style="display: flex; margin: 0 auto; padding-left: 15px"
              >
                <div style="text-align: center">
                  <v-avatar color="#1C3879" size="70">
                    <span class="white--text text-h4">1</span>
                  </v-avatar>
                  <div
                    style="
                      white-space: nowrap;
                      margin-top: 20px;
                      font-size: 19px;
                    "
                  >
                    สมัครสมาชิกบริษัท/ ร้าน
                  </div>
                </div>
                <hr />
                <div style="text-align: center">
                  <v-avatar color="grey" size="70">
                    <span class="white--text text-h4">2</span>
                  </v-avatar>
                  <div
                    style="
                      white-space: nowrap;
                      margin-top: 20px;
                      font-size: 19px;
                    "
                  >
                    สร้างบัญชี Line Official Account
                  </div>
                </div>
                <hr />
                <div style="text-align: center; margin-left: 30px">
                  <v-avatar color="grey" size="70">
                    <span class="white--text text-h4">3</span>
                  </v-avatar>
                  <div
                    style="
                      white-space: nowrap;
                      margin-top: 20px;
                      font-size: 19px;
                    "
                  >
                    เข้าสู่ระบบ
                  </div>
                </div>
              </div>
              <div
                v-if="resCol === '12'"
                style="display: flex; margin: 0 auto; width: 300px"
              >
                <div style="text-align: center">
                  <v-avatar color="#1C3879" size="50">
                    <span class="white--text text-h7">1</span>
                  </v-avatar>
                  <div
                    style="
                      white-space: nowrap;
                      margin-top: 10px;
                      font-size: 14px;
                    "
                  >
                    สมัครสมาชิก
                  </div>
                </div>
                <hr style="margin-top: 20px" />
                <div style="text-align: center">
                  <v-avatar color="grey" size="50">
                    <span class="white--text text-h7">2</span>
                  </v-avatar>
                  <div
                    style="
                      white-space: nowrap;
                      margin-top: 10px;
                      font-size: 14px;
                    "
                  >
                    สร้าง Line OA
                  </div>
                </div>
                <hr style="margin-top: 20px" />
                <div style="text-align: center; margin-left: 10px">
                  <v-avatar color="grey" size="50">
                    <span class="white--text text-h7">3</span>
                  </v-avatar>
                  <div
                    style="
                      white-space: nowrap;
                      margin-top: 10px;
                      font-size: 14px;
                    "
                  >
                    เข้าสู่ระบบ
                  </div>
                </div>
              </div>
            </div>
            <v-img
              contain
              width="60%"
              src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FMascot-Betask.png?alt=media&token=e7dcc64d-0d70-4179-9370-900348cd8ee5"
            ></v-img>
            <!-- <v-img
              contain
              width="60%"
              :src="require('@/assets/Mascot-Betask.png')"
            ></v-img> -->
          </v-col>
        </v-row>
      </v-col>
      <v-col :cols="resCol">
        <div class="pb-15 pt-7">
          <v-row class="text-center" justify="center" no-gutters>
            <v-col cols="10">
              <h2 style="color: #001d6e">
                <strong>ลงทะเบียนเข้าใช้งาน</strong>
              </h2>
              <h5><strong>กรุณากรอกแบบฟอร์มนี้เพื่อสร้างบัญชี</strong></h5>
            </v-col>
          </v-row>
          <br />
          <v-form ref="form_add" v-model="validAdd" lazy-validation>
            <v-row justify="center" no-gutters style="height: 70px">
              <v-col cols="10">
                <v-text-field
                  v-model="form.nameCompany"
                  label="ชื่อบริษัท"
                  :rules="[rules.required]"
                  outlined
                />
              </v-col>
            </v-row>
            <v-row justify="center" no-gutters>
              <v-col cols="10">
                <v-select
                  v-model="form.category"
                  :items="category"
                  label="ประเภทธุรกิจ"
                  outlined
                  required
                  :rules="[rules.required]"
                  @change="selectCategorySub(),form.category === 7 ? (selected = ['ซ่อมทั่วไป']): (selected = ['บริการเริ่มต้น'])"
                ></v-select>
              </v-col>
            </v-row>
            <v-row justify="center" no-gutters v-if="categorySub.length > 0">
              <v-col cols="10">
                <v-select
                  v-model="form.categorySub"
                  :items="categorySub"
                  label="ประเภทบริการ"
                  outlined
                  required
                  multiple
                  attach
                  chips
                  :menu-props="{ bottom: true, offsetY: true }"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>
            </v-row>
            <!-- <v-row justify="center" style="display: none;" no-gutters v-if="form.category !== ''"
              ><v-col cols="10" class="font18 ml-15">ประเภทบริการ</v-col></v-row
            > -->
            <div v-show="vShow !== false">
              <v-row justify="center" no-gutters v-if="form.category !== ''">
              <v-col cols="10" class="font18 ml-15">ประเภทบริการ</v-col>
              <v-col cols="9">
                <v-checkbox
                  v-if="form.category === 7"
                  v-model="selected"
                  label="ซ่อมทั่วไป"
                  value="ซ่อมทั่วไป"
                ></v-checkbox>
              </v-col>
              <v-col cols="9">
                <v-checkbox
                  v-if="form.category === 7"
                  v-model="selected"
                  label="ซ่อมสีและตัวถัง"
                  value="ซ่อมสีและตัวถัง"
                ></v-checkbox>
              </v-col>
              <v-col cols="9">
                <v-checkbox
                  v-if="form.category === 7"
                  v-model="selected"
                  label="ล้าง ขัด เคลือบเงา"
                  value="ล้าง ขัด เคลือบเงา"
                ></v-checkbox>
              </v-col>
              <v-col cols="9">
                <v-checkbox
                  v-if="form.category !== 7"
                  v-model="selected"
                  label="บริการเริ่มต้น"
                  value="บริการเริ่มต้น"
                ></v-checkbox>
              </v-col>
            </v-row>
            </div>
            <v-row justify="center" no-gutters style="height: 70px">
              <v-col cols="10">
                <v-text-field
                  v-model="form.email"
                  label="อีเมล"
                  :rules="[rules.required, rules.email]"
                  outlined
                />
              </v-col>
            </v-row>
            <v-row justify="center" no-gutters style="height: 140px">
              <v-col cols="10">
                <!-- <v-text-field
                  v-model="form.tel"
                  label="เบอร์ติดต่อ"
                  maxlength="10"
                  outlined
                  :rules="[rules.counterTel, rules.numberRules]"
                /> -->
                <v-text-field
                  v-model="form.tel"
                  label="เบอร์ติดต่อ"
                  outlined
                  required
                  maxlength="10"
                  :rules="[rules.counterTel, rules.numberRules]">
                </v-text-field>
              </v-col>
              <v-col cols="10">
                <v-menu
                  ref="menu1"
                  v-model="menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.bdDate"
                      outlined
                      label="วันเกิด"
                      v-bind="attrs"
                      readonly
                      :rules="[rules.required]"
                      hide-details
                      required
                      v-on="on"
                      append-icon="mdi-calendar"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    ref="picker1"
                    v-model="form.bdDate"
                    :active-date.sync="activePicker"
                    :max="new Date().toISOString().substr(0, 10)"
                    min="1950-01-01"
                    locale="th-th"
                    @change="save1"
                    outlined
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row justify="center" no-gutters style="height: 70px;margin-top: 30px;">
              <v-col cols="10">
                <v-text-field
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.passwordRules]"
                  :type="showPassword ? 'text' : 'password'"
                  name="input-10-2"
                  label="password"
                  hint="At least 12 characters"
                  v-model="form.password"
                  class="input-group--focused"
                  outlined
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center" no-gutters style="height: 70px">
              <v-col cols="10">
                <v-text-field
                  :append-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  v-model="form.currentPassword"
                  label="current password"
                  :rules="[checkPasswordMatch]"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  outlined
                  @click:append="showCurrentPassword = !showCurrentPassword"
                />
              </v-col>
            </v-row>
            <v-row justify="center" no-gutters style="height: 70px">
              <v-col cols="10" style="display: flex; justify-content: center">
                <vue-recaptcha
                  ref="recaptcha"
                  @verify="verifyMethod"
                  @render="renderMethod"
                  sitekey="6Lef5A8hAAAAAIffpLLp_mpt_UFbcuq6l_mXbh8e"
                ></vue-recaptcha>
              </v-col>
            </v-row>

            <!-- <div v-if="recapStatus" class="mt-3 mb-2" style="color: red;">กรุณากดยืนยันตัว</div> -->
            <v-row
              v-if="recapStatus"
              justify="center"
              no-gutters
              style="height: 40px"
            >
              <v-col cols="10">
                <v-alert text outlined type="error">
                  กรุณากดยืนยันตัว.
                </v-alert>
              </v-col>
            </v-row>
            <!-- <v-row justify="center" no-gutters
              ><v-col cols="10" class="font18">ข้อมูลธุรกิจ</v-col></v-row
            > -->
            <!-- <v-row justify="center" no-gutters
              ><v-col cols="10" class="font18 ml-15">ประเภทธุรกิจ</v-col></v-row
            > -->
            <!-- <v-row justify="center" no-gutters v-if="form.category !== ''"
              ><v-col cols="10" class="font18 ml-15">ประเภทบริการ</v-col></v-row
            >
            <v-row justify="center" no-gutters v-if="form.category !== ''">
              <v-col cols="9">
                <v-checkbox
                  v-if="form.category === 'ธุรกิจรถยนต์'"
                  v-model="selected"
                  label="ซ่อมทั่วไป"
                  value="ซ่อมทั่วไป"
                ></v-checkbox>
              </v-col>
              <v-col cols="9">
                <v-checkbox
                  v-if="form.category === 'ธุรกิจรถยนต์'"
                  v-model="selected"
                  label="ซ่อมสีและตัวถัง"
                  value="ซ่อมสีและตัวถัง"
                ></v-checkbox>
              </v-col>
              <v-col cols="9">
                <v-checkbox
                  v-if="form.category === 'ธุรกิจรถยนต์'"
                  v-model="selected"
                  label="ล้าง ขัด เคลือบเงา"
                  value="ล้าง ขัด เคลือบเงา"
                ></v-checkbox>
              </v-col>
              <v-col cols="9">
                <v-checkbox
                  v-if="form.category === 'ธุรกิจอื่นๆ'"
                  v-model="selected"
                  label="บริการเริ่มต้น"
                  value="บริการเริ่มต้น"
                ></v-checkbox>
              </v-col>
            </v-row> -->
            <v-row justify="center" no-gutters style="display: contents;">
              <v-col cols="12" style="justify-content: center;display: flex;height: 46px;">
                <v-checkbox hide-details v-model="checkTerm1" @change="closeDialogPDPA()" style="margin-bottom: 10px;" color="primary">
                  <template v-slot:label>
                    <div style="align-items: center;display: flex;padding-top: 6px;">
                      ยอมรับ
                    </div>
                  </template>
                </v-checkbox>
                <a  @click = "openPrivacyNotice(1)" href="#"
                    :style="widthScreen <= 375 ? 'margin-left: 6px;display: flex;align-items: end;margin-top: 48px;text-decoration: revert;' : 'margin-left: 6px;display: flex;align-items: end;margin-top: 48px;text-decoration: revert;'">
                  นโยบายความเป็นส่วนตัวสำหรับลูกค้า
                </a>
              </v-col>
              <v-col cols="12" :style="widthScreen <= 375 ? 'justify-content: center;display: flex;margin-top: 10px;left: -10px;' : 'justify-content: center;display: flex;left: -10px;'">
                <v-checkbox hide-details v-model="checkTerm2" @change="closeDialogPDPA()" style="margin-bottom: 10px;" color="primary">
                  <template v-slot:label>
                    <div style="align-items: center;display: flex;padding-top: 6px;">
                      ยอมรับ
                    </div>
                  </template>
                </v-checkbox>
                <a  @click = "openPrivacyNotice(2)" href="#"
                    :style="widthScreen <= 375 ? 'margin-left: 6px;display: flex;align-items: center;text-decoration: revert;margin-top:7px;' : 'margin-left: 6px;display: flex;align-items: center;text-decoration: revert;margin-top: 5px;'">
                  ข้อกำหนดและเงื่อนไขการใช้บริการ
                </a>
              </v-col>
            </v-row>
            <v-row justify="center" no-gutter v-show="!checkTerm1 || !checkTerm2">
              <v-col cols="12" :style="widthScreen <= 375 ? 'justify-content: center;display: flex;color:red;font-size:15px;' : 'justify-content: center;display: flex;color:red;'">
                กรุณากรอกเลือกยอมรับ ข้อกำหนดและเงื่อนไขการใช้บริการ
              </v-col>
            </v-row>
            <v-row justify="center" no-gutter>
              <v-col cols="10">
                <v-btn
                  color="#001D6E"
                  style="font-size: 20px;color:white"
                  x-large
                  block
                  :disabled="!checkTerm1 || !checkTerm2 || recapchaToken === '' || !validAdd "
                  @click="addData()"
                >
                  ยืนยันการลงทะเบียน
                </v-btn>
              </v-col>
            </v-row>
            <v-row justify="center" no-gutter>
              <div class="mr-2" style="font-size: 18px">มีบัญชีอยู่แล้ว?</div>
              <div style="font-size: 18px; color: #001d6e" @click="gotoLogin()">
                เข้าสู่ระบบ
              </div>
            </v-row>
          </v-form>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogEnd" persistent max-width="445">
      <v-card>
        <v-container>
          <v-card-text>
            <v-row class="mb-6" justify="center">
              <v-col md="auto">
                <v-img
                  src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FnotiUser.png?alt=media&token=f4d142cd-3e4c-4b7c-831e-2fae4008fe67"
                  class="a"
                  style="width: 353px; height: 216.51px"
                ></v-img>
                <!-- <v-img
                  :src="require('@/assets/notiUser.svg')"
                  class="a"
                  style="width: 353px; height: 216.51px"
                ></v-img> -->
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-row class="mb-6" justify="center">
              <v-col md="auto">
                <h3 style="color: black"><strong>Important !!</strong></h3>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-row class="mb-6" justify="center" no-gutters>
              <v-col lg="8">
                <h6><strong>Username:</strong>{{ form.email }}</h6>
                <h6><strong>Password:</strong>1234</h6>
              </v-col>
            </v-row>
          </v-card-text>
          <v-row justify="center" no-gutter>
            <v-col md="auto">
              <v-btn
                dark
                x-large
                color="#1B437C"
                @click="
                  (dialogEnd = false),
                    checkboot()
                "
              >
                ไปหน้าถัดไป
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogPrivacyNotice"
      max-width="80%"
      persistent
      scrollable
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-text>
          <PrivacyNotice :languageSelect="0"></PrivacyNotice>
        </v-card-text>
        <v-card-actions class="text-center">
          <v-spacer></v-spacer>
          <v-btn
            color="teal"
            class="button"
            dark
            large
            @click="closeDialogPDPA"
          >
            ยอมรับ
          </v-btn>
          <v-btn color="error" class="button" dark large @click="gotoClose()">
            ไม่ยอมรับ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </main>
</template>
<script>
import axios from 'axios' // api
import moment from 'moment-timezone'
import PrivacyNotice from '../Welcome/PrivacyNotice.vue'
import NavbarRegister from '../Welcome/NavbarRegister.vue'
import VueRecaptcha from 'vue-recaptcha'
export default {
  components: {
    name: '',
    PrivacyNotice,
    NavbarRegister,
    'vue-recaptcha': VueRecaptcha
  },
  computed: {
    checkPasswordMatch () {
      return (value) => value === this.form.password || 'รหัสผ่านไม่ตรงกัน'
    },
    resCol () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '12'
        case 'sm':
          return '12'
        case 'md':
          return '6'
        case 'lg':
          return '6'
        case 'xl':
          return '6'
      }
    }
  },
  watch: {
    menu1 (val) {
      val && setTimeout(() => (this.$refs.picker1.activePicker = 'YEAR'))
    }
  },
  data () {
    return {
      security: 'true',
      showPassword: false,
      showCurrentPassword: false,
      menu1: false,
      activePicker: null,
      vShow: false,
      dialogPrivacyNotice: false,
      overlay: false,
      recapStatus: false,
      checkTerm1: false,
      checkTerm2: false,
      form: {
        nameCompany: '',
        email: '',
        tel: '',
        category: '',
        categorySub: [],
        bdDate: '',
        password: ''
      },
      selected: ['ซ่อมทั่วไป'],
      // category: [
      //   { text: 'ธุรกิจเสริมสวย', value: 'ธุรกิจเสริมสวย' },
      //   { text: 'ธุรกิจคลินิก', value: 'ธุรกิจคลินิก' },
      //   { text: 'ธุรกิจโรงพยาบาล', value: 'ธุรกิจโรงพยาบาล' },
      //   { text: 'ธุรกิจสนามกีฬา', value: 'ธุรกิจสนามกีฬา' },
      //   { text: 'ศูนย์การเรียนรู้', value: 'ศูนย์การเรียนรู้' },
      //   { text: 'หน่วยงานราชการ', value: 'หน่วยงานราชการ' },
      //   { text: 'ธุรกิจรถยนต์', value: 'ธุรกิจรถยนต์' },
      //   { text: 'ธุรกิจอื่นๆ', value: 'ธุรกิจอื่นๆ' }
      // ],
      category: [],
      Allcategory: [],
      categorySub: [],
      AllcategorySub: [],
      counterTel: [
        v => !!v || 'กรุณากรอก',
        v => (v && v.length < 13) || 'กรุณากรอกเบอร์ให้ครบ'
      ],
      rules: {
        numberRules: (value) =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        counterTel: (value) => value.length <= 10 || 'กรุณากรอกเบอร์ให้ครบ',
        IDcardRules: (value) =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        required: (value) => !!value || 'กรุณากรอก.',
        resizeImag: (value) =>
          !value ||
          value.size < 2000000 ||
          'Avatar size should be less than 2 MB!',
        counterIDcard: (value) => value.length <= 13 || 'Max 13 characters',
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        passwordRules: (value) => {
          const isValidLength = value.length >= 12
          const hasUpperCase = /[A-Z]/.test(value)
          const hasNumber = /\d/.test(value)
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
          const hasNoScriptTag = !/<(\/)?[a-z][\s\S]*>/i.test(value)
          if (isValidLength && hasUpperCase && hasNumber && hasSpecialChar && hasNoScriptTag) {
            return true
          } else if (!isValidLength) {
            return 'ต้องมีอย่างน้อย 12 ตัวอักษร'
          } else if (!hasUpperCase) {
            return 'ต้องมีอย่างน้อย 1 ตัวอักษรใหญ่'
          } else if (!hasNumber) {
            return 'ต้องมีอย่างน้อย 1 ตัวเลข'
          } else if (!hasSpecialChar) {
            return 'ต้องมีอย่างน้อย 1 อักษรพิเศษ'
          } else if (!hasNoScriptTag) {
            return 'ไม่อนุญาติให้ใส่ tag หรือ script'
          }
        }
      },
      recapchaToken: '',
      shopIdGoto: '',
      shopId: '',
      dataReady: true,
      validAdd: true,
      dialog: false,
      dialogEnd: false,
      widthScreen: window.screen.width,
      privacyConfigDetail:
        '<h6 class="ql-align-center">เรื่อง นโยบายความเป็นส่วนตัว</h6><p class="ql-align-center"><br></p><p class="ql-align-center">บริษัท บีแทสก์ คอนซัลติ้ง จำกัด เห็นความสำคัญ ในการปกป้องข้อมูลส่วนบุคคล  เพื่อเป็นให้เป็นไปตาม<a href="http://www.ratchakitcha.soc.go.th/DATA/PDF/2562/A/069/T_0052.PDF" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 123, 255);">พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562</a></p><hr class="ql-align-center"><p class="ql-align-center">ผู้ให้บริการให้มี สิทธิการเข้าถึงข้อมูล <code style="color: rgb(232, 62, 140);">(Personal Data Protection Act : PDPA)</code></p><hr><p><strong><u>สำคัญ</u></strong></p><ol><li>ในการใช้บริการนี้ ผู้ใช้ต้องตรวจสอบว่าได้ดำเนินการผ่าน V-LINK ผู้ให้บริการนี้ไม่ ต้องรับผิดชอบต่อความเสียหายใดๆ ที่เกิดจากการใช้บริการจาก แหล่งอื่นที่ไม่ใช่ผู้ให้บริการอย่างเป็นทางการ</li><li>ข้อมูลส่วนบุคคลที่มอบให้แก่บริการนี้และข้อมูลส่วนบุคคลที่ รวบรวมใหม่จะถูกนำไปใช้ภายใต้ความรับผิดชอบของผู้ใช้บริการ นี้ โปรดตรวจสอบรายละเอียดในข้อกำหนดการใช้บริการและ นโยบายความเป็นส่วนตัวของผู้ให้บริการ</li><li>ข้อมูลโปรไฟล์ประกอบด้วย ชื่อ-นามสกุล,วันเกิด ,อีเมลล์</li><li>โปรดตรวจสอบว่า ชื่อ-นามสกุลของท่าน ไม่มีเนื้อหาที่ละเมิดในสิทธิ์ของผู้ใด เช่น ละเมิดลิขสิทธิ์ ละเมิด ความเป็นส่วนตัว ตามที่ระบุในข้อกำหนดการใช้บริการ บริษัท บีแทสก์ คอนซัลติ้ง จำกัด</li></ol><p><br></p>'
    }
  },
  created () {
    window.addEventListener('resize', this.myEventHandler)
  },
  destroyed () {
    window.removeEventListener('resize', this.myEventHandler)
  },
  async mounted () {
    await this.getCategory()
    await this.getCategorySub()
    // this.$ga.enable()
    // if (this.$route.query.state === 'register' && this.$route.query.productName === 'link') {
    //   await this.getBotLineIdLink()
    //   // await this.getOaLink()
    // } else {
    //   this.$swal('ผิดพลาด', 'กรุณาติดต่อเจ้าหน้าที่', 'error')
    // }
    // this.dialog = true
    // this.validate('ADD')
    // this.getTest()
  },
  methods: {
    save1 (date) {
      console.log('dddd', date)
      this.$refs.menu1.save(date)
    },
    myEventHandler (e) {
      this.getSceenSize()
    },
    getSceenSize () {
      this.widthScreen = window.innerWidth
      // console.log('ssssss', this.widthScreen)
    },
    async getCategory () {
      await axios.get(this.DNS_IP + '/category/getsort')
        .then(async (response) => {
          let rs = response.data
          console.log('rs_getCategory', rs)
          if (rs.length > 0) {
            this.Allcategory = rs
            rs.forEach((d) => {
              let s = {}
              s.text = d.nameCategoryTH
              s.textEn = d.nameCategoryEN
              s.value = d.idCategory
              // s.value = d.nameCategoryTH
              this.category.push(s)
            })
          }
        }).catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
    },
    async getCategorySub () {
      await axios.get(this.DNS_IP + '/categorySub/getsort')
        .then(async (response) => {
          let rs = response.data
          console.log('rs_getCategorySub', rs)
          if (rs.length > 0) {
            this.AllcategorySub = rs
          }
        }).catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
    },
    async selectCategorySub () {
      this.form.categorySub = []
      this.categorySub = []
      console.log('this.form', this.form.category)
      // let Id = this.Allcategory.filter((i) => i.nameCategoryTH === this.form.category)[0].idCategory
      // console.log('ddfdfsdfsdf', this.Allcategory.filter((i) => i.nameCategorySubTH === this.form.category))
      this.AllcategorySub.forEach((d) => {
        let s = {}
        if (d.idCategory === this.form.category) {
          s.text = d.nameCategorySubTH
          s.textEn = d.nameCategorySubEN
          s.value = d.idCategorySub
          this.categorySub.push(s)
        }
      })
      console.log('this.cat', this.categorySub)
    },
    closeDialogPDPA () {
      console.log('closeDialogPDPA', this.recapStatus, this.checkTerm1, this.checkTerm2)
      if (this.checkTerm1 === true && this.checkTerm2 === true) {
        this.dialogPrivacyNotice = false
        console.log('gtmTrackEvent')
        this.gtmTrackEvent('PDPA', 'click', 'Agree PDPA')
      }
    },
    closeDialog () {
      this.dialog = false
      this.gtmTrackEvent('PDPA', 'click', 'Agree PDPA')
    },
    gtmTrackEvent (category, action, label) {
      try {
        if (this.$gtm.enabled()) {
          console.log('enable')
        } else {
          console.log('disable')
        }
        this.$gtm.trackEvent({
          category: category,
          action: action,
          label: label
        })
      } catch (err) {
        console.log(err)
      }
    },
    gotoLogin () {
      window.location.href = 'https://betask-linked-admin.web.app/'
      // this.$router.push('/RegisterClose')
    },
    gotoClose () {
      window.location.href = 'https://betaskthai.com/be_linked/'
      // this.$router.push('/RegisterClose')
    },
    validate () {
      this.$refs.form_add.validate()
    },
    linkTo (Linkitem) {
      window.open(Linkitem, '_blank')
      // window.location.href = 'http://stackoverflow.com'
    },
    openPrivacyNotice (check) {
      if (check === 1) {
        window.open('https://betaskthai.com/privacy-policy-customer/')
      } else {
        window.open('https://betaskthai.com/privacy-policy-services/')
      }
    },
    // validate (Action) {
    //   switch (Action) {
    //     case 'ADD':
    //       this.$nextTick(() => {
    //         let self = this
    //         self.$refs.form_add.validate()
    //       })
    //       break
    //     case 'UPDATE':
    //       this.$nextTick(() => {
    //         let self = this
    //         self.$refs.form_update.validate()
    //       })
    //       break

    //     default:
    //       break
    //   }
    // },
    // async getBotLineIdLink () {
    //   let dt = {
    //     code: this.$route.query.code,
    //     redirect_uri: 'https://betask-linked.web.app/register?productName=' + this.$route.query.productName
    //   }
    //   await axios
    //     .post(
    //       // eslint-disable-next-line quotes
    //       this.DNS_IP + "/line/linkYourBot",
    //       dt
    //     )
    //     .then(async (response) => {
    //       console.log('getBotLineId', response.data)
    //       // this.form.shopId = response.data.bot_id
    //       await axios
    //         .get(this.DNS_IP + '/sys_shop/get?shopId=' + response.data.bot_id)
    //         .then(async (responses) => {
    //           console.log('sys_shop', responses.data)
    //           if (responses.data.status === false) {
    //             this.dialog = true
    //             this.validate('ADD')
    //             this.shopId = response.data.bot_id
    //           } else {
    //             this.dialog = false
    //             this.$swal('ผิดพลาด', 'Line OA ของท่านได้เข้าร่วม Be-Link กรุณา Log In', 'error')
    //             this.$router.push('/registerClose')
    //             // location.replace('https://betask-linked.web.app/registerClose')
    //           }
    //         })
    //       // await this.getOaLink(response.data.bot_id)
    //       // location.replace('https://betask-linked-admin.web.app')
    //     })
    //     // eslint-disable-next-line handle-callback-err
    //     .catch((error) => {
    //       console.log(error)
    //       // this.$router.push('/system/Errorpage?returnLink=' + this.returnLink)
    //       this.dataReady = true
    //     })
    // },
    verifyMethod (a) {
      this.recapchaToken = a
      this.recapStatus = false
      this.closeDialogPDPA()
      this.$refs.form_add.validate()
    },
    renderMethod (c) {
      console.log(c)
    },
    checkboot () {
      if (this.$route.query.ref === 'boot') {
        window.location = 'https://betask-linked-admin.web.app/'
      } else {
        this.$router.push('/CreateLineOAaccount?shopId=' + this.shopIdGoto)
      }
    },
    addData (d) {
      console.log('token', d)
      console.log('formAdd', this.form)
      this.validate()
      setTimeout(() => this.addDataSubmit(), 500)
    },
    async addDataSubmit () {
      if (this.validAdd !== false) {
        if (this.form.tel.length >= 10) {
          this.overlay = true
          if (this.recapchaToken !== '') {
            if (this.selected.length > 0) {
              axios
                .get(this.DNS_IP + '/system_user/get?userName=' + this.form.email)
                .then((response1) => {
                  if (response1.data.status === false) {
                    this.$swal({
                      title: 'ต้องการ ลงทะเบียน ใช่หรือไม่?',
                      type: 'question',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#b3b1ab',
                      confirmButtonText: 'ใช่',
                      cancelButtonText: 'ไม่'
                    })
                      .then(async (result) => {
                        var sourceLink = ''
                        if (this.$route.query.ref !== undefined) {
                          sourceLink = this.$route.query.ref
                        } else {
                          sourceLink = ''
                        }
                        var shopId = moment().valueOf()
                        var data = {
                          shopId: 'SD_' + shopId.toString(),
                          arrayTypeService: this.selected,
                          shopName: this.form.nameCompany,
                          category: this.form.category,
                          categorySub: JSON.stringify(this.form.categorySub),
                          contactEmail: this.form.email,
                          contactTel: this.form.tel,
                          birthday: this.form.bdDate,
                          password: this.form.password,
                          sourceLink: sourceLink,
                          security: this.security
                        }
                        await axios
                          .post(this.DNS_IP + '/register/add', data)
                          .then(async (response) => {
                          // Debug response
                            let rs = response.data
                            if (rs.status) {
                            // this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
                              await axios
                                .get(
                                // eslint-disable-next-line quotes
                                  this.DNS_IP +
                                  '/system_user/get?userName=' +
                                  this.form.email
                                )
                                .then(async (response) => {
                                  if (response.data[0]) {
                                    let dt = {
                                      email: response.data[0].userName,
                                      user: response.data[0].userName,
                                      status: 'create',
                                      pass: response.data[0].userPassword
                                    }
                                    await axios
                                      .post(
                                        'https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/Welcome-sendMail',
                                        dt
                                      )
                                      .then(async (response) => {
                                        this.overlay = false
                                        this.dialogEnd = true
                                        this.shopIdGoto = rs.shopId
                                        this.gtmTrackEvent('Register', 'click', 'Register Success')
                                      })
                                  } else {
                                    this.overlay = false
                                    this.$swal(
                                      'ผิดพลาด',
                                      'Account ไม่ถูกต้อง1',
                                      'error'
                                    )
                                  }
                                })
                              // eslint-disable-next-line handle-callback-err
                                .catch((error) => {
                                  this.overlay = false
                                  console.log(error)
                                  this.$swal(
                                    'ผิดพลาด',
                                    'Account ไม่ถูกต้อง2',
                                    'error'
                                  )
                                })
                            } else {
                              this.overlay = false
                              this.$swal(
                                'ผิดพลาด',
                                'กรุณากรอกข้อมูลใหม่อีกครั้งคะ',
                                'error'
                              )
                            }
                          })
                        // eslint-disable-next-line handle-callback-err
                          .catch((error) => {
                            console.log('error function addDataGlobal : ', error)
                            // this.$router.push(
                            //   '/system/Errorpage?returnLink=' + this.returnLink
                            // )
                            this.overlay = false
                          })
                      })
                      .catch((error) => {
                        console.log('error function addData : ', error)
                        this.overlay = false
                      })
                  } else {
                    this.$swal(
                      'ผิดพลาด',
                      'อีเมลของท่าน มีอยู่ในระบบแล้ว กรุณากรอกอีเมลใหม่',
                      'error'
                    )
                    this.overlay = false
                  }
                })
            } else {
              this.$swal('ผิดพลาด', 'กรุณาเลือก ประเภทบริการ', 'error')
              this.overlay = false
            }
          } else {
            this.recapStatus = true
            this.overlay = false
          }
        } else {
          this.$swal(
            'ผิดพลาด',
            'กรุณากรอกเบอร์โทรให้ครบ 10 หลัก',
            'error'
          )
        }
      }
    }
  }
}
</script>
<style scoped>
.main {
  padding: 0px;
  background: #ffffff;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(180deg, #ffffff 10%, #e1f3ff 100%);
}
.bgPage {
  background: linear-gradient(180deg, #ffffff 10%, #e1f3ff 100%);
  position: absolute;
  left: 0%;
  right: 0%;
  top: 0%;
  bottom: 0%;
}
hr {
  border: none;
  border-top: 4px dotted grey;
  color: #fff;
  background-color: #fff;
  height: 1px;
  width: 50%;
  margin-top: 30px;
}
</style>
