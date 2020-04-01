<style lang="less">
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
  .lost {
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
          <div class="count">{{ count.userAccount }} 人</div>
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
          <div class="count">{{ count.lostCount }} 件</div>
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
          <div class="count">{{ count.foundCount }} 件</div>
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
          <div class="count">{{ count.newsCount }} 条</div>
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
          <div class="count">{{ count.announceCount }} 条</div>
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
          <div class="count">{{ count.thanksCount }} 条</div>
        </el-card>
      </Cell>
    </Row>
    <Row :space="30">
      <Cell :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
        <div class="h-panel shadow">
          <div class="h-panel-bar">
            <Tabs v-model="type" :datas="{ lost: '寻物启事分类统计', found: '招领启事分类统计' }"></Tabs>
          </div>
          <div class="h-panel-body">
            <transition name="el-fade-in">
              <div v-show="type == 'lost'" class="lost" id="c1"></div>
            </transition>
            <transition name="el-fade-in">
              <div v-show="type == 'found'" class="lost" id="c2"></div>
            </transition>
          </div>
        </div>
      </Cell>

      <Cell :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <div class="h-panel shadow">
          <div class="h-panel-bar">
            <div class="h-panel-title">失物统计</div>
          </div>
          <div class="h-panel-body">
            <h-circle :percent="parseInt((lostBili.yes / lostBili.count) * 100)" :stroke-width="16" :size="180">
              <p class="gray-color" v-font="28">总数：{{ lostBili.count }}</p>
              <div v-height="5"></div>
              <p class="dark-color" v-font="13">正在寻找/已寻回比例</p>
              <p class="gray-color">
                <span class="primary-color" v-font="16">{{ lostBili.no }}</span
                >/<span>{{ lostBili.yes }}</span>
              </p>
            </h-circle>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <h-circle :percent="parseInt((lostBili.yes / lostBili.count) * 100)" :stroke-width="8" :size="80"
              ><span v-font="12">占比: {{ lostBili.yes }}%</span></h-circle
            >
          </div>
          <div class="h-panel-body">
            <h-circle :percent="parseInt((foundBili.yes / foundBili.count) * 100)" :stroke-width="16" :size="180">
              <p class="gray-color" v-font="28">总数：{{ foundBili.count }}</p>
              <div v-height="5"></div>
              <p class="dark-color" v-font="13">正在认领/已被认领比例</p>
              <p class="gray-color">
                <span class="primary-color" v-font="16">{{ foundBili.no }}</span
                >/<span>{{ foundBili.yes }}</span>
              </p>
            </h-circle>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <h-circle :percent="parseInt((foundBili.yes / foundBili.count) * 100)" :stroke-width="8" :size="80"
              ><span v-font="12">占比: {{ foundBili.yes }}%</span></h-circle
            >
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
      count: {},
      lostType: [],
      foundType: [],
      lostBili: {},
      foundBili: {}
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
      R.Dashboard.lostTypeCount().then(res => {
        console.log(res);
        if (res.ok) {
          this.lostType = res.body;
          const chart = new Chart({
            container: 'c1',
            forceFit: true,
            height: 430,
            padding: [20, 20]
          });

          console.log(chart);

          chart.source(this.lostType);

          chart.interval().position('type*count');

          chart.render();
        }
      });
    },
    showFoundTypeCount() {
      R.Dashboard.foundTypeCount().then(res => {
        console.log(res);
        if (res.ok) {
          this.foundType = res.body;
          const chart = new Chart({
            container: 'c2',
            forceFit: true,
            height: 430,
            padding: [20, 20]
          });

          console.log(chart);

          chart.source(this.foundType);

          chart.interval().position('type*count');

          chart.render();
        }
      });
    },
    showBili() {
      R.Dashboard.bili().then(res => {
        console.log(res);
        if (res.ok) {
          this.lostBili = res.body[0];
          this.foundBili = res.body[1];
        }
      });
    }
  },
  mounted() {
    this.showCount();
    this.showLostTypeCount();
    this.showFoundTypeCount();
    this.showBili();
  }
};
</script>
