<template>
  <div class="min frame-page frame-flex-page h-panel">
    <div class="frame-left">
      <SubMenu :datas="menus" ref="menu"></SubMenu>
    </div>
    <div class="frame-main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PublishPost',
  data() {
    return {
      menus: [
        {
          title: '寻物启事登记',
          key: 'LostPublish'
        },
        {
          title: '招领启事登记',
          key: 'FoundPublish'
        }
      ]
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {}
  },
  computed: {}
};
</script>

<style lang="less" scoped>
.min {
  min-width: 1200px;
}
</style>
