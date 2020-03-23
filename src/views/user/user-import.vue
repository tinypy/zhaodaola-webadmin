<template>
  <div class="frame-page create">
    <Row :space="20">
      <Cell :xs="24" :sm="24" :md="6" :lg="8" :xl="8">
        <div class="h-panel h-panel-no-border">
          <div class="h-panel-bar">
            <span class="h-panel-title blue-color">
              <i class="el-icon-s-data"></i>
              用户批量导入
            </span>
            <span class="h-panel-right"></span>
          </div>
          <div class="h-panel-body">
            <el-upload
              ref="upload"
              :on-change="change"
              :on-remove="remove"
              :headers="headers"
              :limit="1"
              :auto-upload="false"
              drag
              :action="action"
              :multiple="false"
              :on-success="uploadSuccess"
              :on-error="uploadError"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                <span class="h-tag-circle h-tag-bg-blue">说</span>
                只支持上传格式以.xls或者.xlsx结尾的excel文件
              </div>
              <div class="el-upload__tip" slot="tip">
                <span class="h-tag-circle h-tag-bg-blue">明</span>
                每次最多只能上传一个文件
              </div>
            </el-upload>
            <div style="margin-top:20px;">
              <Button icon="h-icon-outbox" :disabled="disabled" :loading="loading" @click="upload" color="red">Upload</Button>
            </div>
          </div>
        </div>
      </Cell>
      <Cell :xs="24" :sm="24" :md="18" :lg="16" :xl="16">
        <div class="h-panel h-panel-no-border">
          <div class="h-panel-bar">
            <span class="h-panel-title blue-color">
              <i class="el-icon-s-custom"></i>
              单用户添加
            </span>
            <span class="h-panel-right"></span>
          </div>
          <div class="h-panel-body">
            <Form ref="create" :label-width="100" :rules="validationRules" mode="twocolumn" :model="create" :showErrorTip="false">
              <FormItem label="账号" prop="username">
                <input v-model="create.username" type="text" placeholder="请输入新增用户的学号或教职工号" />
              </FormItem>
              <FormItem label="姓名" prop="realName">
                <input v-model="create.realName" type="text" placeholder="请输入用户真实姓名" />
              </FormItem>
              <FormItem label="电话" prop="telephone">
                <input v-model="create.telephone" type="text" placeholder="请输入用户联系电话" />
              </FormItem>
              <FormItem label="邮箱" prop="email">
                <input v-model="create.email" type="text" placeholder="请输入用户校内邮箱" />
              </FormItem>
              <FormItem label="身份证号码" prop="idCard">
                <input v-model="create.idCard" type="text" placeholder="请输入用户身份证号码" />
              </FormItem>
              <FormItem label="系部" prop="dept">
                <Select v-model="create.dept" dict="depts" placeholder="请选择用户所在系部"></Select>
              </FormItem>
              <FormItem label="性别" prop="gender">
                <Radio v-model="create.gender" dict="gender"></Radio>
              </FormItem>
              <FormItem label="角色" prop="roles" single>
                <Select v-model="create.roles" :datas="roleParam" :multiple="true" placeholder="请选择新增用户角色"></Select>
              </FormItem>
              <FormItem single>
                <Button color="primary" :loading="isLoading" @click="submit">保存</Button>&nbsp;&nbsp;&nbsp;
                <Button @click="refresh">重置</Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </Cell>
    </Row>
  </div>
</template>

<script>
import { getToken } from '@/js/common/auth.js';
const api = 'http://localhost:8001/api';
export default {
  name: 'UserImport',
  mounted() {
    // 角色列表
    R.Role.getAll().then(res => {
      if (res.ok) {
        res.body.forEach(element => {
          let temp = {};
          temp.title = element.remark;
          temp.key = element.id;
          this.roleParam.push(temp);
        });
      }
    });
  },
  data() {
    return {
      validationRules: {
        required: ['username', 'realName', 'telephone', 'email', 'dept', 'gender', 'idCard', 'roles'],
        email: ['email'],
        mobile: ['telephone']
      },
      isLoading: false,
      roleParam: [],
      create: {
        username: '',
        realName: '',
        telephone: '',
        email: '',
        idCard: '',
        dept: '',
        gender: 1,
        roles: []
      },
      action: api + '/users/import',
      headers: {
        Authorization: getToken()
      },
      loading: false,
      disabled: true
    };
  },
  methods: {
    submit() {
      let validResult = this.$refs.create.valid();
      if (validResult.result) {
        R.User.createUser(this.create).then(res => {
          if (res.ok) {
            console.log(res.body);
            this.$Notice({
              type: 'success',
              title: '成功',
              content: '新增用户数据成功'
            });
            let username = this.create.username;
            this.refresh();
            this.create.username = username;
          }
        });
      }
    },
    refresh() {
      let temp = {
        username: '',
        realName: '',
        telephone: '',
        email: '',
        idCard: '',
        dept: '',
        gender: 1
      };
      this.create = temp;
      this.isLoading = false;
      this.$refs.create.resetValid();
    },
    change(file, fileList) {
      this.disabled = fileList.length > 0 ? false : true;
    },
    remove(file, fileList) {
      this.disabled = fileList.length > 0 ? false : true;
    },
    uploadSuccess(response, file, fileList) {
      this.loading = false;
      this.$Notice({
        type: 'success',
        title: '成功',
        content: '用户数据导入成功'
      });
    },
    uploadError(err, file, fileList) {
      this.loading = false;
      let temp = JSON.parse(err.message);
      this.$Notice({
        type: 'error',
        title: '错误',
        content: temp.message
      });
    },
    upload() {
      this.loading = true;
      this.$refs.upload.submit();
    }
  }
};
</script>

<style lang="less">
.create {
  .el-upload {
    display: inline-block;
    text-align: center;
    cursor: pointer;
    outline: 0;
    width: 100%;
    .el-upload-dragger {
      background-color: #fff;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      box-sizing: border-box;
      width: 100%;
      height: 180px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
  }
}
</style>