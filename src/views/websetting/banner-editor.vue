<template>
  <div>
    <div v-width="500">
      <div class="h-panel">
        <div class="h-panel-bar">
          <span class="h-panel-title">网站轮播图修改</span>
          <span class="h-panel-right">
            <a @click="close">关闭</a>
          </span>
        </div>
        <div class="h-panel-body">
          <Form ref="bannerForm" :label-width="100" :rules="validationRules" mode="single" :model="bannerItem" :showErrorTip="false">
            <FormItem label="标题" prop="title">
              <input v-model="bannerItem.title" type="text" placeholder="标题" />
            </FormItem>
            <FormItem label="资讯编号" prop="link">
              <input v-model="bannerItem.link" type="text" placeholder="校园资讯编号" />
            </FormItem>
            <FormItem label="类型" prop="type">
              <Select v-model="bannerItem.type" dict="type" placeholder="展示类型"></Select>
            </FormItem>
            <FormItem label="排序" prop="type">
              <NumberInput type="text" v-model="bannerItem.sort" placeholder="排序" />
            </FormItem>
            <FormItem label="展示图片" prop="images" single>
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
            <FormItem label="状态" prop="status">
              <Select v-model="bannerItem.status" dict="status" placeholder="状态"></Select>
            </FormItem>
            <FormItem>
              <Button color="primary" :loading="loading" @click="save">保 存</Button>&nbsp;&nbsp;&nbsp;
              <Button @click="close">取 消</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
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
export default {
  props: {
    bannerItem: Object
  },
  mounted() {
    console.log(this.bannerItem);
    if (this.bannerItem.image != null && this.bannerItem.image != '') {
      let temp = {};
      temp.name = this.bannerItem.image;
      temp.url = this.baseApi + this.bannerItem.image;
      this.fileList.push(temp);
    }
  },
  data() {
    return {
      validationRules: {
        required: ['title', 'link', 'type', 'sort']
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
      baseApi: this.$store.getters.baseApi + '/file/'
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    save() {
      this.loading = true;
      let validResult = this.$refs.bannerForm.valid();
      if (validResult.result) {
        // 文件上传
        this.$refs.upload.submit();
        try {
          fileUpload(this.fileData).then(response => {
            this.fileData = new FormData();
            if (response.status == 200) {
              if (response.data.length > 0) {
                this.bannerItem.image = response.data[0];
              }
              console.log(this.bannerItem);
              // 发布
              R.Banner.editorBanner(this.bannerItem).then(res => {
                console.log(res);
                if (res.ok) {
                  this.loading = false;
                  this.$emit('success', res.ok);
                  this.close();
                }
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
      this.loading = false;
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
    }
  }
};
</script>

<style lang="scss" scoped></style>
