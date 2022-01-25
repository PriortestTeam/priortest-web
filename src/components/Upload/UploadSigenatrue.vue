<template>
  <el-upload
    ref="upload"
    class="upload-demo"
    accept=".jpg,.jpeg,.png"
    :action="url"
    :auto-upload="false"
    :headers="headers"
    :show-file-list="false"
    :on-change="handleChange"
  >
    <el-button type="primary" size="small">上传签名</el-button>
    <div slot="tip" class="el-upload__tip">
      仅支持JPG和PNG格式，且不超过5MB，一次只能上传一个文件
    </div>
  </el-upload>
</template>

<script>
import { uploadSignature } from '../../api/signoff.js'
export default {
  data () {
    return {
      url: process.env.VUE_APP_BASE_API + '/signOff/upload'
    }
  },
  computed: {
    headers () {
      return {
        Authorization: 'Bearer ' + localStorage.getItem('token')// 本地获取token,添加到headers里面
      }
    }
  },
  methods: {
    handleChange (file, fileList) {
      console.log(file)
      if (file.raw.type !== 'image/png' && file.raw.type !== 'image/jpg' && file.raw.type !== 'image/jpeg') {
        this.$message.warning('仅支持JPG和PNG格式')
        this.$refs.upload.clearFiles()
      } else if (file.size > 1024 * 1024 * 5) {
        this.$message.warning('上传文件大小不能超过5MB')
        this.$refs.upload.clearFiles()
      } else {
        const formData = new FormData()
        formData.append('file', file.raw)
        uploadSignature(formData).then(res => {
          if (res.code === '200') {
            this.$message.success('上传成功')
            this.$emit('getImgUrl', res)
          }
        })
      }
    }
  }
}
</script>

<style></style>
