<template>
    <v-main>
      <v-container>
        <v-form>
            <h5 class="padding-title bold filter">
                Choose Message Patform Notify
            </h5>
            <div class="row">
                <div class="col-md-4 col-sm-12 " @click="lineClick">
                    <v-card class="center magin-card">
                        <img src="../../assets/PhotoMessage/line-app-logo-line-app-logo-transparent-line-app-icon-transparent-free-free-png.png" class="img-icon">
                        <p class="col-md-4 col-sm-12 bold-opacity">LINE NOTIFY</p>
                    </v-card>
                </div>
                <div class="col-md-4 col-sm-12 "  @click="facebookClick">
                    <v-card class=" center magin-card">
                        <img src="../../assets/PhotoMessage/facebook-icon-512x512-seb542ju.png" class="img-icon">
                        <p class="col-md-4 col-sm-12 bold-opacity">FACEBOOK NOTIFY</p>
                    </v-card>
                </div>
                <div class="col-md-4 col-sm-12 "  @click="emailClick">
                    <v-card class="center magin-card">
                        <img src="../../assets/PhotoMessage/pngwingEmail.png" class="img-icon">
                        <p class="col-md-4 col-sm-12 bold-opacity">EMAIL NOTIFY</p>
                    </v-card>
                </div>
                <div class="col-md-4 col-sm-12 " @click="smsClick">
                    <v-card class="center magin-card">
                        <img src="../../assets/PhotoMessage/pngwing.png" class="img-icon">
                        <p class="col-md-4 col-sm-12 bold-opacity">SMS NOTIFY</p>
                    </v-card>
                </div>
            </div>
        </v-form>
      </v-container>
    </v-main>
</template>
<style scoped>
.filter{
    filter:drop-shadow(2px 2px 2px gray)
}
.magin-card{
    margin: 5px;
    width: auto;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.bold-opacity{
    font-weight: bold;
    color:#616161
}
.padding-title{
    padding: 20px 0;
    text-align: center;
}
.bold{
    font-weight: bold;
}
.img-icon {
    max-width: 50%;
    padding: 20px;
    filter: drop-shadow(2px 2px 3px #7d7e81a6);
}
.v-sheet.v-card {
    cursor: pointer;
    border-radius: 19px;
    filter: drop-shadow(0px 0px 1px #ddd);
}
.v-sheet.v-card:hover{
   transform: scale(1.01);
}
.img-icon:hover{
    transform: scale(1.03);
}
</style>
<script>
// import axios from 'axios'
export default {
  components: {},
  data () {
    return {
      data: '',
      selectedLine: true,
      selectedFacebook: true,
      selectedEmail: true,
      selectedSMS: true
    }
  },
  methods: {
    lineClick () {
      if (this.selectedLine === true) {
        window.location.href = 'https://www.google.com/'
        console.log('Double-clicked!')
      } else {
        console.log('Double-click functionality disabled because selectedLine is false.')
      }
    },
    facebookClick () {
      if (this.selectedFacebook === true) {
        window.location.href = 'https://www.google.com/'
        console.log('Double-clicked!')
      } else {
        console.log('Double-click functionality disabled because selectedLine is false.')
      }
    },
    emailClick () {
      if (this.selectedEmail === true) {
        window.location.href = 'https://www.google.com/?&bih=963&biw=1920&rlz=1C5CHFA_enTH1056TH1056&hl=en'
        console.log('Double-clicked!')
      } else {
        console.log('Double-click functionality disabled because selectedLine is false.')
      }
    },
    smsClick () {
      if (this.selectedSMS === true) {
        window.location.href = 'https://www.google.com/?&bih=963&biw=1920&rlz=1C5CHFA_enTH1056TH1056&hl=en'
        console.log('Double-clicked!')
      } else {
        console.log('Double-click functionality disabled because selectedLine is false.')
      }
    },
    updateStatus () {
      console.log('update')
    }
  }
}
</script>
