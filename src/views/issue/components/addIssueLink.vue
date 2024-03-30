<template>
  <div>
    <div class="mb-2">
      <el-button type="primary" :disabled="DelRele" @click="handleRele">关联</el-button>
      <div class="test-text">
        <span>测试用例 </span>
        <el-autocomplete
          class="inline-input"
          v-model="testCaseTitle"
          :fetch-suggestions="testCaseIDSearch"
          placeholder="请输入用例 ID"
          :trigger-on-focus="false"
          @select="handleSelect"
          :clearable='true'
          style="width: 200px;"
        ></el-autocomplete>
      </div>
      <el-button type="primary" :disabled="DelReles" @click="handleDelRele">移除关联</el-button>

    </div>
    <el-table ref="issuelinklist" :data="issueLinkList" tooltip-effect="dark" style="width: 100%"
      @selection-change="handleSelectionChange" :header-cell-style="{ background: '#4286cd', color: '#f0e8e8' }">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column prop="targertId" label="测试用例">
        <template slot-scope="scope">
          <el-button slot="reference" type="primary" @click="handleShowId(scope.row.targetId)">{{ scope.row.targetId
          }}</el-button>
          <el-drawer title="标题" size="55%" :visible.sync="drawer" :with-header="false">
            <el-form ref="form" :model="testCaseData" label-width="140px" class="form">
              <el-form-item label="标题">
                <el-input v-model="testCaseData.title" disabled></el-input>
              </el-form-item>
              <el-form-item label="版本">
                <el-input v-model="testCaseData.version" disabled></el-input>
              </el-form-item>
              <el-form-item label="分类">
                <el-input v-model="testCaseData.caseCategory" disabled></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="testCaseData.description" disabled></el-input>
              </el-form-item>
              <el-form-item label="优先级">
                <el-input v-model="testCaseData.priority" disabled></el-input>
              </el-form-item>
              <el-form-item label="负责人">
                <el-input v-model="testCaseData.reportTo" disabled></el-input>
              </el-form-item>
              <el-form-item label="关联故事">
                <el-input v-model="testCaseData.feature" disabled></el-input>
              </el-form-item>
              <el-form-item label="测试数据">
                <el-input v-model="testCaseData.testData" disabled></el-input>
              </el-form-item>
              <el-form-item label="测试方法">
                <el-input v-model="testCaseData.testMethod" disabled></el-input>
              </el-form-item>
              <el-form-item label="用例状态">
                <el-input v-model="testCaseData.testStatus" disabled></el-input>
              </el-form-item>
              <el-form-item label="环境">
                <el-input v-model="testCaseData.env" disabled></el-input>
              </el-form-item>
              <el-form-item label="测试类型">
                <el-input v-model="testCaseData.testType" disabled></el-input>
              </el-form-item>
              <el-form-item label="testDevice">
                <el-input v-model="testCaseData.testDevice" disabled></el-input>
              </el-form-item>
              <el-form-item label="浏览器">
                <el-input v-model="testCaseData.browser" disabled></el-input>
              </el-form-item>
              <el-form-item label="外部ID">
                <el-input v-model="testCaseData.externalLinkId" disabled></el-input>
              </el-form-item>
              <el-form-item label="平台">
                <el-input v-model="testCaseData.platform" disabled></el-input>
              </el-form-item>
              <el-form-item label="测试条件">
                <el-input v-model="testCaseData.testCondition" disabled></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="testCaseData.remarks" disabled></el-input>
              </el-form-item>
              <el-form-item label="单选框测试">
                <el-radio v-model="radio" label="1" disabled>是</el-radio>
                <el-radio v-model="radio" label="0" disabled>否</el-radio>
              </el-form-item>
              <el-form-item label="数值型">
                <el-input v-model="numeric" disabled></el-input>
              </el-form-item>
              <el-form-item label="测试">
                <el-input v-model="test" disabled></el-input>
              </el-form-item>
              <el-form-item label="测试值">
                <el-input v-model="testingVluen" disabled></el-input>
              </el-form-item>
              <el-form-item label="故事必填">
                <el-input v-model="StoryRequired" disabled></el-input>
              </el-form-item>
              <el-form-item label="链接型字段">
                <el-input v-model="LinkedField" disabled></el-input>
              </el-form-item>
              <el-form-item label="多选项定义不是必填">
                <el-input v-model="multipleOptions" disabled></el-input>
              </el-form-item>
              <el-form-item label="测试日期类型">
                <el-input v-model="testDate" disabled></el-input>
              </el-form-item>
              <el-form-item label="链接下拉框">
                <el-input v-model="LinkDropdownBox" disabled></el-input>
              </el-form-item>
              <el-form-item label="用户列表">
                <el-input v-model="userList" disabled></el-input>
              </el-form-item>
              <el-form-item label="fsf">
                <el-input v-model="fsf" disabled></el-input>
              </el-form-item>
              <el-form-item label="复选框用例">
                <el-checkbox v-model="checkboxuseCase" disabled></el-checkbox>
              </el-form-item>
              <el-form-item label="">
                <el-table :data="testCaseData.testCaseStepList" fit style="width: 100%">
                  <el-table-column prop="testStep" label="步骤" width="180">
                  </el-table-column>
                  <el-table-column prop="teststepCondition" label="执行条件" width="180">
                  </el-table-column>
                  <el-table-column prop="testData" label="测试数据">
                  </el-table-column>
                  <el-table-column prop="expectedResult" label="期待结果">
                  </el-table-column>
                  <el-table-column prop="remarks" label="备注">
                  </el-table-column>
                  <!-- <el-table-column label="自定义字段">
                    <span>缺陷必填</span> <el-input v-model="teststepExpand[0].valueData" disabled></el-input>
                    <span>自定义字段</span><el-checkbox v-model="checkboxuseCase"></el-checkbox>
                  </el-table-column> -->
                </el-table>
              </el-form-item>
            </el-form>
          </el-drawer>
          <!-- <el-popover placement="right" width="700" trigger="click"> -->



          <!-- </el-popover> -->

        </template>
      </el-table-column>
      <el-table-column prop="Action" label="操作" show-overflow-tooltip>
        <template slot-scope="scope"><el-button type="primary" @click="handleDelReles(scope.row.id)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>

