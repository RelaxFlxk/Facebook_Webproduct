<template>
  <main>
  </main>
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
