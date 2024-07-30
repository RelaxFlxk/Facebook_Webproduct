<template>
  <div>
    <v-main>
      <h1 style="text-align: center;">ขอบคุณที่ใช้บริการเรา</h1>
      <h1 style="text-align: center;">กรุณา Login</h1>
    </v-main>
  </div>
</template>
<script>
// import adminLeftMenu from '../SidebarManageShop.vue' // เมนู
import axios from 'axios' // api
export default {
  components: {
    // 'left-menu-admin': adminLeftMenu
  },
  data () {
    return {
      validAdd: true,
      show: '',
      nameOa: '',
      showConfirm: '',
      returnLink: '/system/ManageShop',
      type: 'password',
      typeConfirm: 'password',
      form: {
        logo: '',
        name: '',
        category: '',
        userName: '',
        password: '',
        productName: '',
        // confirmPassword: '',
        shopId: '',
        CREATE_USER: '',
        LAST_USER: ''
      },
      rules: {
        counterTel: value => value.length <= 10 || 'Max 10 characters',
        required: value => !!value || 'กรุณากรอก.',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  // beforeCreate () {
  //   if (!this.$session.exists()) {
  //     this.$router.push('/Core/Login')
  //   }
  // },
  async mounted () {
    // location.replace('https://betask-linked-admin.web.app')
    if (this.$route.query.state === 'register' && this.$route.query.productName.substring(0, 4) === 'link') {
      await this.getBotLineIdLink()
      // await this.getOaLink()
    } else {
      this.$swal('ผิดพลาด', 'กรุณาติดต่อเจ้าหน้าที่', 'error')
    }
  },
  methods: {
    async getBotLineIdLink () {
      let dt = {
        code: this.$route.query.code,
        redirect_uri: 'https://betask-linked.web.app/ManageShop?productName=' + this.$route.query.productName
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/line/linkYourBot",
          dt
        )
        .then(async (response) => {
          console.log('getBotLineId', response.data)
          this.form.shopId = response.data.bot_id
          await axios
            .get(
              // eslint-disable-next-line quotes
              this.DNS_IP + "/sys_shop/get?shopId=" + response.data.bot_id
            )
            .then(async (responses) => {
              if (responses.data.status === false) {
                await this.getOaLink(response.data.bot_id)
                location.replace('https://betask-linked-admin.web.app')
              } else {
                if (response.data.bot_id !== this.$route.query.productName.substring(4)) {
                  // this.removeShopDup()
                }
                this.$swal('ผิดพลาด', 'Line Oa ที่ท่านเลือกอยู่ใน ระบบแล้ว กรุณา Log In และเพิ่ม User ในระบบ (refId ' + response.data.bot_id + ')', 'error')
              }
            })
            .catch((error) => {
              console.log(error)
            })
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          console.log(error)
          // this.$router.push('/system/Errorpage?returnLink=' + this.returnLink)
          this.dataReady = true
        })
    },
    async removeShopDup () {
      var dt = {
        shopIdOld: this.$route.query.productName.substring(4)
      }
      await axios
        .post(
          this.DNS_IP + '/register/RemoveDupShop', dt
        )
        .then(async (response) => {
        })
    },
    async getOaLink (shopIdDt) {
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/line/getOa", {
            headers: {
              'botid': shopIdDt
            }
          }
        )
        .then(async (response) => {
          console.log('getOa', response.data)
          this.nameOa = response.data.displayName
          if (response.data.pictureUrl) {
            this.form.logo = response.data.pictureUrl
          } else {
            this.form.logo = ''
          }
          var dt = {
            shopId: shopIdDt,
            shopImge: this.form.logo,
            shopIdOld: this.$route.query.productName.substring(4)
          }
          await axios
            .post(
              this.DNS_IP + '/register/updateShopId', dt
            )
            .then(async (response) => {
            })
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          console.log(error)
          // this.$router.push('/system/Errorpage?returnLink=' + this.returnLink)
          // this.dataReady = true
        })
    }
  }
}
</script>
