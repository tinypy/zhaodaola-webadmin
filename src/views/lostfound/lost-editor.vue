<template>
  <div class="frame-page">
    <div class="h-panel h-panel-no-border shadow">
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
          <FormItem label="丢失地址" prop="plcae">
            <input type="text" v-model="lostItem.place" placeholder="还记得与它相见的最后地点吗" />
          </FormItem>
          <FormItem label="丢失时间" prop="lostTime">
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
          <FormItem label="失主姓名" prop="name">
            <input type="text" v-model="lostItem.name" placeholder=".失主姓名...." />
          </FormItem>
          <FormItem label="联系电话" prop="telephone">
            <input type="text" v-model="lostItem.telephone" placeholder="联系电话....." />
          </FormItem>
          <FormItem label="宿舍楼号" prop="dorm">
            <input type="text" v-model="lostItem.dorm" placeholder="宿舍楼号....." />
          </FormItem>
          <FormItem label="微信" prop="wechat">
            <input type="text" v-model="lostItem.wechat" placeholder="微信....." />
          </FormItem>
          <FormItem label="启事状态" prop="status">
            <Select v-model="lostItem.status" dict="lost" placeholder="启事状态"></Select>
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
  name: 'LostEditor',
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
              R.Lost.updateLost(this.lostItem).then(res => {
                console.log(res);
                if (res.ok) {
                  this.$Notice({
                    type: 'success',
                    title: '成功',
                    content: '寻物启事已修改成功'
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
      if (!this.lostId) return;
      R.Lost.getOne(this.lostId).then(res => {
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
            route: { name: 'LostManager' }
          }
        ];
        // title
        this.titleDatas.push({
          title: this.lostItem.title,
          icon: 'h-icon-edit'
        });
      });
    }
  },
  data() {
    return {
      userId: this.$route.params.userId || 0,
      fileData: new FormData(),
      dialogImageUrl: '',
      dialogVisible: false,
      isLoading: false,
      param: {
        end: new Date()
      },
      validationRules: {
        required: ['title', 'type', 'status'],
        mobile: ['telephone']
      },
      fileData: new FormData(),
      loading: false,
      action: api + '/losts/upload',
      headers: {
        Authorization: getToken()
      },
      categorys: [],
      titleDatas: [
        {
          icon: 'h-icon-menu',
          route: { name: 'LostManager' }
        }
      ],
      lostId: this.$route.params.lostId || 0,
      baseApi: this.$store.getters.baseApi + '/file/',
      lostItem: {},
      fileList: []
    };
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
  }
};
</script>

<style lang="scss" scoped>
</style>