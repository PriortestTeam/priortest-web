<template>
  <div class="signoff-container">
    <el-card>
      <el-form ref="createForm" :model="from" :rules="rules" label-width="100px" class="demo-ruleForm"
        label-position="left">
        <div>
          <div v-loading="createLoading" class="set_btn_type set_btn_2" @click="createFile">
            {{ $t("lang.SignOff.Generate") }}
          </div>
        </div>
        <el-form-item label="项目" prop="scope" class="form-small">
        <el-select v-model="projectId" size="small" @change="getProjectInfo" disabled :style="{ width: '130px' }">
        <el-option v-for="(item, index) in projectList" :key="index" :label="item.title" :value="item.id" />
        </el-select>
        </el-form-item>
        <el-form-item label="版本" prop="version" class="form-small">
          <el-row class="radiu">
            <el-radio-group v-model="baseInfo.version" @change="versionTypeChange">
              <el-radio :label="true">最新版本({{LatestVersion}})</el-radio>
              <el-radio :label="false">
                <el-select v-model="from.version" size="mini" placeholder="测试版本" :disabled="baseInfo.version === true"
                  @change="versionChange">
                  <el-option v-for="(value, key) in projectVersionList" :key="key" :label="value" :value="value" />
                </el-select>
              </el-radio>
            </el-radio-group>
          </el-row>
        </el-form-item>
        <el-form-item label="环境" prop="env" class="form-small">
          <!-- <el-row class="radiu"> -->
          <el-select v-model="from.env" size="mini" placeholder="选择环境" @change="envChange">
            <el-option v-for="(value, key) in projectEnvList" :key="key" :label="value" :value="value" />
          </el-select>
          <!-- </el-row> -->
        </el-form-item>
        <el-form-item label="周期" prop="testCycle" class="form-small">
          <el-row class="radiu">
            <el-radio-group v-model="baseInfo.testCycle" @change="cycleTypeChange">
              <el-radio label="curentReleaseVersion">当前版本</el-radio>
              <el-radio :label="false">
                <el-select v-model="from.testCycle" size="mini" placeholder="测试周期标题"
                  :disabled="baseInfo.testCycle === 'curentReleaseVersion'" multiple>
                  <el-option v-for="(item, index) in testCycleTitleList" :key="index" :label="item.title"
                    :value="item.title" multiple />
                </el-select>
              </el-radio>
            </el-radio-group>
          </el-row>
        </el-form-item>
    
        <el-form-item label="缺陷" prop="issue" class="form-small">
          <el-row>
            <el-row :span="4">
              <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
            </el-row>
            <el-checkbox-group v-model="from.issue" @change="issueChecked">
              <el-checkbox v-for="(item, index) in issues" :key="index" :label="item" :value="item.title" />
            </el-checkbox-group>
          </el-row>
        </el-form-item>

        <el-form-item label="签名" prop="fileUrl" class="form-small">
          <!-- Signi-Upload -->
          <el-row v-if="signiList.length > 0" class="radiu">
            <el-radio-group v-model="from.fileUrl">
              <!-- <el-radio
                v-for="(item, index) in signiList"
                :key="index"
                :label="item.file_path"
              >{{ item.uuid_file_name }}
                <i
                  class="el-icon el-icon-error"
                  @click.stop="removeSigniList(index)"
                /></el-radio> -->
              <div v-for="(item, index) in signiList" :key="index" class="mb-2 signi" style="height: 22px">
                <el-radio :label="item.file_path">{{
                  item.uuid_file_name
                }}</el-radio>
                <i class="el-icon el-icon-error" @click="removeSigniList(item)" />
              </div>
            </el-radio-group>
          </el-row>
          <!-- <div class="set_btn_type set_btn_3" @click="uploadSigni">上传签名</div> -->
          <UploadSigenatrue @getImgUrl="getImgUrl" />
          <!-- <div class="signForm">
           <el-radio-group v-model="from.fileUrl">
    <el-radio :label="3">备选项</el-radio>
    <el-radio :label="6">备选项</el-radio>
    <el-radio :label="9">备选项</el-radio>
  </el-radio-group>
        </div> -->
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div class="pdf-list">
        <div class="pdf-title">签收记录</div>
        <el-empty v-if="records.length <= 0" description="暂无签收记录" />
        <div v-for="(item, index) in records" :key="item.id" class="pdf-name">
          {{ index + 1 }}.
          <el-button type="text" @click="lookPdf(item)">{{
            item.fileName
          }}</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getProjectListByUser,
  getProjectEnv,
  getProjectVersion,
  getIssueList,
  getTestCycleTitle,
  createGenerate,
  getSignaturePath,
  getRecord,
  deleteSign
} from '@/api/signoff.js'

