<template>
  <div class="frame-page">
    <div class="h-panel h-panel-no-border">
      <div class="h-panel-bar">
        <div class="h-panel-title">系统菜单列表</div>
      </div>
      <div class="h-panel-bar">
        <Row :space="20">
          <Cell :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <Button icon="h-icon-inbox" color="green">导出数据</Button>&nbsp;&nbsp;&nbsp;
            <Button icon="h-icon-plus" color="blue">新增</Button>&nbsp;&nbsp;&nbsp;
          </Cell>
        </Row>
      </div>
      <div class="h-panel-body bottom-line">
        <Table ref="table" :datas="datas" checkbox>
          <TableItem title="图标" :width="50" align="center">
            <template slot-scope="{ data }">
              <i :class="data.icon"></i>
            </template>
          </TableItem>
          <TableItem title="菜单名称" :width="160" treeOpener>
            <template slot-scope="{ data }">
              <span>{{ data.title }}</span>
            </template>
          </TableItem>
          <TableItem title="菜单路由" :width="160" prop="name" align="center"></TableItem>
          <TableItem title="排序" :width="100" prop="sort" align="center"></TableItem>
          <TableItem title="上一级菜单ID" :width="100" prop="pid" align="center"></TableItem>
          <TableItem title="权限" :width="160" prop="permission" align="center"></TableItem>
          <TableItem title="类型" align="center" :width="160">
            <template slot-scope="{ data }">
              <span v-if="data.type == 1" class="blue-color">菜单</span>
              <span v-if="data.type == 2" class="green-color">按钮</span>
            </template>
          </TableItem>
          <TableItem title="创建时间" :width="160" prop="createTime" align="center"></TableItem>
          <TableItem title="操作" :width="160" align="center">
            <template slot-scope="{ data }">
              <Button icon="h-icon-edit" color="green"></Button>
              <Button icon="h-icon-trash" color="red"></Button>
            </template>
          </TableItem>
        </Table>
      </div>
      <div class="h-panel-bar">
        <span class="h-tag-circle h-tag-red">注</span>
        <span>菜单列表不允许操作，只允许迭代系统时手动添加构建菜单</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuManger',
  data() {
    return {
      datas: []
    };
  },
  methods: {
    initTreeMenu() {
      console.log('SSS');
      R.Menu.treeMenu().then(res => {
        console.log(res);
        if (res.ok) {
          this.datas = res.body;
        }
      });
    }
  },
  mounted() {
    this.initTreeMenu();
  }
};
</script>

<style lang="scss" scoped></style>
