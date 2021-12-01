<template>
  <el-upload
    class="upload-demo"
    :action="url"
    :auto-upload="false"
    :headers="headers"
    :on-change="handleChange"
  >
    <el-button type="primary" size="small">上传签名</el-button>
    <div slot="tip" class="el-upload__tip">
      一次只能上传一个文件
    </div>
  </el-upload>
</template>

<script>
import { uploadSignature } from '../../api/signoff.js'
export default {
  props:['signPaath'],
  computed: {
    headers() {
      return {
        Authorization: 'Bearer ' + localStorage.getItem('token')//本地获取token,添加到headers里面
      }
    }
  },
  data() {
    return {
      url:process.env.VUE_APP_BASE_API+'/signOff/upload'
    }
  },
  methods: {
    handleChange(file, fileList) {
      const formData = new FormData();
      formData.append("file", file.raw);
      uploadSignature(formData).then(res => {
        this.$emit('getImgUrl', res);
      })
    },
  }
};
</script>

<style></style>
