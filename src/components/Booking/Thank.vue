<template>
  <v-main>
    <v-card
    :ripple="false"
    :img="ImgCover"
    height="240px"
    width="100%"
    >
    </v-card>
    <v-card class="pa-6 pb-10 mt-n10"
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
    <v-card class="pa-3 pt-6 pb-6 mt-16" >
    <div v-if="(redirectBy === 'BookingForm' || redirectBy === 'BookingAdmin') && DataFlow.length > 0" class="pa-0 ma-0">
      <div v-if="DataFlow[0].checkDeposit === 'True' && depositPrice > 0 && statusShowPayment === true">
        <div v-if="bookingthankText !== null || bookingthankText !== ''" >
          <!-- <textarea  disabled rows="5"  cols="50" style="resize: none;" v-model="bookingthankText"></textarea> -->
          <!-- <h5 v-html="nl2br(bookingthankText,false,false)" style="text-align: center;"></h5> -->
        </div>
        <!-- <div v-if="shop.length > 0" class="text-center">
          <h5 v-if="this.$route.query.shopId && (bookingthankText === null || bookingthankText === '' )" class="">ขอบคุณที่นัดหมายเข้าใช้บริการ</h5>
        </div> -->
        <h4 class="text-center font-weight-black" >{{ languageSelect === 0 ? DataFlow[0].depositTextTH || 'ชำระเงินมัดจำด้วย' : DataFlow[0].depositTextEN || "Payment via" }}</h4>
        <h5 class="text-center font-weight-black" >QR PromptPay</h5>
        <p class="text-center mt-5">{{ languageSelect === 0 ? "กรุณาแคปหน้าจอ QR Code เพื่อดำเนินการจ่ายเงินด้วยแอพพลิเคชั่นของธนาคาร" : "Please screenshot the QR code to pay with Bank application" }}</p>
        <v-card class="mt-6 mb-6 pb-6 " elevation="10">
          <v-img
            v-if="showQrPayments === 'False'"
            height="80%"
            src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FQR-prompt.jpg?alt=media&token=42637b63-af5b-45d9-8900-b866b789819e"
          ></v-img>
          <v-img
            v-if="showQrPayments === 'True' && qrPaymentsImg === ''"
            height="80%"
            src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FQR-prompt.jpg?alt=media&token=42637b63-af5b-45d9-8900-b866b789819e"
          ></v-img>
          <!-- <v-img
            height="80%"
            :src="require('@/assets/QR-prompt.jpg')"
          ></v-img> -->
          <div class="text-center" v-if="value && showQrPayments === 'False'">
            <qrcode-vue  :value="value" :size="size" level="H" :foreground="foreground" />
          </div>
          <div class="text-center" v-if="showQrPayments === 'True'">
            <template v-if="qrPaymentsImg === ''">
              <qrcode-vue  :value="value" :size="size" level="H" :foreground="foreground" />
            </template>
            <template v-if="qrPaymentsImg !== ''">
              <v-img
                height="80%"
                :src="qrPaymentsImg"
              ></v-img>
            </template>
          </div>
          <h6 v-if="shop.length > 0 && shop[0].showShopName === 'True'"  class="text-center mt-3">{{ shop[0].shopName }}</h6>
          <h6 class="text-center mt-0">{{ languageSelect === 0 ? "บัญชี : " : "Account : " }}{{this.DataFlow[0].promptPayName}}</h6>
          <h6 class="text-center mt-0" v-if="depositPrice !== 0 && depositPrice !== 1">{{ languageSelect === 0 ? "จำนวนเงิน : " : "Deposit amount : " }}{{formatNumber(depositPrice)}}{{ languageSelect === 0 ? " บาท" : " baht" }}</h6>
          <h6 class="text-center mt-10" v-if="depositTime !== 'NO'" style="color: red;">( {{ languageSelect === 0 ? "* ชำระเงินภายใน " + depositTimeItem.filter((i) => i.value === depositTime)[0].text  : "* Pay within  " + depositTimeItem.filter((i) => i.value === depositTime)[0].textEng }} )</h6>
          <h6 class="text-center mt-3">( {{ languageSelect === 0 ? "แนบสลิปการโอนเงินโดยกดที่ปุ่ม อัพโหลดสลิป" : "Attach the transfer slip by clicking on the Upload Slip button." }} )</h6>
        </v-card>
        <!-- <h6 class="text-center mt-5">กลังจากชำระแล้วกรุณาส่งหลักฐานสลิปโอนเงิน โดยคลิกปุ่มด้านล่าง</h6> -->
        <div class="text-center mt-5">
          <v-btn
          v-if="statuscheckCreditCard === 'True'"
          class="button pa-2"
          :color="DarkModeButton"
          dark
          large
          @click="dialogCreditCard = true"
          >{{ languageSelect === 0 ? "ย้อนกลับ" : "Back" }}
        </v-btn>
        <v-btn
          class="button pa-2"
          :color="DarkModeButton"
          dark
          large
          @click="gotoPaymentUpload()"
          >{{ languageSelect === 0 ? "อัพโหลดสลิป" : "Upload slip" }}
        </v-btn>
      </div>
      <div class="text-center">
         <v-btn
          v-if="stripeBtstatus"
          block
          :color="DarkModeButton"
          dark
          large
          class="pa-2"
          @click="goToPaymentLink()"
          >{{ languageSelect === 0 ? "ชำระผ่านบัตรเครดิต / QR Code (เคาน์เตอร์)" : "creditcard / QR Code (Counter)" }}
        </v-btn>
      </div>
      </div>
      <div v-else>
        <template v-if="languageSelect === 0">
          <div v-if="bookingthankText !== ''" >
            <!-- <textarea  disabled rows="5"  cols="50" style="resize: none;" v-model="bookingthankText"></textarea> -->
            <!-- <h5 v-html="nl2br(bookingthankText,false,false)" style="text-align: center;"></h5> -->
            <div v-if="languageSelect === 0">
              <h5 v-html="nl2br(bookingthankText,false,false)" style="text-align: center;"></h5>
              </div>
            <div v-else>
              <h5 v-html="nl2br(bookingthankTextEn,false,false)" style="text-align: center;"></h5>
              </div>
          </div>
        </template>
        <template v-else>
          <div v-if="bookingthankTextEn !== ''" >
            <!-- <textarea  disabled rows="5"  cols="50" style="resize: none;" v-model="bookingthankText"></textarea> -->
            <!-- <h5 v-html="nl2br(bookingthankTextEn,false,false)" style="text-align: center;"></h5> -->
            <div v-if="languageSelect === 0">
              <h5 v-html="nl2br(bookingthankText,false,false)" style="text-align: center;"></h5>
              </div>
            <div v-else>
              <h5 v-html="nl2br(bookingthankTextEn,false,false)" style="text-align: center;"></h5>
              </div>
          </div>
          <div v-if="bookingthankTextEn === '' && bookingthankText !== ''" >
            <!-- <textarea  disabled rows="5"  cols="50" style="resize: none;" v-model="bookingthankText"></textarea> -->
            <!-- <h5 v-html="nl2br(bookingthankText,false,false)" style="text-align: center;"></h5> -->
            <div v-if="languageSelect === 0">
              <h5 v-html="nl2br(bookingthankText,false,false)" style="text-align: center;"></h5>
              </div>
            <div v-else>
              <h5 v-html="nl2br(bookingthankTextEn,false,false)" style="text-align: center;"></h5>
              </div>
          </div>
        </template>
        <div v-if="shop.length > 0" class="text-center">
          <div v-if="languageSelect === 0">
          <h5 v-if="$route.query.shopId && (bookingthankText === null || bookingthankText === '' )" class="">{{ "ทางทีมงาน " + shop[0].shopName + " จะติดต่อกลับให้เร็วที่สุด" }}</h5>
        </div>
        <div v-else>
          <h5 v-if="$route.query.shopId && (bookingthankTextEn === null || bookingthankTextEn === '' )" class="">{{ "Our team " + shop[0].shopName + " will contact you back soon." }}</h5>
        </div>
        </div>
        <!-- <h3 class="text-center" v-if="DarkModefont" :style="'color:' + DarkModefont +';'">ขอบคุณที่เข้ารับบริการกับเรา</h3> -->
        <div class="text-center" v-if="dataLineConfig.checkConfig === false">
            <v-btn
            v-if="this.$route.query.shopId"
            elevation="10"
            color="green"
            dark
            :disabled="!valid"
            @click="getBotinfo()"
          >{{ languageSelect === 0 ? "รับการแจ้งเตือนผ่าน Line OA" : "Get notified LINE OA" }}</v-btn>
        </div>
      </div>

    </div>
    <div v-if="redirectBy === 'stampFirstStepErrorNoBook'" class="pa-0 ma-0">
      <div  class="text-center">
          <h5 v-html="nl2br(textByredirectBy,false,false)"></h5>
        </div>
        <div class="text-center mt-6">
            <v-btn
            v-if="this.$route.query.shopId"
            elevation="10"
            color="green"
            dark
            :disabled="!valid"
            @click="getBotinfo()"
          >{{ languageSelect === 0 ? "ช่องทางติดต่อ Line OA" : "Get notified LINE OA" }}</v-btn>
        </div>
    </div>
    <div v-else-if="redirectBy === 'stampFirstStepErrorNoDate'" class="pa-0 ma-0">
      <div  class="text-center">
          <h5 v-html="nl2br(textByredirectBy,false,false)"></h5>
        </div>
        <div class="text-center mt-6">
            <v-btn
            v-if="this.$route.query.shopId"
            elevation="10"
            color="green"
            dark
            :disabled="!valid"
            @click="getBotinfo()"
          >{{ languageSelect === 0 ? "ช่องทางติดต่อ Line OA" : "Get notified LINE OA" }}</v-btn>
        </div>
    </div>
    <div v-else-if="redirectBy === 'stampFirstStep'" class="pa-0 ma-0">
      <div  class="text-center">
          <h5 v-html="nl2br(textByredirectBy,false,false)"></h5>
        </div>
        <div class="text-center mt-6">
            <v-btn
            v-if="this.$route.query.shopId"
            elevation="10"
            color="green"
            dark
            :disabled="!valid"
            @click="getBotinfo()"
          >{{ languageSelect === 0 ? "ช่องทางติดต่อ Line OA" : "Get notified LINE OA" }}</v-btn>
        </div>
    </div>
     <div v-else-if="redirectBy === 'rating'" class="pa-0 ma-0">
      <div  class="text-center">
          <h5 v-html="nl2br(textByredirectBy,false,false)"></h5>
        </div>
        <div class="text-center mt-6">
            <v-btn
            v-if="this.$route.query.shopId"
            elevation="10"
            color="green"
            dark
            :disabled="!valid"
            @click="getBotinfo()"
          >{{ languageSelect === 0 ? "ช่องทางติดต่อ Line OA" : "Get notified LINE OA" }}</v-btn>
        </div>
    </div>
    <div v-else-if="redirectBy === 'ratingDuplicate'" class="pa-0 ma-0">
      <div  class="text-center">
          <h5 v-html="nl2br(textByredirectBy,false,false)"></h5>
        </div>
        <div class="text-center mt-6">
            <v-btn
            v-if="this.$route.query.shopId"
            elevation="10"
            color="green"
            dark
            :disabled="!valid"
            @click="getBotinfo()"
          >{{ languageSelect === 0 ? "ช่องทางติดต่อ Line OA" : "Get notified LINE OA" }}</v-btn>
        </div>
    </div>
    <div v-else-if="redirectBy === 'ratingNoData'" class="pa-0 ma-0">
      <div  class="text-center">
          <h5 v-html="nl2br(textByredirectBy,false,false)"></h5>
        </div>
        <div class="text-center mt-6">
            <v-btn
            v-if="this.$route.query.shopId"
            elevation="10"
            color="green"
            dark
            :disabled="!valid"
            @click="getBotinfo()"
          >{{ languageSelect === 0 ? "ช่องทางติดต่อ Line OA" : "Get notified LINE OA" }}</v-btn>
        </div>
    </div>
     <div v-else-if="redirectBy === 'ratingNoSave'" class="pa-0 ma-0">
      <div  class="text-center">
          <h5 v-html="nl2br(textByredirectBy,false,false)"></h5>
        </div>
        <div class="text-center mt-6">
            <v-btn
            v-if="this.$route.query.shopId"
            elevation="10"
            color="green"
            dark
            :disabled="!valid"
            @click="getBotinfo()"
          >{{ languageSelect === 0 ? "ช่องทางติดต่อ Line OA" : "Get notified LINE OA" }}</v-btn>
        </div>
    </div>
     <div v-else-if="redirectBy === 'stampStepNoStep'" class="pa-0 ma-0">
      <div  class="text-center">
          <h5 v-html="nl2br(textByredirectBy,false,false)"></h5>
        </div>
        <div class="text-center mt-6">
            <v-btn
            v-if="this.$route.query.shopId"
            elevation="10"
            color="green"
            dark
            :disabled="!valid"
            @click="getBotinfo()"
          >{{ languageSelect === 0 ? "ช่องทางติดต่อ Line OA" : "Get notified LINE OA" }}</v-btn>
        </div>
    </div>
     <div v-else-if="redirectBy === 'stampStepDuplicateStep'" class="pa-0 ma-0">
      <div  class="text-center">
          <h5 v-html="nl2br(textByredirectBy,false,false)"></h5>
        </div>
        <div class="text-center mt-6">
            <v-btn
            v-if="this.$route.query.shopId"
            elevation="10"
            color="green"
            dark
            :disabled="!valid"
            @click="getBotinfo()"
          >{{ languageSelect === 0 ? "ช่องทางติดต่อ Line OA" : "Get notified LINE OA" }}</v-btn>
        </div>
    </div>
     <div v-else-if="redirectBy === 'stampStepNoService'" class="pa-0 ma-0">
      <div  class="text-center">
          <h5 v-html="nl2br(textByredirectBy,false,false)"></h5>
        </div>
        <div class="text-center mt-6">
            <v-btn
            v-if="this.$route.query.shopId"
            elevation="10"
            color="green"
            dark
            :disabled="!valid"
            @click="getBotinfo()"
          >{{ languageSelect === 0 ? "ช่องทางติดต่อ Line OA" : "Get notified LINE OA" }}</v-btn>
        </div>
    </div>
     <div v-else-if="redirectBy === 'stampStep'" class="pa-0 ma-0">
      <div  class="text-center">
          <h5 v-html="nl2br(textByredirectBy,false,false)"></h5>
        </div>
        <div class="text-center mt-6">
            <v-btn
            v-if="this.$route.query.shopId"
            elevation="10"
            color="green"
            dark
            :disabled="!valid"
            @click="getBotinfo()"
          >{{ languageSelect === 0 ? "ช่องทางติดต่อ Line OA" : "Get notified LINE OA" }}</v-btn>
        </div>
    </div>
    <div v-else-if="redirectBy !== 'BookingForm' && redirectBy !== 'BookingAdmin' && redirectBy === 'N'" class="pa-0 ma-0">
      <div  class="text-center">
        <div v-if="languageSelect === 0">
          <h5 v-if="bookingthankText === null || bookingthankText === ''" class="">{{ languageSelect === 0 ? "ขอบคุณที่เข้ารับบริการกับเรา" : "Thank you for your service." }}</h5>
          <h5 v-else v-html="nl2br(bookingthankText,false,false)" style="text-align: center;"></h5>
        </div>
        <div v-else>
          <h5 v-if="bookingthankTextEn === null || bookingthankTextEn === ''" class="">{{ languageSelect === 0 ? "ขอบคุณที่เข้ารับบริการกับเรา" : "Thank you for your service." }}</h5>
          <h5 v-else v-html="nl2br(bookingthankTextEn,false,false)" style="text-align: center;"></h5>
        </div>
          <!-- <h5 v-if="bookingthankText === null || bookingthankText === ''" class="">{{ languageSelect === 0 ? "ขอบคุณที่เข้ารับบริการกับเรา" : "Thank you for your service." }}</h5>
          <h5 v-else v-html="nl2br(bookingthankText,false,false)" style="text-align: center;"></h5> -->
        </div>
        <div class="text-center" v-if="dataLineConfig.checkConfig === false">
            <v-btn
            v-if="this.$route.query.shopId"
            elevation="10"
            color="green"
            dark
            :disabled="!valid"
            @click="getBotinfo()"
          >{{ languageSelect === 0 ? "รับการแจ้งเตือนผ่าน Line OA" : "Get notified LINE OA" }}</v-btn>
        </div>
    </div>
    <div v-else-if="redirectBy === 'completedPayment' && paymentLink !== ''" class="pa-0 ma-0">
      <template v-if="languageSelect === 0">
        <div v-if="bookingthankText !== ''" >
          <!-- <textarea  disabled rows="5"  cols="50" style="resize: none;" v-model="bookingthankText"></textarea> -->
          <h5 v-html="nl2br(bookingthankText,false,false)" style="text-align: center;"></h5>
        </div>
      </template>
      <template v-else>
        <div v-if="bookingthankTextEn !== ''" >
          <!-- <textarea  disabled rows="5"  cols="50" style="resize: none;" v-model="bookingthankText"></textarea> -->
          <h5 v-html="nl2br(bookingthankTextEn,false,false)" style="text-align: center;"></h5>
        </div>
        <div v-if="bookingthankTextEn === '' && bookingthankText !== ''" >
          <!-- <textarea  disabled rows="5"  cols="50" style="resize: none;" v-model="bookingthankText"></textarea> -->
          <h5 v-html="nl2br(bookingthankText,false,false)" style="text-align: center;"></h5>
        </div>
      </template>
      <div v-if="shop.length > 0" class="text-center">
        <div v-if="languageSelect === 0">
          <h5 v-if="$route.query.shopId && (bookingthankText === null || bookingthankText === '' )" class="">{{ "ทางทีมงาน " + shop[0].shopName + " จะติดต่อกลับให้เร็วที่สุด" }}</h5>
        </div>
        <div v-else>
          <h5 v-if="$route.query.shopId && (bookingthankTextEn === null || bookingthankTextEn === '' )" class="">{{ "Our team " + shop[0].shopName + " will contact you back soon." }}</h5>
        </div>
      </div>
      <div class="text-center" v-if="dataLineConfig.checkConfig === false">
          <v-btn
          v-if="$route.query.shopId"
          elevation="10"
          color="green"
          dark
          :disabled="!valid"
          @click="getBotinfo()"
        >{{ languageSelect === 0 ? "รับการแจ้งเตือนผ่าน Line OA" : "Get notified LINE OA" }}</v-btn>
      </div>
    </div>
    <div v-else-if="redirectBy === 'PaymentUpload' || redirectBy === 'omisePayment'" class="pa-0 ma-0">
      <template v-if="languageSelect === 0">
        <div v-if="bookingthankText !== ''" >
          <!-- <textarea  disabled rows="5"  cols="50" style="resize: none;" v-model="bookingthankText"></textarea> -->
          <h5 v-html="nl2br(bookingthankText,false,false)" style="text-align: center;"></h5>
        </div>
      </template>
      <template v-else>
        <div v-if="bookingthankTextEn !== ''" >
          <!-- <textarea  disabled rows="5"  cols="50" style="resize: none;" v-model="bookingthankText"></textarea> -->
          <h5 v-html="nl2br(bookingthankTextEn,false,false)" style="text-align: center;"></h5>
        </div>
        <div v-if="bookingthankTextEn === '' && bookingthankText !== ''">
          <!-- <textarea  disabled rows="5"  cols="50" style="resize: none;" v-model="bookingthankText"></textarea> -->
          <h5 v-html="nl2br(bookingthankText,false,false)" style="text-align: center;"></h5>
        </div>
      </template>
      <div v-if="shop.length > 0" class="text-center">
        <div v-if="languageSelect === 0">
          <h5 v-if="$route.query.shopId && (bookingthankText === null || bookingthankText === '' )" class="">{{ "ทางทีมงาน " + shop[0].shopName + " จะติดต่อกลับให้เร็วที่สุด" }}</h5>
        </div>
        <div v-else>
          <h5 v-if="$route.query.shopId && (bookingthankTextEn === null || bookingthankTextEn === '' )" class="">{{ "Our team " + shop[0].shopName + " will contact you back soon." }}</h5>
        </div>
      </div>
      <div class="text-center" v-if="dataLineConfig.checkConfig === false">
          <v-btn
          v-if="$route.query.shopId"
          elevation="10"
          color="green"
          dark
          :disabled="!valid"
          @click="getBotinfo()"
        >{{ languageSelect === 0 ? "รับการแจ้งเตือนผ่าน Line OA" : "Get notified LINE OA" }}</v-btn>
      </div>
    </div>
    <!-- <div v-else-if="redirectBy === 'createPayment' && paymentLink !== ''" class="pa-0 ma-0">
      <div  class="text-center">
          <h5 class="">{{ languageSelect === 0 ? "ขอบคุณที่เข้ารับบริการกับเรา" : "Thank you for your service." }}</h5>
        </div>
        <div class="text-center" v-if="paymentLink !== ''">
            <v-btn
            elevation="10"
            color="green"
            dark
            :disabled="!valid"
            @click="goToPaymentLink()"
          >{{ languageSelect === 0 ? "กดเพื่อชำระเงินอีกครั้ง" : "Press pay again" }}</v-btn>
        </div>
    </div> -->
    </v-card>
    </v-card>
    <v-dialog
      v-model="dialogCreditCard"
      fullscreen
      scrollable
    >
    <v-card>
      <!-- <v-container class="pa-0"> -->
    <v-card-title class="pa-0 ma-0">
    </v-card-title>
    <v-card-text>
      <v-card
    :ripple="false"
    :img="ImgCover"
    height="240px"
    width="100%"
    >
    </v-card>
      <v-card class="pa-6 pb-10 mt-n10"
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
         <h4 class="text-center mt-3 font-weight-black" :style="'color:' + DarkModefont + ';'">
        {{ languageSelect === 0 ? 'การชำระเงิน' : 'Payment' }}
      </h4>
      <h5
        class="text-center"
        :style="'color:' + DarkModefont + ';'"
      >
        {{ languageSelect === 0 ? 'เลือกช่องทางการชำระเงิน' : 'Choose a payment method' }}
      </h5>
      <div class="pa-3 pt-6 pb-6 mt-5" :color="DarkModeBackground" style="display: flex;justify-content: center;align-items: center;flex-direction: column;">
        <v-row>
          <v-col :cols="colswidth === 1 ? 12:6">
            <v-sheet
              :elevation="checkboxPromtpay === 'True' ? 5 : 1"
              class="CDcontend"
              color="#FFFFFF"
              @click="selectPayment('checkboxPromtpay')"
              >
                <h5 class="mr-3">{{ languageSelect === 0 ? "ชำระผ่าน QR PromtPay" : "ชำระผ่าน QR PromtPay" }}</h5>
                <v-icon
                  large
                  :color="checkboxPromtpay === 'True' ? DarkModeButton : '#e0e0e0'"
                  >
                  {{ checkboxPromtpay === 'True' ? 'mdi-check-circle' : 'mdi-checkbox-blank-circle-outline' }}
                </v-icon>
            </v-sheet>
          </v-col>
          <v-col :cols="colswidth === 1 ? 12:6" v-if="statuscheckCreditCard === 'True'">
            <v-sheet
            :elevation="checkboxCreditCard === 'True' ? 5 : 1"
            class="CDcontend"
            @click="selectPayment('checkboxCreditCard')"
            color="#FFFFFF"
            >
              <h5 class="mr-3">{{ languageSelect === 0 ? "ชำระผ่านบัตรเครดิต / QR Code (เคาน์เตอร์)" : "creditcard/ QR Code (Counter)" }}</h5>
              <v-icon
                large
                :color="checkboxCreditCard === 'True' ? DarkModeButton : '#e0e0e0'"
                >
                {{ checkboxCreditCard === 'True' ? 'mdi-check-circle' : 'mdi-checkbox-blank-circle-outline' }}
              </v-icon>
          </v-sheet>
          </v-col>
          <v-col :cols="colswidth === 1 ? 12:6" v-if="statuscheckCoupon === 'True'">
            <v-sheet
            :elevation="checkboxCreditCard === 'True' ? 5 : 1"
            class="CDcontend"
            @click="selectPayment('checkboxCoupon')"
            color="#FFFFFF"
            >
              <h5 class="mr-3">{{ languageSelect === 0 ? "ใช้คูปอง/อื่นๆ" :"coupon and other" }}</h5>
              <v-icon
                large
                :color="checkboxCoupon === 'True' ? DarkModeButton : '#e0e0e0'"
                >
                {{ checkboxCoupon === 'True' ? 'mdi-check-circle' : 'mdi-checkbox-blank-circle-outline' }}
              </v-icon>
          </v-sheet>
          </v-col>
        </v-row>
     </div>
    </v-card>
    </v-card-text>

      <v-card-actions class="pa-0" :style='"display: flex;background:#FFFFFF;"'>
       <div class="pa-1 pt-2 px-10" style="width: 100%;background-color: #FFFFFF;border-radius: 40px 40px 0px 0px;">
        <v-btn
          style="height: 55px;"
          class="button pa-2"
          :color="DarkModeButton"
          dark
          block
          large
          @click="gotocheckCreditCard()"
          >{{ languageSelect === 0 ? "ยืนยัน" : "Confirm" }}
          <v-icon  class="ml-3" dark>mdi-arrow-right</v-icon>
        </v-btn>
       </div>
      </v-card-actions>
    <!-- </v-container> -->
    </v-card>
  </v-dialog>
    <v-dialog
      v-model="dialogSelectOnlinePayment"
      fullscreen
      scrollable
    >
    <v-card>
    <v-card-title class="pa-0 ma-0">
    </v-card-title>
    <v-card-text>
      <v-card
      :ripple="false"
      :img="ImgCover"
      height="240px"
      width="100%"
      >
      </v-card>
        <v-card class="pa-6 pb-10 mt-n10"
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
          <h4 class="text-center mt-3 font-weight-black" :style="'color:' + DarkModefont + ';'">
          {{ languageSelect === 0 ? 'การชำระเงิน' : 'Payment' }}
        </h4>
        <h5
          class="text-center"
          :style="'color:' + DarkModefont + ';'"
        >
          {{ languageSelect === 0 ? 'เลือกช่องทางการชำระเงิน' : 'Choose a payment method' }}
        </h5>
        <div class="pa-3 pt-6 pb-6 mt-5" :color="DarkModeBackground" style="display: flex;justify-content: center;align-items: center;flex-direction: column;">
          <v-row>
            <v-col :cols="colswidth === 1 ? 12:6">
              <v-sheet
                :elevation="checkboxPromtpayOnline === true ? 5 : 1"
                class="CDcontend"
                color="#FFFFFF"
                @click="selectPayment('stripe')"
                >
                  <h5 class="mr-3">{{ languageSelect === 0 ? "Stripe" : "Stripe" }}</h5>
                  <v-icon
                    large
                    :color="checkboxPromtpayOnline === true ? DarkModeButton : '#e0e0e0'"
                    >
                    {{ checkboxPromtpayOnline === true ? 'mdi-check-circle' : 'mdi-checkbox-blank-circle-outline' }}
                  </v-icon>
              </v-sheet>
            </v-col>
            <v-col :cols="colswidth === 1 ? 12:6">
              <v-sheet
              :elevation="checkboxPromtpayOnline === false ? 5 : 1"
              class="CDcontend"
              @click="selectPayment('omise')"
              color="#FFFFFF"
              >
                <h5 class="mr-3">{{ languageSelect === 0 ? "Omise" : "Omise" }}</h5>
                <v-icon
                  large
                  :color="checkboxPromtpayOnline === false ? DarkModeButton : '#e0e0e0'"
                  >
                  {{ checkboxPromtpayOnline === false ? 'mdi-check-circle' : 'mdi-checkbox-blank-circle-outline' }}
                </v-icon>
            </v-sheet>
            </v-col>
          </v-row>
      </div>
      </v-card>
      </v-card-text>

        <v-card-actions class="pa-0" :style='"display: flex;background:#FFFFFF;"'>
        <div class="pa-3 pt-5 px-10" style="width: 100%;background-color: #FFFFFF;border-radius: 40px 40px 0px 0px;">
          <v-btn
            style="height: 55px;"
            class="button pa-2"
            :color="DarkModeButton"
            dark
            block
            large
            @click="gotocheckCreditCardOnline()"
            >{{ languageSelect === 0 ? "ยืนยัน" : "Confirm" }}
            <v-icon  class="ml-3" dark>mdi-arrow-right</v-icon>
          </v-btn>
        </div>
        </v-card-actions>
    </v-card>
  </v-dialog>
  </v-main>
