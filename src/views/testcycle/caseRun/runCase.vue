
<template>
  
  <div class='project-container app-container'>
   <div class="container">
   <el-button style="width: 80px" type="primary" @click="changeVisible">运行列表</el-button>
   <el-button style="width: 80px" type="primary" @click="ToTestCycle">返回周期</el-button>
   <el-button style="width: 60px" @click="changetcaseListIndex(tcaseListIndex, 'up')" type="success">上个</el-button>
   <el-button style="width: 60px" @click="changetcaseListIndex(tcaseListIndex, 'next')" type="success">下个</el-button>
    
   <el-button @click="executeCase('1',tcaseInTcycleList[tcaseListIndex].testCase.id)" type="text" class="custom-button pass">通过All</el-button>
   <el-button @click="executeCase('2',tcaseInTcycleList[tcaseListIndex].testCase.id)" type="text" class="custom-button fail">失败&缺陷（自动）All</el-button>
   <el-button @click="executeCase('2',tcaseInTcycleList[tcaseListIndex].testCase.id)" type="text" class="custom-button fail">失败&缺陷 all </el-button>
   <el-button @click="executeCase('2',tcaseInTcycleList[tcaseListIndex].testCase.id)" type="text" class="custom-button fail">失败 all </el-button>
   <el-button @click="executeCase('4',tcaseInTcycleList[tcaseListIndex].testCase.id)" type="text" class="custom-button block">停滞 all </el-button>
   <el-button @click="executeCase('3',tcaseInTcycleList[tcaseListIndex].testCase.id)" type="text" class="custom-button skip">跳过 all</el-button>
   <el-button @click="executeCase('0',tcaseInTcycleList[tcaseListIndex].testCase.id)" type="text" class="custom-button NA">无效 all </el-button>
   
  </div>

  <div class="tcTitle">测试用例：{{tcaseInTcycleList[tcaseListIndex].testCase.title }}</div>

  <el-table :data="useCaseData">          
  <el-table-column prop="testStep" label="步骤">  </el-table-column>
  <el-table-column prop='teststepCondition' label="执行条件" >  </el-table-column>
  <el-table-column prop='testData' label="测试数据">          </el-table-column>
  <el-table-column prop='expectedResult' label="期待结果">          </el-table-column>
  <el-table-column label="运行结果">
      <template slot-scope="textarea">
            <el-input type="textarea" :rows="2" placeholder='请输入运行结果' v-model="textarea.row.actualResult"></el-input>
      </template>
  </el-table-column>
  <el-table-column label="执行">
     <template  slot-scope="scope">
        <el-button @click="executeStep(scope.$index, scope.row, $event)"  class="custom-button pass">通过</el-button> |
        <el-button @click="executeStep(scope.$index, scope.row, $event)" class="custom-button fail">失败</el-button> |
        <el-button @click="executeStep(scope.$index, scope.row, $event, tcaseInTcycleList[tcaseListIndex])" class="custom-button fail">失败&缺陷（自动）</el-button> |
        <el-button @click="executeStep(scope.$index, scope.row, $event)"  class="custom-button fail">失败&缺陷</el-button> |
          <el-drawer title="缺陷" :visible.sync="drawer" :with-header="false" size="50%" show-close="true"> <issue></issue>
            </el-drawer>
         <el-button @click="executeStep(scope.$index, scope.row, $event)"  class="custom-button block">停滞</el-button> |
         <el-button @click="executeStep(scope.$index, scope.row, $event)"  class="custom-button NA">无效</el-button> |
         <el-button @click="executeStep(scope.$index, scope.row, $event)"  class="custom-button skip">跳过</el-button>
      </template>
   </el-table-column>  
  </el-table>
 </div>

</template>



<script>
import { queryTestCaseStepApi } from '@/api/testcaseStep'
import { getListBytestCycle, caseStepRun } from '@/api/testcycle'
import Issue from '@/views/testcycle/caseRun/Issue.vue'
import { message } from '@/utils/common'

