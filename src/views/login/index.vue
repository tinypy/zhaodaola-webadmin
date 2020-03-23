<style lang="less">
.login-vue {
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: url('../../images/login-bg.jpg') no-repeat center center;
  background-size: cover;
  height: 100%;
  min-width: 766px;
  overflow: hidden;
  .title {
    font-size: 38px;
    font-weight: bold;
    position: relative;
    top: 80px;
    left: 0px;
    text-align: center;
    user-select: none;
    line-height: 60px;
  }
  .login-container {
    background-color: white;
    width: 380px;
    height: 320px;
    margin: 100px auto 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;
    .h-form .h-form-item {
      position: relative;
      margin-bottom: 10px;
      input[type='text'],
      input[type='password'] {
        height: 38px;
      }
    }
    .form-code {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .input-code {
        height: 38px;
        flex: 1;
      }
      .img-code {
        width: 100px;
        height: 38px;
        box-sizing: border-box;
        img {
          width: 100px;
          height: 38px;
          line-height: 38px;
          display: block;
          cursor: pointer;
        }
      }
    }
  }
}
</style>

<template>
  <div class="login-vue">
    <div class="title">
      广州大学华软软件学院失物招领中心
      <br />后台管理系统
    </div>
    <div class="login-container animated fadeInDown">
      <Form ref="form" :model="login" :rules="validationRules" :labelPosition="labelPosition" :labelWidth="0">
        <FormItem prop="username" label="用户名" :showLabel="false">
          <div class="h-input h-input-prefix-icon">
            <input type="text" v-model="login.username" placeholder="请输入登录账号" auto-complete="off" @keyup.enter="handleLogin" />
            <i class="h-icon-user"></i>
          </div>
        </FormItem>
        <FormItem prop="password" label="密码" :showLabel="false">
          <div class="h-input h-input-prefix-icon">
            <input type="password" v-model="login.password" placeholder="请输入登录密码" auto-complete="off" @keyup.enter="handleLogin" />
            <i class="h-icon-lock"></i>
          </div>
        </FormItem>
        <FormItem prop="code" label="验证码" :showLabel="false">
          <div class="form-code">
            <div class="input-code">
              <div class="h-input">
                <input type="text" v-model="login.code" placeholder="请输入验证码" auto-complete="off" @keyup.enter="handleLogin" />
              </div>
            </div>
            <div class="img-code">
              <img :src="src" alt="哎呀" title="看不清楚，换一张" @click="getCode" />
            </div>
          </div>
        </FormItem>
        <FormItem>
          <Button :block="true" color="primary" @click="handleLogin" :loading="isLoading">登 录</Button>
        </FormItem>
      </Form>
    </div>
    <div>
      Copyright © 2019 PangYi -
      <a href="https://www.sise.com.cn/">ZhaoDaoLa-Admin</a>
    </div>
  </div>
</template>
<script>
import { setToken } from 'js/common/auth.js';
export default {
  data() {
    return {
      labelPosition: 'left',
      showErrorTip: true,
      isLoading: false,
      login: {
        username: '',
        password: '',
        uuid: '',
        code: ''
      },
      src: '',
      validationRules: {
        required: ['username', 'password', 'code']
      },
      validOnChange: true
    };
  },
  mounted() {
    this.getCode();
  },
  methods: {
    handleLogin() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.isLoading = true;
        R.User.login(this.login).then(res => {
          if (res.ok) {
            // 保存登录状态
            setToken(res.body.token);
            this.$router.push({ path: this.redirect || '/' });
            this.isLoading = false;
          } else {
            this.getCode();
            this.login = {
              username: '',
              password: '',
              uuid: '',
              code: ''
            };
            this.isLoading = false;
          }
        });
      }
    },
    getCode() {
      setTimeout(() => {
        R.Code.code().then(res => {
          this.src = res.body.img;
          this.login.uuid = res.body.uuid;
        });
      }, 500);
    }
  }
};
</script>