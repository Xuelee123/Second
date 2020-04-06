<template>
<div>
  <el-button type="info" @click="logout">退出</el-button>
</div>
</template>

<script>
export default {
  data(){
    return {}
  },
  methods: {
    logout () {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
 
</style>