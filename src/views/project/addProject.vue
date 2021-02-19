<template>
  <div class="app-container add-form add-project">
    <el-form
      ref="projectFrom"
      :model="projectFrom"
      :rules="Projectrules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <div>
        <el-button
          v-if="!projectFrom.id"
          type="primary"
          round
          @click="submitForm('projectFrom', false)"
        >保存并新建</el-button>
        <el-button
          v-if="!projectFrom.id"
          type="primary"
          round
          @click="submitForm('projectFrom', true)"
        >保存并返回</el-button>
        <el-button
          v-if="projectFrom.id"
          type="primary"
          round
          @click="submitForm('projectFrom')"
        >确认修改</el-button>
        <el-button
          type="primary"
          round
          @click="giveupBack('projectFrom')"
        >放弃</el-button>
        <router-link v-if="!projectFrom.id" to="/admincenter/admincenter">
          <el-button type="text">{{
            $t("lang.PublicBtn.CreateCustomField")
          }}</el-button>
        </router-link>
      </div>
      <div class="form-box">
        <el-form-item :label="$t('lang.Project.ProjectTitle')" prop="title">
          <el-input v-model="projectFrom.title" size="small" maxlength="15" />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="状态" prop="status">
              <el-select
                v-model="projectFrom.status"
                placeholder="请选择项目状态"
                clearable
              >
                <el-option label="Progress" :value="1" />
                <el-option label="Closed" :value="0" />
                <el-option label="Plan" :value="2" />
              </el-select> </el-form-item></el-col>
          <el-col :span="8">
            <el-form-item
              :label="$t('lang.Project.ReportTo')"
              size="small"
              prop="reportToName"
            >
              <el-input
                v-model="projectFrom.reportToName"
                maxlength="15"
              /> </el-form-item></el-col>
          <el-col :span="8">
            <el-form-item
              size="small"
              :label="$t('lang.Project.Customer')"
              prop="customer"
            >
              <el-select
                v-model="projectFrom.customer"
                placeholder="请选择"
                clearable
              >
                <el-option label="暂无" value="" />
              </el-select> </el-form-item></el-col>
        </el-row>
        <el-form-item
          :label="$t('lang.Project.Description')"
          prop="description"
          size="small"
        >
          <el-input
            v-model="projectFrom.description"
            type="textarea"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </el-form-item>
      </div>
    </el-form>
    <div v-if="projectFrom.id" class="table">
      <el-upload
        class="upload-demo"
        action
        :http-request="HandleUploadSelf"
        multiple
        :file-list="allfileList"
      >
        <el-button size="small" type="primary">附件</el-button>
      </el-upload>
      <el-table
        ref="allfileList"
        :data="allfileList"
        :header-cell-style="tableHeader"
        stripe
        style="width: 100%; margin-top: 10px"
      >
        <el-table-column
          prop="fileName"
          :show-overflow-tooltip="true"
          align="center"
          label="文件名称"
        />
        <el-table-column prop="uploader" align="center" label="上传者" />

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
          :before-remove="editbeforeRemove"
          multiple
          :limit="1"
          :on-exceed="editExceed"
          :file-list="editfileList"
        >
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
import { mapGetters } from 'vuex'
import { addProjects, editProjects } from '@/api/project'
import { message, returntomenu, formData, formatChangedPara } from '@/utils/common'
import { addAttachment, fileList, deleteAttachment, updateAttachment } from '@/api/fileUpload'

export default {
  name: 'Addproject',
  data() {
    return {
      profileOpen: false,
      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
      }, // 表头颜色加粗设置
      disabled: false,
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
        type: 'Project',
        linkId: ''
      },
      projectFrom: {},
      projectFromTem: {},
      Projectrules: {
        title: [
          { required: true, message: '请输入项目标题', trigger: 'blur' }
        ],
        reportToName: [
          { required: true, message: '请输入负责人', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }

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
    this.projectFrom = JSON.parse(this.$route.query.info)
    if (this.projectFrom.id) {
      this.fileParams.type = this.projectFrom.scope
      this.fileParams.linkId = this.projectFrom.id
      this.projectFromTem = Object.assign({}, this.projectFrom)
      this.getfileList()
    }
  },
  mounted() {
  },
  methods: {
    // 重置表单
    resetFields() {
      this.projectFrom = {
        id: undefined,
        title: undefined,
        description: undefined,
        report: undefined,
        customer: undefined,
        status: undefined,
        fileList: []
      }
      this.$refs['projectFrom'].resetFields()
    },
    // 提交
    submitForm(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.projectFrom.id) {
            const param = formatChangedPara(this.projectFromTem, this.projectFrom)
            editProjects(param).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
                returntomenu(this, 1000)
              }
            }).catch(error => {
              console.log(error)
            })
          } else {
            addProjects(this.projectFrom).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
                this.resetFields()
                if (type) {
                  returntomenu(this, 1000)
                }
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
      if (!this.projectFrom.id) {
        this.resetFields()
      }
      this.returntomenu(this)
    },
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
@import "index.scss";
</style>
