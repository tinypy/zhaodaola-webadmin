<template>
  <div class="frame-page">
    <div class="h-panel h-panel-no-border shadow">
      <div class="h-panel-bar">
        <div class="h-panel-title">失物招领帖子评论数据表格</div>
      </div>
      <div class="h-panel-bar">
        <Row :space="20">
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="6">
            <input type="text" style="width: 100%;" v-model="search.word" placeholder="输入评论内容搜索" />
          </Cell>
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="4">
            <input type="text" style="width: 100%;" v-model="search.postCode" placeholder="输入失物招领帖子编号搜索" />
          </Cell>
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="4">
            <input type="text" style="width: 100%;" v-model="search.username" placeholder="输入评论者用户名搜索" />
          </Cell>
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="4">
            <Select v-model="search.type" dict="comment" placeholder="评论类型"></Select>
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
            <Poptip content="确定删除所选记录以及旗下的子评论？" @confirm="deleteComment" :disabled="disabled">
              <Button icon="h-icon-trash" color="red" :disabled="disabled">删 除</Button>
            </Poptip>
          </Cell>
        </Row>
      </div>
      <div class="h-panel-body bottom-line">
        <!-- 表格 -->
        <Table :datas="datas" ref="commentTable" :loading="loading" :border="false" :checkbox="true" @select="onSelect">
          <TableItem title="ID" prop="id" :width="100" align="center"></TableItem>
          <TableItem title="父级ID" prop="pid" :width="100" align="center"></TableItem>
          <TableItem title="帖子标题" :width="200">
            <template slot-scope="{data}">
              <TextEllipsis textClass="link" :text="data.title" more="..." :height="20" :width="200" useTooltip tooltipTheme="white" placement="top"></TextEllipsis>
            </template>
          </TableItem>
          <TableItem title="评论者" prop="fromUsername" :width="150" align="center"></TableItem>
          <TableItem title="被评论者" prop="toUsername" :width="150" align="center"></TableItem>
          <TableItem title="发布时间" prop="createTime" :width="150" align="center"></TableItem>
          <TableItem title="操作" :width="140" align="center">
            <template slot-scope="{ data }">
              <Button noBorder text-color="red" @click="open(data)">详情</Button>
            </template>
          </TableItem>
          <template slot="expand" slot-scope="{ index, data }">
            <Form readonly mode="twolumn">
              <FormItem label="帖子编号">{{ data.postCode }}</FormItem>
              <FormItem label="评论类型">{{ data.type==1?'寻物帖子评论':'招领帖子评论' }}</FormItem>
              <FormItem label="评论内容" single>{{ data.content }}</FormItem>
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
  name: 'CommentManager',
  data() {
    return {
      sizes: [10, 20, 50, 100],
      commentIds: [],
      datas: [],
      loading: false,
      disabled: true,
      downloadLoading: false,
      searchLoading: false,
      param: {
        end: new Date()
      },
      format: 'YYYY-MM-DD',
      value: {},
      search: {
        word: '',
        postCode: '',
        username: '',
        type: 0,
        start: '',
        end: '',
        page: 1,
        size: 10,
        total: 0
      }
    };
  },
  methods: {
    currentChange(value) {
      console.log(value);
      this.search.page = value.cur;
      this.search.size = value.size;
      this.submitSearch();
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
      this.commentIds = temp;
      console.log(this.commentIds);
    },
    deleteComment() {
      R.Comment.delete(this.commentIds).then(res => {
        if (res) {
          this.$Notice({
            type: 'success',
            title: '成功',
            content: '评论已成功删除啦'
          });
          this.refresh();
          this.submitSearch();
        }
        this.$refs.commentTable.clearRowSelect();
        this.$refs.commentTable.setSelection([]);
      });
    },
    exportData() {
      this.downloadLoading = true;
      R.Comment.download(this.search).then(res => {
        if (res.ok) {
          Utils.downloadFile(res.body, '失物招领帖子评论数据');
        }
        this.downloadLoading = false;
      });
    },
    submitSearch() {
      this.searchLoading = true;
      this.loading = true;
      if (this.search.type == null) this.search.type = 0;
      R.Comment.getCommentList(this.search).then(res => {
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
      this.search.postCode = '';
      this.search.start = '';
      this.search.end = '';
    },
    change() {
      if (this.value.start) this.search.start = this.value.start + ' 00:00:00';
      if (this.value.end) this.search.end = this.value.end + ' 23:59:59';
    }
  }
};
</script>

<style lang="scss" scoped>
</style>