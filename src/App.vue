<template>
<v-app :style="themeStyle">
  <v-main>
    <router-view></router-view>
  </v-main>
</v-app>

</template>
<script>
export default {
  name: 'App',
  data () {
    return {
    }
  },
  methods: {

  }
}
</script>

<style>
body {
    font-family: Kanit !important;
}
  html, body {
  margin:0;
  padding:0;
  height: 100vh;
  overflow-x: hidden;
  }
.betask-bg {
  background-color:#1B437C;
  color: #fff;
}
.betask-grey-bg {
  background-color: #D9DDDC;
  color: #1B437C;
}
.v-application--wrap {
  background-color: #FAFAFA;
}
.v-application, .v-application .text-h5, .v-application .text-h6  {
    font-family: Kanit !important;
}
.v-dialog {
  border-radius: 0px !important;
}
.menu_active {
  color: var(--color_headline1) !important;
}
.v-footer, .v-card__text {
  padding: 0px !important;
}
.btn_headline1 {
  background-color: var(--color_headline1) !important;
  border-color: var(--color_headline1) !important;
  width: 100% !important;
}
.btn_subheadline1 {
  background-color: var(--color_subheadline1) !important;
  border-color: var(--color_subheadline1) !important;
  width: 100% !important;
}
.btn_icon1 {
  background-color: var(--color_icon1) !important;
  border-color: var(--color_icon1) !important;
  width: 100% !important;
}
.headline1 {
  color: var(--color_headline1) !important;
}
.headline1_bg {
  background-color: var(--color_headline1) !important;
  color: #ffffff;
}
.subheadline1 {
  color: var(--color_subheadline1) !important;
}
.icon1 {
  color: var(--color_icon1) !important;
}
.headline2 {
  color: var(--color_headline2) !important;
}
.subheadline2 {
  color: var(--color_subheadline2) !important;
}
.icon2 {
  color: var(--color_icon2) !important;
}
.picture {
  color: var(--color_picture) !important;
}
.headline2_bg {
  background-color: var(--color_headline2) !important;
}
.coin_icon::after {
  margin-left: 15px;
  margin-top: 5px;
  content: "";
  background-image: var(--coin_img);
  background-size: 25px 25px;
  display: inline-block;
  width: 25px;
  height: 25px;
  vertical-align: top;
}
.v-toolbar__content{
  display: flex;
  justify-content: space-around;
}
.coin_icon_point::after {
  margin-left: 2px;
  margin-top: 0px;
  content: "";
  background-image: var(--coin_img);
  background-size: 20px 20px;
  display: inline-block;
  width: 20px;
  height: 20px;
  vertical-align: top;
}
.coin_icon_small::after {
  margin-left: 2px;
  margin-top: 3px;
  content: "";
  background-image: var(--coin_img);
  background-size: 20px 20px;
  display: inline-block;
  width: 20px;
  height: 20px;
  vertical-align: top;
}
.coin_icon_medium::after {
  margin-left: 6px;
  margin-top: 13px;
  content: "";
  background-image: var(--coin_img);
  background-size: 40px 40px;
  display: inline-block;
  width: 40px;
  height: 40px;
  vertical-align: top;
}
.coin_icon_big::after {
  margin-left: 10px;
  margin-top: 15px;
  content: "";
  background-image: var(--coin_img);
  background-size: 50px 50px;
  display: inline-block;
  width: 50px;
  height: 50px;
  vertical-align: top;
}
.coin_icon_large::after {
  margin-left: 10px;
  margin-top: 15px;
  content: "";
  background-image: var(--coin_img);
  background-size: 130px 130px;
  display: inline-block;
  width: 130px;
  height: 130px;
  vertical-align: top;
}
.chip_point{
  width: 60px;
}
.Raleway {
  font-family: Raleway;
}
.RalewayBold {
  font-family: RalewayBold;
}
.bold {
  font-weight: bold;
}
.font8 {
  font-size: 8px;
}
.font10 {
  font-size: 10px;
}
.font12 {
  font-size: 12px;
}
.font14 {
  font-size: 14px;
}
.font16 {
  font-size: 16px;
}
.font18 {
  font-size: 18px;
}
.font20 {
  font-size: 20px;
}
.font24 {
  font-size: 24px;
}
.font26 {
  font-size: 26px;
}
.font35 {
  font-size: 35px;
}
.font28 {
  font-size: 28px;
}
.font45 {
  font-size: 45px;
}
.font55 {
  font-size: 55px;
}
.weight1000 {
    font-weight: 1000;
}
.link {
  cursor:pointer;
}
.pac-container {
  position:relative !important;
  top:-356px !important;
}
</style>>