import { issueLinkList, issueLinkDelete, issueLinkSave, issueLinkIdList, testCaseSerach } from '@/api/issue'
import addPossibleValue from '@/views/issue/components/addPossibleValue.vue'

import { Empty } from 'element-ui'

import { relativeTimeThreshold } from 'moment'


export default {
  components: { addPossibleValue },
  props: ['caseId'],
  data() {
    return {
      issueLinkList: [],
      issueLinkSelection: [],
      testCaseTitle: '',
      testCaseID: '',
      addPossibleValueVisible: false,
      DelRele: false,
      DelReles: false,
      testCaseData: {},
      drawer: false,
      radio: '1',
      numeric: '',
      test: '',
      testingVluen: '',
      StoryRequired: '',
      LinkedField: '',
      multipleOptions: '',
      testDate: '',
      LinkDropdownBox: '',
      userList: '',
      fsf: '',
      checkboxuseCase: ''

    }
  },
  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo
    },

  },
  created() {
    //
    this.getIssueLinkList()
  },
  mounted() {

    //

  },
  methods: {
    //获取列表
    getIssueLinkList() {
      let objectId = this.$route.query.id
      let params = {
        "category": "ISSUE_TEST_CASE", "objectId": objectId, "targetId": ""
      }
      issueLinkList(
        params
      ).then(res => {
        if (res.code === '200') {
          console.log("linklist", res.data.list);
          this.issueLinkList = res.data.list
        }
      })
    },
    //关联测试用例
    handleRele() {
      let objectId = this.$route.query.id
      let targetId = this.testCaseID
      let category = "ISSUE_TEST_CASE"
      if (targetId.length) {

        this.DelRele = true;

      }
      else {
        this.DelRele = false
        return
      }
      let params = {
        "category": category, "objectId": objectId, "targetId": targetId
      }
      issueLinkSave(params).then(res => {
        if (res.code === '200') {
          this.$message({
            message: '关联成功',
            type: 'success'
          });
          this.testCaseTitle = ''
          this.testCaseID = ''
          this.getIssueLinkList()
        }
      })
    },
    // 移除关联
    handleDelRele() {

      let ids = this.issueLinkSelection.map(item => item.id)
      if (ids.length) {
        this.DelReles = true;
      }
      else {
        this.DelReles = false;
        return
      }
      issueLinkDelete({
        ids
      }).then(res => {
        if (res.code === '200') {
          this.$message({
            message: '移除成功',
            type: 'success'
          });
          this.getIssueLinkList()
        }
      })
    },

    // 显示用例列表数据
    handleShowId(id) {
      console.log("id", id);
      issueLinkIdList({
        id
      }).then(res => {
        if (res.code === '200') {
          this.drawer = true
          this.testCaseData = res.data
          this.testCaseData.testcaseExpand = JSON.parse(res.data.testcaseExpand)
          this.radio = res.data.testcaseExpand.attributes[0].valueData.toString()
          this.numeric = this.testCaseData.testcaseExpand.attributes[1].valueData
          this.test = this.testCaseData.testcaseExpand.attributes[2].valueData
          this.testingVluen = this.testCaseData.testcaseExpand.attributes[3].valueData
          this.StoryRequired = this.testCaseData.testcaseExpand.attributes[4].valueData
          this.LinkedField = this.testCaseData.testcaseExpand.attributes[5].valueData
          this.multipleOptions = this.testCaseData.testcaseExpand.attributes[6].valueData
          this.testDate = this.testCaseData.testcaseExpand.attributes[7].valueData
          this.LinkDropdownBox = this.testCaseData.testcaseExpand.attributes[10].valueData
          this.userList = this.testCaseData.testcaseExpand.attributes[11].valueData
          this.fsf = this.testCaseData.testcaseExpand.attributes[12].valueData
          this.checkboxuseCase = this.testCaseData.testcaseExpand.attributes[13].valueData ? true : false

          //自定字段
          //   this.testCaseData.testCaseStepList.forEach((item) => {
          //     item.teststepExpand = JSON.parse(item.teststepExpand)
          //   })
          //   console.log("-------", this.testCaseData.testCaseStepList[0].teststepExpand);
        }
      })
    },
    // 移除关联
    handleDelReles(id) {
      let ids = [`${id}`]
      issueLinkDelete({
        ids
      }).then(res => {
        if (res.code === '200') {
          this.$message({
            message: '移除成功',
            type: 'success'
          });
          this.getIssueLinkList()
        }
      })
    },

    // 选择变化
    handleSelectionChange(val) {
      this.issueLinkSelection = val;
    },
    //搜索输入用例
    testCaseIDSearch (title, cb) {
      if (!title)  return
      testCaseSerach({
        title,
        projectId: this.projectInfo.userUseOpenProject.projectId
      }).then(res => {
        if (res.code == '200') {
          let results = [{ value: '暂无数据' }]
          if (res.data.length) {
            this.DelRele = false
            results = res.data.map(item => { return { ...item, value: item.title } })
          }
          else {
            this.DelRele = true
          }
          // 调用 callback 返回建议列表的数据
          cb(results);
        }
      })
    },
    // 选择用例关联
    handleSelect (item) {
      this.testCaseID = item.id
      console.log(item,this.testCaseID,'item---');
     }
  }


}
</script>
<style lang="scss" scoped>
@import '../index.scss';

.mb-2 {
  .el-button {
    width: 8vw;
    margin-bottom: 10px;
    background: rgb(66, 134, 205);
  }

  .test-text {
    margin-bottom: 50px;

  }

}
</style>
