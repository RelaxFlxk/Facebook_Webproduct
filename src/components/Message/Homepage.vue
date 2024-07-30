<template>
 <div>
  <div class="container">
    <div class="row-setting">
      <div align="center" @click="logOut()">
        <div class=" center magin-card card-social">
          <div class="bold-opacity">LOG OUT</div>
        </div>
      </div>
    </div>
    <div class="row-card-profile">
      <!-- {{this.userInfoGoogle}} -->
    </div>
  </div>
 </div>
</template>
<script>
import Vue from 'vue'
import VueSession from 'vue-session'
import axios from 'axios'
import firebase from 'firebase'
import 'firebase/auth'
Vue.use(VueSession)

export default {
  components: {
  },
  data () {
    return {
      user: null,
      redirect: '',
      shopId: '',
      source: '',
      userInfoGoogle: '',
      userInfoFacebook: ''
    }
  },
  async mounted () {
    const queryString = decodeURIComponent(window.location.search)
    const params = new URLSearchParams(queryString)
    this.redirect = params.get('redirect')
    this.shopId = params.get('shopId')
    this.source = params.get('source')

    await this.getMember()
  },
  methods: {
    logOut () {
      firebase
        .auth()
        .signOut()
        .then(() => {
          localStorage.removeItem('userInfoGoogle')
          localStorage.removeItem('providerGoogle')
          localStorage.removeItem('userInfoFacebook')
          localStorage.removeItem('providerFacebook')
          // alert('Successfully signed out.')
          this.$router.push(`/MessageLogin?shopId=${this.shopId}&&source=${this.source}`)
        })
    },
    async getMember () {
      this.userInfoGoogle = JSON.parse(sessionStorage.getItem('userInfoGoogle'))
      this.userInfoFacebook = JSON.parse(sessionStorage.getItem('userInfoFacebook'))
      // this.userInfoFacebook =
      // console.log('providerData', this.userInfoFacebook.providerData[0].uid)
      const userId = this.userInfoGoogle !== null
        ? this.userInfoGoogle.providerData[0].uid
        : this.userInfoFacebook.providerData[0].uid
      await axios
        .get(
          this.DNS_IP + `/getMembers/${userId}`
          // 'https://378f-2001-fb1-37-a07d-84ed-6040-ada4-fa3.ngrok-free.app/getMembers/108168629994454963514'
        )
        .then(async (response) => {
          console.log('this.redirect', this.redirect)
          console.log('response', response)
          if (response.data.message !== 'No data found') {
            console.log('responseIf', response.data)
            if (this.redirect === 'appoitment') {
              this.$router.push(`/BookingFormNoLine?shopId=${this.shopId}&source=${this.source}`)
            }
          } else {
            console.log('responseelse', this.userInfoGoogle)
            this.$router.push(`/`)
          }
        }).catch(() => {})
    }
  }
}
</script>
<style scoped>
.magin-card {
  margin: 5px;
  width: auto;
  padding: 10px;
}
.card-social {
  padding: 15px !important;
  border: solid #91919199;
  border-radius: 5px;
  /* min-width: 330px !important; */
  margin: 10px 35px !important;
  max-width: 335px;
}

.card-social:hover {
  filter: opacity(75%);
  cursor: pointer;
}
.color-black {
  background-color: #000000c9;
}
</style>
