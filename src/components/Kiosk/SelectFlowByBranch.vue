<template>
  <v-main>
    <v-overlay :value="overlay" :absolute="absolute" :opacity="opacity">
      <!-- <v-progress-linear
        color="deep-purple accent-4"
        indeterminate
        rounded
        height="106"
      ></v-progress-linear> -->
      <v-progress-circular
        indeterminate
        size="364"
      ><strong style="font-size: 55px;">Printing...</strong></v-progress-circular>
    </v-overlay>
    <v-container>
      <v-row>
        <v-col cols="12" class="pr-0">
          <div style="display:flex;justify-content: left;" class="ma-3">
            <v-icon left color="red" @click="testPrint">mdi-map-marker</v-icon>
            {{ languageSelect === 0 ? masBranchNameTh : masBranchNameEn }}
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pb-0 pt-0 text-center">
          <div class="d-flex flex-column justify-space-between align-center">
          <v-img
            :aspect-ratio="16/9"
            width="300"
            height="400"
            :src="LoGo"
          ></v-img>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pb-0 pt-0 text-center">
          <div class="ma-3">
            <!-- <v-chip
              class="mr-1 font-weight-black"
              :color="languageSelect === 0 ? 'green' : ''"
              dark
              @click="languageSelect = 0"
              > -->
              <v-avatar left @click="languageSelect = 0, languageSelectText = 'th'" size="80">
                <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fflag-TH.png?alt=media&token=e4bd7ffa-aed9-47e3-9240-4dcb9d8d284e"></v-img>
              </v-avatar>
                <!-- TH
            </v-chip>
            <v-chip
              class="ml-1 font-weight-black"
              :color="languageSelect === 1 ? 'green' : ''"
              dark
              @click="languageSelect = 1"> -->
              <v-avatar left @click="languageSelect = 1, languageSelectText = 'en'" size="80">
                <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fflag-USA1.png?alt=media&token=a83dd820-f576-457a-8d08-1009cea9d70b"></v-img>
              </v-avatar>
                <!-- EN
            </v-chip> -->
            <!-- <v-avatar left @click="languageSelect = 1, languageSelectText = 'ch'" size="70">
                <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/event%2Fchaina.png?alt=media&token=2527d63c-cca8-45f2-85ba-d1539732c504"></v-img>
              </v-avatar>
              <v-avatar left @click="languageSelect = 1, languageSelectText = 'jp'" size="80">
                <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/event%2Fjapan.png?alt=media&token=a4d83ea1-e32e-4569-b630-f9d21f9babdc"></v-img>
              </v-avatar> -->
          </div>
        </v-col>
        <!-- <v-col cols="12">
          <v-btn
            class="custom-button"
            depressed
            block
            x-large
            @click="bluetoothConnect()"
          >
            connect
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn
            class="custom-button"
            depressed
            block
            x-large
            @click="bluetoothConnectTo('00:12:5B:01:13:92')"
          >
            connect to
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn
            class="custom-button"
            depressed
            block
            x-large
            @click="connectPrint()"
          >
            print
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn
            class="custom-button"
            depressed
            block
            x-large
            @click="connectPrintQR()"
          >
            print QR
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn
            class="custom-button"
            depressed
            block
            x-large
            @click="printImageOld()"
          >
            print ของเค้า
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn
            class="custom-button"
            depressed
            block
            x-large
            @click="printImage()"
          >
            print Q
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn
            class="custom-button"
            depressed
            block
            x-large
            @click="printTest()"
          >
            Test Print
          </v-btn>
        </v-col> -->
        <v-col cols="12" v-for="(item, index) in flowData" :key="index">
          <button
            :style="'color:' + DarkModeButton"
            class="custom-button custom-button-larger"
            @click="gotoBooking(item.flowId)"
          >
            <p v-if="languageSelect === 0 && languageSelectText === 'th'">
              {{item.flowName}}
            </p>
            <p v-if="languageSelect === 1 && languageSelectText === 'en'">
              {{item.flowNameEn}}
            </p>
            <!-- <p v-if="languageSelect === 1 && languageSelectText === 'ch'">
              {{item.flowId === 4725 ? '兌換外幣' : '已付款'}}
            </p>
            <p v-if="languageSelect === 1 && languageSelectText === 'jp'">
              {{item.flowId === 4725 ? '両替' : '既に支払いました'}}
            </p> -->
          </button>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import iconv from 'iconv-lite'
