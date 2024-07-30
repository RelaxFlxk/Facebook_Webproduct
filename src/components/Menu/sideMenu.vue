<template>
  <transition name="slide">
    <div
      class="slidein"
      v-if="drawer"
      style="'width:100% !important';background: linear-gradient(90deg, #FCFCFC 0%, #F7F7F7 10.04%, #F7F7F7 51.56%, #F7F7F7 89.58%, #FCFCFC 100%);box-shadow: 0px 4px 20px rgba(114, 114, 114, 0.1);"
    >
      <v-row>
        <v-col cols="auto">
          <v-btn
              outlined
              @click="toggle(), updatePrice('False')"
            >
              <v-icon>mdi-arrow-left-thick</v-icon>
            </v-btn>
        </v-col>
        <v-col cols="auto" style="font-size:18px;">
          {{languageSelect === 0? "รายการของคุณ": "Your Order"}}
        </v-col>
      </v-row>
      <hr>
      <div style="align-items: center;width:100%;height:600px;overflow-y: scroll;overflow-x: hidden;">
       <v-row>
        <v-col cols="12" v-for="(item,id) in dataMenu" :key="id" style="display: flex;">
          <v-card class="cardMenu">
              <v-img
                class="pictureMenu"
                :src="item.picture"
              ></v-img>
              <div class="cardTextMenu">
                <div class="textOneBow">
                  <p class="ma-0 textTitelMenu">{{item.name}}</p>
                  <p class="ma-0 textSubTitelMenu" v-if="item.nameSub.length < 20">{{ item.nameSub }}</p>
                  <div v-else>
                    <p class="ma-0 textSubTitelMenu" >{{ (item.nameSub.substring(0,20) + '..') }}</p>
                    <p class="ma-0 textSubTitelMenu" style="color: #B72025;" @click="GetdetailsNameSub(item.nameSub)">อ่านต่อ...</p>
                  </div>
                  <br>
                  <p class="ma-0 textPriceMenu">{{formatNumber(item.price)}} {{languageSelect === 0? "บาท": "Baht"}}</p>
                  <!-- <p>{{item.nameSub}}</p> -->
                  <v-text-field
                    v-if="parseInt(item.qty) > 0"
                    v-model="item.remark"
                    :label="languageSelect === 0? 'หมายเหตุ': 'Remark'"
                    single-line
                    hide-details
                    dense
                  ></v-text-field>
                </div>
              </div>
              <div class="buttomMenu">
                <v-btn
                  icon
                  x-small
                  color="#FF7B2C"
                  class="buttomMenuplusmins"
                  @click="changeCounter('-1', item)"
                >
                  <v-icon dark>
                    mdi-minus
                  </v-icon>
                </v-btn>
                {{item.qty}}
                <v-btn
                  icon
                  x-small
                  color="#FF7B2C"
                  class="buttomMenuplusmins "
                  @click="changeCounter('1', item)"
                >
                  <v-icon dark>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </div>
          </v-card>
        </v-col>
       </v-row>
       </div>
       <br>
       <div class="sendOrder">
        <v-card width="100%" height="78px" class="display: flex;align-items: center;"  style="border-radius: 16px;">
          <v-container>
          <v-row>
            <v-col cols="6">{{languageSelect === 0? "รวมราคา": "Total price"}}</v-col>
            <v-col cols="6" class="text-right">{{formatNumber(priceMenu)}}</v-col>
          </v-row>
          </v-container>
        </v-card>
        <br>
        <v-btn
          color="#B72025"
          class="white--text"
          width="100%"
          height="54px"
          style="border-radius: 16px;"
          @click="updatePrice('True')"
        >
          {{languageSelect === 0? "ยืนยันรายการ": "Send Order"}}
          <v-icon
            right
            dark
          >
            mdi-arrow-right
          </v-icon>
        </v-btn>
       </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: [
    'toggleParent',
    'drawerParent',
    'languageSelectParent',
    'dataMenuParent',
    'priceMenuParent',
    'updatePriceMenuParent'
  ],
  data () {
    return {
      drawer: this.drawerParent,
      languageSelect: this.languageSelectParent,
      dataMenu: this.dataMenuParent,
      priceMenu: this.priceMenuParent,
      detailsNameSub: false,
      detailsData: ''
    }
  },
  async mounted () {},
  methods: {
    GetdetailsNameSub (item) {
      this.$emit('nameSubDialog', item)
    },
    toggle () {
      this.toggleParent()
    },
    changeCounter (num, item) {
      item.qty += +num
      if (num === '1') {
        this.priceMenu = this.priceMenu + parseInt(item.price)
      } else {
        if (item.qty >= 0) {
          this.priceMenu = this.priceMenu - parseInt(item.price)
        }
      }
      // eslint-disable-next-line no-unused-expressions
      !isNaN(item.qty) && item.qty > 0 ? item.qty : item.qty = 0
      if (item.qty === 0) {
        item.remark = ''
      }
    },
    formatNumber (value) {
      if (value && value !== 0) {
        // console.log('valuevalue', value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else {
        return 0
      }
    },
    updatePrice (status) {
      if (status === 'True') {
        this.$emit('updatePriceMenuParent', this.priceMenu, this.dataMenu)
        this.toggle()
      } else {
        this.$emit('updatePriceMenuParent', this.priceMenu, this.dataMenu)
      }
    }
  },
  watch: {
    languageSelect () {
      this.languageSelect = this.languageSelectParent
    },
    drawerParent () {
      this.drawer = this.drawerParent
    },
    dataMenuParent () {
      this.dataMenu = this.dataMenuParent
    },
    priceMenuParent () {
      this.priceMenu = this.priceMenuParent
    }
  }
}
</script>
<style scoped>
.sendOrder {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;

  width: 100%;
  height: 112px;

  flex: none;
  order: 2;
  align-self: stretch;
  flex-grow: 0;
  justify-content: flex-end;
}
.buttomMenuplusminus {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;

  width: 32px;
  height: 32px;
  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
}
.buttomMenu {
  /* display: flex;
  flex-direction: row;
  align-items: flex-end; */
  padding: 0px;
  gap: 10px;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 32px;
  height: 100px;
  /* Inside auto layout */

  flex: none;
  order: 2;
  flex-grow: 0;
}
.textPriceMenu {
/* Price/Small */
font-style: normal;
font-weight: 700;
font-size: 14px;
line-height: 20px;

color: #FF7B2C;

}
.textTitelMenu {
font-style: normal;
font-weight: 600;
font-size: 14px;
line-height: 22px;
}
.textSubTitelMenu {
font-style: normal;
font-weight: 200;
font-size: 14px;
line-height: 22px;
}
.textOneBox {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 4px;

  width: 147px;
  height: 64px;
  /* Inside auto layout */

  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
}
.colMenu {
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;

width: 327px;
height: 124px;
/* Inside auto layout */

flex: none;
order: 0;
align-self: stretch;
flex-grow: 0;
}
.cardTextMenu {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 15px;

  width: 147px;
  height: auto;
  /* Inside auto layout */

  flex: none;
  order: 1;
  flex-grow: 1;
}
.pictureMenu {
  width: 100px;
  height: 100px;

  filter: drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.7));

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
}
.cardMenu {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 20px 10px 20px 10px;
  width: 327px;
  min-height: auto;

  background: #FFFFFF;
  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.03), 0px 4px 20px -2px rgba(50, 50, 71, 0.04);
  border-radius: 16px;

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 1;
}
.slide-enter,
.slide-leave-active {
  right: -100%;
}
.close-btn {
  border: none;
  font-weight: bold;
  font-size: 2em;
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.5em;
}
</style>
