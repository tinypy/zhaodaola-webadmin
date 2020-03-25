<template>
  <div class="frame-page">
    <div class="h-panel h-panel-no-border shadow">
      <div class="h-panel-bar">
        <div class="h-panel-title">操作日志数据表格</div>
      </div>
      <div class="h-panel-bar">
        <Row :space="20">
          <Cell :xs="24" :sm="12" :md="8" :lg="4" :xl="6">
            <input type="text" style="width: 100%;" v-model="search.word" placeholder="输入想要搜索的内容......" />
          </Cell>
          <Cell :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
            <DateRangePicker style="width: 100%;" v-model="value" :format="format" :option="param" @input="change"></DateRangePicker>
          </Cell>
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="6">
            <Button icon="h-icon-search" color="primary" :loading="searchLoading" @click="submitSearch">搜索</Button>&nbsp;&nbsp;
            <Button icon="h-icon-refresh" color="yellow" @click="refresh">重置</Button>&nbsp;&nbsp;
            <Button icon="h-icon-inbox" color="green" :loading="downloadLoading" @click="exportData">导出数据</Button>
          </Cell>
        </Row>
      </div>
      <div class="h-panel-body bottom-line">
        <!-- 表格 -->
        <Table :datas="datas" ref="logTable" :loading="loading" :border="border">
          <TableItem title="用户名" prop="username" :width="150" align="center"></TableItem>
          <TableItem title="IP" prop="requestIp" :width="150" align="center"></TableItem>
          <TableItem title="IP来源" prop="address" :width="150" align="center"></TableItem>
          <TableItem title="描述" prop="description" :width="150" align="center"></TableItem>
          <TableItem title="浏览器" prop="browser" :width="150" align="center"></TableItem>
          <TableItem title="请求耗时" :width="150" align="center">
            <template slot-scope="{data}">
              <span class="red-color">{{data.time}} ms</span>
            </template>
          </TableItem>
          <TableItem title="创建时间" prop="createTime" :width="150" align="center"></TableItem>
          <TableItem title="操作" :width="140" align="center">
            <template slot-scope="{ data }">
              <Button noBorder text-color="blue" @click="open(data)">详情</Button>
            </template>
          </TableItem>
          <template slot="expand" slot-scope="{index, data}">
            <Form readonly mode="single">
              <FormItem label="请求方法：">{{data.method}}</FormItem>
              <FormItem label="请求参数：">{{data.params}}</FormItem>
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
export default {
  name: 'OperationLog',
  methods: {
    exportData() {
      this.downloadLoading = true;
      R.Log.download(this.search, 'INFO').then(res => {
        if (res.ok) {
          Utils.downloadFile(res.body, '操作日志数据');
        }
        this.downloadLoading = false;
      });
    },
    refresh() {
      this.value = {};
      this.search.word = '';
      this.search.start = '';
      this.search.end = '';
    },
    submitSearch() {
      this.searchLoading = true;
      this.loading = true;

      console.log(this.search);

      R.Log.getLogList(this.search, 'INFO').then(res => {
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
    open(data) {
      this.$set(data, '_expand', !data._expand);
    },
    change() {
      if (this.value.start) this.search.start = this.value.start + ' 00:00:00';
      if (this.value.end) this.search.end = this.value.end + ' 23:59:59';
    },
    currentChange(value) {
      console.log(value);
      this.search.page = value.cur;
      this.search.size = value.size;
      this.submitSearch();
    }
  },
  data() {
    return {
      datas: [],
      border: false,
      loading: false,
      searchLoading: false,
      downloadLoading: false,
      param: {
        end: new Date()
      },
      sizes: [10, 20, 50, 100],
      value: {},
      format: 'YYYY-MM-DD',
      search: {
        word: '',
        start: '',
        end: '',
        page: 1,
        size: 10,
        total: 0
      }
    };
  },
  mounted() {
    this.submitSearch();
  }
};
</script>

<style lang="scss" scoped></style>