export default {
  components: {},
  data () {
    return {
      absolute: false,
      opacity: 0.9,
      languageSelectText: 'th',
      overlay: false,
      width: 300,
      languageSelect: 0,
      masBranchID: '',
      masBranchNameTh: '',
      masBranchNameEn: '',
      shopId: '',
      shop: [],
      flowData: [],
      flowId: '',
      beforQueue: 0,
      servicePointCount: [],
      ColorByShop: [],
      DarkMode: '',
      DarkModeStatus: null,
      DarkModeButton: '',
      DarkModeBackground: '',
      DarkModefont: '',
      LoGo: '',
      bookingField: [],
      fieldNameItem: []
    }
  },
  async mounted () {
    if (this.$route.query.masBranchID && this.$route.query.shopId) {
      this.masBranchID = this.$route.query.masBranchID
      this.shopId = this.$route.query.shopId
      await this.getShop()
      await this.getDataFlow()
      await this.getDataBranch()
      await this.getBookingField()
    } else {
      this.$swal(this.languageSelect === 0 ? 'ผิดพลาด' : 'Oop', this.languageSelect === 0 ? 'กรุณาติดต่อเจ้าหน้าที่' : 'Please contact the staff.', 'error')
    }
  },
  methods: {
    async resetFirebaseUse (item) {
      let params = {
        userName: 'system_ohrich'
      }
      await axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/Pepsico-ProcessOhrichNew', params)
    },
    bluetoothConnect () {
      // eslint-disable-next-line no-undef
      KBBluetooth.connect()
      // eslint-disable-next-line no-undef
      alert(KBBluetooth.isConnected())
    },
    bluetoothConnectTo (macaddress) {
      // eslint-disable-next-line no-undef
      KBBluetooth.connectTo(macaddress)
      // eslint-disable-next-line no-undef
      alert(KBBluetooth.isConnected())
    },
    printTest () {
      alert('connect')
      // eslint-disable-next-line no-undef
      KBBluetooth.connect()
      // KBBluetooth.connectTo('00:12:5B:01:13:92')
      this.connectPrint()
    },
    connectPrint () {
      // eslint-disable-next-line no-undef
      if (KBBluetooth.isConnected()) {
        alert('connect true')
        this.receiptPrint()
      } else {
        alert('connect false')
        // this.showAndroidToast('Default bluetooth device not connected! Attempting re-connect')
        // eslint-disable-next-line no-undef
        KBBluetooth.connect()
        // attempt print in 5 seconds
        setTimeout(this.receiptPrint(), 5000)
      }
    },
    connectPrintQR () {
      // eslint-disable-next-line no-undef
      if (KBBluetooth.isConnected()) {
        alert('connect true')
        this.receiptPrintQR()
      } else {
        alert('connect false')
        // this.showAndroidToast('Default bluetooth device not connected! Attempting re-connect')
        // eslint-disable-next-line no-undef
        KBBluetooth.connect()
        // attempt print in 5 seconds
        setTimeout(this.receiptPrintQR(), 5000)
      }
    },
    connectPrintEN (item, language) {
      // eslint-disable-next-line no-undef
      if (KBBluetooth.isConnected()) {
        this.receiptPrintEN(item, language)
      } else {
        // eslint-disable-next-line no-undef
        KBBluetooth.connect()
        // attempt print in 5 seconds
        setTimeout(this.connectPrintEN(item, language), 5000)
      }
    },
    testPrint () {
      alert('test')
      // eslint-disable-next-line no-undef
      if (KBBluetooth.isConnected()) {
        this.testreceiptPrint()
      } else {
        // eslint-disable-next-line no-undef
        KBBluetooth.connect()
        setTimeout(this.testPrint, 5000)
      }
    },
    testreceiptPrint () {
      var RESET = '\x1B\x40'
      var FEED_3_LINES = '\x1B\x64\x03'
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(RESET)
      var byteQrCode =
        '\x1d(k\x03\x001C\x06\x1d(k\x03\x001E3\x1d(kh\x001P0https://betask-linked.web.app/CheckQueueStoreFrontOhrich?bookNo=BK186285351703413758628&source=ohrich\x1d(k\x03\x001Q0'
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(byteQrCode + '\n')
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(FEED_3_LINES)
      // KBBluetooth.sendBytes(CUT_PAPER);
    },
    receiptPrint () {
      alert('connect receiptPrint')
      var CUT_PAPER = '\x1D\x56\x00'
      // var RESET = '\x1B\x40'
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes('\x1B\x40') // CLEAR ANY PREVIOUS FORMATTING ETC
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes('Printer Testing\nPrinter Testing\nPrinter Testing\nPrinter Testing\nPrinter Testing\nPrinter Testing\nPrinter Testing\nPrinter Testing\n')
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes('sendBytes() test\n')
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(CUT_PAPER)
      // KBBluetooth.sendBytes(DOUBLE_HEIGHT_ON);
      // KBBluetooth.sendBytes('Double Height On\n');
      // KBBluetooth.sendBytes(DOUBLE_HEIGHT_OFF);
      // KBBluetooth.sendBytes('Double Height Off\n');
      // KBBluetooth.sendBytes(EMPHASIZE_ON);
      // KBBluetooth.sendBytes("EMPHASIZE ON\n");
      // KBBluetooth.sendBytes(EMPHASIZE_OFF);
      // KBBluetooth.sendBytes("EMPHASIZE OFF\n");
      // KBBluetooth.sendBytes(UNDERLINE_ON);
      // KBBluetooth.sendBytes("UNDERLINE ON\n");
      // KBBluetooth.sendBytes(UNDERLINE_DOUBLE);
      // KBBluetooth.sendBytes("UNDERLINE DOUBLE\n");
      // KBBluetooth.sendBytes(UNDERLINE_OFF);
      // KBBluetooth.sendBytes("UNDERLINE OFF\n");
      // KBBluetooth.sendBytes(DOUBLESTRIKE_ON);
      // KBBluetooth.sendBytes("DOUBLESTRIKE ON\n");
      // KBBluetooth.sendBytes(DOUBLESTRIKE_OFF);
      // KBBluetooth.sendBytes("DOUBLESTRIKE OFF\n");
      // KBBluetooth.sendBytes(CENTER_JUSTIFIED);
      // KBBluetooth.sendBytes("CENTER_JUSTIFIED\n");
      // KBBluetooth.sendBytes(RIGHT_JUSTIFIED);
      // KBBluetooth.sendBytes("RIGHT_JUSTIFIED\n");
      // KBBluetooth.sendBytes(FEED_3_LINES);
      // eslint-disable-next-line no-undef
      // KBBluetooth.disconnect()
    },
    receiptPrintQR () {
      alert('connect receiptPrint')
      var CUT_PAPER = '\x1D\x56\x00'
      // var RESET = '\x1B\x40'
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes('\x1B\x40') // CLEAR ANY PREVIOUS FORMATTING ETC
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes('Printer Testing\nPrinter Testing\nPrinter Testing\nPrinter Testing\nPrinter Testing\nPrinter Testing\nPrinter Testing\nPrinter Testing\n')
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes('sendBytes() test\n')
      // URL ที่จะสร้างเป็น QR Code
      var url = 'www.google.com'

      // ตัวอย่างข้อมูลที่จะส่งไปยังเครื่องพิมพ์เพื่อสร้าง QR Code
      // โปรดทราบว่าคุณอาจต้องปรับแต่งคำสั่งนี้ให้เข้ากับเครื่องพิมพ์ของคุณ
      var qrCodeCommand = '\x1D\x28\x6B\x03\x00\x31\x43\x03' + // กำหนดขนาด
                    '\x1D\x28\x6B\x03\x00\x31\x45\x30' + // กำหนดการเข้ารหัส
                    '\x1D\x28\x6B' + (url.length + 3) + '\x00\x31\x50\x30' + url + // ข้อมูล QR Code
                    '\x1D\x28\x6B\x03\x00\x31\x51\x30' // คำสั่งพิมพ์ QR Code

      // ส่งคำสั่งไปยังเครื่องพิมพ์ผ่าน KBBluetooth
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(qrCodeCommand)
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(CUT_PAPER)
    },
    convertTh (text) {
      const encodedText = iconv.encode(text, 'TIS-620')
      const hexString = Array.from(encodedText, (byte) =>
        byte.toString(16).padStart(2, '0')
      ).join('')
      return hexString
    },
    receiptPrintEN (item, language) {
      item.servicePointCount = item.servicePointCount || ''
      this.servicePointCount = item.servicePointCount !== '' ? JSON.parse(item.servicePointCount) : []
      var CUT_PAPER = '\x1D\x56\x00'
      var RESET = '\x1B\x40'
      // var S_HEIGHT_ON = '\x1B\x21\x40'
      var T_HEIGHT_ON = '\x1D\x21\x22'
      var F_HEIGHT_ON = '\x1D\x21\x11'
      // var DOUBLE_HEIGHT_ON = '\x1B\x21\x10'
      var DOUBLE_HEIGHT_OFF = '\x1B\x21\x00'
      // var UNDERLINE_ON = '\x1B\x2D\x01'
      // var UNDERLINE_DOUBLE = '\x1B\x2D\x02'
      // var UNDERLINE_OFF = '\x1B\x2D\x00'
      // var EMPHASIZE_ON = '\x1B\x45\x01'
      // var EMPHASIZE_OFF = '\x1B\x45\x02'
      // var DOUBLESTRIKE_ON = '\x1B\x47\x01'
      // var DOUBLESTRIKE_OFF = '\x1B\x47\x00'
      // var LEFT_JUSTIFIED = '\x1B\x61\x00'
      var CENTER_JUSTIFIED = '\x1B\x61\x01'
      // var RIGHT_JUSTIFIED = '\x1B\x61\x02'
      var FEED_1_LINES = '\x1B\x64\x01'
      var FEED_2_LINES = '\x1B\x64\x02'
      var FEED_3_LINES = '\x1B\x64\x03'
      // var REVERSE_FEED_5_LINES = '\x1B\x65\x05'
      // if (language === 'th') {
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes(RESET) // CLEAR ANY PREVIOUS FORMATTING ETC
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes(CENTER_JUSTIFIED)
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes(F_HEIGHT_ON)
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes('OH! RICH\n')
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes(DOUBLE_HEIGHT_OFF)
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes('SUPPERRICH THAILAND\n')
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes(FEED_3_LINES)
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes('SRT Forex\n')
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendHexString(this.convertTh(item.masBranchName))
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes('\n')
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes(FEED_1_LINES)
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes(T_HEIGHT_ON)
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes(item.storeFrontQueue + '\n')
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes(DOUBLE_HEIGHT_OFF)
      //   // eslint-disable-next-line no-undef
      //   // KBBluetooth.sendBytes(item.flowNameEn + '\n')
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendHexString(this.convertTh(item.flowName))
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes('\n')
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes(FEED_1_LINES)
      //   if (this.beforQueue > 0) {
      //     // eslint-disable-next-line no-undef
      //     // KBBluetooth.sendBytes('Waiting Queue ' + this.beforQueue + '\n')
      //     // eslint-disable-next-line no-undef
      //     KBBluetooth.sendHexString(this.convertTh('มีคิวก่อนหน้าคุณ'))
      //     // eslint-disable-next-line no-undef
      //     KBBluetooth.sendBytes(' ' + this.beforQueue + '\n')
      //   } else {
      //     // eslint-disable-next-line no-undef
      //     // KBBluetooth.sendBytes('You are now in the first queue.\n')
      //     // eslint-disable-next-line no-undef
      //     KBBluetooth.sendHexString(this.convertTh('ตอนนี้คุณอยู่คิวแรกแล้ว'))
      //     // eslint-disable-next-line no-undef
      //     KBBluetooth.sendBytes('\n')
      //   }
      //   if (this.servicePointCount.length > 0) {
      //     // eslint-disable-next-line no-undef
      //     KBBluetooth.sendHexString(this.convertTh('ประมาณเวลารอ'))
      //     // eslint-disable-next-line no-undef
      //     KBBluetooth.sendBytes(' ' + parseInt((this.beforQueue * 5) / this.servicePointCount.length) + ' นาที\n')
      //     // eslint-disable-next-line no-undef
      //     // KBBluetooth.sendBytes('Estimate waiting time ' + parseInt((this.beforQueue * 5) / this.servicePointCount.length) + ' min\n')
      //   }
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes(FEED_1_LINES)
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendHexString(this.convertTh('สแกนโค้ด QR เพื่อตรวจสอบสถานะคิวของคุณได้อย่างง่ายดายด้วย Betask'))
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes('\n')
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes(FEED_2_LINES)
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendHexString(this.convertTh('ในกรณีที่ไม่มาปรากฏตัว เราจะข้ามคิวของคุณ'))
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes('\n')
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes(FEED_1_LINES)
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes(item.CREATE_DATEday + '         ' + item.CREATE_DATEtime + '\n')
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes(FEED_3_LINES)
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes(FEED_3_LINES)
      //   // KBBluetooth.disconnect();
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes(CUT_PAPER)
      // } else {
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(RESET) // CLEAR ANY PREVIOUS FORMATTING ETC
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(CENTER_JUSTIFIED)
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(F_HEIGHT_ON)
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(this.shop[0].shopName + '\n')
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(DOUBLE_HEIGHT_OFF)
      // eslint-disable-next-line no-undef
      // KBBluetooth.sendBytes('SUPPERRICH THAILAND\n')
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(FEED_3_LINES)
      // eslint-disable-next-line no-undef
      // KBBluetooth.sendBytes('SRT Forex\n')
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(item.masBranchNameEn + '\n')
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(FEED_1_LINES)
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(T_HEIGHT_ON)
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(item.storeFrontQueue + '\n')
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(DOUBLE_HEIGHT_OFF)
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(item.flowNameEn + '\n')
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(FEED_1_LINES)
      if (this.beforQueue > 0) {
        // eslint-disable-next-line no-undef
        KBBluetooth.sendBytes('Waiting Queue ' + this.beforQueue + '\n')
      } else {
        // eslint-disable-next-line no-undef
        KBBluetooth.sendBytes('You are now in the first queue.\n')
      }
      // if (this.servicePointCount.length > 0) {
      //   // eslint-disable-next-line no-undef
      //   KBBluetooth.sendBytes('Estimate waiting time ' + parseInt((this.beforQueue * 5) / this.servicePointCount.length) + ' min\n')
      // }
      // eslint-disable-next-line no-undef
      // KBBluetooth.sendBytes(FEED_1_LINES)
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes('check queue realtime here\n')
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes('\x1d(k\x03\x001C\x06\x1d(k\x03\x001E3\x1d(kZ\x001P0https://betask-linked.web.app/CheckQueueStoreFrontOhrich?bookNo=' + item.bookNo + '\x1d(k\x03\x001Q0')
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes('\n')
      // KBBluetooth.sendBytes('\x1d(k\x03\x001C\x06\x1d(k\x03\x001E3\x1d(k\xae\x001P0https://betask-linked.web.app/CheckQueueStoreFrontOhrich?shopId=Ue9f527da07ff2da05246ea3f62671493&bookNo=' + item.bookNo + '&languageSelect=' + item.bookingLanguage + '&checkLine=T&source=ohrich\x1d(k\x03\x001Q0\n')
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(FEED_2_LINES)
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes('*In case of no show, we will skip your Q\n')
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(FEED_1_LINES)
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(item.CREATE_DATEday + '         ' + item.CREATE_DATEtime + '\n')
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(FEED_3_LINES)
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(FEED_3_LINES)
      // KBBluetooth.disconnect();
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(CUT_PAPER)
      // }
    },
    sendBytes (bytes) {
      // eslint-disable-next-line no-undef
      KBBluetooth.sendBytes(bytes)
    },
    sendHexString (hex) {
      // eslint-disable-next-line no-undef
      KBBluetooth.sendHexString(hex)
    },
    async getShop () {
      if (this.shopId) {
        await axios
          .get(this.DNS_IP + '/sys_shop/get?shopId=' + this.shopId)
          .then(response => {
            let rs = response.data
            console.log('rssssssssssss', rs)
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
                if (v.darkMode === 'True') {
                  this.DarkMode = '#FFFFFF'
                  this.DarkModefont = '#FFFFFF'
                  this.DarkModeStatus = true
                } else {
                  this.DarkMode = '#ffffff00'
                  this.DarkModefont = '#000000'
                  this.DarkModeStatus = false
                }
              })
            }
          })
      } else {
        this.ColorByShop.push('#E1F3FF', '#FFFFFF')
        this.DarkMode = '#ffffff00'
        this.DarkModefont = '#173053'
      }
    },
    async getBookingField () {
      this.bookingField = []
      let itemIncustomField = []
      await axios
        .get(this.DNS_IP + '/BookingField/get?shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            let bookingData = []
            this.bookingField = rs
            bookingData = JSON.parse(rs[0].flowfieldNameCustomer)
            for (let i = 0; i < bookingData.length; i++) {
              let d = bookingData[i]
              itemIncustomField.push(d.fieldId)
            }
            await this.getCustomField(itemIncustomField)
          }
        }).catch(error => {
          console.log('error function getBookingField : ', error)
        })
    },
    async getCustomField (item) {
      this.fieldNameItem = []
      await axios
        .get(this.DNS_IP + '/customField/fieldId?fieldId=' + item)
        .then(async response => {
          let rs = response.data
          // let aa = []
          if (rs.length > 0) {
            let sortNo = rs.sort((a, b) => a.sortNoField - b.sortNoField)
            for (let i = 0; i < sortNo.length; i++) {
              let d = sortNo[i]
              let s = {}
              s.fieldId = d.fieldId
              s.fieldName = d.fieldName
              s.fieldNameEn = d.fieldNameEn
              s.fieldType = d.fieldType
              s.optionField = d.optionField
              s.conditionField = d.conditionField
              s.conditionValue = d.conditionValue
              s.shopId = d.shopId
              s.fieldValue = ''
              s.requiredField = d.requiredField
              this.fieldNameItem.push(s)
            }
            var data1 = this.fieldNameItem.filter(
              el => parseInt(el.conditionField || 0) > 0
            )
            // var data2 = []
            for (var i = 0; i < data1.length; i++) {
              var d = data1[i]
              var indexC = this.fieldNameItem.findIndex(function (o) {
                return o.fieldId === d.fieldId
              })
              var indexF = this.fieldNameItem.findIndex(function (o) {
                return o.fieldId === parseInt(d.conditionField)
              })
              this.fieldNameItem.splice(
                indexF + 1,
                0,
                this.fieldNameItem.splice(indexC, 1)[0]
              )
              // data2.push({'indexC': indexC, 'indexF': indexF})
            }
            // console.log('data1', data1)
            // console.log('data2', data2)
            // for (var x = 0; x < data2.length; x++) {
            //   var s = data2[x]
            //   this.fieldNameItem.splice((s.indexF + 1), 0, this.fieldNameItem.splice(s.indexC, 1)[0])
            // }
            console.log('CustomField', this.fieldNameItem)
            // setTimeout(() => this.validate(), 500)
          }
        }).catch(error => {
          console.log('error function getCustomField : ', error)
        })
    },
    async getDataFlow () {
      this.flowData = []
      await axios
        .get(this.DNS_IP + '/flow/get?shopId=' + this.shopId + '&masBranchIDAll=' + this.masBranchID)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            this.flowData = rs
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    async getDataBranch () {
      await axios
        .get(this.DNS_IP + '/master_branch/get?masBranchID=' + this.masBranchID)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            this.masBranchNameTh = rs[0].masBranchName
            this.masBranchNameEn = rs[0].masBranchNameEn
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    gotoBooking (flowId) {
      this.overlay = true
      // '/BookingForm?shopId=U5098c87d1ac07b21267db32d4a7de2dd&source=CalendarBooking&time=20%3A00&flowId=3930&masBranchID=1880&date=2023-12-18&languageSelect=0'
      // this.$router.push('/BookingFormNoLine?shopId=' + this.shopId + '&source=ohrich&masBranchID=' + this.masBranchID + '&languageSelect=' + this.languageSelect + '&flowId=' + flowId + '&typeUse=Kiosk')
      let dataBooking = []
      for (let i = 0; i < this.fieldNameItem.length; i++) {
        let d = this.fieldNameItem[i]
        dataBooking.push({'masBranchID': this.masBranchID, 'bookingFieldId': this.bookingField[0].bookingFieldId, 'flowId': flowId, 'packageId': '', 'tokenPackage': '', 'fieldId': d.fieldId, 'fieldName': 'สกุลเงินที่ต้องการแลกเปลี่ยน', 'fieldValue': '', 'shopId': this.shopId, 'dueDate': moment().format('YYYY-MM-DD'), 'sourceLink': 'Kiosk', 'userId': 'No Line', 'limitBookingCheck': 'False', 'limitBookingId': '', 'limitBookingCount': null, 'getLimitBooking': 0, 'statusUpload1': 'False', 'statusUpload2': 'False', 'fileUpload1': '', 'fileUpload2': '', 'dateSelect': moment().format('YYYY-MM-DD'), 'storeFrontCheck': 'True', 'statusBookingForm': 'BookingForm', 'bookingLanguage': this.languageSelect})
      }
      axios
        .post(this.DNS_IP + '/Booking/add', dataBooking)
        .then(async response => {
          let bookNo = response.data.bookNo
          if (response.data.message === 'LimitBooking_Full') {
            this.$swal('คิวเต็มแล้ว', 'กรุณาเลือกวันที่และเวลาใหม่อีกครั้ง', 'error')
            this.overlay = false
          } else {
            let dtt = {
              bookNo: bookNo,
              contactDate: moment().format('YYYY-MM-DD HH:mm'),
              status: 'confirm',
              statusUse: 'use',
              shopId: this.shopId,
              CREATE_USER: 'system_ohrich',
              LAST_USER: 'system_ohrich'
            }
            await axios
              .post(this.DNS_IP + '/booking_transaction/add', dtt)
              .then(async response => {}).catch(error => {
                console.log('error function booking_transaction : ', error)
                this.overlay = false
              }).catch(function (error) {
                console.log('Error booking_transaction add: ' + error)
                this.overlay = false
              })

            // await this.resetFirebaseUse()
            await this.getBookingData(bookNo)
          }
        }).catch(function (error) {
          console.log('Error booking add: ' + error)
          this.overlay = false
        })
    },
    async getBookingData (bookNo) {
      this.dataBookingData = []
      await axios
        // .get(this.DNS_IP + '/BookingData/get?shopId=' + this.shopId + '&bookNo=' + this.bookNo)
        .get(this.DNS_IP + '/booking_view/get?shopId=' + this.shopId + '&bookNo=' + bookNo)
        .then(async response => {
          let rs = response.data
          console.log('rsUse', rs)
          if (rs.length > 0) {
            this.dataBookingData = rs[0]
            console.log('bookingData', rs)
            await this.getBookingQueue(rs[0])
            this.overlay = false
            // await this.setPrint(rs[0], this.languageSelect === 0 ? 'th' : 'en')
            await this.connectPrintEN(rs[0], this.languageSelect === 0 ? 'th' : 'en')
          }
        }).catch(function (error) {
          console.log('Error getBookingData: ' + error)
        })
    },
    async getBookingQueue (dt) {
      await axios
        .get(this.DNS_IP + '/booking_view/get?shopId=' + this.shopId + '&dueDate=' + dt.dueDateDay + '&masBranchID=' + dt.masBranchID + '&flowId=' + dt.flowId + '&storeFrontQueue=is not null&statusBt=confirm')
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            if (rs.filter((item, key) => item.storeFrontQueue === dt.storeFrontQueue).length > 0) {
              let findIndex = rs.findIndex((item, key) => item.storeFrontQueue === dt.storeFrontQueue)
              this.beforQueue = rs.filter((item, key) => key < findIndex).length
            } else {
              this.beforQueue = 0
            }
          } else {
            this.beforQueue = 0
          }
        }).catch(function (error) {
          console.log('Error getBookingQueue: ' + error)
        })
    }
  }
}
</script>

<style scoped>
.custom-button-larger {
  font-size: 40px; /* ปรับขนาดตัวอักษร */
  padding: 10px 20px;
}
.custom-button {
  width: 100%;
  margin-top: 10px;
  border-radius: 25px; /* Makes the button edges rounded */
  background-color: white; /* Button color */
  box-shadow: 0 3px 6px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.24); /* Elevation shadow */
}

/* Optionally, you can add hover effects */
.custom-button:hover {
  background-color: #f5f5f5; /* Slightly darker color on hover */
}
</style>
