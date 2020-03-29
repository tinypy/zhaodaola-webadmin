<template>
  <div class="frame-page">
    <div class="h-panel h-panel-no-border shadow">
      <div class="h-panel-bar">
        <div class="h-panel-title">网站留言数据表</div>
      </div>
      <div class="h-panel-bar">
        <Row :space="20">
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="6">
            <input type="text" style="width: 100%;" v-model="search.word" placeholder="输入标题或内容搜索" />
          </Cell>
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="4">
            <input type="text" style="width: 100%;" v-model="search.username" placeholder="输入用户名搜索" />
          </Cell>
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="6">
            <DateRangePicker style="width: 100%;" v-model="value" placeholder="发布时间" :format="format" :option="param" @input="change"></DateRangePicker>
          </Cell>
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="6">
            <Button icon="h-icon-search" color="primary" :loading="searchLoading" @click="submitSearch">搜 索</Button>&nbsp;&nbsp;
            <Button icon="h-icon-refresh" color="yellow" @click="refresh">重 置</Button>
          </Cell>
        </Row>
        <Row :space="20">
          <Cell :xs="24" :sm="24" :md="10" :lg="8" :xl="8">
            <Poptip content="确定删除所选记录？" @confirm="deleteThanks" :disabled="disabled">
              <Button icon="h-icon-trash" color="red" :disabled="disabled">删 除</Button>
            </Poptip>
          </Cell>
        </Row>
      </div>
      <div class="h-panel-body bottom-line">
        <!-- 表格 -->
        <Table :datas="thanksList" ref="commentTable" :loading="loading" :border="false" :checkbox="true" @select="onSelect">
          <TableItem title="留言者" prop="username" :width="100" align="center"></TableItem>
          <TableItem title="留言标题" prop="title" :width="100" align="center"></TableItem>
          <TableItem title="留言内容" :width="250">
            <template slot-scope="{data}">
              <TextEllipsis
                textClass="link"
                :text="data.content"
                more="..."
                :height="20"
                :width="250"
                useTooltip
                tooltipTheme="white"
                placement="top"
              ></TextEllipsis>
            </template>
          </TableItem>
          <TableItem title="留言时间" prop="createTime" :width="150" align="center"></TableItem>
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
import Avatar from '../../images/avatar.png';
export default {
  name: 'ThanksManager',
  data() {
    return {
      sizes: [10, 20, 50, 100],
      thanksIds: [],
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
        username: '',
        start: '',
        end: '',
        page: 1,
        size: 10,
        total: 0
      },
      thanksList: [],
      Avatar: Avatar,
      baseApi: this.$store.getters.baseApi + '/avatar/'
    };
  },
  methods: {
    refresh() {
      this.value = {};
      this.search.word = '';
      this.search.username = '';
      this.search.start = '';
      this.search.end = '';
    },
    change() {
      if (this.value.start) this.search.start = this.value.start + ' 00:00:00';
      if (this.value.end) this.search.end = this.value.end + ' 23:59:59';
    },
    currentChange() {
      this.search.page = value.cur;
      this.search.size = value.size;
      this.submitSearch();
    },
    onSelect(data) {
      this.disabled = data.length > 0 ? false : true;
      let temp = [];
      for (const item of data) {
        temp.push(item.id);
      }
      this.thanksIds = temp;
      console.log(this.thanksIds);
    },
    deleteThanks() {
      R.Thanks.deleteThanks(this.thanksIds).then(res => {
        if (res) {
          this.$Notice({
            type: 'success',
            title: '成功',
            content: '留言已成功删除啦'
          });
          this.refresh();
          this.submitSearch();
        }
        this.$refs.commentTable.clearRowSelect();
        this.$refs.commentTable.setSelection([]);
      });
    },
    submitSearch() {
      this.thanksList = [];
      this.loading = true;
      R.Thanks.getThanks(this.search).then(res => {
        console.log(res);
        if (res.ok) {
          this.search.page = res.body.page;
          this.search.size = res.body.size;
          this.search.total = res.body.total;

          res.body.list.forEach(thanks => {
            let temp = thanks;
            if (thanks.avatar) {
              temp.avatar = this.baseApi + thanks.avatar;
            }
            this.thanksList.push(temp);
            this.loading = false;
          });
        }
      });
      this.loading = false;
    }
  },
  mounted() {
    this.submitSearch();
  }
};
</script>

<style lang="scss" scoped>
</style>