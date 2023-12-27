
<template>
  
  <div class='project-container app-container'>
   <div class="container">
   <el-button style="width: 80px" type="primary" @click="changeVisible">运行列表</el-button>
   <el-button style="width: 80px" type="primary" @click="ToTestCycle">返回周期</el-button>
   <el-button style="width: 60px" @click="changeDrawerindex(Drawerindex, 'up')" type="success">上个</el-button>
   <el-button style="width: 60px" @click="changeDrawerindex(Drawerindex, 'next')" type="success">下个</el-button>
    
   <el-button @click="handleCaseOperate('通过',DrawerList[Drawerindex].testCase.id)" type="text" class="custom-button pass">通过All</el-button>
   <el-button @click="handleCaseOperate('失败&缺陷（自动）',DrawerList[Drawerindex].testCase.id)" type="text" class="custom-button fail">失败&缺陷（自动）All</el-button>
   <el-button @click="handleCaseOperate('失败&缺陷',DrawerList[Drawerindex].testCase.id)" type="text" class="custom-button fail">失败&缺陷 all </el-button>
   <el-button @click="handleCaseOperate('失败',DrawerList[Drawerindex].testCase.id)" type="text" class="custom-button fail">失败 all </el-button>
   <el-button @click="handleCaseOperate('停滞',DrawerList[Drawerindex].testCase.id)" type="text" class="custom-button block">停滞 all </el-button>
   <el-button @click="handleCaseOperate('无效',DrawerList[Drawerindex].testCase.id)" type="text" class="custom-button NA">无效 all </el-button>
   <el-button @click="handleCaseOperate('跳过',DrawerList[Drawerindex].testCase.id)" type="text" class="custom-button skip">跳过 all</el-button>
  </div>

  <div class="tcTitle">{{DrawerList[Drawerindex].testCase.title }}</div>

  <el-table :data="useCaseData">          
  <el-table-column prop="testStep" label="步骤">  </el-table-column>
  <el-table-column prop='teststepCondition' label="执行条件" >  </el-table-column>
  <el-table-column prop='testData' label="测试数据">          </el-table-column>
  <el-table-column prop='expectedResult' label="期待结果">          </el-table-column>
  <el-table-column label="实际结果" class="table_column">
      <template slot-scope="textarea">
            <el-input type="textarea" :rows="2" placeholder="请输入运行结果" v-model="textarea.row.actualResult"></el-input>
      </template>
  </el-table-column>


  <el-table-column label="执行">
     <template  slot-scope="scope">
        <el-button @click="handleOperate(scope.$index, scope.row, $event)"  class="custom-button pass">通过</el-button> |
        <el-button @click="handleOperate(scope.$index, scope.row, $event)" class="custom-button fail">失败</el-button> |
        <el-button @click="handleOperate(scope.$index, scope.row, $event, DrawerList[Drawerindex])" class="custom-button fail">失败&缺陷（自动）</el-button> |
        <el-button @click="handleOperate(scope.$index, scope.row, $event)"  class="custom-button fail">失败&缺陷</el-button> |
          <el-drawer title="缺陷" :visible.sync="drawer" :with-header="false" size="50%" show-close="true"> <issue></issue>
            </el-drawer>
         <el-button @click="handleOperate(scope.$index, scope.row, $event)"  class="custom-button block">停滞</el-button> |
         <el-button @click="handleOperate(scope.$index, scope.row, $event)"  class="custom-button NA">无效</el-button> |
         <el-button @click="handleOperate(scope.$index, scope.row, $event)"  class="custom-button skip">跳过</el-button>
      </template>
   </el-table-column>  
  </el-table>
 </div>

</template>



<script>
import { queryTestCaseStepApi } from '@/api/testcaseStep'
import { getListBytestCycle, caseStepRun } from '@/api/testcycle'
import Issue from '@/views/testcycle/caseRun/Issue.vue'

export default {
  name: 'useCase',
  components: { Issue },
  data() {
    return {
      visible: false,
      drawer: false,
      DrawerSearch: '测试用例表标 模糊查询',
      DrawerList: [],
      Drawerindex: 0,

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
          this.DrawerList = res.data.list
          this.Drawerindex = res.data.list.every((item) => {
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
  async handleCaseOperate(action,testCaseId) {
      const statusMap = {
        '通过': '1',
        '失败': '2',
        '失败&缺陷（自动）': '2',
        '失败&缺陷': '2',
        '停滞': '4',
        '无效': '0',
        '跳过': '3',
      };

      const statusCode = statusMap[action] || '';
      const Row = {
        projectId: localStorage.getItem('projectId'),
        testCycleId: this.$route.query.id,
        testCaseId: testCaseId,
        "testCaseStepId": '',  //empty always
        actualResult: '批量运行', // empty
        statusCode: `${statusCode}`,
      };

      // Example of sending data to the backend using caseStepRun API
      await caseStepRun(Row)
        .then((res) => {
          console.log('Action performed:', action, res);
          // Handle the response from the API if needed
        })
        .catch((error) => {
          console.error('Error performing action:', action, error);
          // Handle errors if necessary
        });
    },

    async handleOperate(index, row, e, list) {
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
        console.log("res-pass", 1, res);
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
    changeDrawerindex(index, type) {

      switch (type) {
        case 'change':
          this.Drawerindex = index; break;
        case 'up':
          if (this.Drawerindex != 0) {
            this.Drawerindex -= 1
          }
          break;
        case 'next':
          if (this.Drawerindex < this.DrawerList.length - 1) {
            this.Drawerindex += 1
          }
          break;
        default:
          break;
      }
      console.log('按钮', index, type, this.Drawerindex);
      queryTestCaseStepApi(this.DrawerList[this.Drawerindex].testCase.id).then((res) => {
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
  font-size: 18px;
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
