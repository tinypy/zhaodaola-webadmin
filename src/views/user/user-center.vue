<template>
  <div class="frame-page">
    <Row :space="25">
      <Cell :xs="24" :sm="24" :md="8" :lg="6" :xl="5">
        <div class="h-panel h-panel-no-border">
          <div class="h-panel-bar">
            <div class="h-panel-title">个人信息</div>
          </div>
          <div class="h-panel-body">
            <div>
              <div style="text-align: center">
                <el-upload
                  :show-file-list="false"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :headers="headers"
                  :action="updateAvatarApi"
                  class="avatar-uploader"
                >
                  <img :src="userInfo.avatar ? baseApi + userInfo.avatar : Avatar" title="点击上传头像" class="avatar" />
                </el-upload>
              </div>
              <ul class="user-info">
                <li>
                  <div style="height: 100%">
                    登录账号
                    <div class="user-right">{{ userInfo.username }}</div>
                  </div>
                </li>
                <li>
                  用户昵称
                  <div class="user-right">{{ userInfo.nickName }}</div>
                </li>
                <li>
                  手机号码
                  <div class="user-right">{{ userInfo.telephone }}</div>
                </li>
                <li>
                  用户邮箱
                  <div class="user-right">{{ userInfo.email }}</div>
                </li>
                <li>
                  所属部门
                  <div class="user-right">{{ userInfo.dept }}</div>
                </li>
                <li>
                  安全设置
                  <div class="user-right">
                    <a @click="updateVisible = true">修改密码</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Cell>
      <Cell :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <div class="h-panel h-panel-no-border">
          <div class="h-panel-bar">
            <div class="h-panel-title">基本信息</div>
          </div>
          <div class="h-panel-body">
            <Form ref="editor" :label-width="100" :rules="validationRules" mode="single" :model="editor" :showErrorTip="false">
              <FormItem label="姓名" prop="realName">
                <input v-model="editor.realName" type="text" />
              </FormItem>
              <FormItem label="电话" prop="telephone">
                <input v-model="editor.telephone" type="text" />
              </FormItem>
              <FormItem label="邮箱" prop="email">
                <input v-model="editor.email" type="text" />
              </FormItem>
              <FormItem label="身份证号码" prop="idCard">
                <input v-model="editor.idCard" type="text" />
              </FormItem>
              <FormItem label="系部" prop="dept">
                <Select v-model="editor.dept" dict="depts" placeholder="系部"></Select>
              </FormItem>
              <FormItem label="性别" prop="gender">
                <Radio v-model="editor.gender" dict="gender"></Radio>
              </FormItem>
              <FormItem>
                <Button color="primary" :loading="isLoading" @click="submitEditor">保 存</Button>&nbsp;&nbsp;&nbsp;
              </FormItem>
            </Form>
          </div>
        </div>
      </Cell>
    </Row>

    <!-- 新增弹出框 -->
    <el-dialog
      title="修改密码"
      :close-on-click-modal="false"
      :visible.sync="updateVisible"
      width="30%"
      :modal-append-to-body="false"
      top="25vh"
      :destroy-on-close="true"
    >
      <Form ref="form" :label-width="150" :rules="rules" :model="data">
        <FormItem label="旧密码" prop="oldpassword">
          <input type="text" v-model="data.oldpassword" :autocomplete="false" />
        </FormItem>
        <FormItem label="新密码" prop="newpassword1">
          <input type="password" v-model="data.newpassword1" :autocomplete="false" />
        </FormItem>
        <FormItem label="再次输入新密码" prop="newpassword2">
          <input type="password" v-model="data.newpassword2" :autocomplete="false" />
        </FormItem>
        <FormItem>
          <Button color="primary" :loading="isLoading" @click="submit">提 交</Button>&nbsp;&nbsp;&nbsp;
          <Button @click="updateVisible = false">取 消</Button>
        </FormItem>
      </Form>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store';
const api = 'http://localhost:8001/api';
import { getToken, removeToken } from '../../js/common/auth.js';
import Avatar from '@/images/avatar.png';
export default {
  name: 'UserCenter',
  data() {
    return {
      data: {
        oldpassword: null,
        newpassword1: null,
        newpassword2: null
      },
      rules: {
        required: ['oldpassword', 'newpassword1', 'newpassword2'],
        combineRules: [
          {
            refs: ['newpassword1', 'newpassword2'],
            valid: {
              valid: 'equal',
              message: '两次输入的密码不一致'
            }
          }
        ]
      },
      updateVisible: false,
      validationRules: {
        required: ['realName', 'telephone', 'email', 'dept', 'gender', 'idCard'],
        email: ['email'],
        mobile: ['telephone']
      },
      updateAvatarApi: api + '/users/updateAvatar',
      headers: {
        Authorization: getToken()
      },
      Avatar: Avatar,
      userInfo: {},
      baseApi: this.$store.getters.baseApi + '/avatar/',
      isLoading: false,
      editor: {
        id: 0,
        realName: '',
        telephone: '',
        email: '',
        idCard: '',
        dept: '',
        gender: 1
      }
    };
  },
  methods: {
    submit() {
      this.isLoading = true;
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        let pass = {};
        pass.oldPass = this.data.oldpassword;
        pass.newPass = this.data.newpassword1;
        R.User.updatePass(pass).then(res => {
          if (res.ok) {
            this.$notify({
              title: '密码修改成功，请重新登录',
              type: 'success',
              duration: 1500
            });
            setTimeout(() => {
              removeToken();
              this.$router.replace({ name: 'Login' });
            }, 1500);
          }
        });
      }
      this.isLoading = false;
    },
    submitEditor() {
      let validResult = this.$refs.editor.valid();
      if (validResult.result) {
        R.User.updateInfo(this.editor).then(res => {
          if (res.ok) {
            this.$notify({
              title: '修改成功',
              type: 'success',
              duration: 2500
            });
            this.getUserInfo();
          }
        });
      }
    },
    initEditor(user) {
      let tempUser = {};
      tempUser.id = user.id;
      tempUser.realName = user.realName;
      tempUser.telephone = user.telephone;
      tempUser.email = user.email;
      tempUser.idCard = user.idCard;
      tempUser.dept = user.dept;
      tempUser.gender = user.gender == '男' ? 1 : 2;
      this.editor = tempUser;
    },
    getUserInfo() {
      // 获取用户信息;
      R.User.getUserInfo().then(res => {
        if (res.ok) {
          this.userInfo = res.body;
          this.initEditor(res.body);
          store.dispatch('updateAccount', res.body);
          store.dispatch('updateRoles', res.body.roles);
        }
      });
    },
    handleSuccess(response, file, fileList) {
      this.$notify({
        title: '头像修改成功',
        type: 'success',
        duration: 2500
      });
      this.getUserInfo();
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message);
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      });
    }
  },
  mounted() {
    this.getUserInfo();
  }
};
</script>

<style lang="less" scoped>
.avatar-uploader-icon {
  font-size: 28px;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 50%;
}
.user-info {
  padding-left: 0;
  list-style: none;
  li {
    border-bottom: 1px solid #f0f3f4;
    padding: 11px 0;
    font-size: 13px;
  }
  .user-right {
    float: right;

    a {
      color: #317ef3;
    }
  }
}
</style>