<template>
  <div class="project-container app-container">
    <el-button style="width: 80px" type="primary" @click="goBack"> 用例列表</el-button>
    <el-button style="width: 60px" type="primary">上个</el-button>
    <el-button style="width: 60px" type="primary">下个</el-button>

    <el-button @click="executeCase($event,'通过')" class='custom-button pass'>通过</el-button>
    <el-button @click="executeCase($event,'失败')" class='custom-button fail'>失败</el-button>
    <el-button @click="executeCase($event,'缺陷(自动)')" class='custom-button fail'>缺陷(自动)</el-button>
    <el-button @click="executeCase($event,'缺陷')" class='custom-button fail'>缺陷</el-button>
    <el-button @click="executeCase($event,'停滞')" class='custom-button block'>停滞</el-button>
    <el-button @click="executeCase($event,'跳过')" class='custom-button skip'>跳过</el-button>
    <el-button @click="executeCase($event,'无效')" class='custom-button NA'>无效</el-button>

    <div style="font-size: medium; padding-top: 20px; padding-bottom: 20px;">测试用例：{{ testCaseTitle }}</div>

    <el-table :data="dataList">
      <el-table-column prop="testStep" label="步骤"> </el-table-column>
      <el-table-column prop="teststepCondition" label="执行条件"> </el-table-column>
      <el-table-column prop="testData" label="测试数据"> </el-table-column>
      <el-table-column prop="expectedResult" label="期待结果"> </el-table-column>
      <el-table-column label="运行结果">
        <template slot-scope="textarea">
          <el-input type="textarea" :rows="2" placeholder='actualResult' v-model="textarea.row.actualResult"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="执行">
        <template slot-scope="scope">
          <el-button @click="executeStep('通过', scope.row)" class="custom-button pass">通过</el-button> |
          <el-button @click="executeStep('失败', scope.row)" class="custom-button fail">失败</el-button> |
          <el-button @click="executeStep('缺陷(自动)', scope.row)" class="custom-button fail">缺陷(自动)</el-button> |
          <el-button @click="executeStep('缺陷', scope.row)" class="custom-button fail">缺陷</el-button> |
          <el-button @click="executeStep('停滞', scope.row)" class="custom-button block">停滞</el-button> |
          <el-button @click="executeStep('跳过', scope.row)" class="custom-button skip">跳过</el-button> |
          <el-button @click="executeStep('无效', scope.row)" class="custom-button NA">无效</el-button>

        </template>
      </el-table-column>

    </el-table>

  </div>
</template>


<script>
import { caseStepRun } from '@/api/testcycle'
import { message } from '@/utils/common'

export default {

  data() {
    return {
      testCaseId: this.dataList[0].testCaseId,
      testCaseStepId: this.dataList[0].testCaseStepId,
      testCycleId: this.dataList[0].testCycleId,
      runCount:this.dataList[0].runCount,
    }
  },

  methods: {
    goBack() {
      this.$router.back(); // Navigates back to the previous page

    },
    async executeCase(event, action) {
      try {
      const statusMap = {
        '无效': '0',
        '通过': '1',
        '失败': '2',
        '缺陷(自动)': '2',
        '缺陷': '2',
        '跳过': '3',
        '停滞': '4'
      };
      const statusCode = statusMap[action] || '';
      const Row = {
        projectId: localStorage.getItem('projectId'),
        testCycleId: this.testCycleId,
        testCaseId: this.testCaseId,
        "testCaseStepId": '',  //empty always
        actualResult: '批量运行', // empty
        statusCode: `${statusCode}`,      
      };
      // Example of sending data to the backend using caseStepRun API
      const res = await caseStepRun(Row);
      if (res.code === '200') {
      console.log('Action performed:', action, res);
      message('success', res.msg);
      } else {
      console.error('Error performing action:', action, res);
      // Handle the response from the API if needed
      message('error', res.msg || 'Failed to perform action');
      }
  }  catch (error) {
    console.error('Error performing action:', action, error);
    // Handle errors if necessary
    message('error', 'An error occurred while performing the action');
      }
  },
  
  async executeStep(action, row) {
  try {
    const statusMap = {
      '无效': '0',
      '通过': '1',
      '失败': '2',
      '缺陷(自动)': '2',
      '缺陷': '2',
      '跳过': '3',
      '停滞': '4'
    };
    const statusCode = statusMap[action];
    if (!statusCode) {
      console.error('Invalid action:', action);
      // Handle invalid action if necessary
      return;
    }
    const Row = {
      projectId: localStorage.getItem('projectId'),
      testCycleId: this.testCycleId,
      testCaseId: this.testCaseId,
      testCaseStepId: row.testCaseStepId,
      actualResult: row.actualResult ? row.actualResult : '',
      statusCode: statusCode,
      runCount: this.runCount,
    };

    // Example of sending data to the backend using caseStepRun API
    const res = await caseStepRun(Row);

    if (res.code === '200') {
      console.log('Action performed:', action, res);
      message('success', res.msg);
    } else {
      console.error('Error performing action:', action, res);
      // Handle the response from the API if needed
      message('error', res.msg || 'Failed to perform action');
    }
  } catch (error) {
    console.error('Error performing action:', action, error);
    // Handle errors if necessary
    message('error', 'An error occurred while performing the action');
  }
}




  },

  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    testCaseTitle: {
      type: String,
      default: () => ""
    }
  },
  mounted() {
    console.log('Received dataList:', this.dataList, this.testCaseTitle);

  }


};
</script>

<style scoped lang="scss">
@import "../index.scss";

.custom-button {
  color: #e4dfdf;
  /* Default text color */
  border: none;
  /* Remove button border */
  margin-right: 0px;
  /* Add some margin between buttons */
  padding: 0;
  /* Remove default padding */
  font-size: 12px;
  /* Adjust font size */
  cursor: pointer;
  /* Show pointer on hover */
  display: inline;
}

.custom-button.pass {
  color: #54BF34;
  /* Color for '通过' button */
}

.custom-button.fail {
  color: #ED1C24;
  /* Color for '失败&缺陷（自动）' button */
}

.custom-button.skip {
  color: #EA3FF7;
  /* Color for '失败&缺陷（自动）' button */
}

.custom-button.NA {
  color: #774342;
  /* Color for '失败&缺陷（自动）' button */
}

.custom-button.block {
  color: #3A083E;
  /* Color for '失败&缺陷（自动）' button */
}
</style>
