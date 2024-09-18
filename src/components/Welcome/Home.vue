<template>
  <v-main>
    <v-app-bar app color="#043873" dark flat>
      <v-container class="mb-auto">
        <v-row align="center" justify="space-between">
          <v-col cols="12" md="3" class="text-center text-md-left">
            <v-toolbar-title class="mb-0 d-flex justify-center justify-md-start">
              <img src="@/assets/logowhite.png" alt="Betask Consulting" style="height: 40px;">
            </v-toolbar-title>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <div class="d-flex align-center flex-wrap justify-center">
              <v-btn text class="fw-bold py-1 px-2 mx-2 my-1 custom-btn" to="/" exact>หน้าหลัก</v-btn>
              <v-btn text class="fw-bold py-1 px-2 mx-2 my-1 custom-btn" to="/about">เกี่ยวกับเรา</v-btn>
              <v-btn text class="fw-bold py-1 px-2 mx-2 my-1 custom-btn" to="/services">บริการของเรา</v-btn>
              <v-btn text class="fw-bold py-1 px-2 mx-2 my-1 custom-btn" to="/blog">บทความ</v-btn>
              <v-btn text class="fw-bold py-1 px-2 mx-2 my-1 custom-btn" to="/contact">ติดต่อเรา</v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="3" class="d-flex justify-end">
            <v-btn text class="fw-bold py-1 px-2 mx-2 my-1 custom-btn" to="/login">เข้าสู่ระบบ</v-btn>
            <v-btn text class="fw-bold py-1 px-2 mx-2 my-1 custom-btn" to="/register">ลงทะเบียน</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-container fluid fill-height class="main-container">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6">
          <h1 class="text-center white--text">This is Home.vue Components</h1>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
// import axios from 'axios' // api
export default {
  data () {
    return {
    }
  },
  async mounted () {
    let checkShopId = await this.getParamsShopId()
    let dataLineConfig = await this.getDataLineConfig(checkShopId)
    this.$liff.init({
      liffId: dataLineConfig.liffMainID
    }).then(async () => {
      if (!this.$liff.isLoggedIn()) {
        this.$liff.login()
      } else {
        if (this.$route.query['liff.state']) {
          this.$router.push(this.$route.query['liff.state'])
        } else {
          this.$swal('ผิดพลาด', 'กรุณาตรวจสอบลิ้งค์ของท่าน', 'error')
        }
      }
    })
  },
  methods: {
    getParamsShopId () {
      let checkShopId = ''
      if (this.$route.query.shopId) {
        checkShopId = this.$route.query.shopId
      } else {
        let queryString = this.$route.query['liff.state']
        queryString = queryString.split('?')
        if (queryString.length > 0) {
          queryString = queryString[1]
          const params = new URLSearchParams(queryString)
          checkShopId = params.get('shopId')
        }
      }
      return checkShopId
    }
  }
}
</script>

<style scoped>
.custom-btn {
  transition: all 0.3s ease;
}

.custom-btn:hover {
  background-color: white !important;
  color: #04235B !important;
}

.custom-btn::before,
.custom-btn::after {
  display: none !important;
}

.custom-btn.v-btn--active {
  background-color: white !important;
  color: #04235B !important;
}

@media (max-width: 959px) {
  .v-toolbar__content {
    flex-direction: column;
    height: auto !important;
    padding-top: 8px;
    padding-bottom: 8px;
  }
}

.main-container {
  padding-top: 100px; /* Adjust this value as needed to prevent overlap */
}
</style>
