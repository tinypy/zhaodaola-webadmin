<template>
  <div class="frame-page">
    <div class="h-panel h-panel-no-border">
      <div class="h-panel-bar">
        <div class="h-panel-title">认领站点数据表格</div>
      </div>
      <div class="h-panel-bar">
        <Row :space="20">
          <Cell :xs="24" :sm="12" :md="12" :lg="6" :xl="2">
            <input type="text" style="width: 100%;" v-model="search.word" placeholder="输入站点名称或负责人搜索" />
          </Cell>
          <Cell :xs="24" :sm="12" :md="8" :lg="4" :xl="2">
            <Select v-model="search.status" dict="status" placeholder="状态"></Select>
          </Cell>
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="2">
            <Button icon="h-icon-search" color="primary" :loading="searchLoading" @click="submitSearch">搜索</Button>
            <Button icon="h-icon-refresh" color="yellow" @click="refresh">重置</Button>
          </Cell>
        </Row>
        <Row :space="20">
          <Cell :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <Button icon="h-icon-inbox" color="green" :loading="downloadLoading" @click="exportData">导出数据</Button>&nbsp;&nbsp;&nbsp;
            <Button icon="h-icon-plus" color="blue" @click="showcreate">新增</Button>&nbsp;&nbsp;&nbsp;
            <Poptip content="确定删除所选记录，是否永久删除？" @confirm="deleteSite" :disabled="disabled">
              <Button icon="h-icon-trash" color="red" :disabled="disabled">删除</Button>
            </Poptip>
          </Cell>
        </Row>
      </div>
      <div class="h-panel-body bottom-line">
        <!-- 表格 -->
        <Table :datas="datas" ref="tables" :loading="loading" :border="border" :checkbox="checkbox" @select="onSelect">
          <TableItem title="站点地址" prop="address" :width="150" align="center"></TableItem>
          <TableItem title="负责人" prop="charge" :width="150" align="center"></TableItem>
          <TableItem title="联系方式" prop="concat" :width="150" align="center"></TableItem>
          <TableItem title="创建时间" prop="createTime" :width="150" align="center"></TableItem>
          <TableItem title="更新时间" prop="updateTime" :width="150" align="center"></TableItem>
          <TableItem title="状态" :width="60" align="center">
            <template slot-scope="{data}">
              <i v-if="data.status==1" class="h-icon-success green-color"></i>
              <i v-else class="h-icon-error red-color"></i>
            </template>
          </TableItem>
          <TableItem title="操作" :width="100" align="center">
            <template slot-scope="{data}">
              <button class="h-btn h-btn-s h-btn-red" @click="showEditor(data)">编辑</button>
            </template>
          </TableItem>
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

    <!-- 新增弹出框 -->
    <el-dialog
      title="认领站点新增信息"
      :close-on-click-modal="false"
      :visible.sync="createVisible"
      width="30%"
      :modal="false"
      top="25vh"
      :destroy-on-close="true"
    >
      <Form ref="create" :label-width="80" :showErrorTip="false" :rules="validationRules" :model="create">
        <FormItem label="站点地址" prop="address">
          <input v-model="create.address" type="text" placeholder="请输入认领站点地址" required />
        </FormItem>
        <FormItem label="负责人" prop="charge">
          <input v-model="create.charge" type="text" placeholder="请输入认领站点负责人" required />
        </FormItem>
        <FormItem label="联系方式" prop="concat">
          <input v-model="create.concat" type="text" placeholder="请输入负责人联系方式" required />
        </FormItem>
        <FormItem label="状态" prop="status">
          <Select v-model="create.status" dict="status" placeholder="状态"></Select>
        </FormItem>
        <FormItem>
          <Button color="primary" @click="createSite">保 存</Button>&nbsp;&nbsp;&nbsp;
          <Button @click="createVisible = false">取 消</Button>
        </FormItem>
      </Form>
    </el-dialog>

    <el-dialog
      title="认领站点数据修改"
      :close-on-click-modal="false"
      :visible.sync="editorVisible"
      width="30%"
      :modal="false"
      top="25vh"
      :destroy-on-close="true"
    >
      <Form ref="editor" :label-width="80" :showErrorTip="false" :rules="validationRules" :model="create">
        <FormItem label="站点地址" prop="address">
          <input v-model="create.address" type="text" placeholder="请输入认领站点地址" required />
        </FormItem>
        <FormItem label="负责人" prop="charge">
          <input v-model="create.charge" type="text" placeholder="请输入认领站点负责人" required />
        </FormItem>
        <FormItem label="联系方式" prop="concat">
          <input v-model="create.concat" type="text" placeholder="请输入负责人联系方式" required />
        </FormItem>
        <FormItem label="状态" prop="status">
          <Select v-model="create.status" dict="status" placeholder="状态"></Select>
        </FormItem>
        <FormItem>
          <Button color="primary" @click="updateSite">保 存</Button>&nbsp;&nbsp;&nbsp;
          <Button @click="editorVisible = false">取 消</Button>
        </FormItem>
      </Form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SiteManager',
  data() {
    return {
      validationRules: {
        required: ['address', 'status', 'charge', 'concat']
      },
      create: {
        id: null,
        address: '',
        charge: '',
        concat: '',
        status: null
      },
      createVisible: false,
      editorVisible: false,
      createLoading: false,
      sizes: [10, 20, 50, 100],
      checkbox: true,
      border: false,
      loading: false,
      datas: [],
      searchLoading: false,
      downloadLoading: false,
      disabled: true,
      search: {
        word: '',
        status: 0,
        page: 1,
        size: 10,
        total: 0
      },
      sites: []
    };
  },
  methods: {
    updateSite() {
      let validResult = this.$refs.editor.valid();
      if (validResult.result) {
        R.Site.update(this.create).then(res => {
          if (res.ok) {
            this.$Notice({
              type: 'success',
              title: '成功',
              content: '数据修改成功'
            });
            this.editorVisible = false;
            this.create.address = '';
            this.create.charge = '';
            this.create.concat = '';
            this.create.status = 0;
            this.create.id = null;
            this.submitSearch();
          }
        });
      }
    },
    showEditor(data) {
      this.create.id = data.id;
      this.create.address = data.address;
      this.create.charge = data.charge;
      this.create.concat = data.concat;
      this.create.status = data.status;
      this.editorVisible = true;
    },
    onSelect(data) {
      this.disabled = data.length > 0 ? false : true;
      let temp = [];
      for (const item of data) {
        temp.push(item.id);
      }
      this.sites = temp;
      console.log(this.sites);
    },
    currentChange(value) {
      this.search.page = value.cur;
      this.search.size = value.size;
      this.submitSearch();
    },
    deleteSite() {
      R.Site.delete(this.sites).then(res => {
        if (res.ok) {
          this.$Notice({
            type: 'success',
            title: '成功',
            content: '认领站点数据记录已成功删除'
          });
          this.refresh();
          this.submitSearch();
        }
        this.$refs.tables.clearRowSelect();
        this.$refs.tables.setSelection([]);
      });
    },
    createSite() {
      let validResult = this.$refs.create.valid();
      if (validResult.result) {
        R.Site.create(this.create).then(res => {
          if (res.ok) {
            this.$Notice({
              type: 'success',
              title: '成功',
              content: '新增认领站点数据成功'
            });
            this.createVisible = false;
            this.create.address = '';
            this.create.charge = '';
            this.create.concat = '';
            this.create.status = 0;
            this.submitSearch();
          }
        });
      }
    },
    showcreate(done) {
      this.createVisible = true;
      this.create.address = '';
      this.create.charge = '';
      this.create.concat = '';
      this.create.status = null;
      this.create.id = null;
    },
    exportData() {
      this.downloadLoading = true;
      R.Site.download(this.search).then(res => {
        if (res.ok) {
          Utils.downloadFile(res.body, '认领站点数据');
        }
        this.downloadLoading = false;
      });
    },
    submitSearch() {
      this.loading = true;
      this.searchLoading = true;
      if (this.search.status == null) this.search.status = 0;
      R.Site.getList(this.search).then(res => {
        if (res.ok) {
          console.log(res.body);
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
      this.search.word = '';
      this.search.status = 0;
    }
  },
  mounted() {
    this.submitSearch();
  }
};
</script>

<style lang="scss" scoped>
</style>