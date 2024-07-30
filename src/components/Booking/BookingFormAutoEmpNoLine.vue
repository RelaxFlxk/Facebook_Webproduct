<template>
  <v-main>
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-overlay :value="!statusByCalendar">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-card
    v-if="overlay"
    :color="DarkModeBackground"
    min-height="100vh"
    :style="'display: flex;flex-direction: column;justify-content: center;'"
    >
    </v-card>
    <div v-else>
      <v-card :ripple="false" :img="ImgCover" height="240px" width="100%">
    </v-card>
    <v-card
      class="pa-2 pb-10 mt-n10"
      :color="DarkModeBackground"
      :style="
        'background-color:' +
          DarkModeBackground +
          ';min-height: 100vh;border-radius: 45px 45px 0px 0px;'
      "
    >
      <v-row>
        <v-col class="text-center">
          <v-avatar
            class="mt-n16 pa-1"
            style=""
            :color="DarkModeBackground"
            size="150"
          >
            <img :src="LoGo" />
          </v-avatar>
        </v-col>
      </v-row>

      <v-dialog v-model="dialogHistory" hide-overlay fullscreen>
        <!-- <v-dialog v-model="dialogAdd" persistent max-width="70%"> -->
        <v-card class="text-center">
          <v-card-title>{{
            languageSelect === 0 ? "นำข้อมูลเดิมมาใช้งาน" : "Used History"
          }}</v-card-title>
          <v-container>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="dueDate"
                    :items="dueDateItems"
                    :label="
                      languageSelect === 0
                        ? 'ค้นหาจากวันที่นัดหมาย'
                        : 'Search by Booking Date'
                    "
                    dense
                    outlined
                    @change="selectDataHistory()"
                    attach
            :menu-props="{ bottom: true, offsetY: true }"
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-text>
              <div v-for="(item, index) in historyData[0]" :key="index">
                <v-card class="text-center" elevation="14">
                  <v-container>
                    <v-card-text v-for="(items, indexs) in item" :key="indexs">
                      <v-text-field
                        v-if="items.fieldValue !== ''"
                        v-model="items.fieldValue"
                        :label="
                          languageSelect === 0
                            ? items.fieldName
                            : items.fieldNameEn
                        "
                        readonly
                      ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn tile color="success" @click="useHistory(item)">
                        <v-icon left>
                          mdi-account-check
                        </v-icon>
                        {{
                          languageSelect === 0 ? "ใช้ข้อมูลนี้" : "Select Data"
                        }}
                      </v-btn>
                    </v-card-actions>
                  </v-container>
                </v-card>
                <br />
              </div>
            </v-card-text>
            <v-col class="text-center pa-0">
              <v-btn tile color="error" @click="dialogHistory = false">
                <v-icon left>
                  mdi-close
                </v-icon>
                {{ languageSelect === 0 ? "ปิดหน้านี้" : "Close" }}
              </v-btn>
            </v-col>
          </v-container>
        </v-card>
      </v-dialog>
      <div style="display:flex;justify-content: center;" class="ma-3">
            <v-chip
              class="mr-1 font-weight-black"
              :style="'background-color:' + (languageSelect === 0 ? DarkModeButton : 'rgb(103 103 103 / 18%)') + ';font-size:20px'"
              dark
              @click="languageSelect = 0"
              >
              <v-avatar left>
                <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fflag-TH.png?alt=media&token=e4bd7ffa-aed9-47e3-9240-4dcb9d8d284e"></v-img>
              </v-avatar>
                TH
            </v-chip>
            <v-chip
              class="ml-1 font-weight-black"
              :style="'background-color:' + (languageSelect === 1 ? DarkModeButton : 'rgb(103 103 103 / 18%)') + ';font-size:20px'"
              dark
              @click="languageSelect = 1">
              <v-avatar left>
                <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fflag-USA1.png?alt=media&token=a83dd820-f576-457a-8d08-1009cea9d70b"></v-img>
              </v-avatar>
                EN
            </v-chip>
          </div>
      <h3 class="text-center" :style="'color:' + DarkModefont + ';'">
        {{ languageSelect === 0 ? bookingFormHeader : bookingFormHeaderEn }}
      </h3>
      <h5
        class="text-center"
        :style="'color:' + DarkModefont + ';'"
        v-if="shop.length > 0 && shop[0].showShopName === 'True'"
      >
        {{ shop[0].shopName }}
      </h5>
      <v-col cols="12" class="text-center pa-0 mb-3" v-if="statusHistory">
        <v-btn
          class="mx-2"
          dark
          :color="DarkModeButton"
          @click="dialogHistory = true"
        >
          <template v-if="shopId === 'U5dc171850a89e6ca4bf5041c8725fdfe'">{{languageSelect === 0 ? 'ประวัติการเข้าร่วมกิจกรรม' : 'History'}}</template>
          <template v-else>{{languageSelect === 0 ? bookingFormHistoryBT : bookingFormHistoryBTEn}}</template>
          <v-icon right dark>
            mdi-history
          </v-icon>
          <!-- <v-icon dark>
                    mdi-history
                  </v-icon> -->
        </v-btn>
        <!-- <v-btn
              tile
              small
              dark
              :color="DarkModeButton"
              @click="dialogHistory = true"
            >
              <v-icon left>
                mdi-history
              </v-icon>
              {{languageSelect === 0 ? 'เรียกข้อมูลเดิม' : 'Used History'}}
            </v-btn> -->
      </v-col>
      <div
        class="pa-2"
        :style="
          'background-color:' +
            DarkMode +
            ';border-radius: 15px 15px 15px 15px;'
        "
      >
        <v-form ref="form" v-model="valid" lazy-validation v-if="statusByCalendar">
          <br />
          <v-select
              :item-text="languageSelect === 0 ? 'text' : 'textEng'"
              item-value="value"
              v-if="branch.length > 1 "
              v-model="fromAdd.masBranchID"
              :items="branch"
              :label="languageSelect === 0 ? 'สาขา *' : 'Branch *'"
              :background-color="DarkMode"
              color="#000000"
              outlined
              required
              attach
              :menu-props="{ bottom: true, offsetY: true }"
              :rules ="[rules.required]"
              @change="selectBranch()"
          >
          </v-select>
          <v-autocomplete
          v-if="fromAdd.masBranchID !== '' && fromAdd.masBranchID !== null"
            :item-text="languageSelect === 0 ? 'text' : 'textEng'"
            item-value="value"
            v-model="fromAdd.flowId"
            :items="DataFlowName"
            :label="languageSelect === 0 ? (shopId === 'U5dc171850a89e6ca4bf5041c8725fdfe' ? 'ประเภทกิจกรรม *' : 'ประเภทบริการ *') : 'Services *'"
            outlined
            :background-color="DarkMode"
            required
            :rules="[rules.required]"
            attach
            :menu-props="{ bottom: true, offsetY: true }"
            @change="checkTitleEmp(), getPackage(),date = '', checkBrech(),clearconditionField(),priceMenu=0"
          >
          <template slot="item" slot-scope="data">
            <p class="text-wrap" >{{languageSelect === 0 ? data.item.text : data.item.textEng}}</p>
          </template>
          </v-autocomplete>
          <v-select
              :item-text="languageSelect === 0 ? 'text' : 'textEng'"
              item-value="value"
              v-if="customerTimeSlot === 'True' && timeSlotbyCustomer.length > 1"
              v-model="fromAddTimeCus"
              :items="timeSlotbyCustomer"
              :label="languageSelect === 0 ? 'จำนวนชั่วโมง *' : 'number of hours *'"
              :background-color="DarkMode"
              color="#000000"
              outlined
              required
              attach
              :menu-props="{ bottom: true, offsetY: true }"
              :rules ="[rules.required]"
            >
            </v-select>
            <!-- <v-text-field
              v-if="checkFlowAndShop()"
              v-model="fromAdd.bookingDataCustomerEmail"
              label="Email"
              outlined
              :background-color="DarkMode"
              required
              attach
              :menu-props="{ bottom: true, offsetY: true }"
              :rules="[rules.email]"
            >
            </v-text-field> -->
          <!-- <v-select
            :item-text="languageSelect === 0 ? 'text' : 'textEng'"
              item-value="value"
              v-if="branch.length > 1 && fromAdd.flowId !== ''"
              v-model="fromAdd.masBranchID"
              :items="branch"
              :label="languageSelect === 0 ? 'สาขา *' : 'Branch *'"
              :background-color="DarkMode"
              color="#000000"
              outlined
              required
              attach
              :menu-props="{ bottom: true, offsetY: true }"
              :rules ="[rules.required]"
              @change="getEmp(), checkTitleEmp()"
          >
          </v-select> -->
          <!-- <v-select
              v-if="fromAdd.masBranchID !== '' && fromAdd.flowId !== '' && dataEmp.length > 1"
              :item-text="languageSelect === 0 ? 'text' : 'textEng'"
              item-value="value"
              v-model="fromAdd.empId"
              :items="dataEmp"
              :label="languageSelect === 0 ? empTitleTh + ' *' : empTitleEng + ' *'"
              :background-color="DarkMode"
              color="#000000"
              outlined
              required
              attach
              :menu-props="{ bottom: true, offsetY: true }"
              :rules ="[rules.required]"
              @change="SetallowedDates(),fromAddTimeCus = '',checkCustomerTimeSlot(), date = ''"
            >
            </v-select>
            <v-select
              :item-text="languageSelect === 0 ? 'text' : 'textEng'"
              item-value="value"
              v-if="customerTimeSlot === 'True' && fromAdd.empId !== '' && timeSlotbyCustomer.length > 1"
              v-model="fromAddTimeCus"
              :items="timeSlotbyCustomer"
              :label="languageSelect === 0 ? 'จำนวนชั่วโมง *' : 'number of hours *'"
              :background-color="DarkMode"
              color="#000000"
              outlined
              required
              attach
              :menu-props="{ bottom: true, offsetY: true }"
              :rules ="[rules.required]"
              @change="date = '', AddallowedDatesBysetTimebyday()"
            >
            </v-select> -->
            <v-row >
              <v-col class="pb-0" :cols="showTime === 'แสดง' && date !== ''? 6 : 12">
                <!-- <div> -->
                <div v-if="customerTimeSlot === 'False' ? fromAdd.masBranchID && fromAdd.flowId : fromAdd.masBranchID && fromAdd.flowId && fromAddTimeCus">
                  <v-menu
                  ref="menu"
                  v-model="menuDate"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  :rules="[rules.required]"
                  transition="scale-transition"
                  offset-y
                  required
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <!-- @click="pickerDate ? getMonth(pickerDate) : null" -->
                    <v-text-field
                      v-model="date"
                      :label="languageSelect === 0 ? 'วันที่' : 'Date'"
                      readonly
                      :background-color="DarkMode"
                      outlined
                      v-bind="attrs"
                      v-on="on"
                      required
                      :rules="[rules.required]"
                    >
                      <template v-slot:label
                        >{{ languageSelect === 0 ? dateBookingTextThai() : dateBookingTextEng() }}
                      </template>
                      <template #prepend-inner>
                        <v-icon
                          v-if="DarkModeStatus === true"
                          :color="DarkMode === '#FFFFFF' ? '' : DarkMode"
                          right
                        >
                          mdi-calendar
                        </v-icon>
                        <v-icon v-if="DarkModeStatus === false" right>
                          mdi-calendar
                        </v-icon>
                      </template>
                    </v-text-field>
                  </template>
                  <!-- <div class="text-center">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                  </div> -->
                  <!-- @change="setLimitBooking(date), autoSetTime()" -->
                  <!-- :allowed-dates="allowedDates" -->
                  <!-- :picker-date.sync="pickerDate" -->
                  <v-date-picker
                    v-model="date"
                    no-title
                    scrollable
                    :allowed-dates="dayoff"
                    @change="autoSetTime()"
                    @input="(menuDate = false), $refs.menu.save(date)"
                    :min="currentDate"
                  >
                  </v-date-picker>
                </v-menu>
              </div>
            </v-col>
            <v-col class="pb-0" v-if="showTime === 'แสดง'" cols="6">
              <v-select
                v-model="time"
                :items="timeavailable"
                :label="languageSelect === 0 ? 'เวลา' : 'Time'"
                :background-color="DarkMode"
                item-text="text"
                item-value="text"
                persistent-hint
                return-object
                outlined
                required
                v-if="showTime === 'แสดง' && date !== ''"
                :rules="[rules.required]"
                attach
                :menu-props="{ bottom: true, offsetY: true }"
                @change="getDataAutoSetTime()"
              >
                <template v-slot:label
                  >{{ languageSelect === 0 ? "เวลา *" : "Time *" }}
                </template>
                <!-- <template slot="item" slot-scope="data">
                  <p class="text-wrap" >{{data.item.text + '-' + dataEmp.filter((it) => it.value === data.item.empId)[0].text}}</p>
                </template> -->
                </v-select
              >
            </v-col>
          </v-row>
          <div
            v-if="
              dataPackage.filter(el => {
                return el.balanceAmount > 0;
              }).length > 0
            "
          >
            <br>
            <div v-if="dataPackage.filter(el => { return el.balanceAmount > 0 }).length > 0">
            <v-card class="pl-1">
              <v-subheader
                >คุณมี
                {{
                  dataPackage.filter(el => {
                    return el.balanceAmount > 0;
                  }).length
                }}
                แพ็คเกจ</v-subheader
              >
              <v-subheader v-show="StatusPackage.packageName"
                >คุณได้ทำการเลือกแพ็คเกจ
                {{ StatusPackage.packageName }}</v-subheader
              >
              <v-slide-group active-class="success">
                <v-slide-item
                  v-for="(item, index) in dataPackage.filter(el => {
                    return el.balanceAmount > 0;
                  })"
                  :key="index"
                >
                  <v-card
                    class="ma-2 p-1"
                    width="340"
                    height="90"
                    color="#FFFFFF"
                    elevation="6"
                    :style="
                      item.packageId === fromAdd.packageId &&
                      item.token === fromAdd.tokenPackage
                        ? 'border: 1px solid green;'
                        : 'border: 1px solid white;'
                    "
                  >
                    <v-row>
                      <v-col cols="4" class="pr-1">
                        <v-img
                          contain
                          max-height="80"
                          max-width="200"
                          :src="item.packageImg"
                        ></v-img>
                      </v-col>
                      <v-col cols="8" class="font14 headline1 pb-6">
                        <v-row class="font16 bold headline1">
                          <v-col class="pl-1 pt-5 pb-0">{{
                            item.packageName
                          }}</v-col>
                          <v-btn
                            class="mr-4 mt-3"
                            v-if="
                              item.packageId !== fromAdd.packageId &&
                                item.token !== fromAdd.tokenPackage
                            "
                            color="green"
                            outlined
                            rounded
                            x-small
                            @click="
                              UpdatePackage(
                                item.packageId,
                                'ตกลง',
                                item.packageName,
                                item.token
                              )
                            "
                            >ตกลง</v-btn
                          >
                          <v-btn
                            class="mr-4 mt-3"
                            v-if="
                              item.packageId === fromAdd.packageId &&
                                item.token !== fromAdd.tokenPackage
                            "
                            color="green"
                            outlined
                            rounded
                            x-small
                            @click="
                              UpdatePackage(
                                item.packageId,
                                'ตกลง',
                                item.packageName,
                                item.token
                              )
                            "
                            >ตกลง</v-btn
                          >
                          <v-btn
                            class="mr-4 mt-3"
                            v-if="
                              item.packageId === fromAdd.packageId &&
                                item.token === fromAdd.tokenPackage
                            "
                            color="red"
                            outlined
                            rounded
                            x-small
                            @click="
                              UpdatePackage(
                                item.packageId,
                                'ยกเลิก',
                                item.packageName,
                                item.token
                              )
                            "
                            >ยกเลิก</v-btn
                          >
                        </v-row>
                        <v-row class="font14 headline1">
                          <v-col class="pl-1 pt-0 pb-0"
                            >จำนวนการใช้ {{ item.balanceAmount }} /
                            {{ item.amount }}
                          </v-col>
                        </v-row>
                        <v-row class="font14 headline1">
                          <v-col class="pl-1 pt-0 pb-0"
                            >วันหมดอายุ
                            {{
                              arrayMove(
                                new Date(item.expirePackage * 1000)
                                  .toLocaleString()
                                  .split(",")[0]
                                  .split("/"),
                                0,
                                1
                              )
                            }}
                          </v-col>
                        </v-row>
                      </v-col>
                      <!-- <v-col cols="3" class="pl-4">
                      <v-btn v-if="item.packageId !== fromAdd.packageId" color="green" outlined rounded x-small @click="UpdatePackage(item.packageId,'ตกลง',item.packageName)">ตกลง</v-btn>
                      <v-btn v-if="item.packageId === fromAdd.packageId" color="red" outlined rounded x-small @click="UpdatePackage(item.packageId,'ยกเลิก',item.packageName)">ยกเลิก</v-btn>
                  </v-col> -->
                    </v-row>

                    <!-- <h4>{{fromAdd.packageId}}</h4>
                <v-img :src="item.packageImg" height="163px"></v-img>
                <v-row class="font16 bold headline1">
                    <v-col class="pl-6 pt-5 pb-0">{{item.packageName}}</v-col>
                </v-row>
                <v-row class="font14 headline1">
                    <v-col class="pl-6 pt-0 pb-0">จำนวนการใช้  {{item.balanceAmount}} / {{item.amount}} </v-col>
                </v-row>
                <v-row class="font14 headline1">
                    <v-col class="pl-6 pt-0 pb-0">จำนวนแต้ม {{item.packagePoint}}  </v-col>
                </v-row>
                <v-row class="font14 headline1">
                    <v-col class="pl-6 pt-0 pb-0">ราคา Package {{item.packagePrice}} บาท </v-col>
                </v-row>
                <v-row class="font14 icon2">
                    <v-col class="pt-1 text-end pr-6">
                      <v-checkbox
                        v-model="fromAdd.packageId"
                        label="คลิก"
                        color="success"
                        :value="item.packageId"
                        hide-details
                      ></v-checkbox>
                      <v-btn outlined rounded x-small class="headline1" @click="fromAdd.packageId === item.packageId">คลิก</v-btn>
                    </v-col>
                </v-row>
                <br> -->
                  </v-card>
                </v-slide-item>
              </v-slide-group>
            </v-card>
            <br />
          </div>
          </div>
          <!-- <v-select
              v-if="dataPackage.length > 0"
              v-model="fromAdd.packageId"
              :items="dataPackage"
              label="แพ็กเก็ต *"
              :background-color="DarkMode"
              outlined
            >
            </v-select> -->
          <div v-for="(item, index) in fieldNameItem" :key="index">
            <template
              v-if="item.conditionField === '' || item.conditionField === null"
            >
              <v-col
                class="InputData"
                cols="12"
                v-if="item.fieldType == 'text'"
              >
                <v-text-field
                  v-if="item.fieldName === 'เบอร์โทร'"
                  v-mask="'###-###-####'"
                  v-model="item.fieldValue"
                  :label="
                    languageSelect === 0 ? item.fieldName : item.fieldNameEn
                  "
                  :background-color="DarkMode"
                  outlined
                  required
                  :rules="
                    item.requiredField === 'True' ? [rules.required] : [true]
                  "
                >
                  <template v-slot:label v-if="item.requiredField === 'True'"
                    >{{
                      languageSelect === 0
                        ? item.fieldName + "  *"
                        : item.fieldNameEn + "  *"
                    }}
                  </template>
                </v-text-field>
                <v-text-field
                  v-else
                  v-model="item.fieldValue"
                  :label="
                    languageSelect === 0 ? item.fieldName : item.fieldNameEn
                  "
                  :background-color="DarkMode"
                  outlined
                  required
                  :rules="
                    item.requiredField === 'True' ? [rules.required] : [true]
                  "
                >
                  <template v-slot:label v-if="item.requiredField === 'True'"
                    >{{
                      languageSelect === 0
                        ? item.fieldName + "  *"
                        : item.fieldNameEn + "  *"
                    }}
                  </template>
                </v-text-field>
              </v-col>
              <v-col
                class="InputData"
                cols="12"
                v-if="item.fieldType == 'Arguments'"
              >
              <v-checkbox
              class="px-4 pr-5 ma-0"
                v-model="item.fieldValue"
                :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"
                :value="languageSelect === 0 ? 'ตกลง' : 'accept'"
                required
                  :rules="
                    item.requiredField === 'True' ? [rules.required] : [true]
                  "
              >
              <template v-slot:label v-if="item.requiredField === 'True'">
                <h6 class="ma-0 mt-1" style="word-wrap: break-word;">{{languageSelect === 0 ? item.fieldName : item.fieldNameEn}}</h6>
                  </template>
              </v-checkbox>
                </v-col>
              <v-col
                class="InputData"
                cols="12"
                v-if="item.fieldType == 'number'"
              >
                <v-text-field
                  v-if="item.fieldName === 'เบอร์โทร'"
                  v-mask="'###-###-####'"
                  v-model="item.fieldValue"
                  :label="
                    languageSelect === 0 ? item.fieldName : item.fieldNameEn
                  "
                  :background-color="DarkMode"
                  outlined
                  required
                  :rules="
                    item.requiredField === 'True' ? [rules.required] : [true]
                  "
                  ><template v-slot:label v-if="item.requiredField === 'True'"
                    >{{
                      languageSelect === 0
                        ? item.fieldName + "  *"
                        : item.fieldNameEn + "  *"
                    }}
                  </template>
                </v-text-field>
                <v-text-field
                  v-else
                  v-model="item.fieldValue"
                  :label="
                    languageSelect === 0 ? item.fieldName : item.fieldNameEn
                  "
                  :background-color="DarkMode"
                  outlined
                  required
                  :rules="
                    item.requiredField === 'True' ? [rules.required,rules.numberType] : [true]
                  "
                  ><template v-slot:label v-if="item.requiredField === 'True'"
                    >{{
                      languageSelect === 0
                        ? item.fieldName + "  *"
                        : item.fieldNameEn + "  *"
                    }}
                  </template>
                </v-text-field>
              </v-col>
                            <v-col
                class="InputData"
                cols="12"
                v-if="item.fieldType == 'dateTime'"
              >
                    <v-menu
        ref="menudateTime"
        v-model="menudateTime"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="item.fieldValue"
            prepend-inner-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            outlined
            :background-color="DarkMode"
            :label="
              languageSelect === 0 ? item.fieldName : item.fieldNameEn
            "
            required
            :rules="
              item.requiredField === 'True' ? [rules.required] : [true]
            "
          >
          <template v-slot:label v-if="item.requiredField === 'True'"
                    >{{
                      languageSelect === 0
                        ? item.fieldName + "  *"
                        : item.fieldNameEn + "  *"
                    }}
                  </template>
          </v-text-field>

        </template>
        <v-date-picker
          v-model="item.fieldValue"
          no-title
          scrollable
          @input="menudateTime = false"
        >
        </v-date-picker>
      </v-menu>
              </v-col>
              <v-col
                class="InputData"
                cols="12"
                v-if="item.fieldType == 'Autocompletes'"
              >
                <v-autocomplete
                  :item-text="languageSelect === 0 ? 'text' : 'textEng'"
                  item-value="value"
                  v-model="item.fieldValue"
                  :items="JSON.parse(item.optionField)"
                  outlined
                  clearable
                  :background-color="DarkMode"
                  :label="
                    languageSelect === 0 ? item.fieldName : item.fieldNameEn
                  "
                  required
                  :rules="
                    item.requiredField === 'True' ? [rules.required] : [true]
                  "
                >
                  <template v-slot:label v-if="item.requiredField === 'True'"
                    >{{
                      languageSelect === 0
                        ? item.fieldName + "  *"
                        : item.fieldNameEn + "  *"
                    }}
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col
                class="InputData"
                cols="12"
                v-if="item.fieldType == 'Selects'"
              >
                <v-select
                  class="mb-1"
                  :item-text="languageSelect === 0 ? 'text' : 'textEng'"
                  item-value="value"
                  v-model="item.fieldValue"
                  :items="JSON.parse(item.optionField)"
                  :label="
                    languageSelect === 0 ? item.fieldName : item.fieldNameEn
                  "
                  :background-color="DarkMode"
                  required
                  clearable
                  :rules="
                    item.requiredField === 'True' ? [rules.required] : [true]
                  "
                  attach
            :menu-props="{ bottom: true, offsetY: true }"
                  outlined
                >
                  <template v-slot:label v-if="item.requiredField === 'True'"
                    >{{
                      languageSelect === 0
                        ? item.fieldName + "  *"
                        : item.fieldNameEn + "  *"
                    }}
                  </template>
                </v-select>
              </v-col>
              <v-col
                class="InputData"
                cols="12"
                v-if="item.fieldType == 'Radio'"
                style="padding:0px;"
              >
                <v-container fluid style="padding:0px;">
                  <v-radio-group
                    column
                    v-model="item.fieldValue"
                    :background-color="DarkMode"
                    :rules="
                      item.requiredField === 'True' ? [rules.required] : [true]
                    "
                    style="margin:0px;"
                  >
                    <template v-slot:label> </template>
                    <div
                      v-for="radios in JSON.parse(item.optionField)"
                      :key="radios.toISOString"
                    >
                      <v-radio
                        :label="
                          languageSelect === 0 ? radios.text : radios.textEng
                        "
                        :value="radios.value"
                      >
                        <template
                          v-slot:label
                          v-if="item.requiredField === 'True'"
                          >{{ radios.text }}
                        </template></v-radio
                      >
                    </div>
                  </v-radio-group>
                </v-container>
              </v-col>
            </template>
            <template
              v-if="
                item.conditionField !== '' &&
                  fieldNameItem.filter(row => {
                    return row.fieldId === parseInt(item.conditionField);
                  }).length > 0
              "
            >
              <template
                v-if="
                  item.conditionValue ===
                    fieldNameItem.filter(row => {
                      return row.fieldId === parseInt(item.conditionField);
                    })[0].fieldValue
                "
              >
                <v-col
                  class="InputData"
                  cols="12"
                  v-if="item.fieldType == 'text'"
                >
                  <v-text-field
                    v-if="item.fieldName === 'เบอร์โทร'"
                    v-mask="'###-###-####'"
                    v-model="item.fieldValue"
                    :label="
                      languageSelect === 0 ? item.fieldName : item.fieldNameEn
                    "
                    outlined
                    required
                    :background-color="DarkMode"
                    :rules="
                      item.requiredField === 'True' ? [rules.required] : [true]
                    "
                  >
                    <template v-slot:label v-if="item.requiredField === 'True'"
                      >{{
                        languageSelect === 0
                          ? item.fieldName + "  *"
                          : item.fieldNameEn + "  *"
                      }}
                    </template>
                  </v-text-field>
                  <v-text-field
                    v-else
                    v-model="item.fieldValue"
                    :label="
                      languageSelect === 0 ? item.fieldName : item.fieldNameEn
                    "
                    outlined
                    required
                    :background-color="DarkMode"
                    :rules="
                      item.requiredField === 'True' ? [rules.required] : [true]
                    "
                  >
                    <template v-slot:label v-if="item.requiredField === 'True'"
                      >{{
                        languageSelect === 0
                          ? item.fieldName + "  *"
                          : item.fieldNameEn + "  *"
                      }}
                    </template>
                  </v-text-field>
                </v-col>
                <v-col
                class="InputData"
                cols="12"
                v-if="item.fieldType == 'Arguments'"
              >
              <v-checkbox
              class="px-4 pr-5 ma-0"
                v-model="item.fieldValue"
                :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"
                :value="languageSelect === 0 ? 'ตกลง' : 'accept'"
                required
                  :rules="
                    item.requiredField === 'True' ? [rules.required] : [true]
                  "
              >
              <template v-slot:label v-if="item.requiredField === 'True'">
                <h6 class="ma-0 mt-1" style="word-wrap: break-word;">{{languageSelect === 0 ? item.fieldName : item.fieldNameEn}}</h6>
                  </template>
              </v-checkbox>
                </v-col>
                <v-col
                  class="InputData"
                  cols="12"
                  v-if="item.fieldType == 'number'"
                >
                  <v-text-field
                    v-if="item.fieldName === 'เบอร์โทร'"
                    v-mask="'###-###-####'"
                    v-model="item.fieldValue"
                    :label="
                      languageSelect === 0 ? item.fieldName : item.fieldNameEn
                    "
                    outlined
                    required
                    :background-color="DarkMode"
                    :rules="
                      item.requiredField === 'True' ? [rules.required] : [true]
                    "
                  >
                    <template v-slot:label v-if="item.requiredField === 'True'"
                      >{{
                        languageSelect === 0
                          ? item.fieldName + "  *"
                          : item.fieldNameEn + "  *"
                      }}
                    </template>
                  </v-text-field>
                  <v-text-field
                    v-else
                    v-model="item.fieldValue"
                    :label="
                      languageSelect === 0 ? item.fieldName : item.fieldNameEn
                    "
                    outlined
                    required
                    :background-color="DarkMode"
                    :rules="
                      item.requiredField === 'True' ? [rules.required,rules.numberType] : [true]
                    "
                  >
                    <template v-slot:label v-if="item.requiredField === 'True'"
                      >{{
                        languageSelect === 0
                          ? item.fieldName + "  *"
                          : item.fieldNameEn + "  *"
                      }}
                    </template>
                  </v-text-field>
                </v-col>
                                <v-col
                  class="InputData"
                  cols="12"
                  v-if="item.fieldType == 'dateTime'"
                >
                <v-menu
        ref="menuOptionfield"
        v-model="menuOptionfield"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="item.fieldValue"
            prepend-inner-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            outlined
            :background-color="DarkMode"
            :label="
              languageSelect === 0 ? item.fieldName : item.fieldNameEn
            "
            required
            :rules="
              item.requiredField === 'True' ? [rules.required] : [true]
            "
          >
          <template v-slot:label v-if="item.requiredField === 'True'"
                    >{{
                      languageSelect === 0
                        ? item.fieldName + "  *"
                        : item.fieldNameEn + "  *"
                    }}
                  </template>
        </v-text-field>
        </template>
        <v-date-picker
          v-model="item.fieldValue"
          no-title
          scrollable
          @input="menuOptionfield = false"
        >
        </v-date-picker>
      </v-menu>
                </v-col>
                <v-col
                  class="InputData"
                  cols="12"
                  v-if="item.fieldType == 'Autocompletes'"
                >
                  <v-autocomplete
                    :item-text="languageSelect === 0 ? 'text' : 'textEng'"
                    item-value="value"
                    v-model="item.fieldValue"
                    :background-color="DarkMode"
                    :items="JSON.parse(item.optionField)"
                    outlined
                    :label="
                      languageSelect === 0 ? item.fieldName : item.fieldNameEn
                    "
                    required
                    clearable
                    :rules="
                      item.requiredField === 'True' ? [rules.required] : [true]
                    "
                  >
                    <template v-slot:label v-if="item.requiredField === 'True'"
                      >{{
                        languageSelect === 0
                          ? item.fieldName + "  *"
                          : item.fieldNameEn + "  *"
                      }}
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col
                  class="InputData"
                  cols="12"
                  v-if="item.fieldType == 'Selects'"
                >
                  <v-select
                    :item-text="languageSelect === 0 ? 'text' : 'textEng'"
                    item-value="value"
                    class="mb-6"
                    v-model="item.fieldValue"
                    :items="JSON.parse(item.optionField)"
                    :background-color="DarkMode"
                    :label="
                      languageSelect === 0 ? item.fieldName : item.fieldNameEn
                    "
                    required
                    clearable
                    :rules="
                      item.requiredField === 'True' ? [rules.required] : [true]
                    "
                    outlined
                    attach
            :menu-props="{ bottom: true, offsetY: true }"
                  >
                    <template v-slot:label v-if="item.requiredField === 'True'"
                      >{{
                        languageSelect === 0
                          ? item.fieldName + "  *"
                          : item.fieldNameEn + "  *"
                      }}
                    </template>
                  </v-select>
                </v-col>
                <v-col
                  class="InputData"
                  cols="12"
                  v-if="item.fieldType == 'Radio'"
                  style="padding:0px;"
                >
                  <v-container fluid style="padding:0px;">
                    <v-radio-group
                      row
                      v-model="item.fieldValue"
                      :background-color="DarkMode"
                      :rules="
                        item.requiredField === 'True'
                          ? [rules.required]
                          : [true]
                      "
                      style="margin:0px;"
                    >
                      <template v-slot:label> </template>
                      <div
                        v-for="radios in JSON.parse(item.optionField)"
                        :key="radios.toISOString"
                      >
                        <v-radio
                          :label="
                            languageSelect === 0 ? radios.text : radios.textEng
                          "
                          :value="radios.value"
                          ><template
                            v-slot:label
                            v-if="item.requiredField === 'True'"
                            >{{ radios.text }}
                          </template></v-radio
                        >
                      </div>
                    </v-radio-group>
                  </v-container>
                </v-col>
              </template>
            </template>
            <template v-if="item.conditionField === 'flow'">
              <template
                v-if="
                  parseInt(item.conditionValue) === parseInt(fromAdd.flowId)
                "
              >
                <v-col
                  class="InputData"
                  cols="12"
                  v-if="item.fieldType == 'text'"
                >
                  <v-text-field
                    v-if="item.fieldName === 'เบอร์โทร'"
                    v-mask="'###-###-####'"
                    v-model="item.fieldValue"
                    :background-color="DarkMode"
                    :label="
                      languageSelect === 0 ? item.fieldName : item.fieldNameEn
                    "
                    :rules="
                      item.requiredField === 'True' ? [rules.required] : [true]
                    "
                    outlined
                  >
                    <template v-slot:label v-if="item.requiredField === 'True'"
                      >{{
                        languageSelect === 0
                          ? item.fieldName + "  *"
                          : item.fieldNameEn + "  *"
                      }}
                    </template>
                  </v-text-field>
                  <v-text-field
                    v-else
                    v-model="item.fieldValue"
                    :background-color="DarkMode"
                    :label="
                      languageSelect === 0 ? item.fieldName : item.fieldNameEn
                    "
                    :rules="
                      item.requiredField === 'True' ? [rules.required] : [true]
                    "
                    outlined
                  >
                    <template v-slot:label v-if="item.requiredField === 'True'"
                      >{{
                        languageSelect === 0
                          ? item.fieldName + "  *"
                          : item.fieldNameEn + "  *"
                      }}
                    </template>
                  </v-text-field>
                </v-col>
                <v-col
                class="InputData"
                cols="12"
                v-if="item.fieldType == 'Arguments'"
              >
              <v-checkbox
              class="px-4 pr-5 ma-0"
                v-model="item.fieldValue"
                :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"
                :value="languageSelect === 0 ? 'ตกลง' : 'accept'"
                required
                  :rules="
                    item.requiredField === 'True' ? [rules.required] : [true]
                  "
              >
              <template v-slot:label v-if="item.requiredField === 'True'">
                <h6 class="ma-0 mt-1" style="word-wrap: break-word;">{{languageSelect === 0 ? item.fieldName : item.fieldNameEn}}</h6>
                  </template>
              </v-checkbox>
                </v-col>
                <v-col
                  class="InputData"
                  cols="12"
                  v-if="item.fieldType == 'number'"
                >
                  <v-text-field
                    v-if="item.fieldName === 'เบอร์โทร'"
                    v-mask="'###-###-####'"
                    v-model="item.fieldValue"
                    :background-color="DarkMode"
                    :label="
                      languageSelect === 0 ? item.fieldName : item.fieldNameEn
                    "
                    :rules="
                      item.requiredField === 'True' ? [rules.required] : [true]
                    "
                    outlined
                  >
                    <template v-slot:label v-if="item.requiredField === 'True'"
                      >{{
                        languageSelect === 0
                          ? item.fieldName + "  *"
                          : item.fieldNameEn + "  *"
                      }}
                    </template></v-text-field
                  >
                  <v-text-field
                    v-else
                    v-model="item.fieldValue"
                    :background-color="DarkMode"
                    :label="
                      languageSelect === 0 ? item.fieldName : item.fieldNameEn
                    "
                    :rules="
                      item.requiredField === 'True' ? [rules.required,rules.numberType] : [true]
                    "
                    outlined
                  >
                    <template v-slot:label v-if="item.requiredField === 'True'"
                      >{{
                        languageSelect === 0
                          ? item.fieldName + "  *"
                          : item.fieldNameEn + "  *"
                      }}
                    </template></v-text-field
                  >
                </v-col>
                <v-col
                  class="InputData"
                  cols="12"
                  v-if="item.fieldType == 'dateTime'"
                >
                <v-menu
        ref="menuOptionfieldFlow"
        v-model="menuOptionfieldFlow"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="item.fieldValue"
            prepend-inner-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            outlined
            :background-color="DarkMode"
            :label="
              languageSelect === 0 ? item.fieldName : item.fieldNameEn
            "
            required
            :rules="
              item.requiredField === 'True' ? [rules.required] : [true]
            "
          >
          <template v-slot:label v-if="item.requiredField === 'True'"
                    >{{
                      languageSelect === 0
                        ? item.fieldName + "  *"
                        : item.fieldNameEn + "  *"
                    }}
                  </template>
        </v-text-field>
        </template>
        <v-date-picker
          v-model="item.fieldValue"
          no-title
          scrollable
          @input="menuOptionfieldFlow = false"
        >
        </v-date-picker>
      </v-menu>
                </v-col>
                <v-col
                  class="InputData"
                  cols="12"
                  v-if="item.fieldType == 'Autocompletes'"
                >
                  <v-autocomplete
                    :item-text="languageSelect === 0 ? 'text' : 'textEng'"
                    item-value="value"
                    v-model="item.fieldValue"
                    :items="JSON.parse(item.optionField)"
                    :background-color="DarkMode"
                    filled
                    clearable
                    :label="
                      languageSelect === 0 ? item.fieldName : item.fieldNameEn
                    "
                    :rules="
                      item.requiredField === 'True' ? [rules.required] : [true]
                    "
                  >
                    <template v-slot:label v-if="item.requiredField === 'True'"
                      >{{
                        languageSelect === 0
                          ? item.fieldName + "  *"
                          : item.fieldNameEn + "  *"
                      }}
                    </template></v-autocomplete
                  >
                </v-col>
                <v-col
                  class="InputData"
                  cols="12"
                  v-if="item.fieldType == 'Selects'"
                >
                  <v-select
                    :item-text="languageSelect === 0 ? 'text' : 'textEng'"
                    item-value="value"
                    class="mb-6"
                    v-model="item.fieldValue"
                    :items="JSON.parse(item.optionField)"
                    :background-color="DarkMode"
                    :label="
                      languageSelect === 0 ? item.fieldName : item.fieldNameEn
                    "
                    :rules="
                      item.requiredField === 'True' ? [rules.required] : [true]
                    "
                    hide-details
                    outlined
                    clearable
                    attach
            :menu-props="{ bottom: true, offsetY: true }"
                  >
                    <template v-slot:label v-if="item.requiredField === 'True'"
                      >{{
                        languageSelect === 0
                          ? item.fieldName + "  *"
                          : item.fieldNameEn + "  *"
                      }}
                    </template></v-select
                  >
                </v-col>
                <v-col
                  class="InputData"
                  cols="12"
                  v-if="item.fieldType == 'Radio'"
                  style="padding:0px;"
                >
                  <v-container fluid style="padding:0px;">
                    <v-radio-group
                      row
                      :background-color="DarkMode"
                      v-model="item.fieldValue"
                      style="margin:0px;"
                      :rules="
                        item.requiredField === 'True'
                          ? [rules.required]
                          : [true]
                      "
                    >
                      <template v-slot:label> </template>
                      <div
                        v-for="radios in JSON.parse(item.optionField)"
                        :key="radios.toISOString"
                        class="text-center"
                      >
                        <v-radio
                          :label="
                            languageSelect === 0 ? radios.text : radios.textEng
                          "
                          dense
                          :value="radios.value"
                          ><template
                            v-slot:label
                            v-if="item.requiredField === 'True'"
                            >{{ radios.text }}
                          </template></v-radio
                        >
                      </div>
                    </v-radio-group>
                  </v-container>
                </v-col>
              </template>
            </template>
          </div>
          <v-row v-if="showMenu === 'True'">
            <sideMenu :drawerParent="drawer" :toggleParent="toggle" :languageSelectParent="languageSelect" :dataMenuParent="dataMenu" :priceMenuParent="priceMenu" @updatePriceMenuParent="updatePriceMenu" @nameSubDialog="openDialogNameSub"></sideMenu>
            <v-col cols="12" class="pt-0 pb-4">
              <v-btn
                block
                :color="DarkModeButton"
                dark
                @click="toggle"
              >{{languageSelect === 0? "เมนู": "Menu"}}</v-btn>
            </v-col>
            <v-col cols="12" class="pt-0 pb-6">
              <v-expansion-panels multiple v-model="expansionMenu">
                <v-expansion-panel>
                  <v-expansion-panel-header>{{languageSelect === 0? "รายการและราคา": "Order list and prices"}}</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div style="align-items: center;width:100%;">
                      <v-row>
                        <v-col cols="12" v-for="(item,id) in dataMenu.filter(el => { return parseInt(el.qty) > 0 })" :key="id" style="display: flex;">
                          <v-card class="cardMenu">
                              <v-img
                                class="pictureMenu"
                                :src="item.picture"
                              ></v-img>
                              <v-row>
                                <v-col cols="8" class="pt-0 pb-0 textTitelMenu">{{item.name}}</v-col>
                                <v-col cols="8" style="display: flex;justify-content: flex-start;" class="pt-0 pb-0 textTitelMenuSub">{{item.qty}} x {{formatNumber(item.price)}}</v-col>
                                <v-col cols="6" class="pt-0 pb-0 textTitelMenuRemark">{{item.remark}}</v-col>
                              </v-row>
                          </v-card>
                        </v-col>
                        <v-col cols="12">
                          <v-row>
                            <v-col cols="6"><p class="ma-0 textTitelPriceMenu">{{languageSelect === 0? "รวมราคา": "Total price"}}</p></v-col>
                            <v-col cols="6" style="display: flex;justify-content: flex-end;" class="textTitelPriceMenu">{{formatNumber(priceMenu)}}</v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
          <template v-if="showMap === 'แสดง' && center !== null">
            <v-col class="InputData" cols="12">
              <v-text-field
                v-model="address"
                :label="languageSelect === 0 ? 'รายละเอียดที่อยู่ต้นทาง' : 'Address'"
                outlined
                required
                :background-color="DarkMode"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col class="InputData" cols="12">
              <v-card class="p-3">
                <GmapMap
                  v-if="center !== null"
                  :center="center"
                  :zoom="15"
                  style="width: 100%; height: 200px"
                  :options="{
                    disableDefaultUI: true,
                    fullscreenControl: true,
                    zoomControl: true
                  }"
                >
                  <GmapMarker
                    :position="center"
                    :draggable="true"
                    :animation="markerAnimation"
                    @dragend="updateCoordinates"
                  />
                </GmapMap>
              </v-card>
            </v-col>
          </template>
          <v-row v-if="bookingFieldData.length > 0">
            <v-col class="pt-0" cols="12" v-if="(bookingFieldData[0].showUpload1 || 'False') === 'True' ">
              <p class="text-center font-weight-bold">{{bookingFieldData[0].textUpload1}}</p>
              <input v-show="hideInputFile" type="file" ref="fileInput" @change="handleFileChange" accept="image/*,.pdf">
              <div style="display: flex;align-items: center;flex-direction: column-reverse;">
                <v-img
                  @click="addImage()"
                  height="98px"
                  width="327px"
                  :src="languageSelect === 0 ? 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FuploadFilesTH.png?alt=media&token=33cad7b5-9717-42db-9aa6-97c6861f2424' : 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FuploadFilesEN.png?alt=media&token=5f5e99e1-05a1-46eb-a420-26eb697608e0'"
                ></v-img>
              </div>
              <br>
              <v-row>
                <template v-if="fileUpload1.length > 0">
                  <v-col cols="12" class="pb-0 pt-0" v-for="(item, index) in fileUpload1" :key="index">
                    <v-text-field
                      v-model="item.name"
                      dense
                      outlined
                      readonly
                      append-icon="mdi-close-circle"
                      @click:append="deleteImage1(index)"
                    ></v-text-field>
                  </v-col>
                </template>
              </v-row>
            </v-col>
            <v-col class="pb-0" cols="12" v-if="(bookingFieldData[0].showUpload2 || 'False')  === 'True'">
              <p class="text-center font-weight-bold">{{bookingFieldData[0].textUpload2}}</p>
              <input v-show="hideInputFile" type="file" ref="fileInput2" @change="handleFileChange" accept="image/*,.pdf">
              <div style="display: flex;align-items: center;flex-direction: column-reverse;">
                <v-img
                  @click="addImage2()"
                  height="98px"
                  width="327px"
                  :src="languageSelect === 0 ? 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FuploadFilesTH.png?alt=media&token=33cad7b5-9717-42db-9aa6-97c6861f2424' : 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FuploadFilesEN.png?alt=media&token=5f5e99e1-05a1-46eb-a420-26eb697608e0'"
                ></v-img>
              </div>
              <br>
              <v-row>
                <template v-if="fileUpload2.length > 0">
                  <v-col cols="12" class="pb-0 pt-0" v-for="(item, index) in fileUpload2" :key="index">
                    <v-text-field
                      v-model="item.name"
                      dense
                      outlined
                      readonly
                      append-icon="mdi-close-circle"
                      @click:append="deleteImage2(index)"
                    ></v-text-field>
                  </v-col>
                </template>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </div>
      <div class="text-center mt-5" v-if="statusSave">
        <v-btn
          class="button"
          :color="DarkModeButton"
          dark
          large
          @click="validate, addBooking()"
          >{{ languageSelect === 0 ? bookingFormConfirmBT : bookingFormConfirmBTEn }}</v-btn
        >
        <!-- <v-btn
          class="button"
          large
          :color="DarkModeButton"
          dark
          @click="reset"
          >{{ languageSelect === 0 ? "ยกเลิก" : "Cancel" }}</v-btn
        > -->
      </div>
      <!-- <div v-if="showTable">
        <table v-for="(a,b) in showTable" :key="b" >
            <tr style="background-color:red;" v-if="a.status === false">{{a.value}}</tr>
            <tr style="background-color:green;" v-else>{{a.value}}</tr>
      </table>
      </div> -->
    </v-card>
    </div>
    <v-dialog v-model="dialogShowLimitBooking" persistent max-width="400px">
      <v-card>
        <v-col class="text-center">
          <span class="headline">มีชั่วโมงงานที่ท่านเลือกเต็มแล้ว</span>
        </v-col>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <div v-for="(item, index) in dataLimitBookingDate" :key="index">
                  <v-card-text class="text-center"
                    ><strong>{{ item.bookingTime }} : </strong>
                    <v-chip class="ma-2 white--text" :color="item.color">
                      <strong>{{ item.countBookingLimit }}</strong>
                    </v-chip>
                  </v-card-text>
                </div>
              </v-col>
            </v-row>
            <div class="text-center">
              <v-btn
                elevation="10"
                color="#173053"
                outlined
                style="background-color:#FFFFFF"
                small
                @click="dialogShowLimitBooking = false"
                >เลือกเวลา หรือ จำนวนชั่วโมงงานใหม่</v-btn
              >
            </div>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogPrivacyNotice"
      max-width="99%"
      scrollable
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <div style="display:flex;justify-content: center;" class="ma-3" v-if="shop.length > 0">
            <v-chip
              class="mr-1 font-weight-black"
              :style="'background-color:' + (languageSelect === 0 ? DarkModeButton : 'rgb(103 103 103 / 18%)') + ';font-size:20px'"
              dark
              @click="languageSelect = 0"
              >
              <v-avatar left>
                <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fflag-TH.png?alt=media&token=e4bd7ffa-aed9-47e3-9240-4dcb9d8d284e"></v-img>
              </v-avatar>
                TH
            </v-chip>
            <v-chip
              class="ml-1 font-weight-black"
              :style="'background-color:' + (languageSelect === 1 ? DarkModeButton : 'rgb(103 103 103 / 18%)') + ';font-size:20px'"
              dark
              @click="languageSelect = 1">
              <v-avatar left>
                <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fflag-USA1.png?alt=media&token=a83dd820-f576-457a-8d08-1009cea9d70b"></v-img>
              </v-avatar>
                EN
            </v-chip>
          </div>
        <v-card-text v-if="shop.length > 0">
          <PrivacyNotice :shopId="shopId" :shopname="shop[0].shopName" :Email="shop[0].contactEmail" :contactTel="shop[0].contactTel" :languageSelect="languageSelect"></PrivacyNotice>
        </v-card-text>
        <v-card-actions v-if="shop.length > 0" class="text-center">
          <!-- <div class="text-center"> -->
            <v-btn
            color="teal"
            class="button"
            dark
            large
            @click="checkUserId()"
          >
            {{ languageSelect === 0 ? "ยอมรับ" : "Accept" }}
          </v-btn>
          <v-btn
            color="error"
            class="button"
            dark
            large
            @click="gotoThank()"
          >
            {{ languageSelect === 0 ? "ไม่ยอมรับ" : "Reject" }}
          </v-btn>
          <!-- </div> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogSelectGoto"
      max-width="100%"
      persistent
    >
      <v-card style="background: linear-gradient(180deg, #ffffff 10%, #e1f3ff 100%);" height="auto">
        <v-container fluid class="pa-4">
          <!-- <div class="mb-2" style="text-align: end;">
            <v-card-title style="justify-content: space-between;"><div class="pl-3">กรุณาเลือก</div> <v-avatar color="#FAD4D4" size="35">
                  <span style="color:red;padding-bottom: 4px;"><v-icon class="iconify" color="red" data-icon="fluent:receipt-add-20-regular"></v-icon></span>
            </v-avatar></v-card-title>
          </div> -->
          <v-row dense>
            <v-col cols="6" style="border-right: 2px solid #ccd1e4;">
              <div style="text-align: center;" @click="dialogSelectGoto = false">
                <v-avatar color="#9A9897" size="50">
                  <span><span><v-icon class="iconify" color="white" style="font-size: 30px;" data-icon="fa:calendar"></v-icon></span></span>
                </v-avatar>
                <div>นัดหมายใหม่</div>
                <div>Boooking</div>
              </div>
            </v-col>
            <v-col cols="6" v-if="statusCheckDiposit">
              <div height="200px" style="text-align: center;" @click="gotoCheckUser('upload')">
                <v-avatar color="#9A9897" size="50">
                  <span><v-icon class="iconify" color="white" style="font-size: 40px;" data-icon="fluent:receipt-add-20-regular"></v-icon></span>
                </v-avatar>
                <div>แนบหลักฐานโอนเงิน</div>
                <div>Uploaded file</div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <GoogleCalendar ref="GoogleCalendarRef" />
    <v-dialog v-model="dialogNameSub">
      <v-card class="pa-5" style="min-height: 85px;">
        <v-card-text>{{ NameSubData }}</v-card-text>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script>
