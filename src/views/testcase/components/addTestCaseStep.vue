<template>
  <div>
    <div class="mb-2">
      <el-button type="primary" @click="createRow">添加</el-button>
      <el-button type="primary" @click="addTestCaseStep">保存</el-button>
      <el-button type="danger" @click="clear">清空</el-button>
    </div>
    <el-table
      :data="testCaseStepTableData"
      border
      style="width: 100%"
    >
      <el-table-column fixed="left" label="操作" width="100">
        <template v-slot="scope">
          <el-button
            type="text"
            size="small"
            @click.native.prevent="deleteRow(scope.$index, testCaseStepTableData)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="testStep" label="步骤" width="200">
        <template v-slot="scope">
          <el-input v-model="scope.row.testStep" />
        </template>
      </el-table-column>
      <el-table-column prop="teststepCondition" label="测试条件" width="200">
        <template v-slot="scope">
          <el-input v-model="scope.row.teststepCondition" />
        </template>
      </el-table-column>
      <el-table-column prop="testData" label="测试数据" width="200">
        <template v-slot="scope">
          <el-input v-model="scope.row.testData" />
        </template>
      </el-table-column>
      <el-table-column prop="expectedResult" label="期待结果" width="200">
        <template v-slot="scope">
          <el-input v-model="scope.row.expectedResult" />
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注" width="200">
        <template v-slot="scope">
          <el-input v-model="scope.row.remarks" />
        </template>
      </el-table-column>
      <!--      <el-table-column prop="customFieldDatas" label="自定义字段值" width="200">-->
      <!--        <template v-slot="scope">-->
      <!--          <el-input v-model="scope.row.customFieldDatas"/>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>
  </div>

</template>

<script>
import { addTestCaseStepApi, queryTestCaseStepApi } from '@/api/testcaseStep'
import { message } from '@/utils/common'

export default {
  props: ['caseId'],
  data() {
    return {
      // 选择框
      checkedDetail: [],
      // 表格数据
      testCaseStepTableData: []
    }
  },
  created() {
    // 初始化数据
    this.queryTestCaseStep()
  },
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    clear() {
      this.testCaseStepTableData = []
    },
    createRow() {
      // 创建行
      var obj = {
        id: '',
        testCaseId: this.caseId,
        testStep: 'Step 1 description',
        teststepCondition: 'testStepCondition updtae ith id',
        testData: 'testData',
        expectedResult: 'result',
        remarks: 'testing tesxt',
        testStepId: 1,
        testStepExpand: {}
      }
      this.testCaseStepTableData.push(obj)
    },
    // 获取步骤列表
    queryTestCaseStep() {
      // console.log('测试用例ID' + this.caseId);
      queryTestCaseStepApi(this.caseId).then((res) => {
        if (res !== null) {
          this.testCaseStepTableData = res.data
        }
      })
    },
    // 保存步骤
    addTestCaseStep() {
      const caseStepList = {
        testCaseId: this.caseId,
        steps: this.testCaseStepTableData
      }
      addTestCaseStepApi(caseStepList).then((res) => {
        if (res.code === '200') {
          message('success', '保存成功')
        }
      })
    }
  }
}
</script>