export default {
  name: 'useCase',
  components: { Issue },
  data() {
    return {
      visible: false,
      drawer: false,
      DrawerSearch: '测试用例表标 模糊查询',
      tcaseInTcycleList: [],
      tcaseListIndex: 0,

      // 测试步骤详情
      useCaseData: [{
        testStep: '',
        remarks: '',
        teststepCondition: '',
        testData: "",
        expectedResult: '',
        actualResult: '',
      }],
     
       
    }
  },
  created() {
    console.log("id", this.$route.query.id);
    queryTestCaseStepApi(this.$route.query.tableid).then((res) => {
      if (res.data !== null) {
        this.useCaseData = res.data
        res.data.forEach((item, index) => {
          this.useCaseData[index].testStep = item.testStep
          this.useCaseData[index].remarks = item.remarks
          this.useCaseData[index].teststepCondition = item.teststepCondition
          this.useCaseData[index].testData = item.testData
          this.useCaseData[index].expectedResult = item.expectedResult
        })
      }
    })
    getListBytestCycle({ testCycleId: this.$route.query.id }).then(res => {
      getListBytestCycle({ testCycleId: this.$route.query.id }, { pageNum: 1, pagSize: res.data.total }).then(res => {
        if (res.data !== null) {
          this.tcaseInTcycleList = res.data.list
          this.tcaseListIndex = res.data.list.every((item) => {
            return testCase.id == this.$route.query.tableid
          })
        }
      })
    })

  },
  computed: {
    showRecordList() {
      let list = []
      let length = this.recordList.length
      let n = length < 5 ? length : 5
      for (let i = 0; i < n; i++) {
        list.push(this.recordList[i])
      }
      length < 5 ? list.push('More') : null
      return list
    }
  },
  methods: {
  async executeCase(action,testCaseId) {
        const Row = {
        projectId: localStorage.getItem('projectId'),
        testCycleId: this.$route.query.id,
        testCaseId: testCaseId,
        testCaseStepId: '',  //empty always
        actualResult: '批量运行', // empty
        statusCode: action,
      };

      // Example of sending data to the backend using caseStepRun API
      await caseStepRun(Row)
        .then((res) => {
          if (res.code === '200') {
          console.log('Action performed:', action, res);
          message('success', res.msg)
          }            
         
        })
        .catch((error) => {
          console.error('Error performing action:', action, error);
          // Handle errors if necessary
        });
    },

    async executeStep(index, row, e, list) {
    const statusMap = {
        '无效': '0',
        '通过': '1',
        '失败': '2',
        '失败&缺陷（自动）': '2',
        '失败&缺陷': '2',
        '跳过': '3',
        '停滞': '4'
      };
      const statusCode = statusMap[e.target.innerText] || '';
      let Row = {
        "projectId": localStorage.getItem("projectId"),
        "testCycleId": this.$route.query.id,
        "testCaseId": row.testCaseId,
        "actualResult": row.actualResult ? row.actualResult : '',
        "testCaseStepId": row.id,
        "statusCode": `${statusCode}`
      }
      console.log('Pass按钮', index, row, list);
      if (e.target.innerText == '失败&缺陷（自动）') {
        Row = { ...Row, testCaseData: { ...list } }
      }
      await caseStepRun(Row).then(res => {   
        if (res.code === '200') {
          console.log("res-pass", 1, res);
          message('success', res.msg)
          }            
         
      })
      if (e.target.innerText == '失败&缺陷') {
        this.drawer = true
        console.log(this.dialogVisible);
      }
    },

    // 删除记录
    deleteRecord(index) {
      this.recordList.splice(index, 1)
    },
    // 按钮
    changetcaseListIndex(index, type) {

      switch (type) {
        case 'change':
          this.tcaseListIndex = index; break;
        case 'up':
          if (this.tcaseListIndex != 0) {
            this.tcaseListIndex -= 1
          }
          break;
        case 'next':
          if (this.tcaseListIndex < this.tcaseInTcycleList.length - 1) {
            this.tcaseListIndex += 1
          }
          break;
        default:
          break;
      }
      console.log('按钮', index, type, this.tcaseListIndex);
      queryTestCaseStepApi(this.tcaseInTcycleList[this.tcaseListIndex].testCase.id).then((res) => {
        if (res.data !== null) {
          this.useCaseData = res.data
          res.data.forEach((item, index) => {
            this.useCaseData[index].testStep = item.testStep
            this.useCaseData[index].remarks = item.remarks
            this.useCaseData[index].teststepCondition = item.teststepCondition
            this.useCaseData[index].testData = item.testData
            this.useCaseData[index].expectedResult = item.expectedResult
          })
        }
      })
    },
    ToTestCycle() {
      this.$router.push('/testcycle/testcycle')
    },
    changeVisible() {
      this.visible = !this.visible
      this.$router.back()
      localStorage.setItem('tabName', 'second')
    },

  },

}
</script>
<style scoped lang="scss">
@import "../index.scss";


.tcTitle{
  padding-bottom: 10px;
  font-size:medium
}

.container {
   display: flex; /* Use flexbox */
   justify-content: flex-start; /* Align items at the start of the container */
   gap: 1px; /* Gap between buttons */
   flex-wrap: wrap; /* Allow buttons to wrap when container width is insufficient */
   margin-bottom: 10px; /* Optional margin to separate from the table */
}
  .custom-button {    
    border: none; /* Remove button border */
    margin-right: 0px; /* Add some margin between buttons */
    padding: 0; /* Remove default padding */ 
    display: inline;
    justify-content: flex-start; /* Align items at the start of the container */  
  }
  .custom-button.pass {
    color: #207d03; /* Color for '通过' button */
  }
  .custom-button.fail {
    color: #ba060c; /* Color for '失败' button */
  }
  .custom-button.skip {
    color: #bf04cd; /* Color for '跳过' button */
  }
  .custom-button.NA {
    color: #6d7201; /* Color for '无效' button */
  }
  .custom-button.block {
    color:#72027a; /* Color for 'block' button */
  }
</style>
