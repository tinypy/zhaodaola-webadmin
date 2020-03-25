<template>
  <div class="frame-page">
    <div class="h-panel h-panel-no-border shadow">
      <div class="h-panel-bar">
        <div class="h-panel-title">联系我们 And 关于我们</div>
      </div>
      <div class="h-panel-bar">
        <Tabs :datas="param" v-model="selected" @change="change"></Tabs>
        <div class="setting">
          <div class="contact" v-show="show === 'contact'">
            <Form ref="contact" :label-width="100" :rules="validationRules1" mode="single" :model="contact" :showErrorTip="false">
              <FormItem label="负责人" prop="owner">
                <input v-model="contact.owner" type="text" />
              </FormItem>
              <FormItem label="办公地址" prop="address">
                <input v-model="contact.address" type="text" />
              </FormItem>
              <FormItem label="联系电话" prop="phone">
                <input v-model="contact.phone" type="text" />
              </FormItem>
              <FormItem label="校内邮箱" prop="email">
                <input v-model="contact.email" type="text" />
              </FormItem>
              <FormItem>
                <Button color="primary" :loading="contactLoading" @click="submitContact">保存更新</Button>
              </FormItem>
            </Form>
          </div>
          <div class="about" v-show="show === 'about'">
            <Row :space="20">
              <Cell :xs="24" :sm="12" :md="10" :lg="6" :xl="6">
                <Button icon="h-icon-upload" color="primary" :loading="aboutLoading" @click="submitAbout">保存更新</Button>
              </Cell>
            </Row>
            <div style="margin:10px 0px;"></div>
            <div class="editor">
              <div ref="toolbar" class="toolbar"></div>
              <div ref="editor" class="text"></div>
            </div>
          </div>
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
  name: 'Contact',
  data() {
    return {
      aboutLoading: false,
      editor: null,
      info_: '',
      validationRules1: {
        required: ['owner', 'address', 'email', 'phone'],
        email: ['email'],
        mobile: ['phone']
      },
      contactLoading: false,
      param: {
        contact: '联系我们设置',
        about: '关于我们设置'
      },
      selected: 'contact',
      show: 'contact',
      contact: {
        owner: '',
        address: '',
        phone: '',
        email: ''
      },
      about: {
        content: ''
      }
    };
  },
  methods: {
    seteditor() {
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
    },
    submitAbout() {
      this.aboutLoading = true;
      let validResult = this.$refs.contact.valid();
      // 内容赋值
      this.about.content = this.info_;
      if (this.about.content == '' || this.editor.txt.text().length < 50) {
        this.$Notice({
          type: 'error',
          title: '错误',
          content: '内容不允许为空或者小于50个文字'
        });
        return;
      }
      R.Contact.saveContact(this.about).then(res => {
        console.log(res);
        if (res.ok) {
          this.$Notice({
            type: 'success',
            title: '成功',
            content: '保存更新成功'
          });
        }
        this.aboutLoading = false;
      });
      this.aboutLoading = false;
    },
    submitContact() {
      this.contactLoading = true;
      let validResult = this.$refs.contact.valid();
      if (validResult.result) {
        R.Contact.saveContact(this.contact).then(res => {
          if (res.ok) {
            this.$Notice({
              type: 'success',
              title: '成功',
              content: '保存更新成功'
            });
          }
          this.contactLoading = false;
        });
      }
      this.contactLoading = false;
    },
    change(data) {
      console.log(data);
      this.show = data.key;
      this.tigger();
    },
    tigger() {
      R.Contact.getType('contact').then(res => {
        console.log(res);
        if (res.ok) {
          if (res.body == null) return;
          this.contact = res.body;
        }
      });
      R.Contact.getType('about').then(res => {
        console.log(res);
        if (res.ok) {
          if (res.body == null) return;
          this.about = res.body;
          this.info_ = this.about.content;
          this.editor.txt.html(this.info_);
        }
      });
    }
  },
  mounted() {
    this.seteditor();
    this.editor.txt.html(this.info_);
    this.tigger();
  }
};
</script>

<style lang="less" scoped>
.setting {
  padding: 30px 0px;
  box-sizing: border-box;
}
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