import UploadSigenatrue from '@/components/Upload/UploadSigenatrue.vue'
import { getLastVersion } from '@/utils/compareVersion.js'

export default {
  name: 'Dashboard',
  components: {
    UploadSigenatrue
  },
  data() {
    return {
      createLoading: false,
      searchFrom: {
        verison: '',
        env: '',
        testCycle: ''
      },
      baseInfo: {
        version: true,
        env: true,
        testCycle: 'curentReleaseVersion'
      },
      lastVersion: '',
      currentCycle: '',
      projectList: [],
      from: {
        env: '',
        testCycle: [],
        version: '',
        fileUrl: '',
        issue: []
      },
      rules: {
        version: [
          {
            required: true, validator: (rule, val, callback) => {
              if (!val && this.baseInfo.version === false) {
                callback(new Error('请选择发布版本'))
              } else {
                callback()
              }
            }, message: '请选择发布版本', trigger: 'blur'
          }
        ],
        env: [
          { required: true, message: '请选择测试环境', trigger: 'blur' }
        ],
        testCycle: [
          {
            required: true, validator: (rule, val, callback) => {
              if ((!val || val.length <= 0) && this.baseInfo.testCycle !== 'curentReleaseVersion') {
                callback(new Error('请选择测试周期'))
              } else {
                callback()
              }
            }, message: '请选择测试周期', trigger: 'blur'
          }
        ],
        fileUrl: [
          { required: true, message: '请选择签名', trigger: 'blur' }
        ],
        issue: [
          { required: true, message: '请选择缺陷', trigger: 'blur' }
        ]
      },
      issues: [],
      signiList: [], // 签名列表
      signi: '',
      isIndeterminate: true,
      checkAll: false,
      projectEnvList: [],
      projectVersionList: [],
      testCycleTitleList: [],
      projectId: '',
      records: []
    }
  },
  computed: {
    ...mapGetters([
      'name',
      {
        lang: state => state.header.lang
      }
    ])
  },
  async mounted() {
    const loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
      target: document.querySelector('.app-main')
    })
    // 从缓存中获取 projectId
    // const projectId = localStorage.getItem('projectId')
    // 测试id号
    this.projectId = localStorage.getItem('projectId')
    // 获取测试环境
    try {
      await this.getProjectListByUser()
      await this.getIssueList()

      await this.getProjectEnv()
      await this.getProjectVersion()
      await this.getTestCycleVersion()
      await this.getSign()
      await this.recordList()
    } catch (err) {
      console.log(err)
    }
    loading.close()
  },
  created() {
  // Assuming getTestCycleTitle is an async function that fetches the data
  this.getTestCycleTitle();
},
  methods: {
    // 查看pdf
    lookPdf(file) {
      this.$message.warning('敬请期待')
      // window.open('http://124.71.142.223:8082' + file.filePath)
    },
    // 发布版本类型切换
    versionTypeChange(val) {
      this.baseInfo.verison = val
      if (val === true) {       
        this.searchFrom.verison = this.lastVersion
        this.from.version = ''
      } else {
        this.from.version = this.searchFrom.version = this.projectVersionList.mergeValues ? this.projectVersionList.mergeValues[0] : ''
      
      }
      this.getTestCycleVersion()
    },
    // 下拉框切换版本
    versionChange(val) {
      this.searchFrom.verison = val
      this.getTestCycleTitle()

    },
    // 测试环境下拉切换
    envChange(val) {
      this.searchFrom.env = val
      this.from.env = val
      this.getTestCycleTitle()
    },
    // 测试周期切换
    cycleTypeChange(val) {
      if (val === 'curentReleaseVersion') {
        this.baseInfo.testCycle = 'curentReleaseVersion'
        this.searchFrom.testCycle = 'curentReleaseVersion'
      } else {
        this.baseInfo.testCycle = false
        this.from.testCycle = this.searchFrom.testCycle = this.testCycleVersionList.mergeValues ? this.testCycleVersionList.mergeValues[0] : ''
      }
      this.getTestCycleVersion()
    },
    handleCheckAllChange(val) {
      this.from.issue = val ? this.issues.map(item => item.title) : [];
      this.isIndeterminate = false;
    },
    issueChecked(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.issues.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.issues.length
    },
    // 删除签名信息
    async removeSigniList(val) {
      const loading = this.$loading({
        lock: true,
        text: '正在删除',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await deleteSign({ fileId: val.id })
        loading.close()
        if (res.code === '200') {
          this.$message.success('删除成功')
        }
      } catch (err) {
        console.log(err)
        loading.close()
      }
      this.getSign()
    },
    // 上传签名
    // uploadSigni() {
    //   this.signiList.push({
    //     label: Math.floor(Math.random()*10000000),
    //     name: "签名" + Math.floor(Math.random()*10000000)
    //   });
    // },
    createFile() {
      this.createLoading = true
      this.$refs.createForm.validate(async (valid) => {
        if (valid) {
          try {
            const data = {
              env: this.from.env,
              fileUrl: this.from.fileUrl,
              issue: this.from.issue.join(','),
              projectId: localStorage.getItem('projectId'),
              testCycle: this.baseInfo.testCycle === 'curentReleaseVersion' ? 'curentReleaseVersion=1' : this.from.testCycle.join(','),
              version: this.baseInfo.version ? this.lastVersion : this.from.version
            }
            const res = await createGenerate(data)
            if (res.code === '200') {
              this.$message.success('生成成功')
              await this.getProjectListByUser()
              await this.getIssueList()
              await this.getProjectEnv()
              await this.getProjectVersion()
              await this.getTestCycleVersion()
              await this.getSign()
              await this.recordList()
            }
          } catch (err) {
            console.log(err)
          }
          console.log('success')
        }
      })
      this.createLoading = false
    },
    getImgUrl(url) {
      if (!url) return
      this.getSign()
    },
    async getProjectEnv() {
      const res = await getProjectEnv({ projectId: this.projectId })
      const possibleValueString = res.data[0].possible_value;
      this.projectEnvList = JSON.parse(possibleValueString);

      //this.from.env = this.projectEnvList.mergeValues[0] || ''
      //this.baseInfo.env = this.projectEnvList.mergeValues[0] || ''
      //this.searchFrom.env = this.projectEnvList.mergeValues[0] || ''
    },

    async getIssueList() {
      const res = await getIssueList({ projectId: this.projectId })
      const possibleValueString = res.data[0].possible_value;
      this.issues = JSON.parse(possibleValueString);
    },

  async getProjectVersion() {
      const res = await getProjectVersion({ projectId: this.projectId })
      const possibleValueString = res.data[0].possible_value;
      this.projectVersionList = JSON.parse(possibleValueString);
    },

    async getTestCycleTitle() {
      //this.from.testCycle = []
      try{
      const res = await getTestCycleTitle({ projectId: this.projectId, env: this.searchFrom.env, version: this.baseInfo.version ? this.lastVersion : this.from.version })
      //this.testCycleTitleList = res.data || []
      this.testCycleTitleList = res.data.titles;
    }
      catch (error) {
      console.error('Error fetching test cycle titles:', error);
    }
    },
    async getSign() {
      const res = await getSignaturePath()
      this.signiList = res.data
      this.from.fileUrl = res.data[0] ? res.data[0].file_path : ''
    },
    async getProjectListByUser() {
      const res = await getProjectListByUser()
      this.projectList = res.data
    },


    getProjectInfo() {
      this.getProjectEnv()
      this.getIssueList()
      this.getTestCycleTitle()
      this.getProjectVersion()
    },

    async recordList() {
      this.records = []
      try {
        const res = await getRecord()
        if (res.code === '200') {
          this.records = res.data
        } else {
          this.records = []
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss">
@import "index.scss";

.signoff-container {
  width: 100%;
  height: calc(100vh - 61px);
  flex: 1;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 15px;

  .el-card {
    height: 100%;
    overflow: auto;
  }

  .el-card:nth-of-type(1) {
    height: 100%;
    flex: 1;
  }

  .el-card:nth-of-type(2) {
    width: 30%;
    margin-left: 20px;
  }

  .pdf-list {
    width: 100%;

    .pdf-title {
      font-size: 16px;
      color: #5f6e8e;
      font-weight: bold;
      margin-bottom: 15px;
    }

    .pdf-name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.signi {
  display: flex;
  align-items: center;

  &>i {
    display: none;
  }

  &:hover {
    &>i {
      display: inline-block;
    }
  }
}
</style>
