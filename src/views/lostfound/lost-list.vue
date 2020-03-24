<template>
  <div class="frame-page">
    <div class="h-panel h-panel-no-border">
      <div class="h-panel-bar">
        <div class="h-panel-title">寻物启事管理</div>
      </div>
      <div class="h-panel-bar">
        <Row :space="20">
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="6">
            <input type="text" style="width: 100%;" v-model="search.word" placeholder="输入寻物启事标题或说明搜索" />
          </Cell>
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="4">
            <input type="text" style="width: 100%;" v-model="search.username" placeholder="输入用户账号搜索" />
          </Cell>
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="4">
            <Select v-model="search.type" :datas="categorys" placeholder="失物分类"></Select>
          </Cell>
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="4">
            <Select v-model="search.status" dict="lost" placeholder="启事状态"></Select>
          </Cell>
        </Row>
        <Row :space="20">
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="6">
            <DateRangePicker style="width: 100%;" v-model="value" placeholder="发布时间" :format="format" :option="param" @input="change"></DateRangePicker>
          </Cell>
          <Cell :xs="24" :sm="12" :md="10" :lg="8" :xl="6">
            <Button icon="h-icon-search" color="primary" :loading="searchLoading" @click="submitSearch">搜 索</Button>&nbsp;&nbsp;
            <Button icon="h-icon-refresh" color="yellow" @click="refresh">重 置</Button>
          </Cell>
        </Row>
        <Row :space="20">
          <Cell :xs="24" :sm="24" :md="10" :lg="8" :xl="8">
            <Button icon="h-icon-inbox" color="green" :loading="downloadLoading" @click="exportData">导出数据</Button>&nbsp;&nbsp;
            <Poptip content="确定删除所选记录，是否永久删除？" @confirm="deleteLost" :disabled="disabled">
              <Button icon="h-icon-trash" color="red" :disabled="disabled">删 除</Button>
            </Poptip>
          </Cell>
        </Row>
      </div>
      <div class="h-panel-body bottom-line">
        <!-- 表格 -->
        <Table :datas="datas" ref="lostTable" :loading="loading" :border="border" :checkbox="checkbox" @select="onSelect">
          <TableItem title="发布者" prop="username" :width="150" align="center"></TableItem>
          <TableItem title="标题" prop="title" :width="200" align="center"></TableItem>
          <TableItem title="类型" prop="type" :width="150" align="center"></TableItem>
          <TableItem title="发布时间" prop="createTime" :width="150" align="center"></TableItem>
          <TableItem title="浏览次数" prop="browse" :width="120" align="center"></TableItem>
          <TableItem title="状态" :width="120" align="center">
            <template slot-scope="{ data }">
              <span class="h-tag h-tag-bg-green">{{ data.status }}</span>
            </template>
          </TableItem>
          <TableItem title="操作" :width="150" align="center">
            <template slot-scope="{ data }">
              <button class="h-btn h-btn-s h-btn-blue" @click="open(data)">{{ data._expand ? '收起' : '展开' }}</button>
              <button class="h-btn h-btn-s h-btn-red" @click="lostEditor(data)">编辑</button>
            </template>
          </TableItem>
          <template slot="expand" slot-scope="{ index, data }">
            <Form readonly mode="threecolumn">
              <FormItem label="编号">{{ data.uuid }}</FormItem>
              <FormItem label="评论数">{{ data.comment }}</FormItem>
              <FormItem label="丢失地址">{{ data.place }}</FormItem>
              <FormItem label="丢失时间">{{ data.lostTime }}</FormItem>
              <FormItem label="失主姓名">{{ data.name }}</FormItem>
              <FormItem label="联系电话">{{ data.telephone }}</FormItem>
              <FormItem label="宿舍号">{{ data.dorm }}</FormItem>
              <FormItem label="微信">{{ data.wechat }}</FormItem>
              <FormItem label="更新时间">{{ data.updateTime }}</FormItem>
              <FormItem label="说明" single>{{ data.remark }}</FormItem>
              <FormItem label="失物图片" single>
                <ImagePreview :width="80" :borderRadius="5" :distance="15" :datas="imagesName(data.imagesName)" @click="openPreview" />
              </FormItem>
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
  name: 'LostManager',
  data() {
    return {
      datas: [],
      border: false,
      baseApi: this.$store.getters.baseApi + '/file/',
      selectList: [],
      disabled: true,
      checkbox: true,
      sizes: [10, 20, 50, 100],
      downloadLoading: false,
      searchLoading: false,
      loading: false,
      value: {},
      param: {
        end: new Date()
      },
      lostIds: [],
      format: 'YYYY-MM-DD',
      categorys: [],
      search: {
        word: '',
        username: '',
        type: 0,
        status: 0,
        start: '',
        end: '',
        page: 1,
        size: 10,
        total: 0
      },
      srcList: []
    };
  },
  methods: {
    lostEditor(data) {
      this.$router.push({ name: 'LostEditor', params: { lostId: data.id, userId: data.userId } });
    },
    currentChange(value) {
      console.log(value);
      this.search.page = value.cur;
      this.search.size = value.size;
      this.submitSearch();
    },
    openPreview(index = 0, data) {
      this.$ImagePreview(this.srcList, index);
    },
    imagesName(images) {
      let temp = [];
      images.forEach(element => {
        let url = this.baseApi + element;
        temp.push(url);
      });
      this.srcList = temp;
      return temp;
    },
    open(data) {
      this.$set(data, '_expand', !data._expand);
    },
    onSelect(data) {
      this.disabled = data.length > 0 ? false : true;
      let temp = [];
      for (const item of data) {
        temp.push(item.id);
      }
      this.lostIds = temp;
      console.log(this.lostIds);
    },
    exportData() {
      this.downloadLoading = true;
      R.Lost.download(this.search).then(res => {
        if (res.ok) {
          Utils.downloadFile(res.body, '寻取启事数据');
        }
        this.downloadLoading = false;
      });
    },
    deleteLost() {
      R.Lost.deleteLost(this.lostIds).then(res => {
        if (res) {
          this.$Notice({
            type: 'success',
            title: '成功',
            content: '寻物启事数据已成功删除啦'
          });
          this.refresh();
          this.submitSearch();
        }
        this.$refs.lostTable.clearRowSelect();
        this.$refs.lostTable.setSelection([]);
      });
    },
    submitSearch() {
      this.searchLoading = true;
      this.loading = true;
      if (this.search.status == null) this.search.status = 0;
      if (this.search.type == null) this.search.type = 0;
      R.Lost.getLostList(this.search).then(res => {
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
      this.search.username = '';
      this.search.type = 0;
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
    // 物品分类
    R.Category.getAll().then(res => {
      if (res.ok) {
        console.log(res.body);
        res.body.forEach(element => {
          let temp = {};
          temp.key = element.id;
          temp.title = element.name;
          this.categorys.push(temp);
        });
      }
    });
  }
};
</script>

<style lang="scss" scoped></style>
