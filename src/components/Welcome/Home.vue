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
