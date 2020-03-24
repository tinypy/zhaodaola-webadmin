<template>
  <div class="frame-page">
    <div class="h-panel h-panel-no-border">
      <div class="h-panel-bar">
        <div class="h-panel-title">认领启事管理</div>
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
            <Select v-model="search.status" dict="found" placeholder="启事状态"></Select>
          </Cell>
        </Row>
        <Row :space="20">
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="6">
            <DateRangePicker
              style="width: 100%;"
              v-model="value"
              placeholder="发布时间"
              :format="format"
              :option="param"
              @input="change"
            ></DateRangePicker>
          </Cell>
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="4">
            <Select v-model="search.contact" dict="contact" placeholder="认领方式"></Select>
          </Cell>
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="6">
            <Button icon="h-icon-search" color="primary" :loading="searchLoading" @click="submitSearch">搜 索</Button>&nbsp;&nbsp;
            <Button icon="h-icon-refresh" color="yellow" @click="refresh">重 置</Button>
          </Cell>
        </Row>
        <Row :space="20">
          <Cell :xs="24" :sm="24" :md="10" :lg="6" :xl="24">
            <Button icon="h-icon-inbox" color="green" :loading="downloadLoading" @click="exportData">导出数据</Button>&nbsp;&nbsp;
            <Poptip content="确定删除所选记录，是否永久删除？" @confirm="deleteFound" :disabled="disabled">
              <Button icon="h-icon-trash" color="red" :disabled="disabled">删 除</Button>
            </Poptip>
          </Cell>
        </Row>
      </div>
      <div class="h-panel-body bottom-line">
        <!-- 表格 -->
        <Table :datas="datas" ref="foundTable" :loading="loading" :border="border" :checkbox="checkbox" @select="onSelect">
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
              <FormItem label="认领者">{{ data.foundUser }}</FormItem>
              <FormItem label="评论数">{{ data.comment }}</FormItem>
              <FormItem label="拾到地址">{{ data.place }}</FormItem>
              <FormItem label="拾到时间">{{ data.lostTime }}</FormItem>
              <template v-if="data.contact == 1">
                <div>
                  <FormItem label="联系电话">{{ data.telephone }}</FormItem>
                  <FormItem label="宿舍号">{{ data.dorm }}</FormItem>
                  <FormItem label="微信">{{ data.wechat }}</FormItem>
                </div>
              </template>
              <template v-if="data.contact == 2">
                <div>
                  <FormItem label="认领站点">{{ data.contactType }}</FormItem>
                </div>
              </template>
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
  name: 'FoundManager',
  data() {
    return {
      disabled: true,
      datas: [],
      loading: false,
      border: false,
      checkbox: true,
      search: {
        word: '',
        username: '',
        type: 0,
        status: 0,
        start: '',
        end: '',
        contact: 0,
        page: 1,
        size: 10,
        total: 0
      },
      foundIds: [],
      baseApi: this.$store.getters.baseApi + '/file/',
      selectList: [],
      sizes: [10, 20, 50, 100],
      downloadLoading: false,
      searchLoading: false,
      value: {},
      param: {
        end: new Date()
      },
      format: 'YYYY-MM-DD',
      categorys: [],
      srcList: []
    };
  },
  methods: {
    deleteFound() {
      R.Found.deleteFound(this.foundIds).then(res => {
        if (res) {
          this.$Notice({
            type: 'success',
            title: '成功',
            content: '认领启事数据已成功删除啦'
          });
          this.refresh();
          this.submitSearch();
        }
        this.$refs.lostTable.clearRowSelect();
        this.$refs.lostTable.setSelection([]);
      });
    },
    exportData() {
      this.downloadLoading = true;
      R.Found.download(this.search).then(res => {
        if (res.ok) {
          Utils.downloadFile(res.body, '认领启事数据');
        }
        this.downloadLoading = false;
      });
    },
    submitSearch() {
      this.searchLoading = true;
      this.loading = true;
      if (this.search.status == null) this.search.status = 0;
      if (this.search.type == null) this.search.type = 0;
      if (this.search.contact == null) this.search.contact = 0;
      R.Found.getFoundList(this.search).then(res => {
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
    imagesName(images) {
      let temp = [];
      images.forEach(element => {
        let url = this.baseApi + element;
        temp.push(url);
      });
      this.srcList = temp;
      return temp;
    },
    lostEditor(data) {
      this.$router.push({ name: 'FoundEditor', params: { foundId: data.id, userId: data.userId } });
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
    refresh() {
      this.value = {};
      this.search.word = '';
      this.search.username = '';
      this.search.type = 0;
      this.search.contact = 0;
      this.search.status = 0;
      this.search.start = '';
      this.search.end = '';
    },
    change() {
      if (this.value.start) this.search.start = this.value.start + ' 00:00:00';
      if (this.value.end) this.search.end = this.value.end + ' 23:59:59';
    },
    onSelect(data) {
      this.disabled = data.length > 0 ? false : true;
      let temp = [];
      for (const item of data) {
        temp.push(item.id);
      }
      this.foundIds = temp;
      console.log(this.foundIds);
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
