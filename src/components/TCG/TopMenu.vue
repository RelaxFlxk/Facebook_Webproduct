<template>
  <v-card
    flat
    class="mt-0 pt-0 mb-8"
  >
    <v-card-text>
      <v-row
        align="center"
        justify="center"
      >
        <v-btn-toggle
          v-model="toggle_exclusive"
          rounded
          block="true"
          class="rounded-xl"
        >
          <v-btn >
            หมอหนี้
          </v-btn>
          <v-btn>
            คิวนัดหมาย
          </v-btn>
          <v-btn>
            ประวัติปรึกษา
          </v-btn>
        </v-btn-toggle>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      toggle_exclusive: 0
    }
  }
}
</script>
