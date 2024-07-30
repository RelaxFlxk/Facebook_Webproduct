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
  mounted () {
    if (this.$liff.isInClient() === false) {
      window.close()
      console.log('dddddddddddd')
    } else {
      this.$liff.closeWindow()
      console.log('dddddddddddd')
    }
  },
  methods: {
  }
}
</script>
