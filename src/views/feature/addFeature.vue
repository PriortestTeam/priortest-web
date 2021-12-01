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
        <el-form-item :label="$t('lang.Feature.FeatureTitle')" prop="title">
          <el-input v-model="featureFrom.title" maxlength="50" size="small" />
        </el-form-item>
        <el-row>
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
          <el-col :span="8">
            <el-form-item size="small" :label="$t('lang.CommonFiled.Version')" prop="version">
              <el-select
                v-model="featureFrom.version"
                placeholder="请选择版本"
                clearable
              >
               <el-option
                  v-for="item in versionsArr"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
                 <router-link
                  to="/admincenter/admincenter?par=versions"
                >
                <el-option label="添加新值" :value="0" />
                    </router-link>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="迭代周期" prop="sprintId">
              <el-select
                v-model="featureFrom.sprintId"
                filterable
                clearable
                remote
                reserve-keyword
                @change="getTag"
                placeholder="请选择迭代周期"
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
               <el-option
                  v-for="item in epicArr"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
               <router-link
                  to="/admincenter/admincenter?par=epic"
                >
                <el-option label="Add New Value" :value="0" />
                    </router-link>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="模块" prop="moudle">
              <el-select
                v-model="featureFrom.moudle"
                placeholder="请选择模块"
                clearable
              >
               <el-option
                  v-for="item in moudleArr"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
                <router-link
                  to="/admincenter/admincenter?par=moudle"
                >
                <el-option label="Add New Value" :value="0" />
                    </router-link>
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
      <div class="tag-box">
        <b>关联迭代周期列表</b>
        <el-tag
          v-for="tag in featureFrom.sprints"
          :key="tag.id"
          closable
          @close="removeTag(tag.id)"
          type="success"
        >
          {{ tag.title }}
        </el-tag>
        <div v-if="featureFrom.sprints.length === 0" class="nodata">
          暂无关联！
        </div>
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
import { sysCustomField } from "@/api/systemArr";

export default {
  name: 'Addfeature',
  components: {
    Upload
  },
  data() {
    return {
      optionsArr: [],
      getOptionsArr:['versions' ,'epic', 'moudle'],
      versionsArr:[],
      epicArr:[],
      moudleArr:[],
      loading: false,
      sprintArr: [],
      featureFrom: {
        sprintId: '',
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
        background: '#4286CD'
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
    this.getOptionsArr.forEach(element => {
       sysCustomField({ fieldName: element}).then((res) => {
        let data=res.data.mergeValues?res.data.mergeValues:[]
        if(element==='moudle'){
          this.moudleArr=data
        }
         if(element==='epic'){
          this.epicArr=data
        }
         if(element==='versions'){
          this.versionsArr=data
        }
    });

    });

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
    getTag() {
      //先看下标签sprints里面是否存在
      let haveIndex = this.featureFrom.sprints.findIndex(item => item.id === this.featureFrom.sprintId)
      if (haveIndex === -1) {
        let item = this.sprintArr.findIndex(item => item.id === this.featureFrom.sprintId)
        this.featureFrom.sprints.push(this.sprintArr[item])
      } else {
        message('error', '该迭代周期已选择')
      }
      this.featureFrom.sprintId = ''

    },
    removeTag(id) {
      let index = this.sprintArr.findIndex(item => item.id === id)
      this.featureFrom.sprints.splice(index, 1)
    },
    // 提交
    submitForm(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
.el-form {
  overflow: hidden;
  .form-box {
    float: left;
  }
  .tag-box {
    margin-left: 80px;
    float: left;
    .el-tag {
      margin-right: 20px;
    }
    .nodata {
      color: red;
      text-align: center;
    }
    b {
      margin-bottom: 20px;
      display: block;
      font-size: 12px;
      color: #4286CD;
    }
  }
}
</style>
