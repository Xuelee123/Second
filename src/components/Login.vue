<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img  src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form :model="loginForm" ref="loginFormRef" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item  prop="username">
          <el-input v-model="loginForm.username"  prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码区域 -->
        <el-form-item  prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns" >
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的对象
       loginForm: {
          username: 'admin',
          password: '123456',
          
        },
        loginFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 8 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 8个字符', trigger: 'blur' }
          ]
        }
    }
  },
  methods: {
    reset () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async(valid) => {
       if(!valid) return
       const result = await this.$http.post('login',this.loginForm)
       const  { data } = result
       if(data.meta.status !== 200) return this.$message.error('登录失败o(╥﹏╥)o')
       this.$message.success('登录成功~~~')
       //登录成功后将token保存到sessionStorage中
       window.sessionStorage.setItem('token', data.data.token)
       //通过编程式路由导航跳转到后台主页，路由地址是/home
       this.$router.push('/home')
      })
    },
  }
};
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;

  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  position: absolute;
  box-shadow: 0 0 10px #ddd;
  left: 50%;
  background-color: #fff;
  transform: translate(-50%, -50%);
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>