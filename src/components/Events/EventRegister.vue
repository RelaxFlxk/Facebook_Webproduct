<template>
  <v-main>
    <v-container>
      <!-- <v-card col='6'> -->
      <v-form v-model="valid" ref="formadd">
        <v-container>
          <v-row class="text-center">
            <h2 class="title">{{titleName}}</h2>
           <!-- <img :src="imgEvent" alt="Event Image"> -->
          </v-row>
          <!-- <v-img
            src='https://firebasestorage.googleapis.com/v0/b/database-78471.appspot.com/o/upload%2F965527229524Strategy_Board.gif?alt=media&token=41cc6640-65d6-4970-b3c7-3a747fb775fb'
            max-height='150'
            contain
            class='grey darken-4'
          ></v-img> -->
          <v-row>
            <v-col class="pb-0 pt-0" cols="12" md="12">
              <v-text-field
                v-model="formadd.name"
                :rules="nameRules"
                label="ชื่อ"
                required
                outlined
                dense
              ></v-text-field>
            </v-col>

            <v-col class="pb-0 pt-0" cols="12" md="12">
              <v-text-field
                v-model="formadd.tel"
                :rules="phoneRules"
                :counter="10"
                label="เบอร์"
                required
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="text-center">
            <v-btn
              :loading="loading"
              :disabled="loading"
              @click="confirm"
              depressed
              rounded
              color="primary"
            >
            <template v-slot:loader>
              <span>กำลังบันทึก...</span>
            </template>
            <template v-slot:default>
              ลงทะเบียน
            </template>
            </v-btn>
          </v-row>
        </v-container>
      </v-form>

      <!-- </v-card> -->
    </v-container>
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-main>
</template>
<script>
import axios from 'axios'
export default {
  components: {},
  data () {
    return {
      // imgEvent: require('@/assets/events/cover-FLEX-nail2023-01.png'),
      imgEvent: 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/event%2Fbanner.png?alt=media&token=4c2d2f7a-395b-44fc-8a35-5996fb08384c',
      loader: null,
      loading: false,
      overlay: true,
      swalConfig: {
        title: null,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      },
      swasuccess: {
        title: 'สำเร็จ',
        text: 'คุณได้ลงทะเบียนเรียบร้อยแล้ว',
        type: 'success',
        showConfirmButton: false
      },
      path: 'http://192.168.1.213:5001',
      formadd: {
        id: '',
        name: '',
        tel: '',
        eventId: '',
        bicTypeId: 0,
        userLineId: '',
        lineDisplayName: ''
      },
      bicTypeText: [
        {
          id: 1, text: 'ร้านอาหาร'
        },
        {
          id: 2, text: 'ร้านเสริมความงาม'
        },
        {
          id: 3, text: 'โรงพยาบาล & คลินิค'
        },
        {
          id: 4, text: 'สุขภาพ กีฬา'
        },
        {
          id: 5, text: 'Event'
        },
        {
          id: 6, text: 'อื่นๆ'
        }
      ],
      datefomat: '',
      profile: null,
      valid: true,
      nameRules: [v => !!v || 'กรุณากรอกชื่อ'],
      phoneRules: [
        v => !!v || 'กรุณากรอกเบอร์',
        v => (!isNaN(parseFloat(v)) && isFinite(v)) || 'ต้องกรอกเฉพาะตัวเลข',
        v => (v && v.length === 10) || 'เบอร์ 10 หลัก'
      ]
    }
  },
  async mounted () {
    if ( // ถ้ากดยดยอมรับ หรือ ไม่ยอมรับ
      this.$route.query.error === 'ACCESS_DENIED' ||
      this.$route.query.error === 'access_denied'
    ) { // ให้ ?liff.state=
      const queryString = decodeURIComponent(window.location.search).replace(
        '?liff.state=',
        ''
      )
      // console.log('queryString', queryString)
      // ดึงค่าใส่ตัวแปร
      const params = new URLSearchParams(queryString)
      this.bicTypeId = params.get('bicTypeId')
      this.eventId = params.get('eventId')
      this.titleName = params.get('titleName')
      // console.log('bicTypeIdif', this.bicTypeId)
      // console.log('eventIdif', this.eventId)
    } else {
      // console.log('bicTypeIdelse', this.$route.query.bicTypeId)
      // console.log('eventIdelse', this.$route.query.eventId)
      if (this.$route.query.bicTypeId !== undefined && this.$route.query.eventId !== undefined) {
        this.bicTypeId = this.$route.query.bicTypeId
        this.eventId = this.$route.query.eventId
        this.titleName = this.$route.query.titleName
      } else {
        const queryString = decodeURIComponent(window.location.search).replace(
          '?liff.state=',
          ''
        )
        // console.log('queryString', queryString)
        const params = new URLSearchParams(queryString)
        this.bicTypeId = params.get('bicTypeId')
        this.eventId = params.get('eventId')
        this.titleName = params.get('titleName')
      }
      await this.checkLiffLogin()
      await this.getForm()
    }
  },
  methods: {
    async validate () {
      const isFormaddValid = await this.$refs.formadd.validate()
      console.log(isFormaddValid)
    },
    async clearformadd () {
      this.formadd.name = ''
      this.formadd.tel = ''
    },
    formatDate (dateString) {
      const months = [
        'มกราคม',
        'กุมภาพันธ์',
        'มีนาคม',
        'เมษายน',
        'พฤษภาคม',
        'มิถุนายน',
        'กรกฎาคม',
        'สิงหาคม',
        'กันยายน',
        'ตุลาคม',
        'พฤศจิกายน',
        'ธันวาคม'
      ]

      const dateObj = new Date(dateString)
      const day = dateObj.getDate()
      const month = months[dateObj.getMonth()]
      const year = dateObj.getFullYear() + 543

      return `${day} ${month} ${year}`
    },
    add () {
      if (this.$refs.formadd.validate() === true) {
        try {
          let params = {
            'name': this.formadd.name,
            'tel': this.formadd.tel,
            'bicTypeId': this.bicTypeId,
            'eventId': this.eventId,
            'userLineId': this.profile.userId,
            'lineDisplayName': this.profile.displayName,
            'lineImage': this.profile.pictureUrl
          }
          // console.log('params', params)
          axios.post(this.DNS_IP + '/Event/check/' + this.profile.userId + '/' + this.bicTypeId + '/' + this.eventId, params).then(async res => {
            if (res.data.add === true) {
              axios.post(this.DNS_IP + '/Event/Register', params).then(async dataobj => {
                // console.log('dataobj.data.bodyobj', dataobj.data.bodyobj)
                if (this.$liff.isInClient()) {
                  await this.$liff.sendMessages(this.dataFlex(dataobj.data.bodyObj, this.formatDate(dataobj.data.date), 'ลงทะเบียนสำเร็จ', 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/event%2Fbanner.png?alt=media&token=4c2d2f7a-395b-44fc-8a35-5996fb08384c', 'คุณได้ลงทะเบียน'))
                  // await this.$liff.sendMessages(this.dataFlex(dataobj.data.bodyObj, this.formatDate(dataobj.data.date), 'ลงทะเบียนสำเร็จ', 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fcover-FLEX-CTC2023-01.png?alt=media&token=1b3d319f-61e2-4552-9820-ee379a150f36', 'คุณได้ลงทะเบียน'))
                    .then(() => {
                      // alert('message sent')
                      console.log('message sent')
                    })
                    .catch((err) => {
                      // alert(err)
                      console.log('error', err)
                    })
                  await this.$liff.sendMessages(this.flxkAds())
                    .then(() => {
                      // alert('message sent')
                      console.log('message sent')
                    })
                    .catch((err) => {
                    // alert(err)
                      console.log('error', err)
                    })
                  await this.$liff.closeWindow()
                }
                this.loading = false
                this.clearformadd()
              })
            } else if (res.data.update === true) {
              // console.log('res.data.update', res.data.bodyObj, res.data.date)
              // this.$swal(this.swasuccess)
              // console.log('res', res)
              // console.log('res', res.data.bodyObj.bicTypeId)
              // console.log('typeof', typeof res)
              this.$swal(this.swasuccess)
              this.loading = false
              if (this.$liff.isInClient()) {
                await this.$liff.sendMessages(this.dataFlex(res.data.bodyObj, this.formatDate(res.data.date), 'แก้ไขลงทะเบียนสำเร็จ', 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/event%2Fbanner.png?alt=media&token=4c2d2f7a-395b-44fc-8a35-5996fb08384c', 'คุณได้แก้ไขข้อมูลลงทะเบียน'))
                  .then(() => {
                    // alert('message sent')
                    console.log('message sent')
                  })
                  .catch((err) => {
                    // alert(err)
                    console.log('error', err)
                  })
                await this.clearformadd()
                this.loading = false
              }
              this.$liff.closeWindow()
            }
            // console.log('res', res)
          })
        } catch (error) {
          this.$swal('เกิดข้อผิดพลาด', 'ทำรายการใหม่อีกครั้ง', 'warning')
        }
      }
    },
    dataFlex (item, date, textFlex, imageFlex, textText) {
      let bic = this.bicTypeText.filter(le => { return le.id === parseInt(item.bicTypeId) })
      let databic = ''
      if (bic.length > 0) {
        databic = bic[0].text
      } else {
        databic = item.bicTypeId
      }
      let dataReturn = [
        // {
        //   type: 'text',
        //   text: textText + '\n กิจกรรม Betask At CTC2023 สำเร็จ \nธุรกิจประเภท ' +
        //   databic +
        //             '\nชื่อ: ' + item.name +
        //             '\nเบอร์โทร: ' + item.tel +
        //             '\nวันที่: ' + date
        // },
        {
          'type': 'flex',
          'altText': 'This is a Flex Message',
          'contents': {
            'type': 'bubble',
            'hero': {
              'type': 'image',
              'url': imageFlex,
              'size': 'full',
              'aspectRatio': '20:13',
              'aspectMode': 'cover',
              'action': {
                'type': 'uri',
                'uri': 'http://linecorp.com/'
              }
            },
            'body': {
              'type': 'box',
              'layout': 'vertical',
              'contents': [
                {
                  'type': 'text',
                  'text': textFlex,
                  'weight': 'bold',
                  'size': 'xl'
                },
                {
                  'type': 'box',
                  'layout': 'vertical',
                  'margin': 'lg',
                  'spacing': 'sm',
                  'contents': [
                    {
                      'type': 'box',
                      'layout': 'baseline',
                      'spacing': 'sm',
                      'contents': [
                        {
                          'type': 'text',
                          'text': 'ชื่อ นามสกุล',
                          'color': '#aaaaaa',
                          'size': 'sm',
                          'flex': 3
                        },
                        {
                          'type': 'text',
                          'text': item.name,
                          'wrap': true,
                          'color': '#666666',
                          'size': 'sm',
                          'flex': 5
                        }
                      ]
                    },
                    {
                      'type': 'box',
                      'layout': 'baseline',
                      'contents': [
                        {
                          'type': 'text',
                          'text': 'เบอร์โทร',
                          'flex': 3,
                          'size': 'sm',
                          'color': '#aaaaaa'
                        },
                        {
                          'type': 'text',
                          'text': item.tel,
                          'flex': 5,
                          'size': 'sm',
                          'color': '#666666'
                        }
                      ]
                    },
                    {
                      'type': 'box',
                      'layout': 'baseline',
                      'contents': [
                        {
                          'type': 'text',
                          'text': 'ประเภทธุรกิจ',
                          'flex': 3,
                          'size': 'sm',
                          'color': '#aaaaaa'
                        },
                        {
                          'type': 'text',
                          'text': databic,
                          'size': 'sm',
                          'flex': 5,
                          'color': '#666666'
                        }
                      ]
                    },
                    {
                      'type': 'box',
                      'layout': 'baseline',
                      'spacing': 'sm',
                      'contents': [
                        {
                          'type': 'text',
                          'text': 'วันที่',
                          'color': '#aaaaaa',
                          'size': 'sm',
                          'flex': 3
                        },
                        {
                          'type': 'text',
                          'text': date,
                          'wrap': true,
                          'color': '#666666',
                          'size': 'sm',
                          'flex': 5
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            'footer': {
              'type': 'box',
              'layout': 'vertical',
              'spacing': 'sm',
              'contents': [
                {
                  'type': 'box',
                  'layout': 'vertical',
                  'contents': [
                    {
                      'type': 'text',
                      'text': '14 ธันวาคม 2566',
                      'color': '#aaaaaa',
                      'size': 'sm'
                    }
                  ],
                  'margin': 'sm'
                }
              ],
              'flex': 0
            }
          }
        }
      ]
      return dataReturn
    },
    flxkAds () {
      let dataReturn = [
        // {'type': 'flex', 'altText': 'Flex Message', 'contents': {'type': 'bubble', 'hero': {'type': 'video', 'url': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/video%2FBeLinked.mp4?alt=media&token=c4c60afd-4b6b-4d49-8376-30c86759a209', 'previewUrl': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/video%2FScreen%20Shot%202566-06-16%20at%2009.40.03.png?alt=media&token=320e7e5b-dd27-46ee-875c-d0f18ca6c8ea', 'altContent': {'type': 'image', 'size': 'full', 'aspectRatio': '20:13', 'aspectMode': 'cover', 'url': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/video%2FScreen%20Shot%202566-06-16%20at%2009.40.03.png?alt=media&token=320e7e5b-dd27-46ee-875c-d0f18ca6c8ea'}}, 'body': {'type': 'box', 'layout': 'vertical', 'contents': [{'type': 'box', 'layout': 'vertical', 'contents': [{'type': 'text', 'text': 'Be Linked', 'weight': 'bold', 'size': 'xl', 'color': '#1B437C'}, {'type': 'text', 'text': 'ระบบจองคิวผ่าน LINE OA'}, {'type': 'text', 'text': 'ครอบคลุมทุกธุรกิจ'}], 'paddingStart': '30px', 'paddingTop': '20px'}, {'type': 'box', 'layout': 'vertical', 'margin': 'xl', 'spacing': 'lg', 'contents': [{'type': 'box', 'layout': 'horizontal', 'spacing': 'none', 'contents': [{'type': 'image', 'url': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/video%2F_Group_%20(4).png?alt=media&token=d8950d64-4b71-4a5c-8a60-8ba9850f8aef', 'margin': 'none', 'gravity': 'center'}, {'type': 'text', 'text': 'จองโต๊ะ', 'wrap': true, 'color': '#666666', 'size': 'md', 'flex': 5, 'gravity': 'center', 'margin': 'xl'}], 'backgroundColor': '#eeeeee', 'paddingStart': '20px', 'margin': 'none', 'height': '50px'}]}, {'type': 'box', 'layout': 'vertical', 'margin': 'xs', 'spacing': 'lg', 'contents': [{'type': 'box', 'layout': 'horizontal', 'spacing': 'none', 'contents': [{'type': 'image', 'url': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/video%2F_Group_%20(5).png?alt=media&token=8640a1ad-989d-47a9-a3a5-a73560ef74a6', 'margin': 'none', 'gravity': 'center'}, {'type': 'text', 'text': 'ระบบบัตรคิว', 'wrap': true, 'color': '#666666', 'size': 'md', 'flex': 5, 'gravity': 'center', 'margin': 'xl'}], 'backgroundColor': '#eeeeee', 'paddingStart': '20px', 'margin': 'none', 'height': '50px'}]}, {'type': 'box', 'layout': 'vertical', 'margin': 'xs', 'spacing': 'lg', 'contents': [{'type': 'box', 'layout': 'horizontal', 'spacing': 'none', 'contents': [{'type': 'image', 'url': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/video%2F_Group_%20(6).png?alt=media&token=f88306db-460b-449f-90a6-6824e03da14d', 'margin': 'none', 'gravity': 'center'}, {'type': 'text', 'text': 'ระบบสะสมแต้ม', 'wrap': true, 'color': '#666666', 'size': 'md', 'flex': 5, 'gravity': 'center', 'margin': 'xl'}], 'backgroundColor': '#eeeeee', 'paddingStart': '20px', 'margin': 'none', 'height': '50px'}]}, {'type': 'box', 'layout': 'vertical', 'margin': 'md', 'spacing': 'none', 'contents': [{'type': 'separator'}]}], 'paddingAll': '0px'}, 'footer': {'type': 'box', 'layout': 'vertical', 'spacing': 'none', 'contents': [{'type': 'button', 'style': 'link', 'height': 'sm', 'action': {'type': 'uri', 'label': 'WEBSITE', 'uri': 'https://betaskthai.com/'}, 'color': '#ffffff'}, {'type': 'box', 'layout': 'vertical', 'contents': [], 'margin': 'sm'}], 'flex': 0, 'backgroundColor': '#1B437C', 'margin': 'none'}}}
        // {
        //   'type': 'flex',
        //   'altText': 'Flex Message',
        //   'contents': {
        //     'type': 'bubble',
        //     'hero': {
        //       'type': 'video',
        //       'url': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/video%2FBeLinked.mp4?alt=media&token=c4c60afd-4b6b-4d49-8376-30c86759a209',
        //       'previewUrl': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/video%2FScreen%20Shot%202566-06-16%20at%2009.40.03.png?alt=media&token=320e7e5b-dd27-46ee-875c-d0f18ca6c8ea',
        //       'altContent': {
        //         'type': 'image',
        //         'size': 'full',
        //         'aspectRatio': '20:13',
        //         'aspectMode': 'cover',
        //         'url': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/video%2FScreen%20Shot%202566-06-16%20at%2009.40.03.png?alt=media&token=320e7e5b-dd27-46ee-875c-d0f18ca6c8ea'
        //       }
        //     },
        //     'body': {
        //       'type': 'box',
        //       'layout': 'vertical',
        //       'contents': [
        //         {
        //           'type': 'box',
        //           'layout': 'vertical',
        //           'contents': [
        //             {
        //               'type': 'text',
        //               'text': 'Be Linked',
        //               'weight': 'bold',
        //               'size': 'xl',
        //               'color': '#1B437C'
        //             },
        //             {
        //               'type': 'text',
        //               'text': 'ระบบจองคิวผ่าน LINE OA'
        //             },
        //             {
        //               'type': 'text',
        //               'text': 'ครอบคลุมทุกธุรกิจ'
        //             }
        //           ],
        //           'paddingStart': '30px',
        //           'paddingTop': '20px'
        //         },
        //         {
        //           'type': 'box',
        //           'layout': 'vertical',
        //           'margin': 'xl',
        //           'spacing': 'lg',
        //           'contents': [
        //             {
        //               'type': 'box',
        //               'layout': 'horizontal',
        //               'spacing': 'none',
        //               'contents': [
        //                 {
        //                   'type': 'image',
        //                   'url': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/video%2F_Group_%20(4).png?alt=media&token=d8950d64-4b71-4a5c-8a60-8ba9850f8aef',
        //                   'margin': 'none',
        //                   'gravity': 'center'
        //                 },
        //                 {
        //                   'type': 'button',
        //                   'style': 'secondary',
        //                   'color': '#f2f2f2',
        //                   'margin': 'xl',
        //                   'flex': 5,
        //                   'gravity': 'center',
        //                   'action': {
        //                     'type': 'message',
        //                     'label': 'จองโต๊ะ',
        //                     'text': 'สนใจ ระบบจองโต๊ะ'
        //                   }
        //                 }
        //               ],
        //               'backgroundColor': '#eeeeee',
        //               'paddingStart': '20px',
        //               'margin': 'none',
        //               'height': '50px'
        //             }
        //           ]
        //         },
        //         {
        //           'type': 'box',
        //           'layout': 'vertical',
        //           'margin': 'xs',
        //           'spacing': 'lg',
        //           'contents': [
        //             {
        //               'type': 'box',
        //               'layout': 'horizontal',
        //               'spacing': 'none',
        //               'contents': [
        //                 {
        //                   'type': 'image',
        //                   'url': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/video%2F_Group_%20(5).png?alt=media&token=8640a1ad-989d-47a9-a3a5-a73560ef74a6',
        //                   'margin': 'none',
        //                   'gravity': 'center'
        //                 },
        //                 {
        //                   'type': 'button',
        //                   'style': 'secondary',
        //                   'color': '#f2f2f2',
        //                   'margin': 'xl',
        //                   'flex': 5,
        //                   'gravity': 'center',
        //                   'action': {
        //                     'type': 'message',
        //                     'label': 'ระบบบัตรคิว',
        //                     'text': 'สนใจ ระบบบัตรคิว'
        //                   }
        //                 }
        //               ],
        //               'backgroundColor': '#eeeeee',
        //               'paddingStart': '20px',
        //               'margin': 'none',
        //               'height': '50px'
        //             }
        //           ]
        //         },
        //         {
        //           'type': 'box',
        //           'layout': 'vertical',
        //           'margin': 'xs',
        //           'spacing': 'lg',
        //           'contents': [
        //             {
        //               'type': 'box',
        //               'layout': 'horizontal',
        //               'spacing': 'none',
        //               'contents': [
        //                 {
        //                   'type': 'image',
        //                   'url': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/video%2F_Group_%20(6).png?alt=media&token=f88306db-460b-449f-90a6-6824e03da14d',
        //                   'margin': 'none',
        //                   'gravity': 'center'
        //                 },
        //                 {
        //                   'type': 'button',
        //                   'style': 'secondary',
        //                   'color': '#f2f2f2',
        //                   'margin': 'xl',
        //                   'flex': 5,
        //                   'gravity': 'center',
        //                   'action': {
        //                     'type': 'message',
        //                     'label': 'ระบบสะสมแต้ม',
        //                     'text': 'สนใจ ระบบสะสมแต้ม'
        //                   }
        //                 }
        //               ],
        //               'backgroundColor': '#eeeeee',
        //               'paddingStart': '20px',
        //               'margin': 'none',
        //               'height': '50px'
        //             }
        //           ]
        //         },
        //         {
        //           'type': 'box',
        //           'layout': 'vertical',
        //           'margin': 'md',
        //           'spacing': 'none',
        //           'contents': [
        //             {
        //               'type': 'separator'
        //             }
        //           ]
        //         }
        //       ],
        //       'paddingAll': '0px'
        //     },
        //     'footer': {
        //       'type': 'box',
        //       'layout': 'vertical',
        //       'spacing': 'none',
        //       'contents': [
        //         {
        //           'type': 'button',
        //           'style': 'link',
        //           'height': 'sm',
        //           'action': {
        //             'type': 'uri',
        //             'label': 'WEBSITE',
        //             'uri': 'https://betaskthai.com/'
        //           },
        //           'color': '#ffffff'
        //         },
        //         {
        //           'type': 'box',
        //           'layout': 'vertical',
        //           'contents': [],
        //           'margin': 'sm'
        //         }
        //       ],
        //       'flex': 0,
        //       'backgroundColor': '#1B437C',
        //       'margin': 'none'
        //     }
        //   }
        // }
        {
          'type': 'flex',
          'altText': 'Flex Message',
          'contents':
        {
          'type': 'bubble',
          'hero': {
            'type': 'video',
            'url': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/video%2FBeLinked.mp4?alt=media&token=c4c60afd-4b6b-4d49-8376-30c86759a209',
            'previewUrl': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/video%2FScreen%20Shot%202566-06-16%20at%2009.40.03.png?alt=media&token=320e7e5b-dd27-46ee-875c-d0f18ca6c8ea',
            'altContent': {
              'type': 'image',
              'size': 'full',
              'aspectRatio': '20:13',
              'aspectMode': 'cover',
              'url': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/video%2FScreen%20Shot%202566-06-16%20at%2009.40.03.png?alt=media&token=320e7e5b-dd27-46ee-875c-d0f18ca6c8ea'
            }
          },
          'body': {
            'type': 'box',
            'layout': 'vertical',
            'contents': [
              {
                'type': 'box',
                'layout': 'vertical',
                'contents': [
                  {
                    'type': 'text',
                    'text': 'Be Linked',
                    'weight': 'bold',
                    'size': 'xl',
                    'color': '#1B437C'
                  },
                  {
                    'type': 'text',
                    'text': 'ระบบจองคิวผ่าน LINE OA'
                  },
                  {
                    'type': 'text',
                    'text': 'ครอบคลุมทุกธุรกิจ'
                  }
                ],
                'paddingStart': '30px',
                'paddingTop': '20px'
              },
              {
                'type': 'box',
                'layout': 'vertical',
                'margin': 'md',
                'spacing': 'none',
                'contents': [
                  {
                    'type': 'separator'
                  }
                ]
              }
            ],
            'paddingAll': '0px'
          },
          'footer': {
            'type': 'box',
            'layout': 'vertical',
            'spacing': 'none',
            'contents': [
              {
                'type': 'box',
                'layout': 'vertical',
                'margin': 'xl',
                'spacing': 'lg',
                'contents': [
                  {
                    'type': 'box',
                    'layout': 'horizontal',
                    'spacing': 'none',
                    'contents': [
                      {
                        'type': 'image',
                        'url': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/video%2F_Group_%20(4).png?alt=media&token=d8950d64-4b71-4a5c-8a60-8ba9850f8aef',
                        'margin': 'none',
                        'gravity': 'center'
                      },
                      {
                        'type': 'button',
                        'style': 'secondary',
                        'color': '#f2f2f2',
                        'margin': 'xl',
                        'flex': 5,
                        'gravity': 'center',
                        'action': {
                          'type': 'uri',
                          'label': 'จองโต๊ะ',
                          'uri': 'https://liff.line.me/1660658626-GWYnx5Ng?bicTypeId=booking'
                        }
                      }
                    ],
                    'backgroundColor': '#eeeeee',
                    'paddingStart': '20px',
                    'margin': 'none',
                    'height': '50px'
                  }
                ]
              },
              {
                'type': 'box',
                'layout': 'vertical',
                'margin': 'xs',
                'spacing': 'lg',
                'contents': [
                  {
                    'type': 'box',
                    'layout': 'horizontal',
                    'spacing': 'none',
                    'contents': [
                      {
                        'type': 'image',
                        'url': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/video%2F_Group_%20(5).png?alt=media&token=8640a1ad-989d-47a9-a3a5-a73560ef74a6',
                        'margin': 'none',
                        'gravity': 'center'
                      },
                      {
                        'type': 'button',
                        'style': 'secondary',
                        'color': '#f2f2f2',
                        'margin': 'xl',
                        'flex': 5,
                        'gravity': 'center',
                        'action': {
                          'type': 'uri',
                          'label': 'ระบบบัตรคิว',
                          'uri': 'https://liff.line.me/1660658626-GWYnx5Ng?bicTypeId=bookingQ'
                        }
                      }
                    ],
                    'backgroundColor': '#eeeeee',
                    'paddingStart': '20px',
                    'margin': 'none',
                    'height': '50px'
                  }
                ]
              },
              {
                'type': 'box',
                'layout': 'vertical',
                'margin': 'xs',
                'spacing': 'lg',
                'contents': [
                  {
                    'type': 'box',
                    'layout': 'horizontal',
                    'spacing': 'none',
                    'contents': [
                      {
                        'type': 'image',
                        'url': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/video%2F_Group_%20(6).png?alt=media&token=f88306db-460b-449f-90a6-6824e03da14d',
                        'margin': 'none',
                        'gravity': 'center'
                      },
                      {
                        'type': 'button',
                        'style': 'secondary',
                        'color': '#f2f2f2',
                        'margin': 'xl',
                        'flex': 5,
                        'gravity': 'center',
                        'action': {
                          'type': 'uri',
                          'label': 'ระบบสะสมแต้ม',
                          'uri': 'https://liff.line.me/1660658626-GWYnx5Ng?bicTypeId=loyalty'
                        }
                      }
                    ],
                    'backgroundColor': '#eeeeee',
                    'paddingStart': '20px',
                    'margin': 'none',
                    'height': '50px'
                  }
                ]
              },
              {
                'type': 'box',
                'layout': 'vertical',
                'contents': [
                  {
                    'type': 'button',
                    'style': 'link',
                    'height': 'sm',
                    'action': {
                      'type': 'uri',
                      'label': 'WEBSITE',
                      'uri': 'https://betaskthai.com/'
                    },
                    'color': '#1B437C',
                    'margin': 'xxl'
                  }
                ]
              }
            ],
            'flex': 0,
            'backgroundColor': '#ffffff',
            'margin': 'none'
          }
        }
        }
      ]
      return dataReturn
    },
    getForm () {
      try {
        axios
          .get(this.DNS_IP + '/Event/getId/' + this.profile.userId + '/' + this.bicTypeId + '/' + this.eventId)
          .then((response) => {
            if (response.data[0].id) {
              this.formadd.id = response.data[0].id
              this.formadd.name = response.data[0].name
              this.formadd.tel = response.data[0].tel
            }
            this.overlay = false
          })
      } catch (error) {
        this.$swal('เกิดข้อผิดพลาด', 'ทำรายการใหม่อีกครั้ง', 'warning')
      }
    },
    confirm () {
      this.loading = true
      if (this.formadd.id) {
        this.swalConfig.title = 'ต้องการแก้ไข ใช่หรือไม่?'
        this.$swal(this.swalConfig)
          .then((result) => {
            console.log('result', result)
            if (result === true) {
              this.add()
            }
          }).catch((error) => {
            if (error === 'cancel') {
              this.loading = false
            }
          })
      } else {
        this.add()
      }
    },
    // register_succes () {
    // },
    async liffSendMessages (textitem) {
      try {
        await this.$liff.sendMessages([
          {
            type: 'text',
            text: textitem
          }
        ])
      } catch (error) {
        console.log('error', error)
      }
    },
    async checkLiffLogin () {
      // console.log('dataLineConfig', dataLineConfig)
      await this.$liff
        .init({
          // liffId: '1661452125-jAAoBBol' ตัวเทส
          liffId: '1660658626-l0Y4rkD6'
        })
        .then(async () => {
          if (process.env.NODE_ENV === 'development') {
            this.getProfile_dev()
          } else {
            if (!this.$liff.isLoggedIn()) {
              this.$liff.login({ redirectUri: window.location.href })
            } else {
              await this.getProfile()
              // await this.liffSendMessages()
            }
          }
        })
        .catch(err => {
          // this.$router.push({ name: '404' })
          console.log(err.code, err.message)
        })
      // this.$liff.init({ 'liffId': liffId }, function (data) {})
    },
    async getProfile () {
      let _this = this
      await this.$liff
        .getProfile()
        .then(function (profile) {
          _this.profile = profile
          console.log('prod', _this.profile)
        })
        .catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
    },
    getProfile_dev () {
      this.profile = {
        'displayName': 'Pamorn Trivorrarat',
        'pictureUrl': 'https://profile.line-scdn.net/0heYkOVB2MOnZGNizwjMlECTZmORxlR2NkYlMmRXNhZhF8USomP1knFSZjN0N9ACh1OlR9QnozbBNKJU0QWGDGQkEGZEF_AXkpall0lQ',
        // 'pictureUrl': 'https://profile.line-scdn.net/0hehdTWCiWOkdZLRKhl6VFEGVoNCouAzwPIUl2JX4pNnQnSHsUMRx8dCgoNCUmTS1BMRhzKHQpMyN9',
        'statusMessage': 'ใช้ไลน์อันนี้นะคร้าบ',
        // 'userId': 'U987fbf72d4f0b37b07c1625f7f6b27b1'
        'userId': 'Ud2e630e20bb8597b90d4908a46fbc4e9p'
        // 'userId': 'Ubb981ed38ad6dd18734560d2203df255'ตัวเทส
      }
      // console.log('dev', this.profile)
    }
  }
}
</script>

<style scoped>
.v-main__wrap {
  background-color: #ffffff;
}
.v-application .grey.darken-4 {
  background-color: #ffffff00 !important;
  border-color: #ffffff00 !important;
  padding-bottom: 20px;
}
.v-card {
  padding: 40px 40px !important;
  border-radius: 30px;
  /* background-image: url('https://firebasestorage.googleapis.com/v0/b/database-78471.appspot.com/o/upload%2F965527229524Strategy_Board.gif?alt=media&token=41cc6640-65d6-4970-b3c7-3a747fb775fb');
  backdrop-filter: blur(15px); */
}
.text-center {
  display: flex;
  justify-content: center;
}
.title {
  text-shadow: 0px 2px 3px #bababa;
  color: #1976d2;
  padding-bottom: 20px;
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