</template>

<script>
import axios from 'axios' // api
import QrcodeVue from 'qrcode.vue'
import moment from 'moment-timezone'
export default {
  components: {
    name: '',
    QrcodeVue
  },
  computed: {
    colswidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 1
        case 'sm': return 1
        case 'md': return 1
        case 'lg': return 2
        case 'xl': return 2
      }
    }
  },
  data () {
    return {
      statusShowPayment: true,
      value: null,
      size: 200,
      foreground: '#000000',
      valid: true,
      GroupId: this.$route.query.GroupId,
      flowId: this.$route.query.flowId,
      bookNo: this.$route.query.bookNo,
      dataOmisePayment: null,
      languageSelect: 0,
      userName: '',
      userPassword: '',
      shopId: this.$route.query.shopId,
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
      dialog: false,
      ColorByShop: [],
      DarkMode: '',
      DarkModeStatus: null,
      DarkModeButton: '',
      DarkModeBackground: '',
      DarkModefont: '',
      shop: [],
      LoGo: [],
      ImgCover: '',
      bookingthankText: null,
      bookingthankTextEn: null,
      redirectBy: null,
      DataFlow: [],
      depositPrice: 0,
      textByredirectBy: '',
      checkMemberId: '',
      showQrPayments: 'False',
      qrPaymentsImg: '',
      dataLineConfig: {},
      statusEngPayment: 'False',
      bookingItem: [],
      statuscheckCreditCard: 'False',
      statuscheckCoupon: 'False',
      dialogCreditCard: false,
      stripeBtstatus: false,
      checkboxPromtpay: 'True',
      checkboxCreditCard: 'False',
      checkboxCoupon: 'False',
      depositTime: '',
      paymentLink: '',
      depositTimeItem: [
        { text: 'ไม่จำกัดเวลามัดจำ', textEng: 'ไม่จำกัดเวลามัดจำ', value: 'NO' },
        { text: '10 นาที', textEng: '10 Min', value: '10' },
        { text: 'ครึ่งชั่วโมง', textEng: '30 Min', value: '30' },
        { text: '1 ชั่วโมง', textEng: '1 Hour', value: '60' },
        { text: '6 ชั่วโมง', textEng: '6 Hour', value: '360' },
        { text: '1 วัน', textEng: '1 Day', value: '1440' }
      ],
      paymentSelect: null,
      endpointSecret: null,
      apiKey: null,
      dataPaymentGet: [],
      dialogSelectOnlinePayment: false,
      checkboxPromtpayOnline: true
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
    await this.setText()
    await this.getBookingField()
    await this.getBooking()
    await this.checkPayment()
    await this.getDataFlow()
    await this.genQrCode()
    if (this.$route.query.languageSelect) {
      this.languageSelect = parseInt(this.$route.query.languageSelect)
      if (this.languageSelect === 0) {
        this.statusShowPayment = true
      } else {
        if (this.statusEngPayment === 'True') {
          this.statusShowPayment = true
        } else {
          this.statusShowPayment = false
        }
      }
    } else {
      this.statusShowPayment = true
      this.languageSelect = 0
    }
  },
  created () {
    window.addEventListener('resize', this.myEventHandler)
  },
  destroyed () {
    window.removeEventListener('resize', this.myEventHandler)
  },
  methods: {
    async getCheckOmise () {
      await axios.get(this.DNS_IP + '/master_payment/get?shopId=' + this.$route.query.shopId + '&payType=omise').then(response => {
        let rs = response.data
        console.log('rs!!!@#!@#!@#!@#', rs)
        if (rs.status !== false) {
          this.apiKey = rs[0].apiKey
          this.endpointSecret = rs[0].endpointSecret
          if (Array.isArray(rs)) {
            if (rs[0].masBranchID === 'All') {
              console.log('ALL')
              this.dataOmisePayment = rs[0]
              this.paymentSelect = JSON.parse(this.dataOmisePayment.payMentSelect)
              console.log('paymentSelect', this.paymentSelect)
              if (this.paymentSelect.find(item => item === 'credit_card')) {
                let creditCard = this.paymentSelect.filter(item => item === 'credit_card')
                this.paymentSelect = this.paymentSelect.filter(item => item !== 'credit_card')
                this.paymentSelect.unshift(creditCard[0])
              }
            } else {
            // console.log('Branch',typeof rs[0].masBranchID)
            // console.log('this.bookingItem[0].masBranchID', typeof this.bookingItem[0].masBranchID.toString())
              console.log('dddd')
              this.dataOmisePayment = rs.filter(item => item.masBranchID === this.bookingItem[0].masBranchID.toString())
              console.log('this.dataOmisePayment', this.dataOmisePayment)
              this.paymentSelect = JSON.parse(this.dataOmisePayment[0].payMentSelect)
              if (this.paymentSelect.find(item => item === 'credit_card')) {
                let creditCard = this.paymentSelect.filter(item => item === 'credit_card')
                this.paymentSelect = this.paymentSelect.filter(item => item !== 'credit_card')
                this.paymentSelect.unshift(creditCard[0])
              }
            }
          }
        }
      }).catch(function (error) {
        console.log('Error getCheckOmise: ' + error)
      })
    },
    async checkPayment () {
      if (this.showQrPayments === 'True') {
        await axios.get(this.DNS_IP + '/master_payment/get?shopId=' + this.$route.query.shopId).then(response => {
          let rs = response.data
          console.log('checkPayment', rs)
          console.log('!!', this.bookingItem)
          if (rs.status !== false) {
            this.dataPaymentGet = rs
            if (this.bookingItem.length > 0) {
              let checkBranch = rs.filter(el => { return parseInt(el.masBranchID) === this.bookingItem[0].masBranchID && el.payType === 'payment' })
              console.log('checkBranch', checkBranch)
              if (checkBranch.length > 0) {
                this.qrPaymentsImg = checkBranch[0].payTypeImage || ''
              } else {
                let checkBranchAll = rs.filter(el => { return el.masBranchID === 'All' && el.payType === 'payment' })
                if (checkBranchAll.length > 0) {
                  this.qrPaymentsImg = checkBranchAll[0].payTypeImage || ''
                } else {
                  this.qrPaymentsImg = ''
                }
              }
            } else {
              let checkBranchAll = rs.filter(el => { return el.masBranchID === 'All' && el.payType === 'payment' })
              if (checkBranchAll.length > 0) {
                this.qrPaymentsImg = checkBranchAll[0].payTypeImage || ''
              } else {
                this.qrPaymentsImg = ''
              }
            }
          } else {
            this.qrPaymentsImg = ''
            this.dataPaymentGet = []
          }
        })
        console.log('this.qrPaymentsImg', this.qrPaymentsImg)
      } else {
        await axios.get(this.DNS_IP + '/master_payment/get?shopId=' + this.$route.query.shopId).then(response => {
          let rs = response.data
          if (rs.status !== false) {
            this.dataPaymentGet = rs
          } else {
            this.dataPaymentGet = []
          }
        })
      }
    },
    selectPayment (item) {
      if (item === 'checkboxCreditCard') {
        this.checkboxCreditCard = 'True'
        this.checkboxPromtpay = 'False'
        this.checkboxCoupon = 'False'
      } else if (item === 'checkboxCoupon') {
        this.checkboxCoupon = 'True'
        this.checkboxPromtpay = 'False'
        this.checkboxCreditCard = 'False'
      } else {
        if (item === 'stripe') {
          this.checkboxPromtpayOnline = true
        } else if (item === 'omise') {
          this.checkboxPromtpayOnline = false
        } else {
          this.checkboxCreditCard = 'False'
          this.checkboxCoupon = 'False'
          this.checkboxPromtpay = 'True'
        }
      }
    },
    async getBookingField () {
      this.statusEngPayment = 'False'
      await axios
        .get(this.DNS_IP + '/BookingField/get?shopId=' + this.$route.query.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            this.statusEngPayment = rs[0].statusEngPayment || 'False'
          } else {
            this.statusEngPayment = 'False'
          }
        })
    },
    nl2br (str, replaceMode, isXhtml) {
      let text = str || ''
      // console.log(str, replaceMode, isXhtml)
      var breakTag = (isXhtml) ? '<br />' : '<br>'
      var replaceStr = (replaceMode) ? '$1' + breakTag : '$1' + breakTag + '$2'
      // console.log('str', (str + '').replace(/(&nbsp|[^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr))
      return (text + '').replace(/(&nbsp|[^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr)
    },
    myEventHandler (e) {
      // console.log(e)
      this.getSceenSize()
    },
    getSceenSize () {
      this.widthScreen = window.innerWidth
      if (this.widthScreen < 300) {
        this.size = 100
      } else if (this.widthScreen > 300 && this.widthScreen < 500) {
        this.size = 200
      } else if (this.widthScreen > 500) {
        this.size = 400
      }
      // console.log('ssssss', this.widthScreen)
      // console.log('this.size', this.size)
    },
    async genQrCode () {
      if (this.DataFlow.length > 0) {
        this.getCheckOmise()
        if (this.DataFlow[0].promptPayID !== null && this.DataFlow[0].amountDeposit !== null) {
          const generatePayload = await require('promptpay-qr')
          // const mobileNumber = '1129900371744'
          // console.log('dataflow', this.DataFlow)
          const promptpayID = this.DataFlow[0].promptPayID
          let amount = 0
          // const IDCardNumber = '0-0000-00000-00-0'
          if (this.redirectBy === 'BookingAdmin') {
            console.log('this.depipri', this.depositPrice)
            console.log('this.DataFlow[0]', this.DataFlow[0])
            amount = this.depositPrice
          } else {
            if (this.DataFlow[0].menuShowStatus === 'True') {
              console.log('this.DataFlow[0]', this.DataFlow[0])
              if (this.DataFlow[0].depositPercent > 0) {
                const percentage = this.DataFlow[0].depositPercent
                const amount = (percentage / 100) * parseFloat(this.bookingItem[0].menuPrice)
                console.log('amount', amount)
                this.depositPrice = parseFloat(amount) + parseFloat(this.DataFlow[0].amountDeposit || 0)
              } else {
                let menuPrice = ''
                if (this.bookingItem[0].menuPrice === '' || this.bookingItem[0].menuPrice === 0) {
                  menuPrice = 0
                } else {
                  menuPrice = parseFloat(this.bookingItem[0].menuPrice)
                }
                console.log('test2', parseFloat(this.DataFlow[0].amountDeposit || 0))
                console.log('menuPrice', menuPrice)
                this.depositPrice = menuPrice + parseFloat(this.DataFlow[0].amountDeposit || 0)
              }
            } else {
              amount = this.DataFlow[0].amountDeposit
              if (this.DataFlow[0].depositPercent > 0) {
                console.log('!!!!!!!!!!IF')
                const percentage = this.DataFlow[0].depositPercent
                // const amount = (percentage / 100) * parseFloat(this.bookingItem[0].menuPrice)
                if (this.$route.query.Calculate) {
                  this.depositPrice = (percentage / 100) * (parseFloat(this.DataFlow[0].amountDeposit) * parseFloat(this.$route.query.Calculate))
                } else {
                  // this.depositPrice = parseFloat(this.DataFlow[0].amountDeposit)
                  this.depositPrice = (percentage / 100) * parseFloat(this.DataFlow[0].amountDeposit)
                }
              } else {
                console.log('!!!!!!!!!!ELSE')
                if (this.$route.query.Calculate) {
                  this.depositPrice = parseFloat(this.DataFlow[0].amountDeposit) * parseFloat(this.$route.query.Calculate)
                } else {
                  this.depositPrice = parseFloat(this.DataFlow[0].amountDeposit)
                }
              }
            }
            amount = this.depositPrice
          }
          await axios.get(this.DNS_IP + '/master_payment/get?shopId=' + this.$route.query.shopId + '&branchIn=' + this.bookingItem[0].masBranchID + '&payType=stripe')
            .then(async response => {
              if (response.data.status !== false) {
                // console.log('respone!##$@#$!@#', this.bookingItem[0])
                let paymentLinkCheck = this.bookingItem[0].paymentLink || ''
                let paymentLinkStatusCheck = this.bookingItem[0].paymentLinkStatus || ''
                let paymentType = this.bookingItem[0].paymentType || ''
                // console.log('paymentLinkCheck', paymentLinkCheck)
                // console.log('paymentLinkStatusCheck', paymentLinkStatusCheck)
                // console.log('this.statuscheckCreditCard', this.statuscheckCreditCard)
                if (paymentLinkCheck === '' && paymentType === 'stripe' && this.statuscheckCreditCard === 'True') {
                  let dataBooking = {
                    'depositStatus': 'False',
                    'depositPrice': amount
                  }
                  await axios.post(this.DNS_IP + '/Booking/edit/' + this.bookingItem[0].bookNo, dataBooking).then(async (responsess) => {
                    this.stripeBtstatus = true
                    this.value = generatePayload(promptpayID, { amount })
                  })
                } else if (paymentType === 'stripe' && paymentLinkStatusCheck !== '' && this.statuscheckCreditCard === 'True') {
                  if (paymentLinkStatusCheck === 'create') {
                    // this.redirectBy = 'createPayment'
                    this.stripeBtstatus = true
                    window.location.href = paymentLinkCheck
                    // this.paymentLink = paymentLinkCheck
                    // this.value = generatePayload(promptpayID, { amount })
                  } else if (paymentLinkStatusCheck === 'completed') {
                    this.redirectBy = 'completedPayment'
                  }
                } else if (paymentType === '' && this.statuscheckCreditCard === 'True') {
                  let dataBooking = {
                    'depositStatus': 'False',
                    'depositPrice': amount
                  }
                  await axios.post(this.DNS_IP + '/Booking/edit/' + this.bookingItem[0].bookNo, dataBooking).then(async (responsess) => {
                    this.stripeBtstatus = true
                    this.value = generatePayload(promptpayID, { amount })
                  })
                }
              } else {
                this.value = generatePayload(promptpayID, { amount }) // First parameter : mobileNumber || IDCardNumber
              }
            }).catch(function (error) {
              console.log('Error genQrCode: ' + error)
              const generatePayload = require('promptpay-qr')
              const promptpayID = this.DataFlow[0].promptPayID
              let amount = 0
              // const IDCardNumber = '0-0000-00000-00-0'
              if (this.redirectBy === 'BookingAdmin') {
                // console.log('this.depositPrice', this.depositPrice)
                amount = this.depositPrice
              } else {
                if (this.DataFlow[0].menuShowStatus === 'True') {
                  // console.log('this.DataFlow[0]', this.DataFlow[0])
                  if (this.DataFlow[0].depositPercent > 0) {
                    const percentage = this.DataFlow[0].depositPercent
                    const amount = (percentage / 100) * parseFloat(this.bookingItem[0].menuPrice)
                    // console.log('amount', amount)
                    this.depositPrice = parseFloat(amount) + parseFloat(this.DataFlow[0].amountDeposit || 0)
                  } else {
                    this.depositPrice = parseFloat(this.bookingItem[0].menuPrice) + parseFloat(this.DataFlow[0].amountDeposit || 0)
                  }
                } else {
                  amount = this.DataFlow[0].amountDeposit
                  if (this.$route.query.Calculate) {
                    this.depositPrice = parseFloat(this.DataFlow[0].amountDeposit) * parseFloat(this.$route.query.Calculate)
                  } else {
                    this.depositPrice = parseFloat(this.DataFlow[0].amountDeposit)
                  }
                }
                amount = this.depositPrice
              }
              this.value = generatePayload(promptpayID, { amount }) // First parameter : mobileNumber || IDCardNumber
            })
        }
      }
    },
    async goToPaymentLinkOmise () {
      // console.log('ddddddd10000', this.paymentSelect)
      let payVatExcludeOmise = this.dataPaymentGet.filter((ii) => ii.payType === 'omise')[0].payVatExclude
      if (this.dataOmisePayment) {
        this.$OmiseCard.configure({
          publicKey: this.apiKey
        })
        // console.log('ddddddd10000111', this.paymentSelect)
        // let a = ['credit_card']
        this.$OmiseCard.open({
          publicKey: this.apiKey,
          frameLabel: this.shop[0].shopName,
          amount: payVatExcludeOmise > 0 ? (((payVatExcludeOmise / 100) * this.depositPrice) + this.depositPrice) * 100 : this.depositPrice * 100,
          currency: 'thb',
          otherPaymentMethods: this.paymentSelect,
          onCreateTokenSuccess: (nonce) => {
            console.log(nonce)
            this.handleOmisepayment(nonce)
          }
        })
      } else {
        await this.pushMsgLineNotifyGroup(this.bookNo)
        this.dialogCreditCard = false
        this.statuscheckCreditCard = 'False'
        this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=checkCreditCard&flowId=' + this.$route.query.flowId + '&bookNo=' + this.bookNo)
        window.location.reload()
      }
    },
    async goToPaymentLink () {
      // const generatePayload = await require('promptpay-qr')
      // let amount = this.amountQrcode
      let dataPayment = {
        'shopId': this.$route.query.shopId,
        'bookNo': this.bookingItem[0].bookNo
      }
      await axios
        .post(this.DNS_IP + '/stripe/createProduct', dataPayment)
        .then(async responses => {
          if (responses.data.status !== false) {
            this.paymentLink = responses.data.paymentLink
            // window.location.href = responses.data.paymentLink
          } else {
            this.paymentLink = ''
          }
        }).catch(function (error) {
          console.log('Error createProduct: ' + error)
        })
      if (this.paymentLink !== '') {
        window.location.href = this.paymentLink
      }
    },
    async checkMember (bookNo) {
      await axios.get(this.DNS_IP + '/booking_view/get?bookNo=' + bookNo)
        .then(async (response) => {
          let rs = response.data
          console.log('RSTESTTTTTT', response)
          if (rs[0].lineUserId === null || rs[0].lineUserId === '') {
            this.checkMemberId = 'memberNo'
          } else {
            this.checkMemberId = 'memberTrue'
          }
          console.log('this.checkMemberId', this.checkMemberId)
        }).catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
    },
    async getBotinfo () {
      if (this.$route.query.shopId) {
        const url = `${this.DNS_IP}/line/getOa`
        // const url = 'http://localhost:81/Api/vgroupl_api/v1/Zoom/Login/getData?'
        const config = {
          headers: {
            'botId': this.$route.query.shopId
          }
        }
        console.log('redircetBy', this.$route.query.redirectBy)
        if (this.$route.query.redirectBy === 'BookingForm' || this.$route.query.redirectBy === 'PaymentUpload') {
          await this.checkMember(this.$route.query.bookNo)
        } else {
          this.checkMemberId = 'memberTrue'
        }
        await axios.get(url, config).then((response) => {
          let rs = response.data
          console.log('rs1111', rs)
          if (this.checkMemberId === 'memberNo') {
            // window.location.href = 'https://line.me/R/oaMessage/' + rs.basicId + `?เปิดรับการแจ้งเตือน ` + this.profile.userId
            window.location.href = 'https://line.me/R/oaMessage/' + rs.basicId + `/?เปิดรับการแจ้งเตือน`
            // liff.openliff.openWindow({
            //   url: 'https://line.me/R/oaMessage/' + rs.basicId + `?เปิดรับการแจ้งเตือน`,
            //   external: true
            // })
          } else {
            window.location.href = 'line://ti/p/' + rs.basicId
          }
        })
      }
    },
    setText () {
      let check = this.redirectBy
      if (check === 'rating') {
        this.redirectBy = check
        this.textByredirectBy = `แบบประเมินความพึงพอใจของผู้ใช้บริการที่มีต่อ ${this.shop[0].shopName} \n
        เพื่อเป็นแนวทางในการพัฒนาและปรับปรุงการให้บริการให้มีประสิทธิภาพและสอดคล้องกับความต้องการของผู้ใช้บริการต่อไป
         \n หมายเหตุ
         \n - สรุปการให้คะแนนความพึงพอใจจะสามารถดูได้เฉพาะ   ผู้ดูแลระบบ ${this.shop[0].shopName} เท่านั้น`
      } else if (check === 'BookingForm') {
        this.redirectBy = check
      } else if (check === 'BookingAdmin') {
        this.redirectBy = check
      } else if (check === 'stampStepNoStep') {
        this.redirectBy = check
        this.textByredirectBy = `ไม่มีขั้นตอนที่ท่านเลือก \n กรุณาติดต่อเจ้าหน้าที่`
      } else if (check === 'stampStepDuplicateStep') {
        this.redirectBy = check
        this.textByredirectBy = `ท่านอยู่ขั้นตอนนี้อยู่แล้ว \n กรุณาติดต่อเจ้าหน้าที่`
      } else if (check === 'stampStepNoService') {
        this.redirectBy = check
        this.textByredirectBy = `ไม่มีนัดหมายเข้ารับบริการนี้ \n กรุณาติดต่อเจ้าหน้าที่`
      } else if (check === 'stampStep') {
        this.redirectBy = check
        this.textByredirectBy = `ทำรายการเสร็จเรียบร้อย`
      } else if (check === 'ratingDuplicate') {
        this.redirectBy = check
        this.textByredirectBy = `แบบประเมินความพึงพอใจของผู้ใช้บริการที่มีต่อ ${this.shop[0].shopName} \n
        เพื่อเป็นแนวทางในการพัฒนาและปรับปรุงการให้บริการให้มีประสิทธิภาพและสอดคล้องกับความต้องการของผู้ใช้บริการต่อไป
         \n หมายเหตุ
         \n - หากลูกค้าให้คะแนนความพึงพอใจไปแล้ว ระบบจะยึดการประเมินครั้งแรกเท่านั้น`
      } else if (check === 'ratingNoData') {
        this.redirectBy = check
        this.textByredirectBy = `ไม่พบข้อมูลของท่าน \n กรุณาทำรายการใหม่อีกครั้ง`
      } else if (check === 'ratingNoSave') {
        this.redirectBy = check
        this.textByredirectBy = `บันทึกไม่สำเร็จ \n กรุณาทำรายการใหม่อีกครั้ง`
      } else if (check === 'stampFirstStepErrorNoBook') {
        this.redirectBy = check
        console.log('this.shop[0].shopName', this.shop[0].shopName)
        this.textByredirectBy = `ไม่พบข้อมูลของท่าน \n\n หากท่านยังไม่ได้ทำการนัดหมาย \n กรุณาติดต่อเจ้าหน้าที่ Admin
         \n เพื่อทำการนัดมายจองคิว ได้ 2 ช่องทางนี้
         \n เคาน์เตอร์ประชาสัมพันธ์ \n
         Tel : ${this.shop[0].contactTel} \n
         (กรณีไม่ได้นัดหมาย ${this.shop[0].shopName} จะไม่สามารถใช้บริการได้)`
      } else if (check === 'stampFirstStepErrorNoDate') {
        this.redirectBy = check
        this.textByredirectBy = `ไม่พบข้อมูลของท่าน \n กรุณาตรวจสอบข้อมูลการนัดหมายของท่าน
         \n หรือท่านไม่อยู่ในรายชื่อที่สามารถเข้ารับบริการในวันนี้
         \n เคาน์เตอร์ประชาสัมพันธ์ `
      } else if (check === 'stampFirstStep') {
        this.redirectBy = check
        this.textByredirectBy = `ท่านสามารถเช็คลำดับคิวของท่านได้ที่ ปุ่มด้านล่าง`
      } else if (check === 'PaymentUpload') {
        this.redirectBy = check
        this.textByredirectBy = `ไม่มีนัดหมายเข้ารับบริการนี้ \n กรุณาติดต่อเจ้าหน้าที่`
      } else {
        this.redirectBy = 'N'
      }
      console.log('redirectBy', check)
    },
    async getShop () {
      if (this.$route.query.redirectBy) {
        let check = this.$route.query.redirectBy
        if (check === 'rating') {
          this.redirectBy = check
        } else if (check === 'BookingForm') {
          this.redirectBy = check
        } else if (check === 'BookingAdmin') {
          this.redirectBy = check
        } else if (check === 'stampStepNoStep') {
          this.redirectBy = check
        } else if (check === 'stampStepDuplicateStep') {
          this.redirectBy = check
        } else if (check === 'stampStepNoService') {
          this.redirectBy = check
        } else if (check === 'stampStep') {
          this.redirectBy = check
        } else if (check === 'ratingDuplicate') {
          this.redirectBy = check
        } else if (check === 'ratingNoData') {
          this.redirectBy = check
        } else if (check === 'ratingNoSave') {
          this.redirectBy = check
        } else if (check === 'stampFirstStepErrorNoBook') {
          this.redirectBy = check
        } else if (check === 'stampFirstStepErrorNoDate') {
          this.redirectBy = check
        } else if (check === 'stampFirstStep') {
          this.redirectBy = check
        } else if (check === 'PaymentUpload') {
          this.redirectBy = check
        } else if (check === 'omisePayment') {
          this.redirectBy = check
        } else {
          this.redirectBy = 'N'
        }
        console.log('redirectBy', check)
      } else {
        this.redirectBy = null
      }
      if (this.$route.query.shopId) {
        await axios.get(this.DNS_IP + '/sys_shop/get?shopId=' + this.$route.query.shopId).then(async response => {
          let rs = response.data
          console.log('rs', rs)
          if (rs.length > 0) {
            this.shop = rs
            console.log('this.shop', this.shop)
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
                this.LoGo = require('@/assets/Thank.svg')
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
            if (rs[0].showQrPayments === null || rs[0].showQrPayments === '') {
              this.showQrPayments = 'False'
            } else {
              this.showQrPayments = rs[0].showQrPayments
            }
            this.bookingthankText = rs[0].bookingthankText || ''
            this.bookingthankTextEn = rs[0].bookingthankTextEn || ''
            console.log('this.bookingthankText', this.bookingthankText)
            console.log('this.bookingthankTextEn', this.bookingthankTextEn)
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
      console.log('this.shop', this.shop)
      console.log('this.showQrPayments', this.showQrPayments)
    },
    async saveUserId () {
      await this.checkLiffLogin(this.dataLineConfig)
      let userId = {
        'userId': this.profile.userId
      }
      await axios.post(this.DNS_IP + '/Booking/edit/' + this.bookNo, userId).then(async response => {
        console.log('response', response)
        if (this.dataLineConfig.checkConfig !== false) {
          this.getDataChkMember()
        }
      })
    },
    async getBooking () {
      console.log('getBooking', this.redirectBy)
      if (this.redirectBy === 'BookingAdmin') {
        await axios.get(this.DNS_IP + '/Booking/get?shopId=' + this.shopId + '&bookNo=' + this.bookNo).then(response => {
          let rs = response.data
          if (rs.length > 0) {
            console.log('testIF', rs.data)
            this.bookingItem = rs
            if (rs[0].depositPrice === null || rs[0].depositPrice === '' || rs[0].depositPrice === '0') {
              console.log('testIF!!!!')
              this.redirectBy = 'N'
              if (rs[0].userId === 'user-skip' || rs[0].userId === null || rs[0].userId === '') {
                console.log('getBookingIF')
                this.saveUserId()
                this.pushMsgLineNotifyGroup(this.bookNo)
              }
            } else {
              this.depositPrice = parseFloat(rs[0].depositPrice)
              if (rs[0].userId === 'user-skip' || rs[0].userId === null || rs[0].userId === '') {
                console.log('getBookingIF')
                this.saveUserId()
              }
            }
          } else {
          }
        })
      } else {
        await axios.get(this.DNS_IP + '/Booking/get?shopId=' + this.shopId + '&bookNo=' + this.bookNo).then(async response => {
          let rs = response.data
          console.log('!@!@!@!@!@!@!@!@!', rs)
          if (rs.length > 0) {
            this.bookingItem = rs
            if (this.$route.query.redirectBy === 'omisePayment') {
              if (this.bookingItem[0].paymentLinkStatus === 'successful') {
                this.$swal({
                  title: 'success',
                  type: 'success',
                  text: 'ชำระเงินสำเร็จขอบคุณที่ใช้บริการ',
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#b3b1ab',
                  confirmButtonText: 'ตกลง'
                })
              } else if (this.bookingItem[0].paymentLinkStatus === 'pending') {
                this.$swal({
                  title: 'รอนำเนินการ',
                  type: 'warning',
                  text: 'กำลังตรวจการชำระเงิน',
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#b3b1ab',
                  confirmButtonText: 'ตกลง'
                })
              } else {
                this.$swal({
                  title: 'ผิดพลาด',
                  type: 'error',
                  text: 'มีบางอย่างผิดพลาดในการชำระเงิน ต้องการย้อนกลับไปชำระเงินหรือไม่ ?',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#b3b1ab',
                  confirmButtonText: 'ตกลง'
                }).then(async result => {
                  // alert('BookingForm')
                  this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=BookingForm&flowId=' + this.$route.query.flowId + '&bookNo=' + this.bookNo)
                  window.location.reload()
                    .catch(error => {
                      console.log('error function addData : ', error)
                    })
                })
              }
            }
          }
        })
      }
    },
    async checkLiffLogin (dataLineConfig) {
      console.log('dataLineConfig', dataLineConfig)
      await this.$liff
        .init({
          liffId: dataLineConfig.liffMainID
        })
        .then(async () => {
          if (process.env.NODE_ENV === 'development') {
            this.getProfile_dev()
          } else {
            if (!this.$liff.isLoggedIn()) {
              this.$liff.login({ redirectUri: window.location.href })
            } else {
              await this.getProfile()
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
      this.profile = this.$profile_dev
      console.log('dev', this.profile)
    },
    async getDataFlow () {
      this.DataFlow = []
      await axios.get(this.DNS_IP + '/flow/get?shopId=' + this.shopId + '&flowId=' + this.flowId).then(response => {
        let rs = response.data
        this.depositTime = rs[0].depositTime
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            this.DataFlow.push(d)
          }
          if (this.redirectBy === 'BookingAdmin') {
            // console.log('checkField', rs[0].checkCreditCard, rs[0].checkCoupon)
            // console.log('this.bookingItem', this.bookingItem)
            if (rs[0].checkCreditCard === 'True' || rs[0].checkCoupon === 'True') { // รอกอท บอกชื่อ ฟิล
              if (this.bookingItem[0].depositPrice === null || this.bookingItem[0].depositPrice === '' || this.bookingItem[0].depositPrice === '0') {
                this.statuscheckCreditCard = 'False'
                this.statuscheckCoupon = 'False'
                this.dialogCreditCard = false
              } else {
                this.statuscheckCreditCard = rs[0].checkCreditCard || 'False'
                this.statuscheckCoupon = rs[0].checkCoupon || 'False'
                this.dialogCreditCard = true
              }
            } else {
              this.statuscheckCreditCard = 'False'
              this.statuscheckCoupon = 'False'
              this.dialogCreditCard = false
            }
          }
          if (this.redirectBy === 'BookingForm') {
            // console.log('checkField', rs[0].checkCreditCard, rs[0].checkCoupon)
            console.log('this.bookingItem', this.bookingItem[0].depositPrice)
            if (rs[0].checkCreditCard === 'True' || rs[0].checkCoupon === 'True') { // รอกอท บอกชื่อ ฟิล
              this.statuscheckCreditCard = rs[0].checkCreditCard || 'False'
              this.statuscheckCoupon = rs[0].checkCoupon || 'False'
              let checkDepositPrice = parseFloat(this.bookingItem[0].depositPrice || 0)
              if (checkDepositPrice > 0 && rs[0].checkCreditCard === 'True') {
                this.dialogCreditCard = true
              }
              if (rs[0].checkCoupon === 'True') {
                this.dialogCreditCard = true
              }
            } else {
              this.statuscheckCreditCard = 'False'
              this.statuscheckCoupon = 'False'
              this.dialogCreditCard = false
            }
          }
        } else {
          this.DataFlow = []
        }
        console.log('this.DataFlow', this.DataFlow)
        console.log('this.depositTime', this.depositTime)
      })
    },
    async pushMsgLineNotifyGroup (bookNo) {
      await axios
        .post(this.DNS_IP + '/Booking/pushMsgLineNotifyGroup/' + bookNo)
        .then(response => {
        })
    },
    gotocheckCreditCardOnline () {
      if (this.checkboxPromtpayOnline === true) {
        this.goToPaymentLink()
      } else {
        this.goToPaymentLinkOmise()
      }
    },
    async gotocheckCreditCard () {
      // console.log('this.DataFlow.flowName', this.bookingItem[0].depositStatus)
      if (this.checkboxCreditCard === 'True') {
        let paymentLinkStatusCheck = this.bookingItem[0].paymentLinkStatus || ''
        let paymentLinkCheck = this.bookingItem[0].paymentLink || ''
        // if (paymentLinkCheck === '') {
        let checkOmise = this.dataPaymentGet.filter(el => { return el.payType === 'omise' })
        let checkStripe = this.dataPaymentGet.filter(el => { return el.payType === 'stripe' })
        console.log('checkStripe', checkStripe)
        console.log('checkOmise', checkOmise)
        console.log('paymentLinkStatusCheck', paymentLinkStatusCheck)
        if (checkOmise.length > 0 && checkStripe.length > 0) {
          this.dialogSelectOnlinePayment = true
          this.dialogCreditCard = false
        } else if (checkOmise.length === 0 && checkStripe.length > 0) {
          if (paymentLinkStatusCheck === 'create') {
            // this.redirectBy = 'createPayment'
            this.stripeBtstatus = true
            window.location.href = paymentLinkCheck
            // this.paymentLink = paymentLinkCheck
            // this.value = generatePayload(promptpayID, { amount })
          } else if (paymentLinkStatusCheck === 'completed') {
            this.redirectBy = 'completedPayment'
            this.dialogSelectOnlinePayment = false
            this.dialogCreditCard = false
          } else {
            this.goToPaymentLink()
          }
        } else if (checkOmise.length > 0 && checkStripe.length === 0) {
          if (paymentLinkStatusCheck === 'pending' || paymentLinkStatusCheck === '' || paymentLinkStatusCheck === 'False') {
            console.log('paymentLinkStatusCheck222222', paymentLinkStatusCheck)
            this.goToPaymentLinkOmise()
          } else {
            this.redirectBy = 'completedPayment'
          }
        }
        // } else {
        //   this.$swal({
        //     title: 'success',
        //     type: 'success',
        //     text: 'นัดหมายนี้ชำระเงินแล้ว',
        //     confirmButtonColor: '#3085d6',
        //     cancelButtonColor: '#b3b1ab',
        //     confirmButtonText: 'ตกลง'
        //   })
        // }
      } else {
        if (this.checkboxCoupon === 'True') {
          this.$router.push('/PaymentUpload?bookNo=' + this.bookNo + '&shopId=' + this.shopId + '&languageSelect=' + this.languageSelect + '&flowId=' + this.$route.query.flowId + '&depositPrice=' + this.depositPrice + '&coupon=true')
        } else {
          this.dialogCreditCard = false
        }
      }
    },
    gotoPaymentUpload () {
      this.$router.push('/PaymentUpload?bookNo=' + this.bookNo + '&shopId=' + this.shopId + '&languageSelect=' + this.languageSelect + '&flowId=' + this.$route.query.flowId + '&depositPrice=' + this.depositPrice)
    },
    async getDataChkMember () {
      if (this.profile.userId) {
        await axios.get(this.DNS_IP + '/member/get?shopId=' + this.$route.query.shopId + '&liffUserId=' + this.profile.userId).then(async result => {
          var lineUserIds = ''
          var liffUserIds = ''
          if (result.data.status === false) {
            await this.onSubmit()
          } else {
            lineUserIds = result.data[0].lineUserId || ''
            liffUserIds = result.data[0].liffUserId || ''
            if (lineUserIds === '' && liffUserIds !== '') {
              await this.onUpdate(result.data[0].memberId)
            }
          }
        })
      }
      // } else {
      //   this.$swal(
      //     'ผิดหลาด!',
      //     'กรุณาทำรายการใหม่',
      //     'error'
      //   )
      // }
    },
    async handleOmisepayment (token) {
      console.log('this.dataPaymentGet+++', this.dataPaymentGet)
      let payVatExcludeOmise = this.dataPaymentGet.filter((ii) => ii.payType === 'omise')[0].payVatExclude
      console.log('tokn_', token)
      if (token.startsWith('tokn_')) {
        console.log('credit card')
        let dt = {
          'secretKey': this.endpointSecret,
          'token': token,
          'productName': this.DataFlow[0].flowName,
          'amount': this.depositPrice,
          'payVatExclude': payVatExcludeOmise > 0 ? (payVatExcludeOmise / 100) * this.depositPrice : null,
          'amountTotal': payVatExcludeOmise > 0 ? ((payVatExcludeOmise / 100) * this.depositPrice) + this.depositPrice : this.depositPrice,
          'bookNo': this.bookNo,
          'shopId': this.DataFlow[0].shopId,
          'flowId': this.flowId
        }
        console.log('dt1', dt)
        await axios.post(this.DNS_IP + '/omise/create_charge_credit', dt).then(res => {
          console.log('getDatafilterMemberSet1____', res.data)
          this.statuscheckCreditCard = 'False'
          window.location.href = res.data.authorizeUri
        }).catch(err => {
          console.log(err)
        })
      } else {
        console.log('ไม่ใช่ credit card')
        let dt = {
          'secretKey': this.endpointSecret,
          'apiKey': this.apiKey,
          'token': token,
          'productName': this.DataFlow[0].flowName,
          'amount': this.depositPrice,
          'payVatExclude': payVatExcludeOmise > 0 ? (payVatExcludeOmise / 100) * this.depositPrice : null,
          'amountTotal': payVatExcludeOmise > 0 ? ((payVatExcludeOmise / 100) * this.depositPrice) + this.depositPrice : this.depositPrice,
          'bookNo': this.bookNo,
          'shopId': this.DataFlow[0].shopId,
          'flowId': this.flowId
        }
        console.log('dt2', dt)
        await axios.post(this.DNS_IP + '/omise/create_charge_not_credit_card', dt).then(res => {
          console.log('getDatafilterMemberSet1', res.data)
          window.location.href = res.data.authorizeUri
        }).catch(err => {
          console.log(err)
        })
      }
    },
    async onSubmit () {
      // var idMember = 'Link_' + Date.now()
      var idMember = moment().valueOf()
      const params = {
        name: this.profile.displayName,
        picture: this.profile.pictureUrl,
        liffUserId: this.profile.userId,
        lineUserId: this.profile.userId,
        shopId: this.$route.query.shopId,
        memberId: idMember,
        CREATE_USER: this.profile.userId,
        LAST_USER: this.profile.userId
      }
      const result = await this.callBeTaskAPIActivity('post', `/member/add`, params)
      console.log('result', result.status)
    },
    async onUpdate (idMember) {
      // "https://api-belinked.betaskthai.com/member/editWebhook/" + request.body.events[0].message.text.split(" ")[2]
      // window.location.replace(`https://access.line.me/dialog/bot/accountLink?linkToken=${this.$route.query.likeToken}&nonce=${idMember}-${this.profile.userId}`)
      // window.location.href = `https://access.line.me/dialog/bot/accountLink?linkToken=${this.$route.query.likeToken}&nonce=${idMember}-${this.profile.userId}`
      const params = {
        lineUserId: this.profile.userId,
        LAST_USER: this.profile.userId
      }
      const result = await this.callBeTaskAPIActivity('post', '/member/editWebhook/' + idMember, params)
      console.log('result', result.status)
    }
  }
}
</script>

<style scoped>
.button {
  width: 45%;
  color: #fff;
  font-weight: 150;
  letter-spacing: 1px;
  margin: 6px 3px;
  padding: 10px 28px;
  border-radius: 25px !important;
  background-color: #0047a5;
}
.main{
  background-color: #FFFFFF;
  height: 100vh;
}
.content{
  overflow:auto;
  white-space: normal;
}
.a{
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  max-height: 350px;
}
.CDcontend{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 7%;
  padding-right: 7%;
  width: 100%;
  border-radius: 20px 20px 20px 20px;
  height: 95px;
}
</style>
