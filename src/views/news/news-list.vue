<template>
  <div class="frame-page">
    <div class="h-panel h-panel-no-border shadow">
      <div class="h-panel-bar">
        <div class="h-panel-title">校园资讯数据表格</div>
      </div>
      <div class="h-panel-bar">
        <Row :space="20">
          <Cell :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <input type="text" style="width: 100%;" v-model="search.word" placeholder="输入资讯标题或作者搜索" />
          </Cell>
          <Cell :xs="24" :sm="12" :md="8" :lg="4" :xl="3">
            <Select v-model="search.status" dict="status" placeholder="状态"></Select>
          </Cell>
          <Cell :xs="24" :sm="12" :md="8" :lg="4" :xl="3">
            <Select v-model="search.dept" dict="depts" placeholder="系部"></Select>
          </Cell>
          <Cell :xs="24" :sm="12" :md="8" :lg="4" :xl="3">
            <Select v-model="search.type" :datas="types" placeholder="校园资讯分类"></Select>
          </Cell>
          <Cell :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <DateRangePicker style="width: 100%;" v-model="value" :format="format" :option="param" @input="change"></DateRangePicker>
          </Cell>
        </Row>
        <Row :space="20">
          <Cell :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
            <Button icon="h-icon-search" color="primary" :loading="searchLoading" @click="submitSearch">搜索</Button>&nbsp;&nbsp;&nbsp;
            <Button icon="h-icon-refresh" color="yellow" @click="refresh">重置</Button>&nbsp;&nbsp;&nbsp;
            <Poptip content="确定删除所选记录，是否永久删除？" @confirm="deleteUser" :disabled="disabled">
              <Button icon="h-icon-trash" color="red" :disabled="disabled">删除</Button>
            </Poptip>
          </Cell>
        </Row>
      </div>
      <div class="h-panel-body bottom-line">
        <!-- 表格 -->
        <Table :datas="datas" ref="newsTable" :loading="loading" :border="border" :checkbox="checkbox" @select="onSelect">
          <TableItem title="标题" :width="200">
            <template slot-scope="{data}">
              <TextEllipsis
                @click="newsInfo(data.id)"
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
          <TableItem title="作者" prop="author" :width="150" align="center"></TableItem>
          <TableItem title="系部" prop="dept" :width="150" align="center"></TableItem>
          <TableItem title="资讯类型" prop="type" :width="150" align="center"></TableItem>
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
              <FormItem label="编号">{{data.uuid}}</FormItem>
              <FormItem label="是否置顶">{{data.placement}}</FormItem>
              <FormItem label="浏览次数">{{data.browse}}</FormItem>
              <FormItem label="创建时间">{{data.createTime}}</FormItem>
              <FormItem label="更新时间">{{data.updateTime}}</FormItem>
              <FormItem label="资讯封面" single>
                <template v-if="data.image">
                  <ImagePreview :width="80" :borderRadius="5" :distance="15" :datas="baseApi+data.image" @click="openPreview" />
                </template>
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
  name: 'NewsList',
  methods: {
    currentChange(value) {
      console.log(value);
      this.search.page = value.cur;
      this.search.size = value.size;
      this.submitSearch();
    },
    newsInfo(id) {
      this.$router.push({ name: 'NewsView', params: { id: id } });
    },
    onEdtior(data) {
      this.$router.push({ name: 'NewsEditor', params: { id: data.id } });
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
      this.newsIds = temp;
      console.log(this.newsIds);
    },
    deleteUser() {
      R.News.delete(this.newsIds).then(res => {
        if (res) {
          this.$Notice({
            type: 'success',
            title: '成功',
            content: '校园资讯数据已成功删除啦'
          });
          this.refresh();
          this.submitSearch();
        }
        this.$refs.newsTable.clearRowSelect();
        this.$refs.newsTable.setSelection([]);
      });
    },
    refresh() {
      this.value = {};
      this.search.word = '';
      this.search.dept = '';
      this.search.type = 0;
      this.search.status = 0;
      this.search.start = '';
      this.search.end = '';
    },
    submitSearch() {
      this.searchLoading = true;
      this.loading = true;
      if (this.search.status == null) this.search.status = 0;
      if (this.search.type == null) this.search.type = 0;
      R.News.getNewsList(this.search).then(res => {
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
    change() {
      if (this.value.start) this.search.start = this.value.start + ' 00:00:00';
      if (this.value.end) this.search.end = this.value.end + ' 23:59:59';
    },
    openPreview(data) {
      this.$ImagePreview(data);
    }
  },
  data() {
    return {
      newsIds: [],
      datas: [],
      param: {
        end: new Date()
      },
      value: {},
      selectList: [],
      disabled: true,
      checkbox: true,
      sizes: [10, 20, 50, 100],
      baseApi: this.$store.getters.baseApi + '/file/',
      border: false,
      loading: false,
      datas: [],
      format: 'YYYY-MM-DD',
      downloadLoading: false,
      searchLoading: false,
      types: [],
      search: {
        word: '',
        dept: '',
        status: 0,
        type: 0,
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
    // 物品分类
    R.NewsType.getAll().then(res => {
      if (res.ok) {
        res.body.forEach(element => {
          let temp = {};
          temp.key = element.id;
          temp.title = element.name;
          this.types.push(temp);
        });
      }
    });
  }
};
</script>

<style lang="scss" scoped>
</style>