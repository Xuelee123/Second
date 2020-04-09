<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 添加与搜索区域 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="addDialogVisiable=true">添加用户</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <!-- 这里的change事件是随着v-model的值变化触发的 -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              @click="showEditDialog(scope.row.id)"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              @click="removeUserById(scope.row.id)"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <!-- 分配角色按钮 tooltip文字提示-->
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisiable" width="50%" @close="addDialogClose">
      <!-- 内容主体区域 -->
      <el-form :model="ruleForm" :rules="addFormgRules" ref="ruleForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisiable"
      width="50%"
      @close="eidtDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="eidtFormRules"
        ref="editRuleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱的规则
    const checkEmail = (rule, value, cb) => {
      //
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        //合法对象
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    //验证号码的规则
    const checkmobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        //合法对象
        return cb();
      }
      cb(new Error("请输入合法的号码"));
    };
    return {
      queryInfo: {
        query: "",
        //当前的 页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 2
      },
      ruleForm: {
        username: "",
        password: "",
        mobile: "",
        email: ""
      },
      //增加对话框的校验规则
      addFormgRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ]
      },
      userList: [],
      total: 0,
      //控制对话框的显示与隐藏
      addDialogVisiable: false,
      editDialogVisiable: false,
      editForm: {},
      //修改对话框的校验规则
      eidtFormRules: {
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (data.meta.status !== 200)
        return this.$message.error("获取用户列表数据失败");
      this.total = data.data.total;
      this.userList = data.data.users;
      //console.log(data.data.users)
    },
    //监听switch开关状态的改变,put是改变状态的请求
    async userStateChange(userinfo) {
      //console.log(userinfo);这里userinfo获取的是前端的发过来的
      //put请求改变状态
      const { data } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      //这个data是发送修改请求后返回的值
      //console.log(data);
      if (data.meta.status !== 200) {
        //如果更新状态失败了，要前端的mg_state状态值要改变回原样
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新状态数据成功");
    },
    //监听pageSize改变的事件
    handleSizeChange(newSize) {
      //console.log(newSize)
      this.queryInfo.pagesize = newSize;
      //重新获取一下数据
      this.getUserList();
    },
    //监听页码值 改变的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pagenum = newPage;
      //重新获取一下数据
      this.getUserList();
    },
    //监听添加用户对话框的关闭事件
    addDialogClose() {
      this.$refs.ruleForm.resetFields();
    },
    //点击按钮，添加新用户
    addUser() {
      this.$refs.ruleForm.validate(async valid => {
        //这个valid是一个布尔值，通过了表单的验证就是true
        //否则就是false
        if (!valid) return;
        //通过了就可以发起添加用户的请求
        console.log(this.ruleForm.mobile);
        const { data } = await this.$http.post("users", this.ruleForm);
        if (data.meta.status !== 201) {
          this.$message.error("添加用户失败！");
        }
        this.$message.success("添加用户成功！");
        //隐藏添加用户的对话框
        this.addDialogVisiable = false;
        //重新获取用户列表数据
        this.getUserList();
      });
    },
    async showEditDialog(id) {
      const { data } = await this.$http.get("users/" + id);
      if (data.meta.status !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.editForm = data.data;
      this.editDialogVisiable = true;
    },
    //监听修改用户对话框的关闭事件
    eidtDialogClosed() {
      this.$refs.editRuleFormRef.resetFields();
    },
    editUser() {
      this.$refs.editRuleFormRef.validate(async valid => {
        if (!valid) return;
        //通过了就发起修改的请求
        const { data } = await this.$http.put("users/" + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        });
        if (data.meta.status !== 200) {
          return this.$message.error("更新用户信息失败");
        }
        this.$message.success("更新用户信息成功");
        //隐藏修改用户的对话框
        this.editDialogVisiable = false;
        //重新获取用户列表数据
        this.getUserList();
      });
    },
    //删除用户
    async removeUserById(id) {
      //先弹框提示是否要删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      //如果用户确认删除，则返回值为字符串confirm
      //如果用户取消删除，则返回值为字符串cancel
      //console.log(confirmResult);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data } = await this.$http.delete("users/" + id);
      if (data.meta.status !== 200) {
        return this.$message.error("删除用户信息失败");
      }
      this.$message.success("删除用户信息成功");
      this.getUserList();
    }
  }
};
</script>
<style lang="less" scoped>
</style>