<template>
    <v-main>
      <v-app-bar app color="#043873" dark flat> //โจ๋
    <v-container class="mb-auto">
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="4">
          <v-toolbar-title class="mb-0">
            <img src="@/assets/logowhite.png" alt="Betask Consulting" style="height: 40px;">
          </v-toolbar-title>
        </v-col>
        <v-col cols="12" md="8" class="d-flex justify-center justify-md-end">
          <div class="d-flex align-center">
            <v-btn text class="fw-bold py-1 px-0 mx-2" to="/" exact>หน้าหลัก</v-btn>
            <v-btn text class="fw-bold py-1 px-0 mx-2" to="">เกี่ยวกับเรา</v-btn>
            <v-btn text class="fw-bold py-1 px-0 mx-2" to="">บริการของเรา</v-btn>
            <v-btn text class="fw-bold py-1 px-0 mx-2" to="">บทความ</v-btn>
            <v-btn text class="fw-bold py-1 px-0 mx-2" to="">ติดต่อเรา</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6">
            <h1 class="text-center white--text">ควย Home</h1>
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

</style>
