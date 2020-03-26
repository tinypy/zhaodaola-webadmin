<template>
  <div>
    <div class="h-panel">
      <div class="h-panel-bar">
        <span class="h-panel-title">
          <i class="el-icon-s-opportunity"></i>&nbsp;&nbsp;
          失物信息
        </span>
      </div>
      <Form :label-width="110" ref="lostform" :rules="validationRules" mode="twocolumn" :model="lostItem" :showErrorTip="false">
        <div class="h-panel-body">
          <FormItem label="标题" prop="title">
            <input type="text" v-model="lostItem.title" placeholder="说一下吧，限制输入30个字哦" v-wordlimit="30" />
          </FormItem>
          <FormItem label="物品分类" prop="type">
            <Select v-model="lostItem.type" :datas="categorys" placeholder="请选择失物的分类"></Select>
          </FormItem>
          <FormItem label="拾到地址" prop="place">
            <input type="text" v-model="lostItem.place" placeholder="请问您是在哪与它相遇的呢" />
          </FormItem>
          <FormItem label="拾到时间" prop="lostTime">
            <DatePicker v-model="lostItem.lostTime" :option="param" format="YYYY-MM-DD"></DatePicker>
          </FormItem>
          <FormItem label="详细说明" prop="remark" single>
            <textarea
              rows="3"
              placeholder="介绍一下，说不定更快找到它主人哦"
              v-autosize
              v-wordcount="50"
              v-model="lostItem.remark"
              resize="false"
              style="width: 100%;resize: none;"
            ></textarea>
          </FormItem>
          <FormItem label="失物图片" prop="images" single>
            <el-upload
              multiple
              :http-request="uploadFile"
              ref="upload"
              :auto-upload="false"
              :action="action"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleSucess"
              :on-error="handleError"
              :on-change="hadnleChange"
              accept="image/jpg, image/gif, image/png, image/jpeg"
              :limit="4"
              :file-list="fileList"
              :headers="headers"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </FormItem>
          <!-- 认领方式 -->
          <FormItem label="认领方式" prop="contact" single>
            <SwitchList v-model="lostItem.contact" :datas="contactParam" :change="switchChange"></SwitchList>
          </FormItem>
          <template v-if="lostItem.contact==1">
            <FormItem label="联系电话" prop="telephone">
              <input type="text" v-model="lostItem.telephone" placeholder="我的电话" />
            </FormItem>
            <FormItem label="宿舍楼号" prop="dorm">
              <input type="text" v-model="lostItem.dorm" placeholder="我的宿舍" />
            </FormItem>
            <FormItem label="微信" prop="wechat">
              <input type="text" v-model="lostItem.wechat" placeholder="我的微信" />
            </FormItem>
          </template>
          <template v-if="lostItem.contact==2">
            <FormItem label="失物认领站点" prop="claim" single>
              <Select v-model="lostItem.claim" :datas="claims" placeholder="请选择认领站定地址"></Select>
            </FormItem>
          </template>
          <FormItem single>
            <Button color="primary" :loading="isLoading" @click="submitFound">保 存</Button>&nbsp;&nbsp;&nbsp;
            <Button @click="refresh">重 置</Button>
          </FormItem>
        </div>
      </Form>
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
  name: 'FoundPublish',
  data() {
    return {
      contactParam: { 1: '个人联系', 2: '认领站点' },
      param: {
        end: new Date()
      },
      validationRules: {
        required: ['title', 'type', 'lostTime', 'place'],
        mobile: ['telephone']
      },
      fileData: new FormData(),
      loading: false,
      action: api + '/losts/upload',
      headers: {
        Authorization: getToken()
      },
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      categorys: [],
      claims: [],
      isLoading: false,
      lostItem: {
        title: '',
        type: null,
        remark: '',
        place: '',
        lostTime: '',
        images: [],
        telephone: '',
        dorm: '',
        wechat: '',
        contact: 1,
        claim: null
      }
    };
  },
  methods: {
    switchChange(data) {
      console.log(data);
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
    submitFound() {
      this.isLoading = true;
      let validResult = this.$refs.lostform.valid();
      if (validResult.result) {
        // 文件上传
        this.$refs.upload.submit();
        try {
          fileUpload(this.fileData).then(response => {
            this.fileData = new FormData();
            if (response.status == 200) {
              let imagesUrl = response.data;
              imagesUrl.forEach(element => {
                this.lostItem.images.push(element);
              });
              console.log(this.lostItem);
              // 发布登记寻物启事请求
              R.Found.publishFound(this.lostItem).then(res => {
                console.log(res);
                if (res.ok) {
                  this.$Notice({
                    type: 'success',
                    title: '成功',
                    content: '寻物启事已成功登记发布'
                  });
                  this.refresh();
                  this.fileList = [];
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
      this.lostItem = {
        title: '',
        type: null,
        remark: '',
        place: '',
        lostTime: '',
        images: [],
        telephone: '',
        dorm: '',
        wechat: '',
        contact: 1,
        claim: null
      };
    }
  },
  mounted() {
    // 物品分类
    R.Category.getAll().then(res => {
      if (res.ok) {
        console.log(res.body);
        res.body.forEach(element => {
          let temp = {};
          temp.key = element.id;
          temp.title = element.name;
          this.categorys.push(temp);
        });
      }
    });
    // 认领站点
    R.Site.getAll().then(res => {
      console.log(res);
      if (res.ok) {
        res.body.forEach(element => {
          let temp = {};
          temp.key = element.id;
          temp.title = element.address;
          this.claims.push(temp);
        });
      }
    });
  }
};
</script>

<style lang="scss" scoped>
</style>