<template>
  <div class="signoff-container app-container">
    <el-form
      ref="from"
      :model="from"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
      label-position="left"
    >
      <div>
        <div class="set_btn_type set_btn_2" @click="createFile">
          {{ $t("lang.SignOff.Generate") }}
        </div>
      </div>
      <el-form-item label="项目" prop="scope" class="form-small">
        <el-select
          v-model="projectId"
          size="small"
          placeholder="请选择Project"
          disabled
          @change="getProjectInfo"
        >
          <el-option
            v-for="(item, index) in projectList"
            :key="index"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="发布版本" prop="scope" class="form-small">
        <el-row class="radiu">
          <el-radio-group v-model="version">
            <el-radio label="Latest Version">Latest Version</el-radio>
            <el-radio label="复选框 C">
              <el-select v-model="from.version" size="mini" placeholder="1.0">
                <el-option
                  v-for="(item, index) in projectVersionList.mergeValues"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-radio>
          </el-radio-group>
          <!-- <el-checkbox-group v-model="versionList">
            <el-checkbox label="Current Version" />
            <el-checkbox label="Latest Version" />
            <el-checkbox label="复选框 C">
              <el-select v-model="from.version" size="mini" placeholder="1.0">
                <el-option label="1.0" value="1.0" />
                <el-option label="2.0" value="2.0" />
              </el-select>
            </el-checkbox>
          </el-checkbox-group> -->
        </el-row>
      </el-form-item>
      <el-form-item label="测试环境" prop="scope" class="form-small">
        <el-row class="radiu">
          <el-select v-model="from.env" size="mini" placeholder="1.0">
            <el-option
              v-for="(item, index) in projectEnvList.mergeValues"
              :key="index"
              :label="item"
              :value="item"
            />
            <!-- <el-option label="PRO" value="2.0" /> -->
          </el-select>
        </el-row>
      </el-form-item>
      <el-form-item label="测试周期" prop="scope" class="form-small">
        <el-row class="radiu">
          <el-radio-group v-model="Testle">
            <el-radio label="Current Version">Current Version</el-radio>
            <el-radio label="复选框 C">
              <el-select
                v-model="from.testCycle"
                size="mini"
                placeholder="Version 1.0 - Regression"
              >
                <el-option
                  v-for="(item, index) in testCycleVersionList"
                  :key="index"
                  :label="item"
                  :value="item"
                  multiple
                />
                <!-- <el-option label="Version 2.0 - Regression" value="2.0" /> -->
              </el-select>
            </el-radio>
          </el-radio-group>
          <!-- <el-checkbox-group v-model="TestleList">
            <el-checkbox label="Current Version" />
            <el-checkbox label="Latest Version" />
            <el-checkbox label="复选框 C">
              <el-select
                v-model="from.testCycle"
                size="mini"
                placeholder="Version 1.0 - Regression"
              >
                <el-option label="Version 1.0 - Regression" value="1.0" />
                <el-option label="Version 2.0 - Regression" value="2.0" />
              </el-select>
            </el-checkbox>
          </el-checkbox-group> -->
        </el-row>
      </el-form-item>
      <el-form-item label="缺陷" prop="scope" class="form-small">
        <el-row>
          <el-row :span="4">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >全选</el-checkbox>
          </el-row>
          <el-checkbox-group
            v-model="lssueList"
            @change="handleCheckedCitiesChange"
          >
            <el-row :span="4">
              <el-checkbox label="修改" />
            </el-row>
            <el-row :span="4">
              <el-checkbox label="关闭" />
            </el-row>
            <el-row :span="4">
              <el-checkbox label="未分配" />
            </el-row>
            <el-row :span="4">
              <el-checkbox label="已分配" />
            </el-row>
            <el-row :span="4">
              <el-checkbox label="拒绝" />
            </el-row>
            <el-row :span="4">
              <el-checkbox label="已验证" />
            </el-row>
            <el-row :span="4">
              <el-checkbox label="验证成功" />
            </el-row>
            <el-row :span="4">
              <el-checkbox label="验证失败" />
            </el-row>
          </el-checkbox-group>
        </el-row>
      </el-form-item>

      <el-form-item label="签名" prop="scope" class="form-small">
        <!-- Signi-Upload -->
        <el-row v-if="signiList.length > 0" class="radiu">
          <el-radio-group v-model="from.fileUrl">
            <div v-for="(item, index) in signiList" :key="item.label" class="mb-2 signi">
              <el-radio :label="item">{{ item }}</el-radio>
              <i class="el-icon el-icon-error" @click="removeSigniList(index)" />
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getProjectEnv,
  getProjectVersion,
  getTestCycleVersion,
  createGenerate, getSignaturePath
} from '@/api/signoff.js'
import {
  queryForProjects
} from '@/api/project.js'
import UploadSigenatrue from '@/components/Upload/UploadSigenatrue.vue'
// 缺陷参数
const lssueList = [
  '修改',
  '关闭',
  '未分配',
  '已分配',
  '拒绝',
  '已验证',
  '验证成功',
  '验证失败'
]
export default {
  name: 'Dashboard',
  components: {
    UploadSigenatrue
  },
  data() {
    return {
      projectList: [],
      from: {
        env: '',
        testCycle: [],
        version: '',
        fileUrl: ''
      },
      rules: {},
      versionList: ['Current Version'],
      version: 'Latest Version',
      // TestleList: ['Current Version'],
      Testle: 'Current Version',
      // lssueList: ['', 'Fixed', 'Closed', 'Opend', 'Assigned', 'Rejected'],
      lssueList: [],
      signiList: [], // 签名列表
      signi: '',
      allLssueList: lssueList,
      isIndeterminate: true,
      checkAll: false,
      projectEnvList: [],
      projectVersionList: [],
      testCycleVersionList: [],
      projectId: ''
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
    // 从缓存中获取 projectId
    // const projectId = localStorage.getItem('projectId')
    // 测试id号
    this.projectId = localStorage.getItem('projectId')
    // 获取测试环境
    this.getSign()
    this.getProject()
    this.getProjectEnv()
    this.getProjectVersion()
    this.getTestCycleVersion()
  },
  methods: {
    handleCheckAllChange(val) {
      this.lssueList = val ? lssueList : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.allLssueList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.allLssueList.length
    },
    // 删除签名信息
    removeSigniList(i) {
      this.signiList.splice(i, 1)
    },
    // 上传签名
    // uploadSigni() {
    //   this.signiList.push({
    //     label: Math.floor(Math.random()*10000000),
    //     name: "签名" + Math.floor(Math.random()*10000000)
    //   });
    // },
    async createFile() {
      const data = {
        env: this.from.env,
        fileUrl: this.from.fileUrl,
        issue: this.lssueList.toString(),
        projectId: localStorage.getItem('projectId'),
        testCycleVersion: this.from.testCycle.length ? this.from.testCycle.toString() : this.Testle,
        version: this.from.version ? this.from.version : this.version
      }
      // const data = {
      //   env: '12',
      //   fileUrl:'/usr/oneclick/data/file/bdc1ff71-3f30-42d2-a073-a8df9d5281d4.txt',
      //   issue: this.lssueList.toString(),
      //   projectId: localStorage.getItem('projectId'),
      //   testCycleVersion:'1.0',
      //   version:'v1.0'
      // };
      console.log(this.signiList)
      console.log(data)
      const res = await createGenerate(data)
      console.log('res', res)
    },
    getImgUrl(url) {
      if (!url) return
      this.getSign()
    },
    async getProjectEnv() {
      const res = await getProjectEnv({ projectId: this.projectId })
      this.projectEnvList = res.data
    },
    async getProjectVersion() {
      const res = await getProjectVersion({ projectId: this.projectId })
      this.projectVersionList = res.data
    },
    async getTestCycleVersion() {
      const res = await getTestCycleVersion({ projectId: this.projectId, env: '12', version: 'v1.0' })
      this.testCycleVersionList = res.data
    },
    async getSign() {
      const res = await getSignaturePath()
      this.signiList = res.data
    },
    async getProject() {
      const res = await queryForProjects({
        pageNum: 1,
        pageSize: 10
      }, {})
      this.projectList = res.data
    },
    getProjectInfo() {
      this.getProjectEnv()
      this.getProjectVersion()
      this.getTestCycleVersion()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "index.scss";

.signi {
  display: flex;
  align-items: center;
}
</style>
