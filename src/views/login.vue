<template>
  <div class="login-wrap">
    <div class="login">
      <h1 class="logo"> </h1>
      <!-- <img class="logo" src="@/assets/images/logo.png" alt> -->

      <div class="login-form">
        <h3 class="title">识别分析模型与典型场景适配管理平台</h3>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              type="text"
              auto-complete="off"
              placeholder="用户名称"
              clearable
            >
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
            </el-input>
          </el-form-item>
          <el-form-item style="margin-top: 41px" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              auto-complete="off"
              placeholder="请输入密码"
              clearable
              @keyup.enter.native="handleLogin"
            >

              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
            </el-input>
          </el-form-item>

          <el-form-item style="width:100%;">
            <el-button
              :loading="loading"
              size="medium"
              type="primary"
              class="login-btn"
              @click.native.prevent="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "admin123"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ]
      },
      loading: false,

      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },

  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(res => {
              // this.getDictList();
              this.$router.push({ path: this.redirect || "/" }).catch(() => {});
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    }

    // 获取字典项
    // getDictList() {
    //   return new Promise(resolve => {
    //     getDict({}).then(res => {
    //       localStorage.setItem("dict", JSON.stringify(res.data));
    //       // resolve();
    //     });
    //   });
    // }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login-wrap {
  height: 100%;
  background-image: url("~@/assets/images/login_bg.png");
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login {
  flex-direction: column;
  text-align: center;
  .logo {
    // width: 90%;
    //width: 840px;
    width: 612px;
    color: #fff;
    margin-bottom: 30px;
  }
  .login-form {
    background: url("~@/assets/images/login_form.png") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    padding: 43px 92px 45px;
    height: 410px;
    .title {
      font-size: 24px;
      text-align: center;
      color: #fff;
    }
    ::v-deep .el-form {
      width: 50%;
      margin: 38px auto 0;
      .el-input {
        height: 44px;
        input {
          height: 44px;
          background-color: rgba(23, 63, 136, 0);
          //border-color: ;
          border: none;
          color: #258ae7;
          padding-left: 50px;
        }
      }
      .el-input__prefix {
        display: flex;
        align-items: center;
        //&::after {
        //  content: "";
        //  display: inline-block;
        //  width: 1px;
        //  height: 15px;
        //  background-color: #258ae7;
        //  margin-left: 10px;
        //}
      }
      .input-icon {
        height: 39px;
        width: 20px;
        margin-left: 2px;
      }
    }
    .login-btn {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      width: 146%;
      background-color: #409EFF;
      border-radius: 24px;
      border: 0;
      height: 52px;
      margin-top: 55px;
    }
  }
  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }
  .login-code {
    width: 33%;
    height: 38px;
    float: right;
    img {
      cursor: pointer;
      vertical-align: middle;
    }
  }
}
</style>
