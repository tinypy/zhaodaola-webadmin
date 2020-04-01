<template>
  <div>
    <div v-width="450">
      <div class="h-panel">
        <div class="h-panel-bar">
          <span class="h-panel-title">信息修改</span>
          <span class="h-panel-right">
            <a @click="close">关闭</a>
          </span>
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
            <FormItem label="状态" prop="status">
              <Select v-model="editor.status" dict="status" placeholder="状态"></Select>
            </FormItem>
            <FormItem label="角色" prop="roles">
              <Select v-model="editor.roles" :datas="roleParam" :multiple="true"></Select>
            </FormItem>
            <FormItem>
              <Button color="primary" :loading="isLoading" @click="submitEditor">保存</Button>&nbsp;&nbsp;&nbsp;
              <Button @click="close">取消</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: Object
  },
  mounted() {
    console.log(this.user);
    // 修改的用户信息
    let tempUser = {};
    tempUser.id = this.user.id;
    tempUser.realName = this.user.realName;
    tempUser.telephone = this.user.telephone;
    tempUser.email = this.user.email;
    tempUser.idCard = this.user.idCard;
    tempUser.dept = this.user.dept;
    tempUser.gender = this.user.gender;
    tempUser.status = this.user.status;
    tempUser.roles = [];
    this.user.roles.forEach(role => {
      tempUser.roles.push(role.id);
    });
    this.editor = tempUser;
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
        required: ['realName', 'telephone', 'email', 'dept', 'gender', 'status', 'roles', 'idCard'],
        email: ['email'],
        mobile: ['telephone']
      },
      isLoading: false,
      roleParam: [],
      editor: {
        id: 0,
        realName: '',
        telephone: '',
        email: '',
        idCard: '',
        dept: '',
        gender: 1,
        status: 0,
        roles: []
      }
    };
  },
  methods: {
    submitEditor() {
      let validResult = this.$refs.editor.valid();
      if (validResult.result) {
        R.User.updateUser(this.editor).then(res => {
          this.$emit('success', res.ok);
          this.close();
        });
      }
    },
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
</style>