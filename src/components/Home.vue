<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!-- 侧边栏区域 -->
    <el-container>
      <!-- 侧边栏菜单区域 -->
      <el-aside :width="isCollapse ? '64px': '200px'">
          <div class="toggle-button" @click="toggleButton">|||</div>
          <el-menu
            :default-active="activePath"
            class="el-menu-vertical-demo"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409BFF"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            router
           
          >
            <el-submenu :index="item.id + ''" v-for = "item in menuList" :key="item.id">
              <!-- 一级菜单的模板区 -->
              <template slot="title">
                <i :class="iconList[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单区 -->
              <el-menu-item :index="'/' + item.path" v-for = "item in item.children" :key="item.id"
              @click="saveNavState('/' + item.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{item.authName}}</span>
                </template>
              </el-menu-item>
              
            </el-submenu>
          </el-menu>
        
      </el-aside>
      <!-- 内容区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList(),
    this.activePath = window.sessionStorage.getItem('path')
  },
  data() {
    return {
      menuList: [],
      iconList:{
        125:'iconfont icon-user',
        103:'iconfont icon-tijikongjian',
        101:'iconfont icon-shangpin',
        102:'iconfont icon-danju',
        145:'iconfont icon-baobiao'
      },
      isCollapse: true,
      activePath: ''
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear("token");
      this.$router.push("/login");
    },
    async getMenuList() {
     const result =  await this.$http.get('menus')
     console.log(result);
     if(result.data.meta.status!== 200) return this.$message.error('列表获取失败')
     const {data} = result.data
     console.log(data);
     this.menuList = data
    },
    toggleButton () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (path) {
      window.sessionStorage.setItem('path',path)
      this.activePath = path
    }
  }
};
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px
}
.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer
}
</style>