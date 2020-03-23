<template>
  <div class="frame-page">
    <div class="h-panel h-panel-no-border">
      <div class="h-panel-bar">
        <div class="h-panel-title">
          <i class="h-icon-home yellow-color" @click="reback"></i>&nbsp;&nbsp;&nbsp;
          <span>{{newsInfo.title}}</span>
        </div>
      </div>
      <div class="h-panel-body bottom-line">
        <Row :space="20">
          <Cell :width="3"></Cell>
          <Cell :width="18">
            <div class="news-info bottom-line">
              <div class="item">
                <i class="icon-file-subtract"></i>
                作者：{{newsInfo.author}}
              </div>
              <div class="item">
                <i class="icon-tag"></i>
                来源：{{newsInfo.dept}}
              </div>
              <div class="item">
                <i class="icon-clock"></i>
                发布时间：{{newsInfo.createTime}}
              </div>
              <div class="item">
                <i class="icon-eye"></i>
                浏览次数：{{newsInfo.borwse}}
              </div>
            </div>
            <div class="news-content">
              <div v-html="newsInfo.content"></div>
            </div>
          </Cell>
          <Cell :width="3"></Cell>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewsView',
  data() {
    return {
      newsInfo: {},
      newsId: null
    };
  },
  methods: {
    reback() {
      this.$router.push({ name: 'NewsList' });
    }
  },
  mounted() {
    this.newsId = this.$route.params.id;
    console.log(this.newsId);
    if (this.newsId == null) return;
    R.News.getOne(this.newsId).then(res => {
      console.log(res);
      if (res.ok) {
        this.newsInfo = res.body;
      }
    });
  }
};
</script>

<style lang="less" scoped>
.news-info {
  width: 100%;
  height: 42px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 6px;
}
.news-content {
  padding: 20px 0;
  box-sizing: border-box;
}
</style>