import axios from 'axios' // api
import moment from 'moment'
import PrivacyNotice from './PrivacyNotice.vue'
import sideMenu from '../Menu/sideMenu.vue'
import GoogleCalendar from '../Core/GoogleCalendarCmp.vue'

export default {
  components: {
    name: '',
    PrivacyNotice,
    GoogleCalendar,
    sideMenu
  },
  watch: {
    // menuDate (val) {
    //   val && setTimeout(() => (this.$refs.dateRef.activePicker = 'month'))
    // },
    pickerDate (newval, oldval) {
      this.getMonth(newval)
      // this.allowedDates()
      // here you can check if month changed using newval and oldval
    }
  },
  data () {
    return {
      markerAnimation: NaN,
      hideInputFile: false,
      textImage: '',
      overlay: false,
      statusSave: true,
      dialogPrivacyNotice: true,
      dialogShowLimitBooking: false,
      dataLimitBookingDate: [],
      selectCountBookingLimit: 1,
      currentDate: moment().format('YYYY-MM-DD'),
      currentMonth: moment().format('YYYY-MM'),
      pickerDate: null,
      activePicker: null,
      languageSelect: 0,
      tab: null,
      center: null,
      address: '',
      profile: [],
      valid: true,
      time: '',
      branch: [],
      fieldNameItem: [],
      shop: [],
      shopId: '',
      source: '',
      DataFlowName: [],
      DataFlowNameAll: [],
      DataflowId: '',
      date: '',
      showTime: '',
      showMap: '',
      showLimitBooking: 'False',
      limitBookingSelect: 'False',
      menuDate: false,
      modal2: false,
      dataCustomer: [],
      fromAdd: {
        bookingFieldId: null,
        fieldId: '',
        fieldValue: '',
        flowId: '',
        masBranchID: '',
        empId: '',
        dueDate: '',
        shopId: '',
        userId: '',
        packageId: '',
        tokenPackage: '',
        statusUpload1: 'False',
        statusUpload2: 'False',
        fileUpload1: '',
        fileUpload2: ''
      },
      fileUpload1: [],
      fileUpload2: [],
      timeavailable: null,
      packageItem: [
        {
          packageImg:
            'https://storage.googleapis.com/betask-loyalty.appspot.com/static/upload/package/LINE_ALBUM___4.jpg',
          packageName: 'testtttttttttttt'
        },
        {
          packageImg:
            'https://storage.googleapis.com/betask-loyalty.appspot.com/static/upload/package/LINE_ALBUM___4.jpg',
          packageName: 'ssssssssssssssss'
        }
      ],
      // timeavailable: ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'],
      rules: {
        numberType: value => {
          if (isNaN(value)) {
            return 'กรุณากรอกตัวเลขเท่านั้น'
          }

          const parsedValue = parseFloat(value)
          if (!Number.isInteger(parsedValue)) {
            return 'กรุณากรอกตัวเลขเท่านั้น'
          }

          return true
        },
        numberRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        counterTel: value => value.length <= 10 || 'Max 10 characters',
        IDcardRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        required: value => !!value || '',
        resizeImag: value =>
          !value ||
          value.size < 2000000 ||
          'Avatar size should be less than 2 MB!',
        counterIDcard: value => value.length <= 13 || 'Max 13 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      branchData: [],
      ColorByShop: [],
      DarkMode: '',
      DarkModeStatus: null,
      DarkModeButton: '',
      DarkModeBackground: '',
      DarkModefont: '',
      LoGo: [],
      ImgCover: '',
      dataPackage: [],
      StatusPackage: {
        status: 'ตกลง',
        color: 'green',
        packageName: ''
      },
      dueDate: '',
      dueDateItems: [],
      historyData: [],
      historyDataDefault: [],
      statusHistory: false,
      dialogHistory: false,
      dataReadyHistory: true,
      checkLimitBooking: {
        ID: '',
        countBooking: null,
        limitCheck: null,
        limitBooking: 0,
        timeSelect: [],
        timeBooking: [],
        slotByflow: ''
      },
      dateDayoff: [],
      dateDayCustom: [],
      dateDaylimit: null,
      limitBookingCheck: false,
      EmpItemLimit: [],
      bookingFieldData: [],
      statusCheckDiposit: false,
      statusCheckHistrory: false,
      dialogSelectGoto: false,
      menuOptionfield: false,
      menudateTime: false,
      menuOptionfieldFlow: false,
      dataEmp: [],
      dataEmpAll: [],
      showTable: [],
      empTitleTh: '',
      empTitleEng: '',
      timeSlotbyCustomer: [],
      customerTimeSlot: 'False',
      fromAddTimeCus: '',
      dataLineConfig: {},
      statusByCalendar: true,
      bookingFormHeader: '',
      bookingFormHistoryBT: '',
      bookingFormConfirmBT: '',
      bookingFormHeaderEn: '',
      bookingFormHistoryBTEn: '',
      bookingFormConfirmBTEn: '',
      liffSendMessageAfterBookingStatus: '',
      statusGoogleCalendar: '',
      statusGoogleCalendarEmp: '',
      showMenu: 'False',
      expansionMenu: [0],
      drawer: false,
      priceMenu: 0,
      dataMenu: [],
      dialogNameSub: false,
      NameSubData: '',
      bookingNowCheck: null,
      bookingNowCheckCount: null,
      bookingNowCheckTimeStatus: null,
      empTime: [],
      setTimeError: true
    }
  },
  async mounted () {
    // await this.geolocate()
    // this.pushMsglineGroup()
    // console.log('this.$route.query.error', this.$route.query.error)
    // alert(this.$route.query.error)
    if (this.$route.query.languageSelect) {
      this.languageSelect = parseInt(this.$route.query.languageSelect)
    }
    // if (
    //   this.$route.query.error === 'ACCESS_DENIED' ||
    //   this.$route.query.error === 'access_denied'
    // ) {
    //   const queryString = decodeURIComponent(window.location.search).replace(
    //     '?liff.state=',
    //     ''
    //   )
    //   console.log('queryString', queryString)
    //   const params = new URLSearchParams(queryString)
    //   this.shopId = params.get('shopId')
    //   this.source = params.get('source')
    //   console.log('shopId', this.shopId)
    //   console.log('source', this.source)
    // } else {
    //   let checkShopId = ''
    //   if (this.$route.query.shopId) {
    //     checkShopId = this.$route.query.shopId
    //   } else {
    //     const queryString = decodeURIComponent(window.location.search).replace(
    //       '?liff.state=',
    //       ''
    //     )
    //     console.log('queryString', queryString)
    //     const params = new URLSearchParams(queryString)
    //     checkShopId = params.get('shopId')
    //   }
    //   this.dataLineConfig = await this.getDataLineConfig(checkShopId)
    //   await this.checkLiffLogin(this.dataLineConfig)
    //   await this.checkBanUserId(this.profile.userId, checkShopId)
    //   this.getDataHistory()
    // }
    if (this.$route.query.shopId) {
      this.source = this.$route.query.source
      this.shopId = this.$route.query.shopId
      await this.getShop()
      // await this.getDataFlow()
      await this.getDataBranch()
      await this.getBookingField()
      await this.BookingByCalendarBooking()
    }
  },
  methods: {
    checkFlowAndShop () {
      let dtCheck = this.DataFlowNameAll.filter((ii) => ii.flowId === this.fromAdd.flowId) || []
      console.log('dtCheck', dtCheck)
      if (dtCheck.length > 0) {
        if (this.statusGoogleCalendar === 'True' && dtCheck[0].GoogleCalendarMeet === 'True') {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    async connectGoogleCalendar (shopId, status, bookNo) {
      console.log('status !!!', status)
      this.$refs.GoogleCalendarRef.checkTypeEvenEmp(shopId, status, bookNo)
    },
    openDialogNameSub (item) {
      console.log('item!!!!', item)
      this.dialogNameSub = true
      this.NameSubData = item
    },
    deleteImage1 (index) {
      this.fileUpload1.splice(index, 1)
    },
    deleteImage2 (index) {
      this.fileUpload2.splice(index, 1)
    },
    handleFileChange (event) {
      const selectedFile = event.target.files[0]
      const allowedTypes = ['application/pdf']
      const fileSize = selectedFile.size
      if (allowedTypes.includes(selectedFile.type)) {
        if (fileSize > 10 * 1024 * 1024) {
          this.$swal(this.languageSelect === 0 ? 'ไฟล์มีขนาดใหญ่เกินไป' : 'The file is too large.', this.languageSelect === 0 ? 'กรุณาอัพโหลดไฟล์ที่มีขนาดไม่เกิน 10 MB' : 'Please upload a file less than 10 MB.', 'error')
        } else {
          if (this.textImage === 'fileUpload1') {
            this.fileUpload1.push(event.target.files[0])
          } else {
            this.fileUpload2.push(event.target.files[0])
          }
        }
      } else {
        if (this.textImage === 'fileUpload1') {
          this.fileUpload1.push(event.target.files[0])
        } else {
          this.fileUpload2.push(event.target.files[0])
        }
      }
    },
    addImage () {
      this.textImage = 'fileUpload1'
      this.$refs.fileInput.click()
    },
    addImage2 () {
      this.textImage = 'fileUpload2'
      this.$refs.fileInput2.click()
    },
    toggle () {
      this.drawer = !this.drawer
    },
    updatePriceMenu (price, dataMenu) {
      console.log('updatePriceMenu', price)
      this.priceMenu = price
      this.dataMenu = dataMenu
    },
    updatePlace (place) {
      // console.log(place)
      this.center = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
    },
    dayoff (val) {
      // คำนวนวันหยุด กรณีช่างหลายคน
      // console.log('val', this.dataEmpAll)
      let item = val
      let newDate = new Date(item)
      let day = newDate.getDay()
      let dateOffitem = []
      let dateOnitem = []
      // console.log('!!!', this.dataEmpAll)
      for (let i = 0; i < this.dataEmpAll.length; i++) {
        let item = this.dataEmpAll[i]
        if (item.typeDayCustom === 'off') {
          if (JSON.parse(item.dateDayoffValue).filter((f) => f === day).length > 0) {
            dateOffitem.push(val)
          } else {
            if (JSON.parse(item.dateDayCustom).filter((f) => f === val).length > 0) {
              dateOffitem.push(val)
            }
          }
        }
        if (item.typeDayCustom === 'on') {
          if (JSON.parse(item.dateDayCustom).filter((f) => f === val).length > 0) {
            dateOnitem.push(val)
          }
        }
      }
      // console.log('dateOffitem', dateOffitem)
      // console.log('dateOnitem', dateOnitem)
      let status = true
      if (dateOffitem.filter((f) => f === val).length > 0 && dateOffitem.length === this.dataEmpAll.filter((f) => f.typeDayCustom === 'off').length) {
        status = false
      }
      if (dateOnitem.filter((f) => f === val).length > 0) {
        status = true
      }
      // console.log('status', status)
      return status
    },
    async AddallowedDatesBysetTimebyday () {
      await this.SetallowedDates()
      if (this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTimebyday === 'True') {
        let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTime)
        timeJson.forEach((item) => {
          if (item.setTime.length < this.fromAddTimeCus) {
            if (this.dateDayoff.filter((i) => i === item.value).length === 0) {
              this.dateDayoff.push(item.value)
            }
          }
        })
      }
      console.log('this.dateDayoff', this.dateDayoff)
    },
    checkCustomerTimeSlot () {
      this.statusChek = false
      // console.log('DataFlowNameAll', this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId))
      this.timeSlotbyCustomer = []
      this.customerTimeSlot = this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId)[0].customerTimeSlot
      let timeSLOT = this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId)[0].timeSlot
      let coutTimeSlot = 1
      // console.log('TIMESLOTBYFLOW_____', this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId)[0].timeSlot)
      let allTime = []
      if (this.customerTimeSlot === 'True') {
        // console.log('EmpItemLimit', this.EmpItemLimit)
        for (let i = 0; i < this.EmpItemLimit.length; i++) {
          let dt = this.EmpItemLimit[i]
          if (dt.setTimebyday === 'True') {
            let timeJson = JSON.parse(dt.setTime)
            let dataTime = []
            timeJson.forEach((itemTime, index) => {
              // console.log('item', itemTime)
              allTime = itemTime.setTime
              allTime.forEach((item, key) => {
                let ss = {}
                if (allTime.length === 1) {
                  ss.text = 'ไม่ระบุ (มีเวลาเดียว)'
                  ss.value = key + 1
                  dataTime.push(ss)
                } else {
                  if (key > 0) {
                    let start = allTime.filter((i, k) => k === 0)[0].value
                    let end = item.value
                    ss.text = this.calculateTime(start, end)
                    ss.textEng = this.calculateTimeEng(start, end)
                    ss.value = key
                    // console.log('TIMEEEE', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value)
                    // console.log('TIMEEEE2', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value, 'coutTime', coutTimeSlot)
                    if (coutTimeSlot === timeSLOT) {
                      dataTime.push(ss)
                      coutTimeSlot = 1
                    } else {
                      coutTimeSlot = coutTimeSlot + 1
                    }
                  // this.timeSlotbyCustomer.push(ss)
                  }
                }
                if ((key + 1) === allTime.length) {
                  coutTimeSlot = 1
                }
              })
            })
            dataTime.forEach((i, n) => {
            // console.log('TTTTTT', this.timeSlotbyCustomer.filter((item) => item.text === i.text && item.value === i.value).length === 0)
              if (this.timeSlotbyCustomer.filter((item) => item.text === i.text && item.value === i.value).length === 0) {
                // console.log('n', n)
                this.timeSlotbyCustomer.push(i)
              }
            })
          // console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
          } else {
            allTime = JSON.parse(dt.setTime)
            allTime.forEach((item, key) => {
              let ss = {}
              if (allTime.length === 1) {
                ss.text = item.value
                // ss.value = key + 1
                // this.timeSlotbyCustomer.push(ss)
                this.fromAddTimeCus = key + 1
                // this.selectflow()
                // this.selectflowByCustomer()
              } else {
                if (key > 0) {
                  let start = allTime.filter((i, k) => k === 0)[0].value
                  let end = item.value
                  ss.text = this.calculateTime(start, end)
                  ss.textEng = this.calculateTimeEng(start, end)
                  ss.value = key
                  // console.log('____', ss.value, timeSLOT, '-', ss.value / timeSLOT)
                  // console.log('TIMEEEE', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value, 'coutTime', coutTimeSlot)
                  if (coutTimeSlot === timeSLOT) {
                    this.timeSlotbyCustomer.push(ss)
                    coutTimeSlot = 1
                  } else {
                    coutTimeSlot = coutTimeSlot + 1
                  }
                }
              }
            })
          }
        }
      } else {
        // this.selectflowByCustomer()
      }
      console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
    },
    checkTitleEmp () {
      this.customerTimeSlot = 'False'
      let checkDataEmpTitle = this.DataFlowNameAll.filter(el => { return el.flowId === this.fromAdd.flowId })
      if (checkDataEmpTitle.length > 0) {
        this.empTitleTh = checkDataEmpTitle[0].empTitleTh || 'พนักงานช่าง'
        this.empTitleEng = checkDataEmpTitle[0].empTitleEng || 'Employee'
      } else {
        this.empTitleTh = 'พนักงานช่าง'
        this.empTitleEng = 'Employee'
      }
    },
    clearconditionField () {
      // let nameConditionField = []
      this.fieldNameItem.forEach((item) => {
        if (item.conditionField !== null && item.conditionField !== '') {
          item.fieldValue = ''
        }
      })
    },
    dateBookingTextThai () {
      let textThai = ''
      if (this.shopId === 'U9f316c85400fd716ea8c80d7cd5b61f8') {
        textThai = 'วันที่เข้ารับบริการ *'
      } else {
        textThai = 'วันที่ *'
      }
      return textThai
    },
    dateBookingTextEng () {
      let textThai = ''
      if (this.shopId === 'U9f316c85400fd716ea8c80d7cd5b61f8') {
        textThai = 'Date of service *'
      } else {
        textThai = 'Date *'
      }
      return textThai
    },
    async checkSlot () {
      if (this.empTime.length > 1) {
        let allTime = []
        for (let i = 0; i < this.empTime.length; i++) {
          let d = this.empTime[i]
          allTime.push(...d.Duplicates)
        }
        // console.log('allTime', allTime)
        // console.log('allTime.every(value => value === allTime[0])', allTime.every(value => value === allTime[0]))
        if (allTime.every(value => value === allTime[0]) === false) {
          this.setTimeError = false
        }
      } else if (this.empTime.length === 1) {
        if (this.empTime[0].statusEmp === false) {
          this.setTimeError = false
        }
      } else {
        console.log('ไม่มีช่าง')
      }
    },
    async getEmpCheck () {
      this.empTime = []
      await axios.get(this.DNS_IP + '/empSelect/get?privacyPage=bookingform&shopId=' + this.shopId).then(async (response) => {
        let rs = response.data
        // console.log('rssssssssssssss', rs)
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            if (d.flowId !== null && d.flowId !== '') {
              let checkFlowId = JSON.parse(d.flowId)
              if (checkFlowId.filter((a) => parseInt(a) === this.fromAdd.flowId).length > 0) {
                if (d.setTime !== null && d.setTime !== '[]' && d.setTime !== '') {
                  if (d.setTimebyday === 'True') {
                    let dt = JSON.parse(d.setTime) || []
                    let TimeDifference = []
                    console.log('dt', dt)
                    for (let b = 0; b < dt.length; b++) {
                      let dtTime = dt[b]
                      // console.log('TEST', await this.calculateTimeDifference(dtTime.setTime))
                      if (dtTime.setTime) {
                        TimeDifference.push(...await this.calculateTimeDifference(dtTime.setTime))
                      }
                    }
                    console.log('TimeDifference', TimeDifference)
                    d.slotTimeCheck = TimeDifference
                    d.checkFlowId = checkFlowId
                    d.Duplicates = await this.removeDuplicates(TimeDifference)
                    d.statusEmp = TimeDifference.every(value => value === TimeDifference[0])
                    this.empTime.push(d)
                  } else {
                    let TimeDifference = await this.calculateTimeDifference(JSON.parse(d.setTime))
                    d.slotTimeCheck = TimeDifference
                    d.checkFlowId = checkFlowId
                    d.Duplicates = await this.removeDuplicates(TimeDifference)
                    d.statusEmp = TimeDifference.every(value => value === TimeDifference[0])
                    this.empTime.push(d)
                  }
                }
              }
            }
          }
        }
      })
      console.log('this.empTime', this.empTime)
    },
    removeDuplicates (array) {
      // ใช้ filter เพื่อสร้างอาร์เรย์ใหม่ที่มีเฉพาะค่าที่ไม่ซ้ำ
      const uniqueArray = array.filter((value, index, self) => {
        // ใช้ indexOf เพื่อตรวจสอบว่าค่าอยู่ในอาร์เรย์เพียงครั้งเดียว
        return self.indexOf(value) === index
      })

      return uniqueArray
    },
    calculateTimeDifference (timeData) {
      // แปลงข้อมูลเวลาเป็นวินาที
      const timesInSeconds = timeData.map(item => this.convertToSeconds(item.value))

      // คำนวณระยะห่างระหว่างเวลา
      const differences = []
      for (let i = 0; i < timesInSeconds.length - 1; i++) {
        const difference = timesInSeconds[i + 1] - timesInSeconds[i]
        differences.push(difference)
      }

      // แปลงระยะห่างเป็นนาที
      const differencesInMinutes = differences.map(difference => Math.floor(difference / 60))
      // console.log(differencesInMinutes)
      return differencesInMinutes
    },

    // แปลงเวลาจาก HH:mm เป็นวินาที
    convertToSeconds (time) {
      const [hours, minutes] = time.split(':')
      return parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60
    },
    async checkBrech () {
      let checkFlow = this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId)[0].customerTimeSlot
      console.log('checkFLow', checkFlow)
      if (checkFlow === 'True') {
        await this.getEmpCheck()
        await this.checkSlot()
        console.log('this.setTimeError', this.setTimeError)
        if (this.setTimeError) {
          if (this.fromAdd.masBranchID !== '') {
            this.fromAdd.empId = ''
            this.fromAddTimeCus = ''
            this.GetbookingNowCheck()
            await this.getEmp()
            await this.checkCustomerTimeSlot()
            console.log('testttttttttttt')
            if (this.dataEmp.length === 0) {
              this.$swal(
                this.languageSelect === 0 ? 'ไม่มี' + this.empTitleTh + 'สำหรับประเภทบริการนี้' : 'There is no ' + this.empTitleEng + ' for this type of service.',
                this.languageSelect === 0 ? 'กรุณาเลือกประเภทบริการอื่นๆ' : 'Please select another type of service.',
                'info'
              )
              this.fromAdd.flowId = ''
            }
          } else {
            this.fromAdd.masBranchID = ''
          }
        } else {
          this.$swal({
            title: 'ผิดพลาด',
            text: 'เนื่องจากบริการนี้ไม่สามารถใช้งานได้ กรุณาติดต่อร้านค้า',
            type: 'info',
            timer: 5000,
            showConfirmButton: false
          })
          this.fromAdd.flowId = ''
        }
      } else {
        if (this.fromAdd.masBranchID !== '') {
          this.fromAdd.empId = ''
          this.fromAddTimeCus = ''
          this.GetbookingNowCheck()
          await this.getEmp()
          await this.checkCustomerTimeSlot()
          console.log('testttttttttttt')
          if (this.dataEmp.length === 0) {
            this.$swal(
              this.languageSelect === 0 ? 'ไม่มี' + this.empTitleTh + 'สำหรับประเภทบริการนี้' : 'There is no ' + this.empTitleEng + ' for this type of service.',
              this.languageSelect === 0 ? 'กรุณาเลือกประเภทบริการอื่นๆ' : 'Please select another type of service.',
              'info'
            )
            this.fromAdd.flowId = ''
          }
        } else {
          this.fromAdd.masBranchID = ''
        }
      }
      console.log('hi')
    },
    async BookingByCalendarBooking () {
      if (this.$route.query.source === 'CalendarBookingAutoEmpNoLine') {
        this.statusByCalendar = false
        console.log('this.$route.query.source', this.$route.query)
        this.fromAdd.masBranchID = parseInt(this.$route.query.masBranchID)
        await this.getDataFlow()
        this.fromAdd.flowId = parseInt(this.$route.query.flowId)

        this.GetbookingNowCheck()
        await this.getEmp()
        // this.getPackage()
        // await this.checkTime()
        this.date = this.$route.query.date
        if (this.$route.query.customerTimeSlot === 'True') {
          console.log('IFF!!!!!!!!')
          await this.checkCustomerTimeSlot()
          this.fromAddTimeCus = parseInt(this.$route.query.fromAddTimeCus)
          // if (this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTimebyday === 'True') {
          //   this.date = ''
          //   this.AddallowedDatesBysetTimebyday()
          //   this.date = this.$route.query.date
          // }
        }
        await this.autoSetTime()
        this.time = this.timeavailable.filter((item) => item.value === this.$route.query.time)[0] || ''
        if (this.time === '') {
          this.$swal({
            title: this.languageSelect === 0 ? 'มีลูกค้าท่านอื่น จองเวลาที่คุณเลือกแล้ว ?' : 'Have another customer Your selected time has been reserved ?',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#b3b1ab',
            confirmButtonText: this.languageSelect === 0 ? 'ไปหน้าปฏิทินนัดหมาย' : 'Go to the appointment calendar page',
            cancelButtonText: this.languageSelect === 0 ? 'เลือกเวลาใหม่จากหน้าปัจจุบัน' : 'Select a new time from the current page.'
          }).then(async response => {
            this.$router.push('/CalendarBookingAutoEmp?shopId=' + this.shopId)
          }).catch(error => {
            console.log('error function booking_transaction : ', error)
          })
        } else {
          await this.getDataAutoSetTime()
        }
        this.statusByCalendar = true
      }
    },
    calculateTime (start, end) {
      let countTime = null
      // if (end > start) {
      //   let time = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
      //   let h = parseInt(time.split(':')[0])
      //   let m = parseInt(time.split(':')[1])
      //   countTime = (h * 60) + m
      // } else {
      //   countTime = 0
      // }
      if (end > start) {
        let genTime = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
        let h = parseInt(genTime.split(':')[0])
        let m = parseInt(genTime.split(':')[1])
        if (h === 0 && m !== 0) {
          countTime = m + ' นาที'
        } else if (h !== 0 && m === 0) {
          countTime = h + ' ชม.'
        } else {
          countTime = h + ' ชม. ' + m + ' นาที'
        }
      } else {
        countTime = 'No Data'
      }
      return countTime
    },
    calculateTimeEng (start, end) {
      let countTime = null
      // if (end > start) {
      //   let time = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
      //   let h = parseInt(time.split(':')[0])
      //   let m = parseInt(time.split(':')[1])
      //   countTime = (h * 60) + m
      // } else {
      //   countTime = 0
      // }
      if (end > start) {
        let genTime = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
        let h = parseInt(genTime.split(':')[0])
        let m = parseInt(genTime.split(':')[1])
        if (h === 0 && m !== 0) {
          countTime = m + ' min.'
        } else if (h !== 0 && m === 0) {
          countTime = h + ' h.'
        } else {
          countTime = h + ' h. ' + m + ' min.'
        }
      } else {
        countTime = 'No Data'
      }
      return countTime
    },
    gotoCheckUser (text) {
      if (text === 'history') {
        this.$router.push('/CheckBookingNext?shopId=' + this.$route.query.shopId)
      } else {
        this.$router.push('/PaymentUpload?shopId=' + this.$route.query.shopId + '&languageSelect=' + this.languageSelect)
      }
    },
    async checkUserId () {
      this.statusCheckDiposit = false
      this.statusCheckHistrory = false
      await axios
        .get(
          this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.$route.query.shopId +
            '&userId=' +
            this.profile.userId +
            '&checkOnsite=is null&statusBt=null&checkDeposit=True&depositStatus=null'
        )
        .then(async response => {
          let rs = response.data
          console.log('response.data', rs)
          if (rs.status === false) {
            this.dialogPrivacyNotice = false
            this.dialogSelectGoto = false
          } else {
            let checkDepositStatus = rs.filter(el => { return moment(el.dueDate).format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD') })
            // console.log('response.data', checkDepositStatus)
            if (checkDepositStatus.length > 0) {
              // this.statusCheckHistrory = true
              this.statusCheckDiposit = true
              this.dialogSelectGoto = true
            } else {
              // this.statusCheckHistrory = false
              this.statusCheckDiposit = false
              this.dialogSelectGoto = false
            }
            this.dialogPrivacyNotice = false
          }
        })
    },
    selectfileUpload (item) {
      console.log(item)
      if (item === 'fileUpload1') {
        if (this.fileUpload1) {
          this.fromAdd.fileUpload1 = URL.createObjectURL(this.fileUpload1)
        } else {
          this.fromAdd.fileUpload1 = ''
        }
      } else {
        if (this.fileUpload2) {
          this.fromAdd.fileUpload2 = URL.createObjectURL(this.fileUpload2)
        } else {
          this.fromAdd.fileUpload2 = ''
        }
      }

      // console.log(event)
    },
    gotoThank () {
      this.$router.push('/Thank?shopId=' + this.shopId + '&languageSelect=' + this.languageSelect)
    },
    checkLimitBookingGet () {
      if (this.limitBookingSelect === 'True') {
        this.statusSave = false
        this.setCountTime()
      } else {
        this.statusSave = true
      }
    },
    setCountTime () {
      let limitCountBranch = 0
      // let setTime = JSON.parse(this.branchData.filter(item => { return item.masBranchID === this.fromAdd.masBranchID })[0].setTime)
      let setTime = JSON.parse(this.EmpItemLimit.filter(el => { return el.flowId === parseInt(this.fromAdd.flowId) })[0].setTime)
      // console.log('setTime', setTime)
      let index = setTime.findIndex(
        element => element.value === this.time.value
      )
      limitCountBranch = setTime.slice(
        index,
        index + this.selectCountBookingLimit
      )
      this.limitCountBranch = limitCountBranch
      this.getDataLimitBooking()
    },
    async getDataLimitBooking () {
      this.dataLimitBookingDate = []
      // let setTime = JSON.parse(this.branchData.filter(item => { return item.masBranchID === this.fromAdd.masBranchID })[0].setTime)
      let setTime = JSON.parse(this.EmpItemLimit.filter(el => { return el.empId === parseInt(this.fromAdd.empId) })[0].setTime)
      let limitBooking = 0
      if (setTime.length > 0) {
        limitBooking = setTime.filter(el => {
          return el.value === this.time.value
        })[0].limitBooking
      } else {
        limitBooking = 0
      }
      // console.log('limitBooking', limitBooking)
      if (limitBooking !== 0) {
        await axios
          .get(
            this.DNS_IP +
              '/LimitBookingDate/get?shopId=' +
              this.$route.query.shopId +
              '&bookingDate=' +
              this.date
          )
          .then(async response => {
            let rs = response.data
            if (rs.status === false) {
              this.dataLimitBookingDate = []
              this.statusSave = true
            } else {
              for (let i = 0; i < rs.length; i++) {
                let d = rs[i]
                let s = {}
                s.bookingTime = d.bookingTime
                s.countBookingLimit = d.countBooking + '/' + limitBooking
                s.countBooking = d.countBooking
                // if (d.countBooking === parseInt(limitBooking)) {
                //   s.color = 'orange darken-1'
                // } else
                if (d.countBooking > parseInt(limitBooking)) {
                  s.color = 'red darken-1'
                } else if (d.countBooking <= parseInt(limitBooking)) {
                  s.color = 'blue darken-1'
                }
                this.dataLimitBookingDate.push(s)
              }
              for (let i = 0; i < this.limitCountBranch.length; i++) {
                let s = {}
                let d = this.limitCountBranch[i]
                if (
                  this.dataLimitBookingDate.filter(el => {
                    return el.bookingTime === d.value
                  }).length > 0
                ) {
                  let index = this.dataLimitBookingDate.findIndex(
                    element => element.bookingTime === d.value
                  )
                  this.dataLimitBookingDate[index].countBooking =
                    this.dataLimitBookingDate[index].countBooking + 1
                  this.dataLimitBookingDate[index].countBookingLimit =
                    this.dataLimitBookingDate[index].countBooking +
                    '/' +
                    limitBooking
                  // if (this.dataLimitBookingDate[index].countBooking === parseInt(limitBooking)) {
                  //   this.dataLimitBookingDate[index].color = 'orange darken-1'
                  // } else
                  if (
                    this.dataLimitBookingDate[index].countBooking >
                    parseInt(limitBooking)
                  ) {
                    this.dataLimitBookingDate[index].color = 'red darken-1'
                  } else if (
                    this.dataLimitBookingDate[index].countBooking <=
                    parseInt(limitBooking)
                  ) {
                    this.dataLimitBookingDate[index].color = 'blue darken-1'
                  }
                } else {
                  s.bookingTime = d.value
                  s.countBooking = 1
                  s.countBookingLimit = 1 + '/' + limitBooking
                  s.color = 'blue darken-1'
                  this.dataLimitBookingDate.push(s)
                }
              }
              this.dataLimitBookingDate = this.dataLimitBookingDate.sort(
                (a, b) => {
                  if (a.bookingTime < b.bookingTime) return -1
                  return a.bookingTime > b.bookingTime ? 1 : 0
                }
              )
              if (
                this.dataLimitBookingDate.filter(el => {
                  return el.color === 'red darken-1'
                }).length > 0
              ) {
                this.dialogShowLimitBooking = true
                this.statusSave = false
              } else {
                this.statusSave = true
              }
            }
            // console.log(' this.dataLimitBookingDate', this.dataLimitBookingDate)
            // console.log('limitBooking', limitBooking)
          })
      }
    },
    async getMonth (month) {
      console.log('month', month)
      // const result = await axios.get(this.DNS_IP + '/LimitBookingDate/get_LimitDate?shopId=' + this.shopId + '&masBranchID=' + this.fromAdd.masBranchID + '&bookingDate=' + month)
      console.log('this.shopId', this.shopId, this.fromAdd.flowId, month)
      const result = await axios.get(this.DNS_IP + '/LimitBookingDate/get_LimitDate?shopId=' + this.shopId + '&flowId=' + this.fromAdd.flowId + '&bookingDate=' + month)
      console.log('month1')
      if (result.data.length > 0) {
        console.log('getMonth IF', result.data)
        this.dateDaylimit = []
        let dt = result.data
        if (dt[0].limitBookingCheck === 'True') {
          console.log('limitBookingCheck === True')
          dt.forEach((v, k) => {
            if (JSON.parse(v.setTime)) {
              let count = 0
              JSON.parse(v.setTime).forEach((v2, k2) => {
                count += parseInt(v2.limitBooking)
              })
              if (v.sum >= count) {
                this.dateDaylimit.push(
                  moment(v.bookingDate).format('YYYY-MM-DD')
                )
              }
            }
          })
        } else {
          console.log('limitBookingCheck === False')
          this.dateDaylimit = []
        }

        // this.dateDaylimit = result.data.map((item) => { return this.momenDate_1(item.bookingDate) })
      } else {
        console.log('getMonth ELSE')
        this.dateDaylimit = []
      }
      // console.log('this.dateDaylimit', this.dateDaylimit)
    },
    arrayMove (arr, oldindex, newindex) {
      arr.splice(newindex, 0, arr.splice(oldindex, 1)[0])
      console.log('arr', arr)
      return arr[1] + '/' + arr[0] + '/' + arr[2]
    },
    async getDataHistory () {
      if (this.$route.query.error === undefined) {
        const BookingData = await axios
          .get(
            this.DNS_IP +
              '/BookingData/get_history?shopId=' +
              this.shopId +
              '&userId=' +
              this.profile.userId
          )
          .then(async response => {
            return response.data
          })
          .catch(error => {
            console.log('error function addData : ', error)
            return null
          })
        await this.ConvertHistoryData(BookingData)
      }
    },
    async ConvertHistoryData (BookingData) {
      this.historyDataDefault = []
      this.statusHistory = false
      // console.log('BookingData', BookingData)
      if (BookingData !== null) {
        if (BookingData.status === false) {
          this.historyDataDefault = []
          this.statusHistory = false
        } else {
          // this.$swal('ไม่พบประวัติการเข้ารับบริการ', 'กรูณาตรวจสอบข้อมูล', 'info')
          let defaultData = BookingData.reduce((r, a) => {
            let bookNo = a.bookNo
            // let filter = (a.fieldName === 'เลขทะเบียน') ? a.fieldValue : null
            // if (filter !== null) {
            r[a.dueDate] = r[a.dueDate] || {}
            r[a.dueDate][bookNo] = r[a.dueDate][bookNo] || []
            //   r[filter][bookNo] = r[filter][bookNo] || []
            // console.log('a', a)
            r[a.dueDate][bookNo].push(a)
            this.dueDateItems.push(a.dueDate)
            // }
            return r
          }, Object.create(null))

          // console.log('defaultData', defaultData)
          this.historyDataDefault = defaultData
          this.statusHistory = true
        }
        console.log('historyDataDefault', this.historyDataDefault)
      } else {
        this.$swal(
          this.languageSelect === 0 ? 'พบความผิดพลาดระหว่างดำเนินการ' : 'An error was encountered during the operation.',
          this.languageSelect === 0 ? 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่' : 'Please press the button to fetch new data.',
          'info'
        )
          .then(result => {
            location.reload()
          })
          .catch(error => {
            console.log('error function addData : ', error)
            location.reload()
          })
      }
    },
    selectDataHistory () {
      this.historyData = []
      this.historyData.push(this.historyDataDefault[this.dueDate])
      // console.log('this.HistoryData', this.historyData)
    },
    useHistory (item) {
      let dataSelect = this.fieldNameItem
      this.fieldNameItem = []
      for (let i = 0; i < dataSelect.length; i++) {
        let d = dataSelect[i]
        if (
          item.filter(el => {
            return parseInt(el.fieldId) === d.fieldId
          }).length > 0
        ) {
          d.fieldValue = item.filter(el => {
            return parseInt(el.fieldId) === d.fieldId
          })[0].fieldValue
        }
        this.fieldNameItem.push(d)
      }
      this.address = item[0].address
      this.dialogHistory = false
    },
    updateCoordinates (location) {
      this.markerAnimation = NaN
      this.center = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng()
      }
    },
    async geolocate () {
      await navigator.geolocation.getCurrentPosition(
        async position => {
          const center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          if (center) {
            this.center = center
          }
        },
        error => {
          this.center = null
          // this.center.lat = null
          // this.center.lng = null
          console.log('error map :', error.message)
        }
      )
    },
    allowedMinute (m) {
      return m % 15 === 0
    },
    allowedHour (h) {
      return h >= 8 && h <= 17
    },
    async UpdatePackage (packageId, StatusPackage, packageName, tokenPackage) {
      console.log(packageId, StatusPackage, packageName, tokenPackage)
      if (StatusPackage === 'ตกลง') {
        this.fromAdd.packageId = packageId
        this.fromAdd.tokenPackage = tokenPackage
        // this.StatusPackage.status = 'ยกเลิก'
        // this.StatusPackage.color = 'red'
        this.StatusPackage.packageName = packageName
      } else {
        this.fromAdd.packageId = ''
        this.fromAdd.tokenPackage = ''
        // this.StatusPackage.status = 'ตกลง'
        // this.StatusPackage.color = 'green'
        this.StatusPackage.packageName = ''
      }
    },
    async getPackage () {
      var dataCheckMap = this.DataFlowNameAll.filter(el => {
        return el.flowId === this.fromAdd.flowId
      })
      if (dataCheckMap.length > 0) {
        for (var x = 0; x < dataCheckMap.length; x++) {
          var t = dataCheckMap[x]
          if (t.menuShowStatus === 'True') {
            this.showMenu = 'True'
            console.log('this.dataMenu', t.menuItem)
            this.dataMenu = JSON.parse(t.menuItem) || []
          } else {
            this.showMenu = 'False'
            this.dataMenu = []
          }
          if (t.checkOnsite === 'True') {
            this.showMap = 'แสดง'
          } else {
            this.showMap = 'ไม่แสดง'
          }
          if (this.showMap === 'แสดง') {
            await this.geolocate()
          }
        }
      } else {
        this.showMap = 'ไม่แสดง'
      }
      if (this.$route.query.error === undefined) {
        // this.fieldNameItem.forEach((field, index) => {
        //   if (field.fieldId === 101) {
        //     this.fieldNameItem[index].fieldValue = String(this.fromAdd.flowId)
        //   }
        // })
        this.dataPackage = []
        await axios
          .get(
            this.DNS_IP_Loyalty +
            // 'https://api-beloyalty-productions.betaskthai.com/' +
              '/PackageLog/get?shopId=' +
              this.shopId +
              '&userId=' +
              this.profile.userId +
              '&flowId=' +
              this.fromAdd.flowId +
              '&checkExpired=T'
          )
          .then(response => {
            console.log('PackageLog', response.data)
            let rs = response.data
            if (rs.status !== false) {
              for (var i = 0; i < rs.length; i++) {
                let d = rs[i]
                let s = {}
                s.text = d.packageName
                s.value = d.packageId
                this.dataPackage.push(d)
                // console.log('this.DataFlowName', this.DataFlowName)
              }
            } else {
              this.dataPackage = []
            }
          })
      }
    },
    async setLimitBooking (dateitem) {
      this.time = ''
      this.timeavailable = []
      // this.showTable = []
      let setTime = []
      // เช็คว่า เวลาในแต่ละวันเหมือนกันรึป่าว
      if (this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTimebyday === 'True') {
        let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTime).filter((items) => items.value === new Date(dateitem).getDay())
        setTime = timeJson[0].setTime || []
        console.log('IF')
      } else {
        console.log('ELSE')
        setTime = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTime) || []
      }
      console.log('this.EmpItemLimit.filter', this.EmpItemLimit)
      this.limitBookingCheck = this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].limitBookingCheck || 'False'
      if (this.limitBookingCheck === 'True') {
        this.timeavailable = setTime
        let slotByflow = []
        if (this.customerTimeSlot === 'False') {
          slotByflow = this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId)[0].timeSlot
        } else {
          slotByflow = this.fromAddTimeCus
        }
        let overTime = this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId)[0].overTime
        console.log('overTime', overTime)
        if (this.timeavailable.length >= slotByflow) {
          let LimitBooking = await this.getLimitBooking()
          console.log('LimitBooking', LimitBooking)
          // เซ็ต Status True ให้แต่ละช่วงเวลา
          this.timeavailable.forEach((v, k) => {
            if (typeof v.status === 'undefined') {
              v.status = true
              if (v.limitBooking === '0') {
                v.status = false
              }
            }
          })
          // เซ็ต Status False ให้กับช่วงเวลาที่มีคนจองแล้ว
          if (LimitBooking.status !== false) {
            if (LimitBooking.length > 0) {
              this.timeavailable.forEach((v, k) => {
                let bookingTarget = LimitBooking.filter((a) => a.bookingTime === v.value)
                console.log('booking', bookingTarget)
                if (bookingTarget.length > 0) {
                  v.status = false
                  let bookingTargetSlot = bookingTarget[0].timeSlotCustomer || bookingTarget[0].timeSlot
                  for (let bT = 0; bT < bookingTargetSlot; bT++) {
                    if (this.timeavailable[k + bT] !== undefined) {
                      this.timeavailable[k + bT].status = false
                    }
                  }
                }
              })
            }
          }
          console.log('this.timeavailable 1', this.timeavailable)

          // จับคู่เวลาตาม slotbyFlow
          let Newtimeavailable = []
          let slotCheck = slotByflow
          for (let i = 0; i < this.timeavailable.length; i++) {
            let num = i + (slotCheck - 1)
            let checkitem = this.timeavailable.filter((item, key) => (key >= i && key <= num))
            console.log('checkitem', checkitem, slotCheck)
            Newtimeavailable.push(checkitem)
          }
          console.log('Newtimeavailable', Newtimeavailable)
          this.timeavailable = []

          //  ตัดเวลาที่มีค่า False ออก
          Newtimeavailable.forEach((v, k) => {
            console.log('v.length >= slotCheck', v.length, slotCheck)
            if (overTime === 'True') {
              if (v.filter((v) => v.status === false).length <= 0) {
                this.timeavailable.push(v[0])
              }
            } else {
              console.log('else')
              // ปิดเวลาสุดท้ายในกรณีที่ ไม่ต้องการให้จองเลยเวลา
              if (v.filter((v) => v.status === false).length <= 0 && v.length >= slotCheck) {
                this.timeavailable.push(v[0])
              }
            }
          })
          console.log('this.timeavailable 3', this.timeavailable)

          // ตัดเวลาในกรณีที่เป็นวันปัจจุบัน เพื่อตัดเวลาที่ผ่านมาแล้วออก
          if (moment(dateitem).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            this.timeavailable = this.timeavailable.filter(item => moment().format(item.value) > moment().format('HH:mm'))
          } else {
          }
          if (this.timeavailable.length === 0) {
            this.$swal(this.languageSelect === 0 ? 'คิวเต็มแล้ว' : 'Full queue', this.languageSelect === 0 ? 'กรุณาเลือกวันที่ใหม่อีกครั้ง' : 'Please select a new date again.', 'error')
            this.date = ''
          }
          if (this.timeavailable.length === 1) {
            this.time = this.timeavailable[0]
          }
        } else {
          this.timeavailable = []
          this.$swal(this.languageSelect === 0 ? 'คิวเต็มแล้ว' : 'Full queue', this.languageSelect === 0 ? 'กรุณาเลือกวันที่ใหม่อีกครั้ง' : 'Please select a new date again.', 'error')
            .then(() => { this.date = '' }).catch(() => { this.date = '' })
        }
      } else {
        console.log('this.timeavailable ELSEEEEE', this.timeavailable)
        // LimitBookingBy Flow
        this.timeavailable = setTime
        if (this.timeavailable.length === 1) {
          this.time = this.timeavailable[0]
        }
      }
    // await this.chekSlotTime()
    },
    async chekSlotTime () {
      let defaultTime = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTime) || []
      let slotByflow = this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId)[0].timeSlot
      let count = 0
      let itemcount = []
      let itemTotal = []
      for (let i = 0; i < defaultTime.length; i++) {
        let d = defaultTime[i]
        if (count === slotByflow) {
          itemTotal.push(itemcount)
          itemcount = []
          count = 0
        } else {
          itemcount.push(d.value)
          count += 1
        }
      }
      // defaultTime.forEach((v, k) => {
      //   if (count === slotByflow) {
      //     itemTotal.push(itemcount)
      //     itemcount = []
      //     count = 0
      //   } else {
      //     itemcount.push(v.value)
      //     count += 1
      //   }
      // })
      // console.log('defaultTime', defaultTime)
      console.log('itemTotal', itemTotal)
    },
    async checkTime () {
      // LimitBookingBy masBranch
      // this.timeavailable = JSON.parse(this.branchData.filter(item => { return item.masBranchID === this.fromAdd.masBranchID })[0].setTime) || []

      // LimitBookingBy Flow
      let setTime = []
      let currentDate = new Date().getDay()
      // เช็คว่า เวลาในแต่ละวันเหมือนกันรึป่าว
      if (this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTimebyday === 'True') {
        let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTime).filter((items) => items.value === currentDate)
        setTime = timeJson[0].setTime || []
        console.log('IF checkTime')
      } else {
        console.log('ELSE checkTime')
        setTime = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTime) || []
      }
      this.timeavailable = setTime
      console.log('timevailable', this.timeavailable)
    },
    async SetallowedDates () {
      console.log('SetallowedDates', this.dataEmpAll)
      this.dataEmpAll.forEach((v, k) => {
        console.log('test')
        if (v.empId === this.fromAdd.empId) {
          console.log('dateDayoffValue', v.dateDayoffValue)
          console.log('dateDayCustom', v.dateDayCustom)
          v.dateDayCustom = v.dateDayCustom || ''
          v.dateDayoffValue = v.dateDayoffValue || ''
          if (v.dateDayoffValue !== '') {
            // console.log('if')
            this.dateDayoff = JSON.parse(v.dateDayoffValue)
          } else {
            // console.log('else')
            this.dateDayoff = []
          }
          if (v.dateDayCustom !== '') {
            this.dateDayCustom = JSON.parse(v.dateDayCustom)
          } else {
            this.dateDayCustom = []
          }
        }
      })

      console.log('datoff', this.dateDayoff)
      console.log('Daycustom', this.dateDayCustom)
      console.log('test', this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId))
      if (this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId).length > 0) {
        let bookingNowCheck = this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId)[0].bookingNowCheck || ''
        if (bookingNowCheck === 'True') {
          console.log('ๅ_ๅ/_ๅ/_ๅ/_ๅ/_test', this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId)[0].bookingNowCheckCount || 1)
          let bookingNowCheckCount = this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId)[0].bookingNowCheckCount || 1
          this.currentDate = moment().add(bookingNowCheckCount, 'days').format('YYYY-MM-DD')
        } else {
          this.currentDate = moment().format('YYYY-MM-DD')
        }
      }
    },
    allowedDates (val) {
      // if (this.dateDaylimit) {
      //   if (this.branchData.filter(el => el.masBranchID === this.fromAdd.masBranchID)[0].typeDayCustom === 'on') {
      //     return val === this.dateDayCustom.filter(el => el === val)[0]
      //   } else {
      //     if (
      //       this.dateDayoff.filter(el => {
      //         return el === new Date(val).getDay()
      //       }).length === 0 &&
      //     this.dateDayCustom.filter(el => {
      //       return el === val
      //     }).length === 0 &&
      //     this.dateDaylimit.filter(el => {
      //       return el === val
      //     }).length === 0
      //     ) {
      //       return val
      //     }
      //   }
      // }
      if (this.dateDaylimit) {
        if (this.dataEmpAll.filter(el => el.empId === this.fromAdd.empId)[0].typeDayCustom === 'on') {
          return val === this.dateDayCustom.filter(el => el === val)[0]
        } else {
          if (
            this.dateDayoff.filter(el => {
              return el === new Date(val).getDay()
            }).length === 0 &&
          this.dateDayCustom.filter(el => {
            return el === val
          }).length === 0 &&
          this.dateDaylimit.filter(el => {
            return el === val
          }).length === 0
          ) {
            return val
          }
        }
      }
    },
    async getShop () {
      if (this.shopId) {
        await axios
          .get(this.DNS_IP + '/sys_shop/get?shopId=' + this.shopId)
          .then(response => {
            let rs = response.data
            console.log('rssssssssssss', rs)
            if (rs.length > 0) {
              this.shop = rs
              rs.forEach(v => {
                if (v.primaryColor) {
                  this.ColorByShop.push(v.primaryColor, v.secondaryColor)
                  this.DarkModeBackground = v.primaryColor
                  this.DarkModeButton = v.secondaryColor
                } else {
                  this.ColorByShop.push('#E1F3FF', '#FFFFFF')
                  this.DarkModeBackground = '#FFFFFF'
                  this.DarkModeButton = '#E1F3FF'
                }
                if (v.shopImge) {
                  this.LoGo = v.shopImge
                } else {
                  this.LoGo = require('@/assets/LogoDefault.jpg')
                }
                if (v.shopImageCover) {
                  this.ImgCover = v.shopImageCover
                } else {
                  if (v.category === 'ธุรกิจรถยนต์') {
                    this.ImgCover = require('@/assets/Cover2.jpg')
                  } else {
                    this.ImgCover = require('@/assets/Cover2.jpg')
                  }
                }
                if (v.darkMode === 'True') {
                  this.DarkMode = '#FFFFFF'
                  this.DarkModefont = '#FFFFFF'
                  this.DarkModeStatus = true
                } else {
                  this.DarkMode = '#ffffff00'
                  this.DarkModefont = '#000000'
                  this.DarkModeStatus = false
                }
              })
            } else {
              this.shop = null
            }
            this.statusGoogleCalendar = rs[0].statusGoogleCalendar
            this.statusGoogleCalendarEmp = rs[0].statusGoogleCalendarEmp
            console.log('this.shop ', this.shop)
          })
      } else {
        this.ColorByShop.push('#E1F3FF', '#FFFFFF')
        this.DarkMode = '#ffffff00'
        this.DarkModefont = '#173053'
      }
    },
    async liffSendMessages (textitem) {
      try {
        await this.$liff.sendMessages([
          {
            type: 'text',
            text: textitem
          }
        ])
      } catch (error) {
        // alert(error)
        console.log('error', error)
      }
    },
    async checkLiffLogin (dataLineConfig) {
      await this.$liff
        .init({
          liffId: dataLineConfig.liffMainID
        })
        .then(async () => {
          if (process.env.NODE_ENV === 'development') {
            this.getProfile_dev()
          } else {
            if (!this.$liff.isLoggedIn()) {
              this.$liff.login({ redirectUri: window.location.href })
            } else {
              await this.getProfile()
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
      this.profile = this.$profile_dev
      console.log('dev', this.profile)
    },
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    async selectBranch () {
      this.fromAdd.flowId = ''
      this.date = ''
      this.customerTimeSlot = 'False'
      await this.getDataFlow()
    },
    async getDataFlow () {
      this.DataFlowName = []
      this.DataFlowNameAll = []
      let dataFlowName = []
      let dataFlowNameAll = []
      // console.log('DataFlowName', this.DataFlowName)
      await axios.get(this.DNS_IP + '/flow/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        // console.log('rssssssssssssss', rs)
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            let checkBranchByFlow = d.masBranchID || 'All'
            if ((checkBranchByFlow === this.fromAdd.masBranchID.toString()) || checkBranchByFlow === 'All') {
              console.log('eeeeeee', d.flowName)
              if (d.timeSlotStatus === 'True') {
                let s = {}
                s.text = d.flowName
                s.textEng = d.flowNameEn
                s.value = d.flowId
                dataFlowName.push(s)
                dataFlowNameAll.push(d)
              }
            }
          }
          this.DataFlowName = dataFlowName
          // this.DataFlowName = dataFlowName.sort((a, b) => {
          //   if (a.text < b.text) return -1
          //   return a.text > b.text ? 1 : 0
          // })
          this.DataFlowNameAll = dataFlowNameAll
          if (this.DataFlowName.length === 1) {
            this.fromAdd.flowId = this.DataFlowName[0].value
            this.checkTitleEmp()
            this.getPackage()
            this.date = ''
            this.checkBrech()
            this.clearconditionField()
          }
          // this.DataFlowNameAll = dataFlowNameAll.sort((a, b) => {
          //   if (a.flowName < b.flowName) return -1
          //   return a.flowName > b.flowName ? 1 : 0
          // })
          console.log('this.DataFlowNameAll', this.DataFlowNameAll)
        } else {
          this.DataFlowName = []
          this.DataFlowNameAll = []
        }
      })
    },
    async getEmp () {
      this.fromAdd.empId = ''
      this.dataEmp = []
      this.dataEmpAll = []
      this.EmpItemLimit = []
      await axios.get(this.DNS_IP + '/empSelect/get?privacyPage=bookingform&masBranchID=' + this.fromAdd.masBranchID).then(async (response) => {
        let rs = response.data
        console.log('rssssssssssssssEmpItemLimit', rs)
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            if (d.flowId !== null && d.flowId !== '') {
              let checkFlowId = JSON.parse(d.flowId)
              if (checkFlowId.filter((a) => parseInt(a) === this.fromAdd.flowId).length > 0) {
                if (d.setTime !== null && d.setTime !== '[]' && d.setTime !== '') {
                  let s = {}
                  s.text = d.empFull_NameTH
                  s.textEng = d.empFull_NameTH
                  s.value = d.empId
                  this.dataEmp.push(s)
                  this.dataEmpAll.push(d)
                  let limit = {}
                  limit.empId = d.empId
                  limit.limitBookingCheck = d.limitBookingCheck || 'False'
                  limit.setTime = d.setTime || '[]'
                  limit.setTimebyday = d.setTimebyday
                  this.EmpItemLimit.push(limit)
                  // console.log('EmpItemLimit', this.EmpItemLimit)
                }
              }
            }
          }
          if (this.dataEmp.length === 0) {
            this.$swal(
              this.languageSelect === 0 ? 'ไม่มี' + this.empTitleTh + 'สำหรับประเภทบริการนี้' : 'There is no ' + this.empTitleEng + ' for this type of service.',
              this.languageSelect === 0 ? 'กรุณาเลือกประเภทบริการอื่นๆ' : 'Please select another type of service.',
              'info'
            )
          }
          if (this.dataEmp.length === 1) {
            this.fromAdd.empId = this.dataEmp[0].value
            console.log('IFEMP')
            // await this.SetallowedDates()
            // await this.checkCustomerTimeSlot()
          }
        } else {
          this.dataEmp = []
          this.dataEmpAll = []
          this.EmpItemLimit = []
        }
      })
    },
    async getDataAutoSetTime () {
      let dueDate = this.date
      let getDay = new Date(this.date).getDay()
      let Time = this.time.value
      let flowId = this.fromAdd.flowId
      let empId = this.timeavailable.filter((item) => item.value === this.time.value)[0].empId
      console.log('Time', empId)
      await axios.get(this.DNS_IP + '/Booking/getAutoSetTime?shopId=' + this.shopId + '&dueDate=' + dueDate + '&getDay=' + getDay + '&Time=' + Time + '&flowId=' + flowId + '&empId=' + empId)
        .then(async (response) => {
          let rs = response.data
          console.log('RS', rs)
          if (rs.length > 0) {
            this.fromAdd.empId = rs[0].empId
          } else {
            this.fromAdd.empId = ''
            this.time = ''
          }
        }).catch((error) => console.log(error))
    },
    async getLimitBookingAutoEmp () {
      // let LimitBooking = axios.get(this.DNS_IP + '/LimitBookingDateEmp/get?shopId=' + this.shopId + '&bookingDate=' + this.date).then(async (response) => {
      //   let rs = response.data
      //   return rs
      // })
      let LimitBooking = axios.get(this.DNS_IP + '/LimitBookingDateEmp/getConcat?shopId=' + this.shopId + '&bookingDate=' + this.date).then(async (response) => {
        let rs = response.data
        let Data = []
        if (rs.length > 0) {
          console.log('rs3333', rs)
          await rs.forEach((item) => {
            let Time = JSON.parse(item.LimitBookingEpm)
            // console.log('TIME', Time)
            Time.forEach((timeItem) => {
              let s = {}
              s.empId = item.empId
              s.bookingTime = timeItem.bookingTime
              s.timeSlotCustomer = timeItem.timeSlotCustomer
              Data.push(s)
            })
          })
          // console.log('DATA', Data)
        }
        return Data
      })
      return LimitBooking
    },
    async mokUp () {
      let A = []
      await this.EmpItemLimit.forEach(async (item) => {
        // ตรวจสอบว่าพนักงานตั้งค่าเวลาไม่เหมือนกันรึป่าว
        if (item.setTimebyday === 'True') {
          let TimeJson = JSON.parse(item.setTime)
          // forEach เวลาของพนักงานตามเงื่อนไข IF ว่าวันที่เลือกตรงกับวันไหน จ-อา
          await TimeJson.forEach(async (Titem) => {
            // เงือนไขวัน จ-อา
            let ddTime = Titem.setTime
            await ddTime.forEach(async (setTimeItem) => {
              if (setTimeItem.value !== '11:00') {
                // console.log('!!!!', setTimeItem.value)
                let s = {}
                s.empId = item.empId
                s.bookingTime = setTimeItem.value
                s.timeSlotCustomer = 1
                A.push(s)
              }
            })
          })
        } else {
          let TimeJson = JSON.parse(item.setTime)
          await TimeJson.forEach(async (setTimeItem) => {
            if (setTimeItem.value !== '11:00') {
              // console.log('!!!!', setTimeItem.value)
              let s = {}
              s.empId = item.empId
              s.bookingTime = setTimeItem.value
              s.timeSlotCustomer = 1
              A.push(s)
            }
          })
        }
      })
      // console.log('A', A)
      return A
    },
    async GetbookingNowCheck () {
      console.log('----', this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId))
      this.bookingNowCheck = this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId)[0].bookingNowCheck
      this.bookingNowCheckCount = this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId)[0].bookingNowCheckCount || 1
      this.bookingNowCheckTimeStatus = this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId)[0].bookingNowCheckTimeStatus || 'False'
      console.log('!@#!@#!@#!@#!@#!@#', this.bookingNowCheck, this.bookingNowCheckCount, this.bookingNowCheckTimeStatus)
      if (this.bookingNowCheck === 'True') {
        console.log('test', this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId)[0].bookingNowCheckCount || 1)
        let CheckMonth = moment().add(this.bookingNowCheckCount, 'days').format('YYYY-MM')
        // console.log('CheckMonth', CheckMonth)
        if (CheckMonth !== this.currentMonth) {
          console.log('IF')
          this.next_bookingNowCheckCount_month = 'True'
          this.setMonthCarousel_Check('next_bookingNowCheckCount_month')
        } else {
          this.next_bookingNowCheckCount_month = 'False'
          console.log('ELSE')
        }
        this.currentDate = moment().add(this.bookingNowCheckCount, 'days').format('YYYY-MM-DD')
        this.currentMonth = moment(this.currentDate, 'YYYY-MM').format('YYYY-MM')
      } else {
        this.currentDate = moment().format('YYYY-MM-DD')
      }
      console.log('!@#!@#!@#!@#!@#!@#', this.currentDate, this.currentMonth)
    },
    async autoSetTime () {
      // ตัดเวลาในกรณีที่เป็นวันปัจจุบัน เพื่อตัดเวลาที่ผ่านมาแล้วออก
      let currentDateBybookingNowCheckTimeStatus = moment().format('YYYY-MM-DD')
      if (this.bookingNowCheck === 'True' && this.bookingNowCheckTimeStatus === 'True') {
        currentDateBybookingNowCheckTimeStatus = this.currentDate
      }
      this.timeavailable = []
      // console.log('!!!!!', new Date(this.date).getDay())
      // console.log('!!!!!', new Date(this.date).getDay())
      let getDay = new Date(this.date).getDay()
      let LimitBookingGet = await this.getLimitBookingAutoEmp()
      let LimitBookingData = LimitBookingGet.length > 0 ? LimitBookingGet : []
      console.log('LimigBooking', LimitBookingGet)
      console.log('this.EmpItemLimit', this.EmpItemLimit)
      // forEach พนักงานทั้งหมดที่รับผิดชอบประเภทบริการนี้
      await this.EmpItemLimit.forEach(async (item) => {
        // ตรวจสอบว่าพนักงานตั้งค่าเวลาไม่เหมือนกันรึป่าว
        let typeDayCustom = this.dataEmpAll.filter((a) => a.empId === item.empId)[0].typeDayCustom
        console.log('typeDayCustom****', typeDayCustom)
        let dateDayoff = JSON.parse(this.dataEmpAll.filter((a) => a.empId === item.empId)[0].dateDayoffValue) || []
        let dateDayCustom = JSON.parse(this.dataEmpAll.filter((a) => a.empId === item.empId)[0].dateDayCustom) || []
        if (typeDayCustom === 'off') {
          if (dateDayoff.filter((offItem) => offItem === getDay).length === 0 && dateDayCustom.filter((CusItem) => CusItem === this.date).length === 0) {
            if (item.setTimebyday === 'True') {
              let TimeJson = JSON.parse(item.setTime)
              // forEach เวลาของพนักงานตามเงื่อนไข IF ว่าวันที่เลือกตรงกับวันไหน จ-อา
              await TimeJson.forEach(async (Titem) => {
                // เงือนไขวัน จ-อา
                if (Titem.value === getDay) {
                  let ddTime = []
                  if (LimitBookingData.length > 0) {
                  // console.log('Tiem.setTime', Titem)
                    ddTime = await this.AutosetlimitBooking(LimitBookingData, item.empId, Titem.setTime)
                  } else {
                    LimitBookingData = []
                    ddTime = await this.AutosetlimitBooking(LimitBookingData, item.empId, Titem.setTime)
                  // ddTime = Titem.setTime
                  }
                  // console.log('ddTime', ddTime)
                  // นำเงื่อนไขเวลาที่ตรงกับวัน จ-อา แล้ว นำมา forEach ต่อ
                  await ddTime.forEach(async (setTimeItem) => {
                    // เช็คเวลาต้องไม่ซ้ำกัน
                    // console.log('setTimeItemIFIFIFIFIFIFI', this.timeavailable.filter((d) => d.value === setTimeItem.value).length, setTimeItem.value)
                    if (this.timeavailable.filter((d) => d.value === setTimeItem.value).length === 0) {
                      setTimeItem.empId = item.empId
                      // console.log('setTimeItem', setTimeItem)
                      this.timeavailable.push(setTimeItem)
                    }
                  })
                }
              })
            } else {
              let TimeJson = JSON.parse(item.setTime)
              // console.log('TimeJson', TimeJson)
              let ddTime = []
              if (LimitBookingData.length > 0) {
                ddTime = await this.AutosetlimitBooking(LimitBookingData, item.empId, TimeJson)
              // console.log('DDTIME', ddTime)
              } else {
                LimitBookingData = []
                ddTime = await this.AutosetlimitBooking(LimitBookingData, item.empId, TimeJson)
              }
              // console.log('ddTime_ELSE', ddTime)
              // นำเงื่อนไขเวลาที่ตรงกับวัน จ-อา แล้ว นำมา forEach ต่อ
              await ddTime.forEach(async (setTimeItem) => {
                // เช็คเวลาต้องไม่ซ้ำกัน
                // console.log('setTimeItem', this.timeavailable.filter((d) => d.value === setTimeItem.value).length, setTimeItem.value)
                if (this.timeavailable.filter((d) => d.value === setTimeItem.value).length === 0) {
                  setTimeItem.empId = item.empId
                  // console.log('setTimeItem!!', setTimeItem)
                  this.timeavailable.push(setTimeItem)
                }
              })
            }
          }
        } else {
          console.log('dateDayCustom.filter((CusItem) => CusItem === dateDay)', dateDayCustom.filter((CusItem) => CusItem === this.date))
          if (dateDayCustom.filter((CusItem) => CusItem === this.date).length > 0) {
            if (item.setTimebyday === 'True') {
              let TimeJson = JSON.parse(item.setTime)
              // forEach เวลาของพนักงานตามเงื่อนไข IF ว่าวันที่เลือกตรงกับวันไหน จ-อา
              await TimeJson.forEach(async (Titem) => {
                // เงือนไขวัน จ-อา
                if (Titem.value === getDay) {
                  let ddTime = []
                  if (LimitBookingData.length > 0) {
                  // console.log('Tiem.setTime', Titem)
                    ddTime = await this.AutosetlimitBooking(LimitBookingData, item.empId, Titem.setTime)
                  } else {
                    LimitBookingData = []
                    ddTime = await this.AutosetlimitBooking(LimitBookingData, item.empId, Titem.setTime)
                  // ddTime = Titem.setTime
                  }
                  // console.log('ddTime', ddTime)
                  // นำเงื่อนไขเวลาที่ตรงกับวัน จ-อา แล้ว นำมา forEach ต่อ
                  await ddTime.forEach(async (setTimeItem) => {
                    // เช็คเวลาต้องไม่ซ้ำกัน
                    // console.log('setTimeItemIFIFIFIFIFIFI', this.timeavailable.filter((d) => d.value === setTimeItem.value).length, setTimeItem.value)
                    if (this.timeavailable.filter((d) => d.value === setTimeItem.value).length === 0) {
                      setTimeItem.empId = item.empId
                      // console.log('setTimeItem', setTimeItem)
                      this.timeavailable.push(setTimeItem)
                    }
                  })
                }
              })
            } else {
              let TimeJson = JSON.parse(item.setTime)
              // console.log('TimeJson', TimeJson)
              let ddTime = []
              if (LimitBookingData.length > 0) {
                ddTime = await this.AutosetlimitBooking(LimitBookingData, item.empId, TimeJson)
              // console.log('DDTIME', ddTime)
              } else {
                LimitBookingData = []
                ddTime = await this.AutosetlimitBooking(LimitBookingData, item.empId, TimeJson)
              }
              // console.log('ddTime_ELSE', ddTime)
              // นำเงื่อนไขเวลาที่ตรงกับวัน จ-อา แล้ว นำมา forEach ต่อ
              await ddTime.forEach(async (setTimeItem) => {
                // เช็คเวลาต้องไม่ซ้ำกัน
                // console.log('setTimeItem', this.timeavailable.filter((d) => d.value === setTimeItem.value).length, setTimeItem.value)
                if (this.timeavailable.filter((d) => d.value === setTimeItem.value).length === 0) {
                  setTimeItem.empId = item.empId
                  // console.log('setTimeItem!!', setTimeItem)
                  this.timeavailable.push(setTimeItem)
                }
              })
            }
          }
        }
      })
      // ตัดเวลาในกรณีที่เป็นวันปัจจุบัน เพื่อตัดเวลาที่ผ่านมาแล้วออก

      if (moment(this.date).format('YYYY-MM-DD') === moment(currentDateBybookingNowCheckTimeStatus).format('YYYY-MM-DD')) {
        this.timeavailable = this.timeavailable.filter(item => moment().format(item.value) > moment().format('HH:mm'))
      }
      console.log(this.customerTimeSlot === 'False' ? this.fromAdd.masBranchID && this.fromAdd.flowId : this.fromAdd.masBranchID && this.fromAdd.flowId && this.fromAddTimeCus)
      console.log('customerTimeSlot === TRUE', this.fromAdd.masBranchID, this.fromAdd.flowId, this.fromAddTimeCus)
      console.log('this.timeavailable.length', this.timeavailable)
      if (this.timeavailable.length === 0) {
        this.$swal(this.languageSelect === 0 ? 'คิวเต็มแล้ว' : 'Full queue', this.languageSelect === 0 ? 'กรุณาเลือกวันที่ใหม่อีกครั้ง' : 'Please select a new date again.', 'error')
        this.date = ''
        this.time = ''
      }
      await this.timeavailable.sort(this.compare)
      // let DD = [...new Set(this.timeavailable.map((el) => el.value))]
      console.log('TIME', this.timeavailable)
    },
    async AutosetlimitBooking (LimitBookingGet, empId, setTime) {
      this.time = ''
      let DATAtimeavailable = setTime
      // เช็คว่า เวลาในแต่ละวันเหมือนกันรึป่าว
      console.log('dddddddddddd', this.DataFlowNameAll)
      // let slotByflow = this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId)[0].timeSlot
      let slotByflow = null
      if (this.customerTimeSlot === 'False') {
        slotByflow = this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId)[0].timeSlot
      } else {
        slotByflow = this.fromAddTimeCus
      }
      let overTime = this.DataFlowNameAll.filter((v) => v.flowId === this.fromAdd.flowId)[0].overTime
      // console.log('overTime', overTime)
      if (DATAtimeavailable.length >= slotByflow) {
        // console.log('123123123', LimitBookingGet.filter((BookingGetItem) => BookingGetItem.empId === empId))
        let LimitBooking = LimitBookingGet.filter((BookingGetItem) => BookingGetItem.empId === empId)
        // console.log('LimitBooking', LimitBooking)
        // เซ็ต Status True ให้แต่ละช่วงเวลา
        DATAtimeavailable.forEach((v, k) => {
          if (typeof v.status === 'undefined') {
            v.status = true
            if (v.limitBooking === '0') {
              v.status = false
            }
          }
        })
        // เซ็ต Status False ให้กับช่วงเวลาที่มีคนจองแล้ว
        if (LimitBooking.status !== false) {
          if (LimitBooking.length > 0) {
            DATAtimeavailable.forEach((v, k) => {
              let bookingTarget = LimitBooking.filter((a) => a.bookingTime === v.value)
              // console.log('booking', bookingTarget)
              if (bookingTarget.length > 0) {
                v.status = false
                let bookingTargetSlot = bookingTarget[0].timeSlotCustomer || bookingTarget[0].timeSlot
                for (let bT = 0; bT < bookingTargetSlot; bT++) {
                  if (DATAtimeavailable[k + bT] !== undefined) {
                    DATAtimeavailable[k + bT].status = false
                  }
                }
              }
            })
          }
        }

        // จับคู่เวลาตาม slotbyFlow
        let Newtimeavailable = []
        let slotCheck = slotByflow
        for (let i = 0; i < DATAtimeavailable.length; i++) {
          let num = i + (slotCheck - 1)
          let checkitem = DATAtimeavailable.filter((item, key) => (key >= i && key <= num))
          Newtimeavailable.push(checkitem)
        }
        // console.log('Newtimeavailable', Newtimeavailable)
        DATAtimeavailable = []

        //  ตัดเวลาที่มีค่า False ออก
        Newtimeavailable.forEach((v, k) => {
          if (overTime === 'True') {
            if (v.filter((v) => v.status === false).length <= 0) {
              DATAtimeavailable.push(v[0])
            }
          } else {
            // ปิดเวลาสุดท้ายในกรณีที่ ไม่ต้องการให้จองเลยเวลา
            if (v.filter((v) => v.status === false).length <= 0 && v.length >= slotCheck) {
              DATAtimeavailable.push(v[0])
            }
          }
        })
        return DATAtimeavailable
      } else {
        DATAtimeavailable = []
        return DATAtimeavailable
      }
    // await this.chekSlotTime()
    },
    compare (a, b) {
      if (a.value < b.value) {
        return -1
      }
      if (a.value > b.value) {
        return 1
      }
      return 0
    },
    async checkLimit () {
      this.checkLimitBooking.ID = 'NO'
      this.checkLimitBooking.countBooking = 1
      this.checkLimitBooking.limitCheck = null
      console.log('this.formAdd.empId', this.fromAdd.empId)
      let LimitBooking = await this.getLimitBooking()
      if (LimitBooking.status === false) {
        this.checkLimitBooking.ID = 'NO'
        this.checkLimitBooking.countBooking = 1
        let allBookingTime = []
        // let dt = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTime) || []
        let dt = []
        if (this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTimebyday === 'True') {
          let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTime).filter((items) => items.value === new Date(this.date).getDay())
          dt = timeJson[0].setTime || []
          console.log('IF')
        } else {
          console.log('ELSE')
          dt = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTime) || []
        }
        let checkTimeSlot = []
        let index = dt.findIndex((i, k) => i.value === this.time.value)
        let slot = ''
        if (this.customerTimeSlot === 'False') {
          slot = this.DataFlowNameAll.filter((item) => item.flowId === this.fromAdd.flowId)[0].timeSlot
        } else {
          slot = this.fromAddTimeCus
        }
        let num = index + (slot - 1)
        checkTimeSlot = dt.filter((i, k) => (k >= index && k <= num))
        console.log('allBookingTime', allBookingTime)
        console.log('chedkTimeSlot', checkTimeSlot)
        this.checkLimitBooking.limitCheck = 'true'
        this.checkLimitBooking.limitBooking = 1
        this.checkLimitBooking.timeSelect = checkTimeSlot
        this.checkLimitBooking.timeBooking = dt
        this.checkLimitBooking.slotByflow = slot
        console.log('1257')
      } else {
        console.log('1259', LimitBooking)
        let allBookingTime = []
        // let dt = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTime) || []
        let dt = []
        if (this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTimebyday === 'True') {
          let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTime).filter((items) => items.value === new Date(this.date).getDay())
          dt = timeJson[0].setTime || []
          console.log('IF')
        } else {
          console.log('ELSE')
          dt = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTime) || []
        }
        LimitBooking.forEach((item, key) => {
          // let dtint = parseInt(dt.filter(item => item.value === this.time.value)[0].limitBooking)
          // console.log('test', dtint)
          // if (item.empId === this.fromAdd.empId && this.momenDate_1(item.bookingDate) === this.date && item.bookingTime === this.time.value) {
          //   this.checkLimitBooking.ID = item.id
          //   console.log('1266')
          //   this.checkLimitBooking.countBooking = parseInt(item.countBooking) + 1
          //   this.checkLimitBooking.limitCheck = parseInt(item.countBooking) >= dtint ? 'false' : 'true'
          //   this.checkLimitBooking.limitBooking = dtint
          //   // console.log('item.masBranchID', item)
          // }
          if (dt.filter((i, k) => i.value === item.bookingTime).length > 0) {
            let index = dt.findIndex((i, k) => i.value === item.bookingTime)
            let slot = item.timeSlotCustomer || item.timeSlot
            let num = index + (slot - 1)
            console.log('index', index, 'slot', slot, num)
            allBookingTime.push(dt.filter((i, k) => (k >= index && k <= num)))
          }
        })
        let checkTimeSlot = []
        let index = dt.findIndex((i, k) => i.value === this.time.value)
        let slot = ''
        if (this.customerTimeSlot === 'False') {
          slot = this.DataFlowNameAll.filter((item) => item.flowId === this.fromAdd.flowId)[0].timeSlot
        } else {
          slot = this.fromAddTimeCus
        }
        let num = index + (slot - 1)
        checkTimeSlot = dt.filter((i, k) => (k >= index && k <= num))
        console.log('allBookingTime', allBookingTime)
        console.log('chedkTimeSlot', checkTimeSlot)
        this.checkLimitBooking.limitCheck = 'true'
        this.checkLimitBooking.limitBooking = 1
        this.checkLimitBooking.timeSelect = checkTimeSlot
        this.checkLimitBooking.timeBooking = dt
        this.checkLimitBooking.slotByflow = slot
        checkTimeSlot.forEach((item, key) => {
          allBookingTime.forEach((item2, key2) => {
            // console.log('filter', item2.filter((i, n) => i.value === item.value))
            if (item2.filter((i, n) => i.value === item.value).length > 0) {
              this.checkLimitBooking.limitCheck = 'false'
              console.log('เวลาซ้ำกัน')
            } else {
              console.log('เวลาไม่ซ้ำกัน')
            }
          })
        })
      }
      // console.log('this.checkLimitBooking', this.checkLimitBooking)
    },
    async getLimitBooking () {
      // console.log('date', this.date)
      // let LimitBooking = axios.get(this.DNS_IP + '/LimitBookingDate/get?shopId=' + this.shopId + '&masBranchID=' + this.fromAdd.masBranchID + '&bookingDate=' + this.date).then(async (response) => {
      //   let rs = response.data
      //   return rs
      // })
      // return LimitBooking
      let LimitBooking = axios.get(this.DNS_IP + '/LimitBookingDateEmp/get?shopId=' + this.shopId + '&empId=' + this.fromAdd.empId + '&bookingDate=' + this.date).then(async (response) => {
        let rs = response.data
        return rs
      })
      return LimitBooking
    },
    async getDataBranch () {
      this.branch = []
      this.branchData = []
      await axios.get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        console.log('rs', rs)
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            let s = {}
            s.text = d.masBranchName
            s.textEng = d.masBranchNameEn
            s.value = d.masBranchID
            this.branch.push(s)
            this.branchData.push(d)
            // console.log('dtdtdtdt', this.branch)
          }
          if (this.branch.length === 1) {
            this.fromAdd.masBranchID = this.branch[0].value
            // this.checkTime()
            this.selectBranch()
            this.SetallowedDates()
          }
        }
      })
      // console.log('branchData', this.branchData)
    },
    async getBookingField () {
      this.bookingField = []
      let itemIncustomField = []
      await axios
        .get(this.DNS_IP + '/BookingField/get?shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            this.fromAdd.bookingFieldId = rs[0].bookingFieldId
            this.bookingFieldData = rs
            console.log('bookingFieldData', this.bookingFieldData)
            this.bookingFormHeader = rs[0].bookingFormHeader || 'ลงทะเบียนนัดหมาย'
            this.bookingFormHistoryBT = rs[0].bookingFormHistoryBT || 'ประวัติการเข้ารับบริการ'
            this.bookingFormConfirmBT = rs[0].bookingFormConfirmBT || 'ยืนยันนัดหมาย'
            this.bookingFormHeaderEn = rs[0].bookingFormHeaderEn || 'Booking Services'
            this.bookingFormHistoryBTEn = rs[0].bookingFormHistoryBTEn || 'History'
            this.bookingFormConfirmBTEn = rs[0].bookingFormConfirmBTEn || 'Confirm'
            this.liffSendMessageAfterBookingStatus = rs[0].liffSendMessageAfterBookingStatus || 'False'
            console.log('liffSendMessageAfterBookingStatus', this.liffSendMessageAfterBookingStatus)
            let checkLocationStatus = rs[0].checkLocationStatus || 'False'
            if (checkLocationStatus === 'True') {
              await navigator.geolocation.getCurrentPosition(
                async position => {
                  const center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  }
                  if (center) {
                    let dt = {
                      shopId: this.shopId,
                      customerLat: center.lat,
                      customerLong: center.lng
                    }
                    await axios
                      .post(this.DNS_IP + '/BookingField/checkLocations', dt)
                      .then(async response => {
                        console.log('checkLocations', response)
                        if (response.data.status === false) {
                          this.$swal(
                            this.languageSelect === 0 ? 'เนื่องจากเกินระยะที่ทางร้านกำหนด' : 'because it exceeds the distance specified by the shop.',
                            this.languageSelect === 0 ? 'กรุณากดนัดหมายในระยะที่ร้านกำหนด' : 'Please make an appointment during the specified period.',
                            'info'
                          )
                            .then(result => {
                              this.$router.go()
                            })
                            .catch(error => {
                              console.log('error function addData : ', error)
                              this.$router.go()
                            })
                        }
                      })
                  } else {
                    this.$swal(
                      this.languageSelect === 0 ? 'เนื่องจากเกินระยะที่ทางร้านกำหนด' : 'because it exceeds the distance specified by the shop.',
                      this.languageSelect === 0 ? 'กรุณากดนัดหมายในระยะที่ร้านกำหนด' : 'Please make an appointment during the specified period.',
                      'info'
                    )
                      .then(result => {
                        this.$router.go()
                      })
                      .catch(error => {
                        console.log('error function addData : ', error)
                        this.$router.go()
                      })
                  }
                },
                error => {
                  // this.center.lat = null
                  // this.center.lng = null
                  this.$swal(
                    this.languageSelect === 0 ? 'เนื่องจากเกินระยะที่ทางร้านกำหนด' : 'because it exceeds the distance specified by the shop.',
                    this.languageSelect === 0 ? 'กรุณากดนัดหมายในระยะที่ร้านกำหนด' : 'Please make an appointment during the specified period.',
                    'info'
                  )
                    .then(result => {
                      this.$router.go()
                    })
                    .catch(error => {
                      console.log('error function addData : ', error)
                      this.$router.go()
                    })
                  console.log('error map :', error.message)
                }
              )
            }
            // console.log('rs', rs)
            let bookingData = []
            if (rs[0].showTime === null || rs[0].showTime === '') {
              this.showTime = 'แสดง'
            } else {
              this.showTime = rs[0].showTime
            }
            this.showLimitBooking = rs[0].showLimitBooking
            // if (rs[0].showMap === null || rs[0].showMap === '') {
            //   this.showMap = 'ไม่แสดง'
            // } else {
            //   this.showMap = rs[0].showMap
            // }
            // if (this.showMap === 'แสดง') {
            //   await this.geolocate()
            // }
            // bookingData = JSON.parse(rs[0].flowfieldName)
            bookingData = JSON.parse(rs[0].flowfieldNameCustomer)
            for (let i = 0; i < bookingData.length; i++) {
              let d = bookingData[i]
              itemIncustomField.push(d.fieldId)
            }
            await this.getCustomField(itemIncustomField)
          } else {
            this.$swal(
              this.languageSelect === 0 ? 'พบความผิดพลาดระหว่างดำเนินการ' : 'An error was encountered during the operation.',
              this.languageSelect === 0 ? 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่' : 'Please press the button to fetch new data.',
              'info'
            )
              .then(result => {
                this.$router.go()
              })
              .catch(error => {
                console.log('error function addData : ', error)
                this.$router.go()
              })
          }
        })
        .catch(error => {
          this.$swal(
            this.languageSelect === 0 ? 'พบความผิดพลาดระหว่างดำเนินการ' : 'An error was encountered during the operation.',
            this.languageSelect === 0 ? 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่' : 'Please press the button to fetch new data.',
            'info'
          )
            .then(result => {
              this.$router.go()
            })
            .catch(error => {
              console.log('error function addData : ', error)
              this.$router.go()
            })
          console.log('error function addData : ', error)
        })
    },
    async getCustomField (item) {
      await axios
        .get(this.DNS_IP + '/customField/fieldId?fieldId=' + item)
        .then(async response => {
          let rs = response.data
          // let aa = []
          if (rs.length > 0) {
            let sortNo = rs.sort((a, b) => a.sortNoField - b.sortNoField)
            for (let i = 0; i < sortNo.length; i++) {
              let d = sortNo[i]
              let s = {}
              s.fieldId = d.fieldId
              s.fieldName = d.fieldName
              s.fieldNameEn = d.fieldNameEn
              s.fieldType = d.fieldType
              s.optionField = d.optionField
              s.conditionField = d.conditionField
              s.conditionValue = d.conditionValue
              s.shopId = d.shopId
              s.fieldValue = ''
              s.requiredField = d.requiredField
              this.fieldNameItem.push(s)
            }
            var data1 = this.fieldNameItem.filter(
              el => parseInt(el.conditionField || 0) > 0
            )
            // var data2 = []
            for (var i = 0; i < data1.length; i++) {
              var d = data1[i]
              var indexC = this.fieldNameItem.findIndex(function (o) {
                return o.fieldId === d.fieldId
              })
              var indexF = this.fieldNameItem.findIndex(function (o) {
                return o.fieldId === parseInt(d.conditionField)
              })
              this.fieldNameItem.splice(
                indexF + 1,
                0,
                this.fieldNameItem.splice(indexC, 1)[0]
              )
              // data2.push({'indexC': indexC, 'indexF': indexF})
            }
            // console.log('data1', data1)
            // console.log('data2', data2)
            // for (var x = 0; x < data2.length; x++) {
            //   var s = data2[x]
            //   this.fieldNameItem.splice((s.indexF + 1), 0, this.fieldNameItem.splice(s.indexC, 1)[0])
            // }
            console.log(this.fieldNameItem)
            // setTimeout(() => this.validate(), 500)
          } else {
            this.$swal(
              this.languageSelect === 0 ? 'พบความผิดพลาดระหว่างดำเนินการ' : 'An error was encountered during the operation.',
              this.languageSelect === 0 ? 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่' : 'Please press the button to fetch new data.',
              'info'
            )
              .then(result => {
                this.$router.go()
              })
              .catch(error => {
                console.log('error function addData : ', error)
                this.$router.go()
              })
          }
        })
        .catch(error => {
          this.$swal(
            this.languageSelect === 0 ? 'พบความผิดพลาดระหว่างดำเนินการ' : 'An error was encountered during the operation.',
            this.languageSelect === 0 ? 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่' : 'Please press the button to fetch new data.',
            'info'
          )
            .then(result => {
              this.$router.go()
            })
            .catch(error => {
              console.log('error function addData : ', error)
              this.$router.go()
            })
          console.log('error function addData : ', error)
        })
    },
    async addbookingCheck () {
      // if (this.branchData.filter(item => { return item.masBranchID === this.fromAdd.masBranchID })[0].limitBookingCheck === 'True') {
      if (this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].limitBookingCheck === 'True') {
        await this.checkLimit()
        // console.log('test', this.branchData.filter(item => { return item.masBranchID === this.fromAdd.masBranchID })[0].setTime)
        if (this.checkLimitBooking.limitCheck === 'true') {
          return true
        } else if (this.checkLimitBooking.limitCheck === 'false') {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    async addBooking () {
      let checkFlow = this.DataFlowNameAll.filter((item) => item.flowId === this.fromAdd.flowId)
      console.log('checkFlow', checkFlow)
      if (checkFlow.length > 0) {
        console.log('If.length')
        if (checkFlow[0].menuShowStatus === 'True') {
          console.log('If.length')
          if (this.dataMenu.filter((i) => parseInt(i.qty) > 0).length > 0) {
            this.addBookingStepTwo()
          } else {
            this.$swal('ผิดพลาด', 'กรุณาเลือกเมนู', 'info')
          }
        } else {
          this.addBookingStepTwo()
        }
      } else {
        this.$swal(
          this.languageSelect === 0 ? 'พบความผิดพลาดระหว่างดำเนินการ' : 'An error was encountered during the operation.',
          this.languageSelect === 0 ? 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่' : 'Please press the button to fetch new data.',
          'info'
        )
          .then(result => {
            this.$router.go()
          })
          .catch(error => {
            console.log('error function addData : ', error)
            this.$router.go()
          })
      }
    },
    async addBookingStepTwo () {
      await this.validate()
      console.log('liffSendMessageAfterBookingStatus', this.liffSendMessageAfterBookingStatus)
      console.log('this.limitCountBranch', this.limitCountBranch)
      console.log('this.', this.valid)
      if (this.valid !== false) {
        let checkFlow = this.DataFlowNameAll.filter(el => { return el.flowId === this.fromAdd.flowId })
        console.log('checkFlow', checkFlow)
        let repeatBooking = ''
        if (checkFlow.length > 0) {
          repeatBooking = checkFlow[0].repeatBooking || 'False'
        } else {
          repeatBooking = 'False'
        }
        if (repeatBooking === 'False') {
          // if (this.branchData.filter(item => { return item.masBranchID === this.fromAdd.masBranchID })[0].limitBookingCheck === 'True') {
          if (this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].limitBookingCheck === 'True') {
            await this.checkLimit()
            // console.log('test', this.branchData.filter(item => { return item.masBranchID === this.fromAdd.masBranchID })[0].setTime)
            if (this.checkLimitBooking.limitCheck === 'true') {
              await this.addBookingsubmit('True')
              console.log('if1400')
            } else if (this.checkLimitBooking.limitCheck === 'false') {
              console.log('else1402')
              this.$swal(
                this.languageSelect === 0 ? 'มีลูกค้าท่านอื่นนัดหมายเวลานี้แล้ว' : 'There are other customers making appointments at this time.',
                this.languageSelect === 0 ? 'กรุณาเลือกวันที่ / เวลา ใหม่อีกครั้ง' : 'Please select a new date/time again.',
                'info'
              )
              this.date = ''
              this.time = ''
            } else {
              console.log('else1407')
              await this.addBookingsubmit('True')
            }
          } else {
            await this.addBookingsubmit('False')
          }
        } else {
          await axios
            .get(
              this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.$route.query.shopId +
            '&userId=' +
            this.profile.userId +
            '&dueDate=' + this.date +
            '&checkOnsite=is null&statusBt=wait and confirm'
            )
            .then(async response => {
              let rs = response.data
              if (rs.status === false) {
                // if (this.branchData.filter(item => { return item.masBranchID === this.fromAdd.masBranchID })[0].limitBookingCheck === 'True') {
                if (this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].limitBookingCheck === 'True') {
                  await this.checkLimit()
                  // console.log('test', this.branchData.filter(item => { return item.masBranchID === this.fromAdd.masBranchID })[0].setTime)
                  if (this.checkLimitBooking.limitCheck === 'true') {
                    await this.addBookingsubmit('True')
                    console.log('if1400')
                  } else if (this.checkLimitBooking.limitCheck === 'false') {
                    console.log('else1402')
                    this.$swal(
                      this.languageSelect === 0 ? 'มีลูกค้าท่านอื่นนัดหมายเวลานี้แล้ว' : 'There are other customers making appointments at this time.',
                      this.languageSelect === 0 ? 'กรุณาเลือกวันที่ / เวลา ใหม่อีกครั้ง' : 'Please select a new date/time again.',
                      'info'
                    )
                    this.date = ''
                    this.time = ''
                  } else {
                    console.log('else1407')
                    await this.addBookingsubmit('True')
                  }
                } else {
                  await this.addBookingsubmit('False')
                }
              } else {
                this.$swal(
                  this.languageSelect === 0 ? 'ผิดพลาด' : 'Error',
                  this.languageSelect === 0 ? 'วันนี้ท่านได้นัดหมายไปแล้ว' : 'Today you have an appointment.',
                  'info'
                )
                this.date = ''
                this.time = ''
              }
            })
        }
      }
    },
    async addBookingsubmit (limitBookingCheck) {
      if (limitBookingCheck === 'True' && this.limitBookingSelect === 'True') {
        await this.manageLimitBooking()
      }
      let rs = this.fieldNameItem
      console.log('dddddddddddd', this.fieldNameItem)
      let Add = []
      let fielditem = this.fieldNameItem
      var dueDate = ''
      if (this.showTime === 'แสดง') {
        dueDate = this.date + ' ' + this.time.value
      } else {
        dueDate = this.date
      }
      let userId = ''
      if (this.$route.query.error === undefined) {
        userId = this.profile.userId
      } else {
        userId = 'system'
      }
      for (let i = 0; i < rs.length; i++) {
        let d = rs[i]
        let update = {}
        if (d.conditionField === '' || d.conditionField === null) {
          update.masBranchID = this.fromAdd.masBranchID
          update.bookingFieldId = this.fromAdd.bookingFieldId
          update.flowId = this.fromAdd.flowId
          update.bookingDataCustomerEmail = this.fromAdd.bookingDataCustomerEmail || ''
          update.empId = this.fromAdd.empId
          update.packageId = this.fromAdd.packageId
          update.tokenPackage = this.fromAdd.tokenPackage
          update.fieldId = d.fieldId
          update.fieldName = d.fieldName
          update.fieldValue = d.fieldValue.replace(/%/g, '%%').replace(/'/g, "\\'")
          update.shopId = d.shopId
          update.dueDate = dueDate
          update.timeText = this.time.text
          update.sourceLink = this.source
          update.userId = userId
          update.limitBookingCheck = limitBookingCheck
          update.limitBookingId = this.checkLimitBooking.ID
          update.limitBookingCount = this.checkLimitBooking.countBooking
          update.getLimitBooking = this.checkLimitBooking.limitBooking
          update.timeBooking = this.checkLimitBooking.timeBooking
          update.timeAll = this.checkLimitBooking.timeSelect
          update.slotByflow = this.checkLimitBooking.slotByflow
          update.timeSlotCustomer = this.fromAddTimeCus
          update.customerTimeSlot = this.customerTimeSlot
          update.statusUpload1 = this.fromAdd.statusUpload1
          update.statusUpload2 = this.fromAdd.statusUpload2
          update.fileUpload1 = ''
          update.fileUpload2 = ''
          update.dateSelect = this.date
          update.timeSelect = this.time.value
          update.bookingLanguage = this.languageSelect
          update.IsNotify = 'False'
          if (this.showMap === 'แสดง') {
            update.address = this.address
            update.addressLatLong = JSON.stringify(this.center)
          }
          if (this.dataMenu.filter((i) => parseInt(i.qty) > 0).length > 0) {
            update.menuItem = JSON.stringify(this.dataMenu.filter((i) => parseInt(i.qty) > 0))
            update.menuPrice = this.priceMenu
          }
          Add.push(update)
        } else {
          if (
            fielditem.filter(row => {
              return row.fieldId === parseInt(d.conditionField)
            }).length > 0
          ) {
            console.log('this', fielditem)
            if (
              d.conditionValue ===
              fielditem.filter(row => {
                return row.fieldId === parseInt(d.conditionField)
              })[0].fieldValue
            ) {
              update.masBranchID = this.fromAdd.masBranchID
              update.bookingFieldId = this.fromAdd.bookingFieldId
              update.flowId = this.fromAdd.flowId
              update.bookingDataCustomerEmail = this.fromAdd.bookingDataCustomerEmail || ''
              update.empId = this.fromAdd.empId
              update.packageId = this.fromAdd.packageId
              update.tokenPackage = this.fromAdd.tokenPackage
              update.fieldId = d.fieldId
              update.fieldName = d.fieldName
              update.fieldValue = d.fieldValue.replace(/%/g, '%%').replace(/'/g, "\\'")
              update.shopId = d.shopId
              update.dueDate = dueDate
              update.timeText = this.time.text
              update.sourceLink = this.source
              update.userId = userId
              update.limitBookingCheck = limitBookingCheck
              update.limitBookingId = this.checkLimitBooking.ID
              update.limitBookingCount = this.checkLimitBooking.countBooking
              update.getLimitBooking = this.checkLimitBooking.limitBooking
              update.timeBooking = this.checkLimitBooking.timeBooking
              update.timeAll = this.checkLimitBooking.timeSelect
              update.slotByflow = this.checkLimitBooking.slotByflow
              update.timeSlotCustomer = this.fromAddTimeCus
              update.customerTimeSlot = this.customerTimeSlot
              update.statusUpload1 = this.fromAdd.statusUpload1
              update.statusUpload2 = this.fromAdd.statusUpload2
              update.fileUpload1 = ''
              update.fileUpload2 = ''
              update.dateSelect = this.date
              update.timeSelect = this.time.value
              update.bookingLanguage = this.languageSelect
              update.IsNotify = 'False'
              if (this.showMap === 'แสดง') {
                update.address = this.address
                update.addressLatLong = JSON.stringify(this.center)
              }
              if (this.dataMenu.filter((i) => parseInt(i.qty) > 0).length > 0) {
                update.menuItem = JSON.stringify(this.dataMenu.filter((i) => parseInt(i.qty) > 0))
                update.menuPrice = this.priceMenu
              }
              Add.push(update)
            }
          } else if (d.conditionField === 'flow') {
            if (parseInt(d.conditionValue) === parseInt(this.fromAdd.flowId)) {
              update.masBranchID = this.fromAdd.masBranchID
              update.bookingFieldId = this.fromAdd.bookingFieldId
              update.flowId = this.fromAdd.flowId
              update.bookingDataCustomerEmail = this.fromAdd.bookingDataCustomerEmail || ''
              update.empId = this.fromAdd.empId
              update.packageId = this.fromAdd.packageId
              update.tokenPackage = this.fromAdd.tokenPackage
              update.fieldId = d.fieldId
              update.fieldName = d.fieldName
              update.fieldValue = d.fieldValue.replace(/%/g, '%%').replace(/'/g, "\\'")
              update.shopId = d.shopId
              update.dueDate = dueDate
              update.timeText = this.time.text
              update.sourceLink = this.source
              update.userId = userId
              update.limitBookingCheck = limitBookingCheck
              update.limitBookingId = this.checkLimitBooking.ID
              update.limitBookingCount = this.checkLimitBooking.countBooking
              update.getLimitBooking = this.checkLimitBooking.limitBooking
              update.timeBooking = this.checkLimitBooking.timeBooking
              update.timeAll = this.checkLimitBooking.timeSelect
              update.slotByflow = this.checkLimitBooking.slotByflow
              update.timeSlotCustomer = this.fromAddTimeCus
              update.customerTimeSlot = this.customerTimeSlot
              update.statusUpload1 = this.fromAdd.statusUpload1
              update.statusUpload2 = this.fromAdd.statusUpload2
              update.fileUpload1 = ''
              update.fileUpload2 = ''
              update.dateSelect = this.date
              update.timeSelect = this.time.value
              update.bookingLanguage = this.languageSelect
              update.IsNotify = 'False'
              if (this.showMap === 'แสดง') {
                update.address = this.address
                update.addressLatLong = JSON.stringify(this.center)
              }
              if (this.dataMenu.filter((i) => parseInt(i.qty) > 0).length > 0) {
                update.menuItem = JSON.stringify(this.dataMenu.filter((i) => parseInt(i.qty) > 0))
                update.menuPrice = this.priceMenu
              }
              Add.push(update)
            }
          }
        }
      }
      console.log('Add', Add)
      console.log('Add', JSON.stringify(Add))
      // console.log('Add', JSON.stringify(Add))
      this.$swal({
        title: this.languageSelect === 0 ? 'ยืนยันรายการนัดหมาย' : 'Please confirm your booking',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: this.languageSelect === 0 ? 'ใช่' : 'Yes',
        cancelButtonText: this.languageSelect === 0 ? 'ไม่' : 'No'
      })
        .then(async result => {
          this.overlay = true
          if (await this.addbookingCheck()) {
            let checkUploadfile = true
            if ((this.bookingFieldData[0].showUpload1 || 'False') === 'True') {
              let checkUpload1 = this.fileUpload1 || []
              if (checkUpload1.length > 0) {
                let params = new FormData()
                for (let i = 0; i < this.fileUpload1.length; i++) {
                  params.append('files', this.fileUpload1[i])
                }
                await axios
                  .post(this.DNS_IP + `/file/upload/updateFile`, params, {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  })
                  .then(function (response) {
                    Add.forEach((item) => {
                      item.fileUpload1 = JSON.stringify(response.data)
                      item.statusUpload1 = 'True'
                    })
                  })
              } else {
                checkUploadfile = false
                Add.forEach((item) => {
                  item.fileUpload1 = ''
                  item.statusUpload1 = 'False'
                })
              }
            }
            if ((this.bookingFieldData[0].showUpload2 || 'False') === 'True') {
              let checkUpload2 = this.fileUpload2 || []
              if (checkUpload2.length > 0) {
                // const _this = this
                let params = new FormData()
                for (let i = 0; i < this.fileUpload2.length; i++) {
                  params.append('files', this.fileUpload2[i])
                }
                await axios
                  .post(this.DNS_IP + `/file/upload/updateFile`, params, {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  })
                  .then(function (response) {
                    Add.forEach((item) => {
                      item.fileUpload2 = JSON.stringify(response.data)
                      item.statusUpload2 = 'True'
                    })
                    // console.log('url Pic', response.data)
                  })
              } else {
                checkUploadfile = false
                Add.forEach((item) => {
                  item.fileUpload2 = ''
                  item.statusUpload2 = 'False'
                })
              }
            }
            // if (checkUploadfile) {
            console.log('if 2406', checkUploadfile)
            axios
              .post(this.DNS_IP + '/Booking/addTimeEpm', Add)
              .then(async response => {
                if (response.data.message === 'LimitBooking_Full') {
                  this.$swal(this.languageSelect === 0 ? 'คิวเต็มแล้ว' : 'Full queue', this.languageSelect === 0 ? 'กรุณาเลือกวันที่ใหม่อีกครั้ง' : 'Please select a new date again.', 'error')
                  this.date = ''
                  this.time = ''
                } else {
                  this.updateNewBookingFibase(this.shopId)
                  this.overlay = true
                  if (this.dataLineConfig.checkConfig !== false) {
                    this.getDataChkMember()
                  }
                  console.log('addDataGlobal DNS_IP + /Booking/add', response)
                  let bookNo = response.data.bookNo
                  let flowId = this.fromAdd.flowId
                  console.log('updateStatusConfirm', this.DataFlowNameAll.filter((item) => item.flowId === flowId)[0].updateStatusConfirm)
                  // console.log('response!!!!!!!!!!!', this.DataFlowNameAll.filter((item) => item.flowId === flowId))
                  let checkDeposit = this.DataFlowNameAll.filter((item) => item.flowId === flowId)[0].checkDeposit
                  let amountDeposit = this.DataFlowNameAll.filter((item) => item.flowId === flowId)[0].amountDeposit
                  let menuShowStatus = this.DataFlowNameAll.filter((item) => item.flowId === flowId)[0].menuShowStatus
                  console.log('menuShowStatus', menuShowStatus, 'checkDeposit', checkDeposit, 'amountDeposit', amountDeposit)
                  console.log('liffSendMessageAfterBookingStatus', this.liffSendMessageAfterBookingStatus)
                  // if (checkDeposit === 'True' && amountDeposit > 0) {
                  if ((checkDeposit === 'True' && amountDeposit > 0) || (checkDeposit === 'True' && menuShowStatus === 'True')) {
                    if (amountDeposit === 0 && this.priceMenu === 0) {
                      await this.pushMsgLineNotifyGroup(bookNo)
                    }
                    if (this.DataFlowNameAll.filter((item) => item.flowId === flowId)[0].updateStatusConfirm === 'True') {
                      console.log('updateStatusConfirm', this.DataFlowNameAll.filter((item) => item.flowId === flowId)[0].updateStatusConfirm)
                      let dtt = {
                        bookNo: bookNo,
                        contactDate: moment().format('YYYY-MM-DD HH:mm'),
                        status: 'confirm',
                        statusUse: 'use',
                        shopId: this.shopId,
                        CREATE_USER: userId,
                        LAST_USER: userId
                      }
                      await axios
                        .post(this.DNS_IP + '/booking_transaction/add', dtt)
                        .then(async response => {
                          console.log('statusGoogleCalendar', this.statusGoogleCalendar)
                          if (this.statusGoogleCalendar === 'True') {
                            this.connectGoogleCalendar(dtt.shopId, 'Add', dtt.bookNo)
                          }
                        }).catch(error => {
                          console.log('error function booking_transaction : ', error)
                        })
                    }
                    let Calculate = 1
                    if (this.customerTimeSlot === 'False') {
                      Calculate = 1
                    } else {
                      Calculate = this.fromAddTimeCus
                    }
                    if (this.languageSelect === 0) {
                      this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=BookingForm&flowId=' + flowId + '&bookNo=' + bookNo + '&languageSelect=' + this.languageSelect + '&Calculate=' + Calculate)
                    } else {
                      let statusEngPayment = this.bookingFieldData[0].statusEngPayment || 'False'
                      if (statusEngPayment === 'False') {
                        await this.pushMsgLineNotifyGroup(bookNo)
                        // await this.getCondition(flowId, 'Thank', bookNo)
                        // await this.pushMsgCustomer(bookNo, flowId)
                      } else {
                        this.$router.push('/Thank?shopId=' + this.shopId + '&redirectBy=BookingForm&flowId=' + flowId + '&bookNo=' + bookNo + '&languageSelect=' + this.languageSelect + '&Calculate=' + Calculate)
                      }
                    }
                    // await this.getCondition(flowId, 'Thank', bookNo)
                  } else {
                    if (this.DataFlowNameAll.filter((item) => item.flowId === flowId)[0].updateStatusConfirm === 'True') {
                      console.log('updateStatusConfirm', this.DataFlowNameAll.filter((item) => item.flowId === flowId)[0].updateStatusConfirm)
                      let dtt = {
                        bookNo: bookNo,
                        contactDate: moment().format('YYYY-MM-DD HH:mm'),
                        status: 'confirm',
                        statusUse: 'use',
                        shopId: this.shopId,
                        CREATE_USER: userId,
                        LAST_USER: userId
                      }
                      await axios
                        .post(this.DNS_IP + '/booking_transaction/add', dtt)
                        .then(async response => {
                          console.log('statusGoogleCalendar', this.statusGoogleCalendar)
                          if (this.statusGoogleCalendar === 'True') {
                            this.connectGoogleCalendar(dtt.shopId, 'Add', dtt.bookNo)
                          }
                        }).catch(error => {
                          console.log('error function booking_transaction : ', error)
                        })
                    }
                    await this.pushMsgLineNotifyGroup(bookNo)
                    // await this.pushMsgCustomer(bookNo, flowId)
                  }
                  // this.$router.push('/Thank?shopId=' + this.shopId)
                  // this.overlay = false
                }
              })
              .catch(error => {
                this.overlay = false
                console.log('error function addData : ', error)
              })
            // } else {
            //   this.$swal('ผิดพลาด', 'อัพโหลดไฟล์ไม่สำเร็จ กรุณาลองอีกครั้ง', 'error')
            //   this.fileUpload1 = null
            //   this.fileUpload2 = null
            //   this.fromAdd.fileUpload1 = ''
            //   this.fromAdd.fileUpload2 = ''
            // }
          } else {
            console.log('else 2421')
            this.$swal(this.languageSelect === 0 ? 'คิวเต็มแล้ว' : 'Full queue', this.languageSelect === 0 ? 'กรุณาเลือกวันที่ใหม่อีกครั้ง' : 'Please select a new date again.', 'error')
            this.date = ''
            this.time = ''
            this.overlay = false
          }
        })
        .catch(error => {
          this.overlay = false
          console.log('Cencel : ', error)
        })
    },
    async pushMsgConfirm (bookNo, flowId) {
      await axios
        .post(this.DNS_IP + '/Booking/pushMsgConfirm/' + bookNo)
        .then(async response => {
          await this.getCondition(flowId, 'Thank', bookNo)
        }).catch(error => {
          console.log('error function pushMsgQueue : ', error)
        })
    },
    async getCondition (flowId, text, bookNo) {
      console.log('test', text)
      await axios
        .get(
          this.DNS_IP + '/flow/get?flowId=' + flowId + '&shopId=' + this.shopId
        )
        .then(response => {
          let rs = response.data
          if (rs.status === false) {
            if (text === 'BookingQrcode') {
              this.$router.push(
                '/BookingQrcode?bookNo=' + bookNo + '&shopId=' + this.shopId + '&languageSelect=' + this.languageSelect
              )
            } else {
              this.$router.push(
                '/Thank?shopId=' + this.shopId + '&redirectBy=BookingForm&flowId=' + flowId + '&bookNo=' + bookNo + '&languageSelect=' + this.languageSelect)
            }
          } else {
            if (rs[0].showCondition === 'แสดง') {
              this.$router.push(
                '/ConditionFlow?shopId=' + this.shopId + '&flowId=' + flowId + '&languageSelect=' + this.languageSelect
              )
            } else {
              if (text === 'BookingQrcode') {
                this.$router.push(
                  '/BookingQrcode?bookNo=' + bookNo + '&shopId=' + this.shopId + '&languageSelect=' + this.languageSelect
                )
              } else {
                this.$router.push(
                  '/Thank?shopId=' + this.shopId + '&redirectBy=BookingForm&flowId=' + flowId + '&bookNo=' + bookNo + '&languageSelect=' + this.languageSelect)
              }
            }
          }
        })
    },
    async pushMsgCustomer (bookNo, flowId) {
      const result = await axios.get(
        this.DNS_IP +
          '/member/get?shopId=' +
          this.shopId +
          '&liffUserId=' +
          this.profile.userId
      )
      console.log('result', result.data.status)
      if (result.data.status === false) {
        let statusSend = {
          statusSend: 'false'
        }
        await axios.post(this.DNS_IP + '/Booking/edit/' + bookNo, statusSend)
        console.log('statusSend', 'false')
        if (this.$liff.isInClient()) {
          // if (this.profile.userId === 'U29e920c9ca4411b09b8c1704f37197c3' || this.profile.userId === 'U35b246f2825895f3fdcc09b72d589f92') {
          //   alert('isInClient')
          // }
          this.$liff
            .sendMessages([
              {
                type: 'text',
                text: 'เปิดรับการแจ้งเตือน'
              }
            ])
            .then(() => {
              console.log('message sent')
              // alert('message sent')
              // this.$liff.closeWindow()
            })
            .catch((err) => {
              console.log('error', err)
              // alert('error:' + err)
            })
        }
        await this.getCondition(flowId, 'Thank', bookNo)
      } else {
        let statusSend = {
          statusSend: 'true'
        }
        await axios.post(this.DNS_IP + '/Booking/edit/' + bookNo, statusSend)
        // let lineUserId = result.data[0].lineUserId
        console.log('statusSend', 'true')
        let updateStatusSend = {
          updateStatusSend: 'false'
        }
        axios
          .post(
            this.DNS_IP + '/Booking/pushMsgCustomer/' + bookNo,
            updateStatusSend
          )
          .then(async response => {
            await this.getCondition(flowId, 'Thank', bookNo)
          })
      }
      // this.clearData()
    },
    async pushMsgLineNotifyGroup (bookNo) {
      await axios
        .post(this.DNS_IP + '/Booking/pushMsgLineNotifyGroup/' + bookNo)
        .then(response => {
          this.clearData()
        })
    },
    async clearData () {
      this.fieldNameItem = []
      this.branch = []
      this.DataFlowName = []
      this.DataflowId = []
      this.fromAdd = {}
      this.fromAddTimeCus = ''
    },
    async getBotinfo () {
      const url = `${this.DNS_IP}/line/getOa`
      // const url = 'http://localhost:81/Api/vgroupl_api/v1/Zoom/Login/getData?'
      const config = {
        headers: {
          botId: this.shopId
        }
      }
      await axios.get(url, config).then(response => {
        let rs = response.data
        console.log('rs1', rs)
        window.location.href = 'line://ti/p/' + rs.basicId
      })
    },
    async manageLimitBooking () {
      let userId = ''
      if (this.$route.query.error === undefined) {
        userId = this.profile.userId
      } else {
        userId = 'system'
      }
      var dt = {
        dataLimit: this.limitCountBranch.filter(el => {
          return el.value !== this.time.value
        }),
        dueDateNew: this.date,
        masBranchIDLimit: this.fromAdd.masBranchID,
        shopId: this.shopId,
        CREATE_USER: userId,
        LAST_USER: userId
      }
      console.log('manageLimitBooking', dt)
      await axios
        .post(this.DNS_IP + '/LimitBookingDate/manageBookForm', dt)
        .then(async response => {})
    },
    async getDataChkMember () {
      if (this.profile.userId) {
        await axios.get(this.DNS_IP + '/member/get?shopId=' + this.$route.query.shopId + '&liffUserId=' + this.profile.userId).then(async result => {
          var lineUserIds = ''
          var liffUserIds = ''
          // if (typeof result.data.status === 'undefined') {
          //   lineUserIds = result.data[0].lineUserId || ''
          //   liffUserIds = result.data[0].liffUserId || ''
          // }
          if (result.data.status === false) {
            await this.onSubmit()
          } else {
            lineUserIds = result.data[0].lineUserId || ''
            liffUserIds = result.data[0].liffUserId || ''
            if (lineUserIds === '' && liffUserIds !== '') {
              await this.onUpdate(result.data[0].memberId)
            }
          }
        })
      }
      // } else {
      //   this.$swal(
      //     'ผิดหลาด!',
      //     'กรุณาทำรายการใหม่',
      //     'error'
      //   )
      // }
    },
    async onSubmit () {
      // var idMember = 'Link_' + Date.now()
      var idMember = moment().valueOf()
      const params = {
        name: this.profile.displayName,
        picture: this.profile.pictureUrl,
        liffUserId: this.profile.userId,
        lineUserId: this.profile.userId,
        shopId: this.$route.query.shopId,
        memberId: idMember,
        CREATE_USER: this.profile.userId,
        LAST_USER: this.profile.userId
      }
      const result = await this.callBeTaskAPIActivity('post', `/member/add`, params)
      console.log('result', result.status)
    },
    async onUpdate (idMember) {
      // "https://api-belinked.betaskthai.com/member/editWebhook/" + request.body.events[0].message.text.split(" ")[2]
      // window.location.replace(`https://access.line.me/dialog/bot/accountLink?linkToken=${this.$route.query.likeToken}&nonce=${idMember}-${this.profile.userId}`)
      // window.location.href = `https://access.line.me/dialog/bot/accountLink?linkToken=${this.$route.query.likeToken}&nonce=${idMember}-${this.profile.userId}`
      const params = {
        lineUserId: this.profile.userId,
        liffUserId: this.profile.userId,
        LAST_USER: this.profile.userId
      }
      const result = await this.callBeTaskAPIActivity('post', '/member/editWebhook/' + idMember, params)
      console.log('result', result.status)
    },
    async callBeTaskAPIActivity (method, url, params) {
      let result = null
      //   const token = this.$liff.getAccessToken() || '1234567890'
      await axios({
        method: method,
        // headers: {
        //   accessToken: token,
        //   lineUserId: this.profile.userId,
        //   activityId: this.formUpdate.activityId
        // },
        url: this.DNS_IP + url,
        data: params
      }).then((response) => {
        result = response.data
      }).catch((error) => {
        console.log(error)
        result = null
      })
      return result
    }
  }
}
</script>

<style scoped>
.textPriceMenu {
/* Price/Small */
font-style: normal;
font-weight: 700;
font-size: 14px;
line-height: 20px;

color: #FF7B2C;

}
.textTitelPriceMenu {
font-style: normal;
font-weight: 600;
font-size: 16px;
line-height: 22px;
}
.textTitelMenu {
font-style: normal;
font-weight: 600;
font-size: 12px;
line-height: 22px;
width:100%;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}
.textTitelMenuSub {
font-style: normal;
font-weight: 600;
font-size: 12px;
line-height: 22px;
}
.textTitelMenuRemark {
font-style: normal;
font-weight: 400;
font-size: 11px;
line-height: 22px;
width:100%;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}
.textSubTitelMenu {
font-style: normal;
font-weight: 200;
font-size: 14px;
line-height: 22px;
}
.cardTextMenu {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 15px;

  width: 147px;
  height: 104px;
  /* Inside auto layout */

  flex: none;
  order: 1;
  flex-grow: 1;
}
.pictureMenu {
  width: 40px;
  height: 40px;

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
  padding: 10px 12px;
  gap: 12px;

  width: 327px;
  height: 70px;

  background: #FFFFFF;
  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.03), 0px 4px 20px -2px rgba(50, 50, 71, 0.04);
  border-radius: 16px;

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 1;
}
.slidein {
  width: 100%;
  padding: 2em 1em;
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  background: #fff;
  height: 100%;
  overflow: scroll;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
  transition: all 0.5s ease-in-out;
}
.roundDialog {
  border-radius: 30px;
}
.button {
  width: 45%;
  color: #fff;
  font-weight: 200;
  letter-spacing: 1px;
  margin: 6px 3px;
  padding: 10px 28px;
  border-radius: 25px !important;
  background-color: #0047a5;
}
.portrait.v-card {
  margin: 0 auto;
  max-width: 600px;
  width: 100%;
}
.main {
  padding: 0px;
  background: #ffffff;
}
.content {
  border-radius: 10px;
}
.a {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0px;
}
.InputData {
  margin: 0px !important;
  padding: 0px !important;
}
</style>
