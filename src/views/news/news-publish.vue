<template>
  <div class="frame-page">
    <Row :space="10">
      <Cell :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <div class="h-panel h-panel-no-border shadow">
          <div class="h-panel-bar">
            <div class="h-panel-title">校园资讯发布</div>
          </div>
          <Form ref="newsForm" :rules="validationRules" :model="newsItem" mode="block" :showErrorTip="false">
            <div class="h-panel-body">
              <FormItem label="标题" prop="title" single>
                <input type="text" v-model="newsItem.title" placeholder="写一个标题吧，限制输入30个字哦" v-wordlimit="30" />
              </FormItem>
              <FormItem label="资讯简述" prop="remark" single>
                <textarea
                  rows="4"
                  placeholder="对发布的校园资讯简单简述一下吧"
                  v-autosize
                  v-wordcount="100"
                  v-model="newsItem.remark"
                  resize="false"
                  style="width: 100%;resize: none;"
                ></textarea>
              </FormItem>
              <FormItem label="作者" prop="author">
                <input type="text" v-model="newsItem.author" placeholder="校园资讯编辑者" />
              </FormItem>
              <FormItem label="系部" prop="dept">
                <Select v-model="newsItem.dept" dict="depts" placeholder="校园资讯发表部门"></Select>
              </FormItem>
              <FormItem label="是否置顶" prop="placement">
                <Radio v-model="newsItem.placement" dict="placement"></Radio>
              </FormItem>
              <FormItem label="资讯分类" prop="type">
                <Select v-model="newsItem.type" :datas="types" placeholder="校园资讯分类"></Select>
              </FormItem>
              <FormItem label="封面" prop="images" single>
                <el-upload
                  multiple
                  :http-request="uploadFile"
                  ref="upload"
                  :action="action"
                  :auto-upload="false"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :on-success="handleSucess"
                  :on-error="handleError"
                  :on-change="hadnleChange"
                  accept="image/jpg, image/gif, image/png, image/jpeg"
                  :limit="1"
                  :file-list="fileList"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
              </FormItem>
              <FormItem single>
                <Button color="primary" @click="submitPulish" :loading="isLoading">立即发布</Button>&nbsp;&nbsp;&nbsp;
                <Button @click="refresh">重 置</Button>
              </FormItem>
            </div>
          </Form>
        </div>
      </Cell>
      <Cell :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <div class="h-panel h-panel-no-border shadow">
          <div class="h-panel-bar">
            <div class="h-panel-title">内容编辑器</div>
            <div class="h-panel-right">
              <Poptip content="是否要重置输入的内容" @confirm="deleteContent">
                <Button icon="h-icon-trash" color="red">清除内容</Button>
              </Poptip>
            </div>
          </div>
          <div class="h-panel-body">
            <div class="editor">
              <div ref="toolbar" class="toolbar"></div>
              <div ref="editor" class="text"></div>
            </div>
          </div>
        </div>
      </Cell>
    </Row>
  </div>
</template>

<script>
const api = 'http://localhost:8001/api';
//引入axios
import request from 'axios';
export function fileUpload(file) {
  return request({
    method: 'post',
    url: api + '/picture/upload',
    headers: { ContentType: 'multipart/form-data', Authorization: getToken() },
    data: file
  });
}
import { getToken } from '@/js/common/auth.js';
import E from 'wangeditor';
export default {
  name: 'NewsPublish',
  methods: {
    submitPulish() {
      this.isLoading = true;
      let validResult = this.$refs.newsForm.valid();
      if (validResult.result) {
        // 内容赋值
        this.newsItem.content = this.info_;
        if (this.newsItem.content == '' || this.editor.txt.text().length < 200) {
          this.$Notice({
            type: 'error',
            title: '错误',
            content: '校园资讯内容不允许为空或者小于200个文字'
          });
          return;
        }
        // 文件上传
        this.$refs.upload.submit();
        try {
          fileUpload(this.fileData).then(response => {
            this.fileData = new FormData();
            if (response.status == 200) {
              if (response.data.length > 0) {
                this.newsItem.image = response.data[0];
              }
              console.log(this.newsItem);
              // 发布登记寻物启事请求
              R.News.publish(this.newsItem).then(res => {
                console.log(res);
                if (res.ok) {
                  this.$Notice({
                    type: 'success',
                    title: '成功',
                    content: '新校园资讯已发布成功'
                  });
                }
                this.isLoading = false;
              });
            } else {
              this.$Notice({
                type: 'error',
                title: '错误',
                content: '上传图片异常'
              });
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
      this.isLoading = false;
    },
    refresh() {
      this.newsItem = {
        title: '',
        remark: '',
        content: '',
        author: '',
        dept: '',
        placement: 1,
        images: '',
        type: 0
      };
    },
    deleteContent() {
      this.editor.txt.clear();
      this.info_ = '';
      this.editor.txt.html('请输入校园资讯的内容，来发挥的你才华吧.......');
    },
    uploadFile: function(file) {
      this.fileData.append('file', file.file);
      return false;
    },
    handleSucess(response) {
      this.loading = false;
    },
    hadnleChange(file, fileList) {
      this.fileList = fileList;
    },
    handleError(err) {
      this.loading = false;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
  data() {
    return {
      editor: null,
      info_: '请输入校园资讯的内容，来发挥的你才华吧.......',
      isLoading: false,
      validationRules: {
        required: ['title', 'remark', 'author', 'dept', 'placement', 'type']
      },
      action: api + '/picture/upload',
      headers: {
        Authorization: getToken()
      },
      fileData: new FormData(),
      loading: false,
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      newsItem: {
        title: '',
        remark: '',
        content: '',
        author: '',
        dept: '',
        placement: 1,
        image: '',
        type: 0
      },
      types: []
    };
  },
  mounted() {
    this.seteditor();
    this.editor.txt.html(this.info_);
    // 物品分类
    R.NewsType.getAll().then(res => {
      if (res.ok) {
        res.body.forEach(element => {
          let temp = {};
          temp.key = element.id;
          temp.title = element.name;
          this.types.push(temp);
        });
      }
    });
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
