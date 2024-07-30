<template>
  <div>
    <v-col
          cols="12"
          sm="6"
          md="3"
        >
        <v-text-field
        solo
        hidden-shardow
      class="custom-text-field"
    ></v-text-field>
        </v-col>
    <v-row class="col-md-12" style="padding: 40px 20px 40px 100px">
      <div class="col-md-7 col-sm-12">
        <div class="card" style="padding: 20px">
          <h3>เพิ่มหัวข้อ</h3>
          <form>
            <v-col cols="12" md="12">
              <v-textarea
                solo
                name="input-7-4"
                v-model="inputText"
              ></v-textarea>
            </v-col>
            <div align="right">
              <v-btn
                :loading="loading"
                :disabled="loading"
                color="success"
                class="ma-2 white--text"
                @click="confirm"
              >
                เพิ่มคำประเมิน
                <v-icon right dark> mdi-playlist-plus </v-icon>
              </v-btn>
            </div>
          </form>
        </div>
        <div class="card" style="padding: 20px">
          <h3>รายการคำถาม</h3>
          <table>
            <tbody v-if="formData.message !== 'No data found'">
              <draggable
                :list="formData"
                :disabled="!enabled"
                class="list-group"
                ghost-class="ghost"
                :move="checkMove"
                @start="dragging = true"
                @end="updateOrder"
              >
                <div
                  style="display: flex; justify-content: space-between; align-items: center;"
                  class="list-group-item"
                  v-for="(element, index) in formData"
                  :key="index"
                >
                  <div>
                    <v-icon>mdi-drag-variant</v-icon>
                    {{ index + 1 }}
                    {{ element.answer }}
                  </div>
                  <v-btn
                    :loading="loading3"
                    :disabled="loading3"
                    color="red"
                    class="ma-2 white--text"
                    fab
                    @click="deleteRating(element.id)"
                  >
                    <v-icon align="right" dark>
                      mdi-delete-forever
                    </v-icon>
                  </v-btn>
                </div>
              </draggable>
            </tbody>
            <tbody v-else>
              No data
            </tbody>
          </table>
        </div>
      </div>

      <!-- //ตัวโมบาย -->
      <div class="col-md-5 col-sm-12">
        <div class="respons_mobie">
          <div class="body_mobie">
            <div class="screen_mobye">
              <div class="camera"></div>
              <div
                style="display: flex; justify-content: center; align-items: center;flex-wrap: wrap;"
              >
                <img
                  src="../../assets/Scenes08.svg"
                  width="100%"
                  style="height: 250px;"
                />
                <!-- <div>ประเมินการบริการ</div> -->
                <div style="padding-top: 30px">
                  <div
                    class="col-sm-12 col-md-12"
                    style="width: 347px !important"
                  >
                    <div v-if="formData.message !== 'No data found'">
                      <div v-for="(data, index) in formData" :key="index">
                        <p class="text-center">
                          {{ index + 1 }}. {{ data.answer }}
                        </p>
                        <div class="text-center col-md-12 rating-margin">
                          <v-rating
                            v-model="data.rating"
                            color="warning"
                            background-color="grey darken-1"
                            empty-icon="$ratingFull"
                            hover
                            fab
                            rounded
                          ></v-rating>
                          <br />
                        </div>
                      </div>
                    </div>
                    <div v-else>ยังไม่มีคำถาม</div>
                    <p style="padding: 5px"></p>

                    <hr class="style-hr" />
                    <v-col cols="12" md="12">
                      <v-textarea
                        clearable
                        outlined
                        name="input-7-4"
                        label="Outlined textarea"
                        clear-icon="mdi-close-circle"
                      >
                        <template #label>
                          <label style="font-size: 18px; padding-bottom: 10px"
                            >ข้อเสนอแนะ</label
                          >
                        </template>
                      </v-textarea>
                    </v-col>

                    <br />
                    <v-checkbox
                      v-model="checkbox"
                      label="success"
                      color="success"
                      value="success"
                      :on-icon="'mdi-check-circle'"
                      :off-icon="'mdi-checkbox-blank-circle-outline'"
                      style="border-radius: 100%;"
                    >
                      <template v-slot:label>
                        <div>ฉันยอมรับให้ พนักงานติดต่อกลับ</div>
                      </template>
                    </v-checkbox>
                    <div align="center">
                      <v-btn
                        :loading="loading2"
                        :disabled="loading2"
                        color="success"
                        class="ma-2 white--text"
                        rounded
                      >
                        ส่ง
                        <v-icon right dark> mdi-send </v-icon>
                      </v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-row>
  </div>
