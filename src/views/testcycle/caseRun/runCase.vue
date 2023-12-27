<template>
  <div class="all">
    <div class="Drawer" v-if="visible">
      <div class="title">用例列表</div>
      <div class="list">
        <div class="search">
          <el-input placeholder="请输入内容" v-model="DrawerSearch">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <template v-for="(item, index) in DrawerList">
          <div class="item" @click="changeDrawerindex(index, 'change')" :key="index"
            :style="{ backgroundColor: (Drawerindex == index ? '#eee' : '#fff') }">
            {{item }}
          </div>
        </template>
      </div>
    </div>

    <div class="content" >
      <div class="container">
          <el-button style="width: 80px" type="danger" @click="changeVisible">运行列表</el-button>
          <el-button style="width: 100px" type="danger" @click="ToTestCycle">返回测试周期</el-button>
          <el-button style="width: 60px" @click="changeDrawerindex(Drawerindex, 'up')" type="success">上个</el-button>
          <el-button style="width: 60px" @click="changeDrawerindex(Drawerindex, 'next')" type="success">下个</el-button>
          <el-button @click="handleCaseOperate('通过',DrawerList[Drawerindex].testCase.id)" type="text" class="custom-button passed">通过All</el-button>|
          <el-button @click="handleCaseOperate('失败&缺陷（自动）',DrawerList[Drawerindex].testCase.id)" type="text" class="custom-button fail">失败&缺陷（自动）All</el-button>|
          <el-button @click="handleCaseOperate('失败&缺陷',DrawerList[Drawerindex].testCase.id)" type="text" class="custom-button fail">失败&缺陷 all</el-button>|
          <el-button @click="handleCaseOperate('失败',DrawerList[Drawerindex].testCase.id)" type="text" class="custom-button fail">失败 all</el-button>|
          <el-button @click="handleCaseOperate('停滞',DrawerList[Drawerindex].testCase.id)" type="text" class="custom-button block">停滞 all</el-button>|
          <el-button @click="handleCaseOperate('无效',DrawerList[Drawerindex].testCase.id)" type="text" class="custom-button NA">无效 all</el-button>|
          <el-button @click="handleCaseOperate('跳过',DrawerList[Drawerindex].testCase.id)" type="text" class="custom-button skip">跳过 all</el-button>
     </div>
      <div class="table">
        <div class="table-title">{{DrawerList[Drawerindex].testCase.title }}</div>
        <el-table :header-cell-style="{ background: '#4286CD', color: '#fff' }" border :data="useCaseData"
          style="width: 100%">
          <el-table-column prop="testStep" label="步骤">  </el-table-column>
          <el-table-column prop='teststepCondition' label="执行条件">  </el-table-column>
          <el-table-column prop='testData' label="测试数据">          </el-table-column>
          <el-table-column prop='expectedResult' label="期待结果">          </el-table-column>
          <el-table-column label="实际结果">
            <template slot-scope="textarea">
                    <el-input type="textarea" :rows="2" placeholder="请输入运行结果" v-model="textarea.row.actualResult"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="执行" width="580">
            <template slot-scope="scope">
              <el-button @click="handleOperate(scope.$index, scope.row, $event)" type="text" class="custom-button pass">通过</el-button>|
              <el-button @click="handleOperate(scope.$index, scope.row, $event)" type="text" class="custom-button fail">失败</el-button>|
              <el-button @click="handleOperate(scope.$index, scope.row, $event, DrawerList[Drawerindex])" type="text" class="custom-button fail">失败&缺陷（自动）</el-button>|
              <el-button @click="handleOperate(scope.$index, scope.row, $event)" type="text" class="custom-button fail">失败&缺陷</el-button>|
              <el-drawer title="缺陷" :visible.sync="drawer" :with-header="false" size="50%" show-close="true"> <issue></issue>
              </el-drawer>
              <el-button @click="handleOperate(scope.$index, scope.row, $event)" type="text" class="custom-button block">停滞</el-button>
              <el-button @click="handleOperate(scope.$index, scope.row, $event)" type="text" class="custom-button NA">无效</el-button>|
              <el-button @click="handleOperate(scope.$index, scope.row, $event)" type="text" class="custom-button skip">跳过</el-button>
            </template>
          </el-table-column>
        </el-table>
</div>

    </div>
  </div>
