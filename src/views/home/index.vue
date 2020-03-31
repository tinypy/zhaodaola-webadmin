<style lang='less'>
.app-home-vue {
  .home-part-body {
    height: 350px;
    .echarts-vue {
      height: 350px;
    }
  }

  .home-part-body2 {
    height: 420px;
    .echarts-vue {
      height: 420px;
    }
  }

  .progress-div {
    > p {
      padding: 8px 0;
    }
    .h-progress {
      &-title {
        color: @dark2-color;
        font-size: 15px;
      }
      &-text {
        width: 40px;
      }
    }
  }

  .head {
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .count {
    padding: 20px 0px;
    font-size: 28px;
    text-align: center;
  }
}
</style>
<template>
  <div class="app-home-vue frame-page">
    <Row :space="30">
      <Cell :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card class="bg-green-color white-color">
          <div class="head">
            <div class="title">平台用户</div>
            <div class="tips">
              <el-tooltip class="item" effect="dark" content="当前平台用户数量" placement="top">
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </div>
          </div>
          <div class="count">{{count.userAccount}} 人</div>
        </el-card>
      </Cell>
      <Cell :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card class="bg-green-color white-color">
          <div class="head">
            <div class="title">失物启事数据量</div>
            <div class="tips">
              <el-tooltip class="item" effect="dark" content="当前已存储的寻找失物的数据量" placement="top">
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </div>
          </div>
          <div class="count">{{count.lostCount}} 件</div>
        </el-card>
      </Cell>
      <Cell :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card class="bg-green-color white-color">
          <div class="head">
            <div class="title">招领启事数据量</div>
            <div class="tips">
              <el-tooltip class="item" effect="dark" content="当前已存储的招领失物的数据量" placement="top">
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </div>
          </div>
          <div class="count">{{count.foundCount}} 件</div>
        </el-card>
      </Cell>
      <Cell :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card class="bg-green-color white-color">
          <div class="head">
            <div class="title">校园资讯数据量</div>
            <div class="tips">
              <el-tooltip class="item" effect="dark" content="校园资讯数据量" placement="top">
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </div>
          </div>
          <div class="count">{{count.newsCount}} 条</div>
        </el-card>
      </Cell>
      <Cell :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card class="bg-green-color white-color">
          <div class="head">
            <div class="title">网站公告数据量</div>
            <div class="tips">
              <el-tooltip class="item" effect="dark" content="网站公告数据量" placement="top">
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </div>
          </div>
          <div class="count">{{count.announceCount}} 条</div>
        </el-card>
      </Cell>
      <Cell :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card class="bg-green-color white-color">
          <div class="head">
            <div class="title">网站留言数据量</div>
            <div class="tips">
              <el-tooltip class="item" effect="dark" content="用户的网站留言数据量" placement="top">
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </div>
          </div>
          <div class="count">{{count.thanksCount}} 条</div>
        </el-card>
      </Cell>
    </Row>
    <Row :space="30">
      <Cell :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
        <div class="h-panel shadow">
          <div class="h-panel-bar">
            <span class="h-panel-title">
              <Tabs class="common-panel-tabs" v-model="type" :datas="{lost: '寻物启事分类统计', found: '招领启事分类统计'}"></Tabs>
            </span>
          </div>
          <div class="h-panel-body">
            <div id="c1"></div>
          </div>
        </div>
      </Cell>

      <Cell :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <div class="h-panel shadow">
          <div class="h-panel-bar">
            <div class="h-panel-title">订单统计</div>
            <div class="h-panel-right">
              <span class="gray-color">总共达成</span>
              <i class="h-split"></i>
              <span class="font20 primary-color">200</span>
              <i class="h-split"></i>
              <span class="gray-color">W</span>
            </div>
          </div>
          <div class="h-panel-body progress-div home-part-body">
            <p>
              <Progress :percent="99" color="green">
                <span slot="title">订单状态</span>
                <span slot="text">4个</span>
              </Progress>
            </p>
            <p>
              <Progress :percent="88" color="blue">
                <span slot="title">订单状态</span>
                <span slot="text">0个</span>
              </Progress>
            </p>
            <p>
              <Progress :percent="55" color="red">
                <span slot="title">订单状态</span>
                <span slot="text">0个</span>
              </Progress>
            </p>
            <p>
              <Progress :percent="77" color="blue">
                <span slot="title">订单状态</span>
                <span slot="text">0个</span>
              </Progress>
            </p>
            <p>
              <Progress :percent="66" color="yellow">
                <span slot="title">订单状态</span>
                <span slot="text">0个</span>
              </Progress>
            </p>
          </div>
        </div>
      </Cell>
    </Row>
  </div>
</template>
<script>
import { Chart } from '@antv/g2';
export default {
  data() {
    return {
      type: 'lost',
      count: {}
    };
  },
  methods: {
    showCount() {
      R.Dashboard.count().then(res => {
        console.log(res);
        if (res.ok) {
          this.count = res.body;
        }
      });
    },
    showLostTypeCount() {
      const data = [
        { year: '1951 年', sales: 38 },
        { year: '1952 年', sales: 52 },
        { year: '1956 年', sales: 61 },
        { year: '1957 年', sales: 145 },
        { year: '1958 年', sales: 48 },
        { year: '1959 年', sales: 38 },
        { year: '1960 年', sales: 38 },
        { year: '1962 年', sales: 38 }
      ];
      const chart = new Chart({
        container: 'c1',
        autoFit: true,
        height: 350
      });

      chart.source(data);

      chart.interval().position('year*sales');

      chart.render();
    }
  },
  mounted() {
    this.showCount();

    this.showLostTypeCount();
  }
};
</script>
