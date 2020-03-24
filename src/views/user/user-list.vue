<template>
  <div class="frame-page">
    <div class="h-panel h-panel-no-border">
      <div class="h-panel-bar">
        <div class="h-panel-title">用户数据表格</div>
      </div>
      <div class="h-panel-bar">
        <Row :space="20">
          <Cell :xs="24" :sm="12" :md="8" :lg="4" :xl="6">
            <input type="text" style="width: 100%;" v-model="search.word" placeholder="输入用户名、姓名或者邮箱搜索" />
          </Cell>
          <Cell :xs="24" :sm="12" :md="8" :lg="4" :xl="3">
            <Select v-model="search.status" dict="status" placeholder="状态"></Select>
          </Cell>
          <Cell :xs="24" :sm="12" :md="8" :lg="4" :xl="3">
            <Select v-model="search.dept" dict="depts" placeholder="系部"></Select>
          </Cell>
          <Cell :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <DateRangePicker style="width: 100%;" v-model="value" :format="format" :option="param" @input="change"></DateRangePicker>
          </Cell>
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="6">
            <Button icon="h-icon-search" color="primary" :loading="searchLoading" @click="submitSearch">搜索</Button>
            <Button icon="h-icon-refresh" color="yellow" @click="refresh">重置</Button>
          </Cell>
        </Row>
        <Row :space="20">
          <Cell :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <Button icon="h-icon-inbox" color="green" :loading="downloadLoading" @click="exportData">导出数据</Button>&nbsp;&nbsp;
            <Poptip content="是否确认将所选记录密码重置为初始密码：111111" @confirm="resetPassword" :disabled="disabled">
              <Button icon="h-icon-lock" color="yellow" :disabled="disabled">重置密码</Button>&nbsp;&nbsp;
            </Poptip>
            <Poptip content="确定删除所选记录，是否永久删除？" @confirm="deleteUser" :disabled="disabled">
              <Button icon="h-icon-trash" color="red" :disabled="disabled">删除</Button>
            </Poptip>
          </Cell>
        </Row>
      </div>
      <div class="h-panel-body bottom-line">
        <!-- 表格 -->
        <Table :datas="datas" ref="userTable" :loading="loading" :border="border" :checkbox="checkbox" @select="onSelect">
          <TableItem title="头像" :width="70" align="center">
            <template slot-scope="{data}">
              <ImagePreview :width="40" :datas="baseApi+data.avatar" @click="openPreview" />
            </template>
          </TableItem>
          <TableItem title="账号" prop="username" :width="150" align="center"></TableItem>
          <TableItem title="姓名" prop="realName" :width="100" align="center"></TableItem>
          <TableItem title="电话" prop="telephone" :width="150" align="center"></TableItem>
          <TableItem title="邮箱" prop="email" :width="150" align="center"></TableItem>
          <TableItem title="性别" :width="60" align="center">
            <template slot-scope="{data}">
              <img src="../../images/nan.png" width="20" v-if="data.gender==1" title="男" />
              <img src="../../images/nv.png" width="20" v-if="data.gender==2" title="女" />
            </template>
          </TableItem>
          <TableItem title="系部" prop="dept" :width="100" align="center"></TableItem>
          <TableItem title="状态" :width="60" align="center">
            <template slot-scope="{data}">
              <i v-if="data.status==1" class="h-icon-success green-color"></i>
              <i v-else class="h-icon-error red-color"></i>
            </template>
          </TableItem>
          <TableItem title="操作" :width="140" align="center">
            <template slot-scope="{data}">
              <button class="h-btn h-btn-s h-btn-blue" @click="open(data)">{{data._expand?'收起':'展开'}}</button>
              <button class="h-btn h-btn-s h-btn-red" @click="onEdtior(data)">编辑</button>
            </template>
          </TableItem>
          <template slot="expand" slot-scope="{index, data}">
            <Form readonly mode="twocolumn">
              <FormItem label="昵称">{{data.nickName}}</FormItem>
              <FormItem label="身份证号码">{{data.idCard}}</FormItem>
              <FormItem label="创建时间">{{data.createTime}}</FormItem>
              <FormItem label="更新时间">{{data.updateTime}}</FormItem>
            </Form>
          </template>
        </Table>
      </div>
      <div class="h-panel-bar">
        <Pagination
          layout="total,sizes,pager"
          :cur="search.page"
          :total="search.total"
          :sizes="sizes"
          :size="search.size"
          align="right"
          @change="currentChange"
        ></Pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/images/avatar.png';

