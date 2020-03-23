<template>
  <div class="frame-page">
    <div class="h-panel h-panel-no-border">
      <div class="h-panel-bar">
        <div class="h-panel-title">
          <Breadcrumb :datas="titleDatas"></Breadcrumb>
        </div>
      </div>
      <Form :label-width="110" ref="lostform" :rules="validationRules" mode="twocolumn" :model="lostItem" :showErrorTip="false">
        <div class="h-panel-body">
          <FormItem label="编号" prop="uuid" single>
            <input type="text" v-model="lostItem.uuid" readonly />
          </FormItem>
          <FormItem label="标题" prop="title">
            <input type="text" v-model="lostItem.title" placeholder="说一下吧，限制输入30个字哦" v-wordlimit="30" />
          </FormItem>
          <FormItem label="物品分类" prop="type">
            <Select v-model="lostItem.type" :datas="categorys" placeholder="请选择失物的分类"></Select>
          </FormItem>
          <FormItem label="拾到地址" prop="place">
            <input type="text" v-model="lostItem.place" placeholder="还记得与它相见的最后地点吗" />
          </FormItem>
          <FormItem label="拾到时间" prop="lostTime">
            <DatePicker v-model="lostItem.lostTime" :option="param" format="YYYY-MM-DD"></DatePicker>
          </FormItem>
          <FormItem label="详细说明" prop="remark" single>
            <textarea
              rows="3"
              placeholder="对失物简单描述一下吧，说不定更快找到它哦"
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
          <FormItem label="启事状态" prop="status">
            <Select v-model="lostItem.status" dict="found" placeholder="启事状态"></Select>
          </FormItem>
          <FormItem single>
            <Button color="primary" :loading="isLoading" @click="submitLost">保 存</Button>&nbsp;&nbsp;&nbsp;
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
  name: 'FoundEditor',
  data() {
    return {
      contactParam: { 1: '个人联系', 2: '认领站点' },
      fileData: new FormData(),
      dialogImageUrl: '',
      dialogVisible: false,
      isLoading: false,
      param: {
        end: new Date()
      },
      validationRules: {
        required: ['title', 'type', 'lostTime', 'place'],
        mobile: ['telephone']
      },
      loading: false,
      action: api + '/founds/upload',
      headers: {
        Authorization: getToken()
      },
      categorys: [],
      titleDatas: [
        {
          icon: 'h-icon-menu',
          route: { name: 'FoundManager' }
        }
      ],
      foundId: this.$route.params.foundId || 0,
      baseApi: this.$store.getters.baseApi + '/file/',
      lostItem: {},
      fileList: [],
      claims: []
    };
  },
  methods: {
    submitLost() {
      this.isLoading = true;
      let validResult = this.$refs.lostform.valid();
      if (validResult.result) {
        // 文件上传
        this.$refs.upload.submit();
        try {
          fileUpload(this.fileData).then(response => {
            console.log(response);
            this.fileData = new FormData();
            if (response.status == 200) {
              let imagesUrl = response.data;
              imagesUrl.forEach(element => {
                this.lostItem.images.push(element);
              });
              console.log(this.lostItem);
              // 提交修改信息
              R.Found.updateFound(this.lostItem).then(res => {
                console.log(res);
                if (res.ok) {
                  this.$Notice({
                    type: 'success',
                    title: '成功',
                    content: '认领启事已修改成功'
                  });
                  this.fileList = [];
                  this.initLost();
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
      this.lostItem.images.forEach(function(item, index, arr) {
        if (item == file.name) {
          arr.splice(index, 1);
        }
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    initLost() {
      if (!this.foundId) return;
      R.Found.getOne(this.foundId).then(res => {
        console.log(res);
        this.lostItem = res.body;
        if (this.lostItem.images.length > 0) {
          this.lostItem.images.forEach(element => {
            let temp = {};
            temp.name = element;
            temp.url = this.baseApi + element;
            this.fileList.push(temp);
          });
        }
        this.titleDatas = [
          {
            icon: 'h-icon-menu',
            route: { name: 'FoundManager' }
          }
        ];
        // title
        this.titleDatas.push({
          title: this.lostItem.title,
          icon: 'h-icon-edit'
        });
        console.log(this.lostItem);
      });
    }
  },
  mounted() {
    this.initLost();
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