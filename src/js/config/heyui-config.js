import dictConfig from './dict-config';
import autocompleteConfig from './autocomplete-config';
import treeConfig from './tree-config';
import categoryConfig from './category-config';

const heyuiConfig = () => {
  const staticDict = dictConfig();
  Object.keys(staticDict).forEach(key => {
    HeyUI.addDict(key, staticDict[key]);
  });

  // 系部全局定义
  HeyUI.initDict({
    depts: [
      '软件工程系',
      '网络技术系',
      '电子系',
      '数码媒体系',
      '计算机系',
      '游戏系',
      '国际经贸系',
      '管理系',
      '外语系',
      '财会系',
      '基础部',
      '思想政治理论课教学部',
      '继续教育学院'
    ]
  });

  HeyUI.initDict({
    gender: { 1: '男', 2: '女' }
  });

  HeyUI.initDict({
    placement: { 1: '置顶', 2: '普通' }
  });

  HeyUI.initDict({
    type: { 1: '首页展示', 2: '校园资讯展示' }
  });

  HeyUI.initDict({
    comment: { 1: '寻物帖子评论', 2: '招领帖子评论' }
  });

  HeyUI.initDict({
    status: [
      { title: '激活', key: 1 },
      { title: '禁用', key: 2 }
    ]
  });

  HeyUI.initDict({
    contact: [
      { title: '个人联系', key: 1 },
      { title: '站点认领', key: 2 }
    ]
  });

  HeyUI.initDict({
    lost: { 1: '寻找中', 2: '已寻回', 3: '不可见', 4: '删除' }
  });

  HeyUI.initDict({
    found: { 1: '认领中', 2: '已认领', 3: '不可见', 4: '删除' }
  });

  HeyUI.config('dict.keyName', 'key');
  HeyUI.config('dict.titleName', 'title');

  HeyUI.config('autocomplete.configs', autocompleteConfig());
  HeyUI.config('tree.configs', treeConfig());
  HeyUI.config('category.configs', categoryConfig());

  HeyUI.config('menu', {
    keyName: 'key',
    titleName: 'title',
    childrenName: 'children'
  });
};

export default heyuiConfig;