</template>
<script>
import axios from 'axios'
import draggable from 'vuedraggable'
// axios.defaults.baseURL = "http://localhost:5004/"
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
export default {
  data () {
    return {
      DNS_IP: 'http://localhost:5004',
      rating: 5,
      checkbox: false,
      starBoldIcon: 'star',
      loader: null,
      loading: false,
      loading2: false,
      loading3: false,
      inputText: null,
      formData: [],
      disabled: true,
      enabled: true,
      dragging: false,
      dragOptions: {
        animation: 150
      },
      swasuccess: {
        title: 'สำเร็จ',
        text: 'เพิ่มคำถามเรียบร้อยแล้ว',
        type: 'success',
        icon: 'success'
      }
    }
  },
  components: {
    draggable
  },
  mounted () {
    this.getData()
  },
  methods: {
    checkMove (e) {
      // console.log('Future index:', e.draggedContext.futureIndex)
      this.formData.splice(
        e.draggedContext.futureIndex,
        0,
        this.formData.splice(e.draggedContext.index, 1)[0]
      )
      this.formData.forEach((item, index) => {
        item.sort = index + 1
      })
    },
    // updateOrder () {
    //   // console.log('Updated order:', this.formData)
    //   axios.post(this.DNS_IP + '/rating/setindex', this.formData)
    //     .then(response => {
    //       console.log('Update successful', response)
    //       this.getData()
    //     })
    //     .catch(error => {
    //       console.error('Update failed:', error)
    //     })
    // },
    updateOrder () {
      console.log('Updated order:', this.formData)

      const updatedFormData = this.formData.map((element, index) => ({
        ...element,
        sort: index + 1
      }))

      axios
        .post(this.DNS_IP + '/rating/setindex', updatedFormData)
        .then(response => {
          console.log('Update successful', response)
          this.getData()
        })
        .catch(error => {
          console.error('Update failed:', error)
        })
    },
    getData () {
      try {
        const payload = {
          RECORD_STATUS: 'N'
        }
        axios.get(this.DNS_IP + '/rating/get', payload).then(respone => {
          this.formData = respone.data

          // console.log('formData', this.formData)
        })
      } catch (error) {
        console.log(error)
      }
    },
    deleteRating (id) {
      // console.log('ddddddd', id_rating)
      try {
        this.$swal({
          title: 'ลบคำถาม?',
          text: 'คุณต้องการลบคำถาม!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ใช่, ต้องการลบ'
        }).then(result => {
          axios
            .post(this.DNS_IP + '/ratingAnswer/delete/' + id)
            .then(respone => {
              this.getData()
              if (result.isConfirmed) {
                this.$swal('ลบสำเร็จ!', 'คุณได้ลบคำถามแล้ว', 'success')
              }
            })
        })
      } catch (error) {
        console.log(error)
      }
    },
    confirm () {
      try {
        const payload = {
          answer: this.inputText,
          rating: 5
        }
        this.loading = true
        axios.post(this.DNS_IP + '/rating/add', payload).then(respone => {
          this.$swal(this.swasuccess)
          this.loading = false
          console.log(respone)
          this.getData()
          this.inputText = ''
        })
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style scoped>
.custom-text-field .v-input__control {
  box-shadow: none !important;
}
.v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)>.v-input__control>.v-input__slot {
    -webkit-box-shadow: 0 3px 1px -2px rgba(255, 255, 255, 0), 0 2px 2px 0 rgba(0, 0, 0, 0), 0 1px 5px 0 rgba(0, 0, 0, 0)!important;
    box-shadow: 0 3px 1px -2px rgba(255, 255, 255, 0), 0 2px 2px 0 rgba(255, 255, 255, 0.14), 0 1px 5px 0 rgba(255, 255, 255, 0.12) !important;
}
.card {
  padding: 10px;
  border: solid #e3e3e3;
  border-radius: 20px;
  margin-bottom: 20px;
}
.respons_mobie {
  display: flex;
  justify-content: center;
}
.body_mobie {
  background-color: #000000;
  width: 377px;
  height: 760px;
  border-radius: 20px;
  box-shadow: 3px 4px 10px #bdbdbd;
  filter: drop-shadow(2px 4px 6px #f9f9f9);
  display: flex;
  justify-content: center;
  align-items: center;
}
.screen_mobye {
  width: 367px;
  height: 730px;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  overflow: scroll;

  /* background-image: url(https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?cs=srgb&dl=pexels-matheus-bertelli-799443.jpg&fm=jpg); */
}
.camera {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #000000;
  margin-top: -15px;
  position: fixed;
  z-index: 1;
}
.card-title {
  padding-top: 40px;
  border-radius: 25px;
  background-color: #797979;
  display: flex;
  align-items: center;
  background: #000000;
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(3.4px);
  -webkit-backdrop-filter: blur(3.4px);
}
.title-1 {
  font-weight: bold !important;
  color: #fff;
  filter: drop-shadow(0px 1px 2px #828282);
  font-size: 20px;
}
.style-hr {
  background-color: #ffffff00;
  border-top: 2px dotted #8c8b8b;
  margin: 15px;
}
.draggable-item {
  background-color: lightgray;
  padding: 10px;
  margin-bottom: 10px;
}
.bubbles {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  top: 0;
  left: 0;
}
.bubble {
  position: absolute;
  bottom: -100px;
  width: 40px;
  height: 40px;
  background: #f1f1f1;
  border-radius: 50%;
  opacity: 0.5;
  animation: rise 10s infinite ease-in;
}
.bubble:nth-child(1) {
  width: 40px;
  height: 40px;
  left: 10%;
  animation-duration: 8s;
}
.bubble:nth-child(2) {
  width: 20px;
  height: 20px;
  left: 20%;
  animation-duration: 5s;
  animation-delay: 1s;
}
.bubble:nth-child(3) {
  width: 50px;
  height: 50px;
  left: 35%;
  animation-duration: 7s;
  animation-delay: 2s;
}
.bubble:nth-child(4) {
  width: 80px;
  height: 80px;
  left: 50%;
  animation-duration: 11s;
  animation-delay: 0s;
}
.bubble:nth-child(5) {
  width: 35px;
  height: 35px;
  left: 55%;
  animation-duration: 6s;
  animation-delay: 1s;
}
.bubble:nth-child(6) {
  width: 45px;
  height: 45px;
  left: 65%;
  animation-duration: 8s;
  animation-delay: 3s;
}
.bubble:nth-child(7) {
  width: 90px;
  height: 90px;
  left: 70%;
  animation-duration: 12s;
  animation-delay: 2s;
}
.bubble:nth-child(8) {
  width: 25px;
  height: 25px;
  left: 80%;
  animation-duration: 6s;
  animation-delay: 2s;
}
.bubble:nth-child(9) {
  width: 15px;
  height: 15px;
  left: 70%;
  animation-duration: 5s;
  animation-delay: 1s;
}
.bubble:nth-child(10) {
  width: 90px;
  height: 90px;
  left: 25%;
  animation-duration: 10s;
  animation-delay: 4s;
}
.rating-margin {
  margin: -20px 0px 0px 0px;
  display: flex;
  justify-content: center;
}
@keyframes rise {
  0% {
    bottom: -100px;
    transform: translateX(0);
  }
  50% {
    transform: translate(100px);
  }
  100% {
    bottom: 1080px;
    transform: translateX(-200px);
  }
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
