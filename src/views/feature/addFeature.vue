<template>
  <div class="app-container add-form add-project">
    <el-form
      ref="featureFrom"
      :model="featureFrom"
      :rules="Projectrules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <div>
        <el-button
          v-if="!featureFrom.id"
          type="primary"
          round
          @click="submitForm('featureFrom', false)"
        >保存并新建</el-button>
        <el-button
          v-if="!featureFrom.id"
          type="primary"
          round
          @click="submitForm('featureFrom', true)"
        >保存并返回</el-button>
        <el-button
          v-if="featureFrom.id"
          type="primary"
          round
          @click="submitForm('featureFrom')"
        >确认修改</el-button>
        <el-button
          type="primary"
          round
          @click="giveupBack('featureFrom')"
        >放弃</el-button>
        <router-link v-if="!featureFrom.id" to="/admincenter/admincenter">
          <el-button type="text">{{
            $t("lang.PublicBtn.CreateCustomField")
          }}</el-button>
        </router-link>
      </div>
      <div class="form-box">
        <el-form-item label="故事标题" prop="title">
          <el-input v-model="featureFrom.title" maxlength="30" size="small" />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item
              size="small"
              :label="$t('lang.Project.Status')"
              prop="status"
            >
              <el-select
                v-model="featureFrom.status"
                placeholder="请选择状态"
                clearable
              >
                <el-option :label="$t('lang.Project.Progress')" :value="1" />
                <el-option
                  :label="$t('lang.Project.Closed')"
                  :disabled="true"
                  :value="0"
                />
                <el-option :label="$t('lang.Project.Plan')" :value="2" />
              </el-select> </el-form-item></el-col>
          <el-col :span="8">
            <el-form-item size="small" label="开发周期" prop="sprintId">
              <el-input
                v-model="featureFrom.sprintId"
                placeholder="纯数字"
                oninput="value=value.replace(/[^\d]/g,'')"
                maxlength="30"
                size="small"
              /></el-form-item></el-col>
          <el-col :span="8">
            <el-form-item label="负责人" size="small" prop="reportTo">
              <el-input
                v-model="featureFrom.reportTo"
                maxlength="15"
              /> </el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="EPIC" prop="epic">
              <el-input
                v-model="featureFrom.epic"
                maxlength="15"
              /> </el-form-item></el-col>
          <el-col :span="8">
            <el-form-item size="small" label="版本" prop="version">
              <el-input
                v-model="featureFrom.version"
                maxlength="15"
              /> </el-form-item></el-col>
        </el-row>
        <el-form-item
          :label="$t('lang.Project.Description')"
          prop="description"
          size="small"
        >
          <el-input
            v-model="featureFrom.description"
            type="textarea"
            maxlength="300"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </el-form-item>
        <el-upload
          class="upload-demo"
          action
          :http-request="HandleUploadSelf"
          multiple
          :file-list="allfileList"
        >
          <el-button size="small" type="primary">附件</el-button>
          <!-- <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div> -->
        </el-upload>

        <el-table
          ref="allfileList"
          :data="allfileList"
          :header-cell-style="tableHeader"
          stripe
          style="width: 100%"
        >
          <el-table-column
            prop="fileName"
            :show-overflow-tooltip="true"
            align="center"
            label="文件名称"
          />
          <el-table-column
            prop="uploader"
            align="center"
            label="上传者"
          />

          <el-table-column
            prop="modifyTime"
            align="center"
            label="更新时间"
            min-width="120"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="操作" min-width="120" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                class="table-btn"
                @click.stop="openfildEdit(scope.row.id)"
              >编辑</el-button>
              <el-button
                type="text"
                class="table-btn"
                @click.stop="openfildDel(scope.row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="fileTotal > 0"
          :total="fileTotal"
          :page.sync="fileParams.pageNum"
          :limit.sync="fileParams.pageSize"
          @pagination="getfileList"
        />
      </div>
    </el-form>
    <el-dialog
      title="修改附件"
      :visible.sync="profileOpen"
      width="500px"
      append-to-body
    >
      <div>
        <el-upload
          class="editupload-demo"
          action
          :http-request="editUploadSelf"
          :on-remove="editRemove"
          :before-remove="editbeforeRemove"
          multiple
          :limit="1"
          :on-exceed="editExceed"
          :file-list="editfileList"
        >
          <el-button size="small" type="primary">附件</el-button>
          <!-- <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div> -->
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
import { mapGetters } from 'vuex'
import { addFeature, detailFeature, editFeature } from '@/api/feature'
import { message, formData, returntomenu, formatChangedPara } from '@/utils/common'
import { addAttachment, fileList, deleteAttachment, updateAttachment } from '@/api/fileUpload'
export default {
  name: 'Addfeature',
  data() {
    return {
      featureFrom: {
        status: 1
      },
      featureFromTemp: {},
      Projectrules: {
        title: [
          { required: true, message: '请输入故事标题', trigger: 'blur' }
        ],
        reportTo: [
          { required: true, message: '请输入负责人', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },

      // 文件
      profileOpen: false,
      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
      }, // 表头颜色加粗设置
      editfileList: [],
      onefileList: [],
      onefileId: '',
      allfileList: [],
      fileTotal: 0,
      // 获取文件列表
      fileParams: {
        pageNum: 1,
        pageSize: 10,
        type: 'Project',
        linkId: ''
      }
      // 文件

    }
  },
  computed: {
    ...mapGetters(
      {
        lang: state => state.header.lang
      }
    ),
    projectInfo() {
      return this.$store.state.user.userinfo
    }
  },
  created() {
    if (this.$route.query.id) {
      detailFeature(this.$route.query.id).then(res => {
        this.featureFrom = res.data
        this.featureFromTemp = Object.assign({}, this.featureFrom)
        this.fileParams.type = res.data.scope
        this.fileParams.linkId = res.data.id
      })
    } else {
      this.featureFrom.projectId = this.projectInfo.userUseOpenProject.projectId
      this.fileParams.linkId = this.projectInfo.userUseOpenProject.projectId
    }
  },
  mounted() {
  },
  methods: {
    // 重置表单
    resetFields() {
      this.featureFrom = {
        id: undefined,

        projectId: this.projectInfo.userUseOpenProject.projectId,
        title: undefined,
        description: undefined,
        status: 1,
        sprintId: undefined,
        reportTo: undefined,
        epic: undefined,
        version: undefined
        // fileList: []
      }
      this.$refs['featureFrom'].resetFields()
    },

    // 提交
    submitForm(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.featureFrom.id) {
            const param = formatChangedPara(this.featureFromTemp, this.featureFrom)
            param.projectId = this.featureFromTemp.projectId
            editFeature(param).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
                returntomenu(this, 1000)
              }
            }).catch(error => {
              console.log(error)
            })
          } else {
            addFeature(this.featureFrom).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
                this.resetFields()
                if (type) {
                  returntomenu(this, 1000)
                }
              } else {
                message('error', res.msg)
              }
            }).catch(error => {
              console.log(error)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 放弃并且返回
    giveupBack() {
      if (!this.featureFrom.id) {
        this.resetFields()
      }
      this.returntomenu(this)
    },
    // 上传
    // 新增file
    HandleUploadSelf(file) {
      const params = {
        type: this.fileParams.type,
        linkId: this.fileParams.linkId
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
    // 修改文件上传
    editRemove(file, fileList) {
      console.log('')
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
@import "index.scss";
</style>