import UserediotrModel from './usereditor-model';

export default {
  name: 'UserList',
  data() {
    return {
      param: {
        end: new Date()
      },
      selectList: [],
      disabled: true,
      checkbox: true,
      sizes: [10, 20, 50, 100],
      Avatar: Avatar,
      baseApi: this.$store.getters.baseApi +"/avatar/",
      border: false,
      loading: false,
      datas: [],
      format: 'YYYY-MM-DD',
      downloadLoading: false,
      searchLoading: false,
      value: {},
      search: {
        word: '',
        dept: '',
        status: 0,
        start: '',
        end: '',
        page: 1,
        size: 10,
        total: 0
      },
      userids: []
    };
  },
  mounted() {
    this.submitSearch();
  },
  methods: {
    resetPassword() {
      R.User.resetPassword(this.userids).then(res => {
        if (res) {
          this.$Notice({
            type: 'success',
            title: '成功',
            content: '密码重置成功啦'
          });
          this.refresh();
          this.submitSearch();
        }
        this.userids;
        this.$refs.userTable.clearRowSelect();
        this.$refs.userTable.setSelection([]);
      });
    },
    deleteUser() {
      R.User.deleteUser(this.userids).then(res => {
        if (res) {
          this.$Notice({
            type: 'success',
            title: '成功',
            content: '用户记录数据已成功删除啦'
          });
          this.refresh();
          this.submitSearch();
        }
        this.$refs.userTable.clearRowSelect();
        this.$refs.userTable.setSelection([]);
      });
    },
    onEdtior(data) {
      this.$Modal({
        type: 'drawer-right',
        width: 450,
        component: {
          vue: UserediotrModel,
          datas: { user: data } // 子组件直接使用 props 即可使用，兼容性 1.15.0+
        },
        events: {
          success: (modal, data) => {
            if (data) {
              this.$Notice({
                type: 'success',
                title: '成功',
                content: '用户信息更新成功'
              });
              this.refresh();
              this.submitSearch();
            } else {
              this.$Notice({
                type: 'error',
                title: '错误',
                content: '用户信息更新失败'
              });
            }
          }
        }
      });
    },
    onSelect(data) {
      this.disabled = data.length > 0 ? false : true;
      let temp = [];
      for (const item of data) {
        temp.push(item.id);
      }
      this.userids = temp;
      console.log(this.userids);
    },
    open(data) {
      this.$set(data, '_expand', !data._expand);
    },
    currentChange(value) {
      console.log(value);
      this.search.page = value.cur;
      this.search.size = value.size;
      this.submitSearch();
    },
    openPreview(data) {
      this.$ImagePreview(data);
    },
    change() {
      if (this.value.start) this.search.start = this.value.start + ' 00:00:00';
      if (this.value.end) this.search.end = this.value.end + ' 23:59:59';
    },
    submitSearch() {
      this.searchLoading = true;
      this.loading = true;
      if (this.search.status == null) this.search.status = 0;
      R.User.getUserList(this.search).then(res => {
        console.log(res);
        if (res.ok) {
          this.datas = res.body.list;
          this.search.page = res.body.page;
          this.search.size = res.body.size;
          this.search.total = res.body.total;
        }
        this.searchLoading = false;
        this.loading = false;
      });
    },
    refresh() {
      this.value = {};
      this.search.word = '';
      this.search.dept = '';
      this.search.status = 0;
      this.search.start = '';
      this.search.end = '';
    },
    exportData() {
      this.downloadLoading = true;
      R.User.download(this.search).then(res => {
        if (res.ok) {
          Utils.downloadFile(res.body, '用户数据');
        }
        this.downloadLoading = false;
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>