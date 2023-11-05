<template>
  <div>
    <el-upload class="upload-demo" action :http-request="HandleUploadSelf" multiple :file-list="allfileList">
      <el-button size="small" type="primary">附件</el-button>
    </el-upload>
    <el-table ref="allfileList" :data="allfileList" :header-cell-style="tableHeader" stripe
      style="width: 100%; margin-top: 10px">
      <el-table-column prop="fileName" :show-overflow-tooltip="true" align="center" label="文件名称" />
      <el-table-column prop="uploader" align="center" label="上传者" />

      <el-table-column prop="modifyTime" align="center" label="更新时间" min-width="120" :show-overflow-tooltip="true" />
      <el-table-column label="操作" min-width="120" align="center">
        <template slot-scope="scope">
          <el-button type="text" class="table-btn" @click.stop="openfildEdit(scope.row.id)">编辑</el-button>
          <el-button type="text" class="table-btn" @click.stop="openfildDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="fileTotal > 0" :total="fileTotal" :page.sync="fileParams.pageNum"
      :limit.sync="fileParams.pageSize" @pagination="getfileList" />

    <el-dialog title="修改附件" :visible.sync="profileOpen" width="500px" append-to-body>
      <div>
        <el-upload class="editupload-demo" action :http-request="editUploadSelf" :before-remove="editbeforeRemove"
          multiple :limit="1" :on-exceed="editExceed" :file-list="editfileList">
          <el-button size="small" type="primary">重新上传</el-button>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="fileSubForm">确 定</el-button>
        <el-button @click="calloff">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { message, formData } from '@/utils/common'

import { addAttachment, fileList, deleteAttachment, updateAttachment } from '@/api/fileUpload'
export default {
  name: 'Upload',
  props: {
    linkId: {
      required: true,
      type: String
    },
    type: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      profileOpen: false,
      tableHeader: {
        color: '#d4dce3',
        background: '#4286CD'
      }, // 表头颜色加粗设置
      // 修改文件
      editfileList: [],
      onefileList: [],
      onefileId: '',
      allfileList: [],
      fileTotal: 0,
      // 获取文件列表
      fileParams: {
        pageNum: 1,
        pageSize: 10,
        type: '',
        linkId: ''
      }
    }
  },
  created() {
    this.fileParams.type = this.type
    this.fileParams.linkId = this.linkId
    console.log(this.type, this.linkId)
    this.getfileList()
  },
  methods: {
    // 新增file
    HandleUploadSelf(file) {
      const params = {
        type: this.type,
        linkId: this.linkId
      }
      addAttachment(params, formData({ file: file.file })).then(res => {
        if (res.code === '200') {
          message('success', res.msg)
          this.getfileList()
        }
      })
    },
    // 获取文件列表
    getfileList() {
      fileList(this.fileParams).then(res => {
        if (res.code === '200') {
          res.data.filter(item => {
            item['name'] = item.fileName
          })
          this.allfileList = res.data
          this.fileTotal = res.total
        }
      })
    },
    // 修改文件
    openfildEdit(id) {
      this.profileOpen = true
      this.onefileId = id
    },
    editExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    editbeforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    editUploadSelf(file, fileList) {
      this.onefileList = file
    },
    // 确认修改file
    fileSubForm() {
      this.profileOpen = false
      updateAttachment(this.onefileId, formData({ file: this.onefileList.file })).then(res => {
        if (res.code === '200') {
          message('success', res.msg)
          this.onefileList = []
          this.editfileList = []
          this.getfileList()
        }
      })
    },
    // 确认修改
    calloff() {
      this.profileOpen = false
    },
    // 删除文件
    openfildDel(id) {
      deleteAttachment(id).then(res => {
        if (res.code === '200') {
          message('success', res.msg)
          this.getfileList()
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
@import "@/views/project/index.scss"; //引入项目的样式
</style>
