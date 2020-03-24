<template>
  <div class="frame-page">
    <div class="h-panel h-panel-no-border">
      <div class="h-panel-bar">
        <div class="h-panel-title">网站公告数据表格</div>
      </div>
      <div class="h-panel-bar">
        <Row :space="20">
          <Cell :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <input type="text" style="width: 100%;" v-model="search.word" placeholder="输入资讯标题或作者搜索" />
          </Cell>
          <Cell :xs="24" :sm="12" :md="8" :lg="4" :xl="3">
            <Select v-model="search.status" dict="status" placeholder="状态"></Select>
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
            <Button icon="h-icon-plus" color="blue" @click="showcreate">新增</Button>&nbsp;&nbsp;&nbsp;
            <Poptip content="确定删除所选记录，是否永久删除？" @confirm="deleteAnnounce" :disabled="disabled">
              <Button icon="h-icon-trash" color="red" :disabled="disabled">删除</Button>
            </Poptip>
          </Cell>
        </Row>
      </div>
      <div class="h-panel-body bottom-line">
        <!-- 表格 -->
        <Table :datas="datas" ref="tables" :loading="loading" :border="border" :checkbox="checkbox" @select="onSelect">
          <TableItem title="标题" :width="200">
            <template slot-scope="{data}">
              <TextEllipsis
                @click="showAnnounce(data.id)"
                textClass="link"
                :text="data.title"
                more="..."
                :height="20"
                :width="200"
                useTooltip
                tooltipTheme="white"
                placement="top"
              ></TextEllipsis>
            </template>
          </TableItem>
          <TableItem title="发布者" prop="username" :width="150" align="center"></TableItem>
          <TableItem title="点击次数" prop="browse" :width="150" align="center"></TableItem>
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
  </div>
</template>

<script>
export default {
  name: 'Announce',
  data() {
    return {
      sizes: [10, 20, 50, 100],
      datas: [],
      border: false,
      checkbox: true,
      disabled: true,
      loading: false,
      searchLoading: false,
      param: {
        end: new Date()
      },
      value: {},
      format: 'YYYY-MM-DD',
      search: {
        word: '',
        status: 0,
        start: '',
        end: '',
        page: 1,
        size: 10,
        total: 0
      },
      announceIds: []
    };
  },
  methods: {
    showAnnounce(id) {},
    showEditor(data) {
      this.$router.push({ name: 'AnnounceEditor', params: { id: data.id } });
    },
    onSelect(data) {
      this.disabled = data.length > 0 ? false : true;
      let temp = [];
      for (const item of data) {
        temp.push(item.id);
      }
      this.announceIds = temp;
    },
    showcreate() {
      this.$router.push({ name: 'AnnounceCreate' });
    },
    currentChange(value) {
      console.log(value);
      this.search.page = value.cur;
      this.search.size = value.size;
      this.submitSearch();
    },
    deleteAnnounce() {
      R.Announce.delete(this.announceIds).then(res => {
        if (res.ok) {
          this.$Notice({
            type: 'success',
            title: '成功',
            content: '网站公告数据记录已成功删除'
          });
          this.refresh();
          this.submitSearch();
        }
        this.$refs.tables.clearRowSelect();
        this.$refs.tables.setSelection([]);
      });
    },
    submitSearch() {
      this.searchLoading = true;
      this.loading = true;
      if (this.search.status == null) this.search.status = 0;
      R.Announce.getAnnounceList(this.search).then(res => {
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
      this.search.status = 0;
      this.search.start = '';
      this.search.end = '';
    },
    change() {
      if (this.value.start) this.search.start = this.value.start + ' 00:00:00';
      if (this.value.end) this.search.end = this.value.end + ' 23:59:59';
    }
  },
  mounted() {
    this.submitSearch();
  }
};
</script>

<style lang="scss" scoped>
</style>