</template>
<script>
import { queryTestCaseStepApi } from '@/api/testcaseStep'
import { getListBytestCycle, caseStepRun } from '@/api/testcycle'
import Issue from '@/views/testcycle/caseRun/Issue.vue'
import { get } from 'js-cookie';
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

      // 第一个table数据
      useCaseData: [{
        testStep: '',
        remarks: '',
        teststepCondition: '',
        testData: "",
        expectedResult: '',
        actualResult: '',
      }],
      inputSearch: '输入关联缺陷ID， 标题',
      recordList: ['第一条', '第二条', '第三条', '第四条', '第五条', '第六条', '第七条'], // 缺陷记录列表
      // 分页

      pageValue: '20',
      tableRadioDown: "1",
      HistoryData: [{
        Runner: 'Jun',
        TestCycle: 'test cycle 1 - title',
        ExecutionTime: '12/03/2022 12:00:00',
        Status: '失败',
        Issue: 'Issue 1： Issue 2:test, Issue 3'
      }, {
        Runner: 'John',
        TestCycle: 'test cycle 2 - title',
        ExecutionTime: '12/02/2022 12:00:00',
        Status: '失败',
        Issue: 'Issue 1, Issue 2:test'
      }, {
        Runner: 'John',
        TestCycle: 'test cycle 1 - title',
        ExecutionTime: '12/09/2021 12:00:00',
        Status: '失败',
        Issue: 'Issue 1： testing,Issue 2:test'
      }]
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
  .custom-button {
    color: #000; /* Default text color */
    border: none; /* Remove button border */
    margin-right: 0px; /* Add some margin between buttons */
    padding: 0; /* Remove default padding */
    font-size: 12px; /* Adjust font size */
    cursor: pointer; /* Show pointer on hover */
  }
  .custom-button.pass {
    color: #54BF34; /* Color for '通过' button */
  }
  .custom-button.fail {
    color: #ED1C24; /* Color for '失败' button */
  }
  .custom-button.skip {
    color: #EA3FF7; /* Color for '跳过' button */
  }
  .custom-button.NA {
    color: #774342; /* Color for '无效' button */
  }
  .custom-button.block {
    color:#3A083E; /* Color for 'block' button */
  }


.all {
  display: flex;
  width: 100%;
  height: 100%;

  .Drawer {
    background-color: #f2f2f2;
    width: 350px;
    height: 100%;
    border-right: 1px solid #ddd;
    padding-left: 10px;
    padding-top: 33px;

    .title {
      width: 100%;
      height: 40px;
      background-color: #D7D7D7;
      line-height: 40px;
      box-sizing: border-box;
      padding: 0 10px;
    }

    .list {
      width: 100%;
      height: 100%;
      background-color: #fff;
      border: 1px solid #ccc;
      border-right: none;
      box-sizing: border-box;
      padding: 15px 0 0 10px;

      .search {
        width: 250px;
        margin-bottom: 20px;
      }

      .item {
        line-height: 19px;
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 5px;
      }

      .item:hover {
        cursor: pointer;
      }
    }
  }

.container {
      display: flex; /* Use flexbox */
      justify-content: flex-start; /* Align items at the start of the container */
      gap: 5px; /* Gap between buttons */
      flex-wrap: wrap; /* Allow buttons to wrap when container width is insufficient */
      margin-bottom: 10px; /* Optional margin to separate from the table */
      }

  .content {
    padding: 1px 12px;
    background-color: #f2f2f2;

    .title {
      .title-up {
        margin-bottom: 3px;
      }
      .title-down {
        color: #A1A1A1;
        margin-bottom: 4px;
      }
    }
    }

    .table {
      .table-title {
        height: 20px;
        line-height: 20px;
     }
      .record {
        margin-left: 6px;
        margin-top: 20px;
        margin-bottom: 4px;

        .search {
          margin-bottom: 20px;
        }
        .recordList {
          .item {
            color: #A7B4C9;
            display: flex;
            align-items: center;
            font-size: 16px;
            line-height: 25px;

            .el-icon-error {
              font-size: 18px;
              color: #999999;
              margin-right: 5px;
            }
            .el-icon-error:hover {
              cursor: pointer;
            }
          }
        }
        .text {
          color: #A7B4C9;
          font-size: 16px;
          line-height: 21px;
        }
      }
      }

    .foot {
      .heard {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        align-items: center;

        .title {
          font-size: 14px;
          line-height: 18px;
        }

        .pageconfig {
          width: 550px;
          display: flex;
          align-items: center;

          .total {
            color: #61AEE2;
            margin-right: 20px;
          }

          .Radio {
            margin-left: 15px;
          }
        }
      }
    }

}
</style>
