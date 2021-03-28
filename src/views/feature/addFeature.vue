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
          >保存并新建</el-button
        >
        <el-button
          v-if="!featureFrom.id"
          type="primary"
          round
          @click="submitForm('featureFrom', true)"
          >保存并返回</el-button
        >
        <el-button
          v-if="featureFrom.id"
          type="primary"
          round
          @click="submitForm('featureFrom')"
          >确认修改</el-button
        >
        <el-button type="primary" round @click="giveupBack('featureFrom')"
          >放弃</el-button
        >
        <router-link v-if="!featureFrom.id" to="/admincenter/admincenter">
          <el-button type="text">{{
            $t("lang.PublicBtn.CreateCustomField")
          }}</el-button>
        </router-link>
      </div>
      <div class="form-box">
        <el-form-item label="故事标题" prop="title">
          <el-input v-model="featureFrom.title" maxlength="50" size="small" />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="开发周期" prop="sprintId">
              <el-select
                v-model="featureFrom.sprintId"
                filterable
                clearable
                multiple
                remote
                reserve-keyword
                placeholder="请选择开发周期"
                :remote-method="remoteMethod"
                :loading="loading"
              >
                <el-option
                  v-for="item in sprintArr"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                >
                </el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item size="small" label="版本" prop="version">
              <el-select
                v-model="featureFrom.version"
                placeholder="请选择版本"
                clearable
              >
                <el-option label="Add New Value" value="" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="负责人" size="small" prop="reportTo">
              <el-select
                v-model="featureFrom.reportTo"
                filterable
                remote
                reserve-keyword
                placeholder="请选择负责人"
                clearable
                :remote-method="remoteReport"
                :loading="loading"
              >
                <el-option
                  v-for="item in optionsArr"
                  :key="item.id"
                  :label="item.userName"
                  :value="item.userName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="EPIC" prop="epic">
              <el-select
                v-model="featureFrom.epic"
                placeholder="请选择epic"
                clearable
              >
                <el-option label="Add New Value" value="" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="模版" prop="moudle">
              <el-select
                v-model="featureFrom.moudle"
                placeholder="请选择模版"
                clearable
              >
                <el-option label="Add New Value" value="" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          :label="$t('lang.Project.Description')"
          prop="description"
          size="small"
        >
          <el-input
            v-model="featureFrom.description"
            type="textarea"
            maxlength="1000"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 8 }"
          />
        </el-form-item>
      </div>
    </el-form>
    <div class="table" v-if="featureFrom.id">
      <Upload :linkId="featureFrom.id" :type="featureFrom.scope" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Upload from '@/components/Upload'
import { queryByNameSubUsers } from '@/api/project'
import { addFeature, detailFeature, editFeature, querySprintList } from '@/api/feature'
import { message, returntomenu, formatChangedPara } from '@/utils/common'

export default {
  name: 'Addfeature',
  components: {
    Upload
  },
  data() {
    return {
      optionsArr: [],
      loading: false,
      sprintArr: [],
      featureFrom: {
        sprintId: [],
        sprints: []
      },
      featureFromTemp: {
      },
      Projectrules: {
        title: [
          { required: true, message: '请输入故事标题', trigger: 'blur' }
        ],
        reportTo: [
          { required: true, message: '请输入负责人', trigger: 'blur' }
        ],
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
        this.featureFrom.sprintId.filter(item => {
          this.featureFrom.sprints.push({ id: item })
        })
        this.featureFrom = res.data
        this.featureFrom.sprintId = res.data.sprints.map(item => item.id)
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
        moudle: undefined,
        sprintId: [],
        sprints: [],
        reportTo: undefined,
        epic: undefined,
        version: undefined
        // fileList: []
      }
      this.$refs['featureFrom'].resetFields()
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          querySprintList({ title: query }).then(res => {
            this.sprintArr = res.data
          })
        }, 200);
      } else {
        this.sprintArr = [];
      }
    },
    remoteReport(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          queryByNameSubUsers({ subUserName: query }).then(res => {
            this.optionsArr = res.data
          })
        }, 200);
      } else {
        this.optionsArr = [];
      }
    },
    // 提交
    submitForm(formName, type) {

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.featureFrom.sprintId.filter(item => {
            this.featureFrom.sprints.push({ id: item })
          })
          delete this.featureFrom.sprintId
          if (this.featureFrom.id) {
            const param = formatChangedPara(this.featureFromTemp, this.featureFrom)
            param.projectId = this.featureFrom.projectId
            param.sprints = this.featureFrom.sprints
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

  }

}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
