<template>
  <div class="frame-page">
    <div class="h-panel h-panel-no-border">
      <div class="h-panel-bar">
        <div class="h-panel-title">网站轮播图数据表格</div>
      </div>
      <div class="h-panel-bar">
        <Row :space="20">
          <Cell :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <input type="text" style="width: 100%;" v-model="search.word" placeholder="输入标题搜索" />
          </Cell>
          <Cell :xs="24" :sm="12" :md="8" :lg="4" :xl="3">
            <Select v-model="search.status" dict="status" placeholder="状态"></Select>
          </Cell>
          <Cell :xs="24" :sm="12" :md="8" :lg="4" :xl="3">
            <Select v-model="search.type" dict="type" placeholder="展示类型"></Select>
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
            <Poptip content="确定删除所选记录，是否永久删除？" @confirm="deleteBanner" :disabled="disabled">
              <Button icon="h-icon-trash" color="red" :disabled="disabled">删除</Button>
            </Poptip>
          </Cell>
        </Row>
      </div>
      <div class="h-panel-body bottom-line">
        <!-- 表格 -->
        <Table :datas="datas" ref="tables" :loading="loading" :border="border" :checkbox="checkbox" @select="onSelect">
          <TableItem title="图片" :width="70" align="center">
            <template slot-scope="{ data }">
              <ImagePreview :width="70" :datas="baseApi + data.image" @click="openPreview" />
            </template>
          </TableItem>
          <TableItem title="资讯编号" prop="link" :width="100" align="center"></TableItem>
          <TableItem title="排序" prop="sort" :width="100" align="center"></TableItem>
          <TableItem title="创建时间" prop="createTime" :width="100" align="center"></TableItem>
          <TableItem title="更新时间" prop="updateTime" :width="100" align="center"></TableItem>
          <TableItem title="展示类型" :width="60" align="center">
            <template slot-scope="{ data }">
              <span class="blue-color" v-if="data.type == 1">首页展示</span>
              <span class="yellow-color" v-else>校园资讯展示</span>
            </template>
          </TableItem>
          <TableItem title="状态" :width="60" align="center">
            <template slot-scope="{ data }">
              <i v-if="data.status == 1" class="h-icon-success green-color"></i>
              <i v-else class="h-icon-error red-color"></i>
            </template>
          </TableItem>
          <TableItem title="操作" :width="140" align="center">
            <template slot-scope="{ data }">
              <button class="h-btn h-btn-s h-btn-blue" @click="open(data)">{{ data._expand ? '收起' : '展开' }}</button>
              <button class="h-btn h-btn-s h-btn-red" @click="onEdtior(data)">编辑</button>
            </template>
          </TableItem>
          <template slot="expand" slot-scope="{ index, data }">
            <Form readonly mode="twocolumn" :label-width="150">
              <FormItem label="校园资讯标题: " single @click="newsInfo(data.newsId)">{{ data.newsTitle }}</FormItem>
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
import BannerCreate from './banner-create';
import BannerEditor from './banner-editor';
export default {
  name: 'Banner',
  methods: {
    currentChange(value) {
      console.log(value);
      this.search.page = value.cur;
      this.search.size = value.size;
      this.submitSearch();
    },
    onEdtior(data) {
      R.Banner.getOne(data.id).then(res => {
        if (res.ok) {
          let bannerItem = res.body;
          this.$Modal({
            type: 'drawer-right',
            width: 500,
            component: {
              vue: BannerEditor,
              datas: { bannerItem: bannerItem } // 子组件直接使用 props 即可使用，兼容性 1.15.0+
            },
            events: {
              success: (modal, data) => {
                if (data) {
                  this.$Notice({
                    type: 'success',
                    title: '成功',
                    content: '网站轮播图修改成功'
                  });
                  this.refresh();
                  this.submitSearch();
                } else {
                  this.$Notice({
                    type: 'error',
                    title: '错误',
                    content: '网站轮播图修改失败'
                  });
                }
              }
            }
          });
        }
      });
    },
    open(data) {
      this.$set(data, '_expand', !data._expand);
    },
    openPreview(data) {
      this.$ImagePreview(data);
    },
    newsInfo(id) {
      this.$router.push({ name: 'NewsView', params: { id: id } });
    },
    onSelect(data) {
      this.disabled = data.length > 0 ? false : true;
      let temp = [];
      for (const item of data) {
        temp.push(item.id);
      }
      this.bannerIds = temp;
    },
    deleteBanner() {
      R.Banner.delete(this.bannerIds).then(res => {
        if (res.ok) {
          this.$Notice({
            type: 'success',
            title: '成功',
            content: '网站轮播图数据记录已成功删除'
          });
          this.refresh();
          this.submitSearch();
        }
        this.$refs.tables.clearRowSelect();
        this.$refs.tables.setSelection([]);
      });
    },
    showcreate() {
      this.$Modal({
        type: 'drawer-right',
        width: 500,
        component: {
          vue: BannerCreate,
          datas: {} // 子组件直接使用 props 即可使用，兼容性 1.15.0+
        },
        events: {
          success: (modal, data) => {
            if (data) {
              this.$Notice({
                type: 'success',
                title: '成功',
                content: '网站轮播图新增成功'
              });
              this.refresh();
              this.submitSearch();
            } else {
              this.$Notice({
                type: 'error',
                title: '错误',
                content: '网站轮播图新增失败'
              });
            }
          }
        }
      });
    },
    submitSearch() {
      this.searchLoading = true;
      this.loading = true;
      if (this.search.status == null) this.search.status = 0;
      R.Banner.getBannerList(this.search).then(res => {
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
    refresh() {
      this.value = {};
      this.search.word = '';
      this.search.status = 0;
      this.search.type = 0;
      this.search.start = '';
      this.search.end = '';
    }
  },
  data() {
    return {
      baseApi: this.$store.getters.baseApi + '/file/',
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
        type: 0,
        start: '',
        end: '',
        page: 1,
        size: 10,
        total: 0
      },
      bannerIds: []
    };
  },
  mounted() {
    this.submitSearch();
  }
};
</script>

<style lang="scss" scoped></style>
