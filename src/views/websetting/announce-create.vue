<template>
  <div class="frame-page">
    <div class="h-panel h-panel-no-border shadow">
      <div class="h-panel-bar">
        <div class="h-panel-title">网站公告发布</div>
      </div>
      <div class="h-panel-bar">
        <Row :space="20">
          <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="6">
            <Button icon="h-icon-upload" color="primary" :loading="isLoading" @click="submitSearch">立 即 发 布</Button>
          </Cell>
        </Row>
      </div>
      <div class="h-panel-body bottom-line">
        <Form ref="announceForm" :rules="validationRules" :model="announce" mode="block" :showErrorTip="false">
          <FormItem label="标题" prop="title" single>
            <input type="text" v-model="announce.title" placeholder="写一个标题吧，限制输入30个字哦" v-wordlimit="30" />
          </FormItem>
        </Form>
        <div class="editor">
          <div ref="toolbar" class="toolbar"></div>
          <div ref="editor" class="text"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const api = 'http://localhost:8001/api';
import { getToken } from '@/js/common/auth.js';
import E from 'wangeditor';
export default {
  name: 'AnnounceCreate',
  methods: {
    submitSearch() {
      this.isLoading = true;
      let validResult = this.$refs.announceForm.valid();
      if (validResult.result) {
        // 内容赋值
        this.announce.content = this.info_;
        if (this.announce.content == '' || this.editor.txt.text().length < 50) {
          this.$Notice({
            type: 'error',
            title: '错误',
            content: '公告内容不允许为空或者小于50个文字'
          });
          return;
        }
        console.log(this.announce);
        R.Announce.publish(this.announce).then(res => {
          console.log(res);
          if (res.ok) {
            if (res.ok) {
              this.$Notice({
                type: 'success',
                title: '成功',
                content: '网站公告已发布成功'
              });
            }
            this.isLoading = false;
          }
        });
      }
      this.isLoading = false;
    },
    seteditor() {
      // http://192.168.2.125:8080/admin/storage/create
      this.editor = new E(this.$refs.toolbar, this.$refs.editor);
      this.editor.customConfig.uploadImgShowBase64 = false; // base 64 存储图片
      this.editor.customConfig.uploadImgServer = api + '/picture/upload'; // 配置服务器端地址
      this.editor.customConfig.uploadImgHeaders = {
        ContentType: 'multipart/form-data',
        Authorization: getToken()
      }; // 自定义 header
      this.editor.customConfig.uploadFileName = 'file'; // 后端接受上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024; // 将图片大小限制为 2M
      this.editor.customConfig.uploadImgMaxLength = 6; // 限制一次最多上传 3 张图片
      this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间
      // 关闭粘贴样式的过滤
      this.editor.customConfig.pasteFilterStyle = false;

      // 配置菜单
      this.editor.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'video', // 插入视频
        'code', // 插入代码
        'undo', // 撤销
        'redo', // 重复
        'fullscreen' // 全屏
      ];

      this.editor.customConfig.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
        },
        customInsert: (insertImg, result, editor) => {
          // 图片上传成功，插入图片的回调
          //result为上传图片成功的时候返回的数据，这里我打印了一下发现后台返回的是data：[{url:"路径的形式"},...]
          console.log(result);
          //insertImg()为插入图片的函数
          //循环插入图片
          result.forEach(images => {
            let url = 'http://localhost:8001/file/' + images;
            insertImg(url);
          });
        }
      };
      this.editor.customConfig.onchange = html => {
        this.info_ = html; // 绑定当前逐渐地值
        console.log(this.info_);
      };
      // 创建富文本编辑器
      this.editor.create();
    }
  },
  mounted() {
    this.seteditor();
    this.editor.txt.html(this.info_);
  },
  data() {
    return {
      validationRules: {
        required: ['title']
      },
      info_: '',
      editor: null,
      isLoading: false,
      announce: {
        title: '',
        content: ''
      }
    };
  }
};
</script>

<style lang="less" scoped>
.editor {
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 0;
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  min-height: 500px;
}
</style>
