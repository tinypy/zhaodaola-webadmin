<template>
  <div class="frame-page">
    <div class="h-panel h-panel-no-border">
      <div class="h-panel-bar">
        <div class="h-panel-title">角色数据表格</div>
      </div>
      <div class="h-panel-bar">
        <Row :space="20">
          <Cell :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <input type="text" style="width: 100%;" v-model="search.word" placeholder="输入分类名称或备注搜索" />
          </Cell>
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="6">
            <Button icon="h-icon-search" color="primary" :loading="searchLoading" @click="submitSearch">搜索</Button>
            <Button icon="h-icon-refresh" color="yellow" @click="refresh">重置</Button>
          </Cell>
        </Row>
        <Row :space="20">
          <Cell :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <Button icon="h-icon-plus" color="blue" @click="showcreate">新增</Button>&nbsp;&nbsp;&nbsp;
            <Poptip content="确定删除所选记录，是否永久删除？" @confirm="deletRole" :disabled="disabled">
              <Button icon="h-icon-trash" color="red" :disabled="disabled">删除</Button>
            </Poptip>
          </Cell>
        </Row>
      </div>
      <div class="h-panel-body bottom-line">
        <!-- 表格 -->
        <Table :datas="datas" ref="tables" :loading="loading" :border="border" :checkbox="checkbox" @select="onSelect">
          <TableItem title="名称" prop="name" :width="150" align="center"></TableItem>
          <TableItem title="备注" :width="150">
            <template slot-scope="{ data }">
              <TextEllipsis :text="data.remark" more="..." :height="20" v-width="150" useTooltip tooltipTheme="white" placement="top"></TextEllipsis>
            </template>
          </TableItem>
          <TableItem title="等级" prop="level" :width="150" align="center"></TableItem>
          <TableItem title="创建时间" prop="createTime" :width="150" align="center"></TableItem>
          <TableItem title="操作" :width="100" align="center">
            <template slot-scope="{ data }">
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
      title="角色新增信息"
      :close-on-click-modal="false"
      :visible.sync="createVisible"
      width="30%"
      :modal="false"
      top="25vh"
      :destroy-on-close="true"
    >
      <Form ref="create" :label-width="80" :showErrorTip="false" :rules="validationRules" :model="create">
        <FormItem label="名称" prop="name">
          <input v-model="create.name" type="text" placeholder="角色名称" required />
        </FormItem>
        <FormItem label="备注" prop="about">
          <input v-model="create.remark" type="text" placeholder="角色备注" />
        </FormItem>
        <FormItem label="等级" prop="status">
          <input v-model="create.level" type="number" placeholder="角色等级" />
        </FormItem>
        <FormItem>
          <Button color="primary" @click="createRole">保 存</Button>&nbsp;&nbsp;&nbsp;
          <Button @click="createVisible = false">取 消</Button>
        </FormItem>
      </Form>
    </el-dialog>

    <el-dialog
      title="角色数据修改"
      :close-on-click-modal="false"
      :visible.sync="editorVisible"
      width="30%"
      :modal="false"
      top="25vh"
      :destroy-on-close="true"
    >
      <Form ref="editor" :label-width="80" :showErrorTip="false" :rules="validationRules" :model="create">
        <FormItem label="名称" prop="name">
          <input v-model="create.name" type="text" placeholder="角色名称" required />
        </FormItem>
        <FormItem label="备注" prop="about">
          <input v-model="create.remark" type="text" placeholder="角色备注" />
        </FormItem>
        <FormItem label="等级" prop="status">
          <input v-model="create.level" type="number" placeholder="角色等级" />
        </FormItem>
        <FormItem>
          <Button color="primary" @click="updateRole">保 存</Button>&nbsp;&nbsp;&nbsp;
          <Button @click="editorVisible = false">取 消</Button>
        </FormItem>
      </Form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'RoleManager',
  data() {
    return {
      validationRules: {
        required: ['name', 'remark', 'level']
      },
      create: {
        id: null,
        name: '',
        remark: '',
        level: 1
      },
      createVisible: false,
      editorVisible: false,
      createLoading: false,
      border: false,
      checkbox: true,
      sizes: [10, 20, 50, 100],
      searchLoading: false,
      search: {
        word: '',
        page: 1,
        size: 10,
        total: 0
      },
      loading: false,
      datas: [],
      disabled: true,
      roleIds: []
    };
  },
  methods: {
    updateRole() {
      let validResult = this.$refs.editor.valid();
      if (validResult.result) {
        R.Role.updateRole(this.create).then(res => {
          if (res.ok) {
            this.$Notice({
              type: 'success',
              title: '成功',
              content: '数据修改成功'
            });
            this.editorVisible = false;
            this.create.name = '';
            this.create.remark = '';
            this.create.level = null;
            this.create.id = null;
            this.submitSearch();
          }
        });
      }
    },
    showEditor(data) {
      this.create.id = data.id;
      this.create.name = data.name;
      this.create.remark = data.remark;
      this.create.level = data.level;
      this.editorVisible = true;
    },
    createRole() {
      let validResult = this.$refs.create.valid();
      if (validResult.result) {
        R.Role.createRole(this.create).then(res => {
          if (res.ok) {
            this.$Notice({
              type: 'success',
              title: '成功',
              content: '角色数据成功'
            });
            this.createVisible = false;
            this.create.name = '';
            this.create.remark = '';
            this.create.level = 1;
            this.submitSearch();
          }
        });
      }
    },
    onSelect(data) {
      this.disabled = data.length > 0 ? false : true;
      let temp = [];
      for (const item of data) {
        temp.push(item.id);
      }
      this.roleIds = temp;
    },
    showcreate() {
      this.createVisible = true;
      this.create.name = '';
      this.create.remark = '';
      this.create.level = 1;
      this.create.id = null;
    },
    deletRole() {
      R.Role.delete(this.roleIds).then(res => {
        if (res.ok) {
          this.$Notice({
            type: 'success',
            title: '成功',
            content: '角色数据记录已成功删除'
          });
          this.refresh();
          this.submitSearch();
        }
        this.$refs.tables.clearRowSelect();
        this.$refs.tables.setSelection([]);
      });
    },
    submitSearch() {
      this.loading = true;
      this.searchLoading = true;
      R.Role.getRoleList(this.search).then(res => {
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
    },
    currentChange(value) {
      this.search.page = value.cur;
      this.search.size = value.size;
      this.submitSearch();
    }
  },
  mounted() {
    this.submitSearch();
  }
};
</script>

<style lang="scss" scoped></style>
