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
            {{ item }}
          </div>
        </template>
      </div>
    </div>
    <div class="content" :style="{ width: (visible ? '1560px' : '1902px') }">
      <div class="title">
        <div class="title-up">
          <el-button style="width: 100px" type="danger" @click="changeVisible">用例执行列表</el-button>
        </div>
        <div class="title-down">
          <el-button style="width: 100px" type="danger" @click="ToTestCycle">返回测试周期</el-button>
          <el-button style="width: 70px" @click="changeDrawerindex(Drawerindex, 'up')" type="success">上个</el-button>
          <el-button style="width: 60px" @click="changeDrawerindex(Drawerindex, 'next')" type="success">下个</el-button>
          <el-button type="text" style="color: #64C9A1">通过</el-button>|
          <el-button type="text" style="color: #DF3D66">失败&缺陷（自动）</el-button>|
          <el-button type="text" style="color: #FF0000">失败&缺陷（手动）</el-button>|
          <el-button type="text" style="color: #FF0000">失败</el-button>|
          <el-button type="text" style="color: #CC00FF">停滞</el-button>|
          <el-button type="text" style="color: #FF6600">无效</el-button>
          <el-button type="text" style="color: #FF6600">跳过</el-button>
        </div>
      </div>
      <div class="table">
        <div class="table-title">{{ DrawerList[Drawerindex].testCase.title }}</div>
        <el-table :header-cell-style="{ background: '#4286CD', color: '#fff' }" border :data="useCaseData"
          style="width: 100%">
          <el-table-column prop="testStep" label="步骤">
          </el-table-column>
          <el-table-column prop="remarks" label="备注">
          </el-table-column>
          <el-table-column prop='teststepCondition' label="执行条件">
          </el-table-column>
          <el-table-column prop='testData' label="测试数据">
          </el-table-column>
          <el-table-column prop='expectedResult' label="期待结果">
          </el-table-column>
          <el-table-column label="实际结果">
            <template slot-scope="textarea">
              <el-input type="textarea" :rows="2" placeholder="请输入结果" v-model="textarea.row.actualResult"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="执行" width="530">
            <template slot-scope="scope">
              <el-button @click="handleOperate(scope.$index, scope.row, $event)" type="text" style="color: #64C9A1">通过</el-button>|
              <el-button @click="handleOperate(scope.$index, scope.row, $event)" type="text" style="color: #FF0000">失败</el-button>|
              <el-button @click="handleOperate(scope.$index, scope.row, $event, DrawerList[Drawerindex])" type="text" style="color: #DF3D66">失败&缺陷（自动）</el-button>|
              <el-button @click="handleOperate(scope.$index, scope.row, $event)" type="text" style="color: #FF0000">失败&缺陷</el-button>|
              <el-drawer title="缺陷" :visible.sync="drawer" :with-header="false" size="50%" show-close="true"> <issue></issue>
              </el-drawer>
              <el-button @click="handleOperate(scope.$index, scope.row, $event)" type="text" style="color: #CC00FF">停滞</el-button>
              <el-button @click="handleOperate(scope.$index, scope.row, $event)" type="text" style="color: #FF6600">无效(NA)</el-button>|
              <el-button @click="handleOperate(scope.$index, scope.row, $event)" type="text" style="color: #FF0000">跳过</el-button>
            </template>

          </el-table-column>
        </el-table>
        <div class="record">
          <div class="search">
            <el-input style="width: 310px" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="inputSearch">
            </el-input>
          </div>
          <div class="recordList">
            <template v-for=" (item, index) in showRecordList">
              <div class="item" :key="index">33333
                <i class="el-icon-error" @click="deleteRecord(index)"></i>
                <span v-if="index == 0" style="color: #4286CD">{{ item }}</span>
                <span v-else>{{ item }}</span>
              </div>
            </template>
          </div>
          <div class="text">最多显示 5条缺陷记录</div>
        </div>
      </div>
      <div class="foot">
        <div class="heard">
          <div class="title">执行记录：显示历次执行记录， 以执行时间排列在前</div>
          <div class="pageconfig">
            <div class="total">Total 5 / 100</div>
            <el-select v-model="pageValue">
              <el-option v-for="item in pageList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <div class="Radio">
              <el-radio-group v-model="tableRadioDown">
                <el-radio label="1">{{ "" }}</el-radio>
                <el-radio label="2">{{ "" }}</el-radio>
                <el-radio label="3">{{ "" }}</el-radio>
                <el-radio label="4">{{ "" }}</el-radio>
                <el-radio label="5">{{ "" }}</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="table">
          <el-table :header-cell-style="{ background: '#4286CD', color: '#fff' }" border :data="HistoryData"
            style="width: 100%">
            <el-table-column type="index">
            </el-table-column>
            <el-table-column prop="Runner" label="执行人">
            </el-table-column>
            <el-table-column prop='TestCycle' label="测试周期">
            </el-table-column>
            <el-table-column label="执行时间" prop="ExecutionTime">
            </el-table-column>
            <el-table-column prop="Status" label="执行状态">
            </el-table-column>
            <el-table-column label="关联缺陷" width="530" prop="Issue">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { queryTestCaseStepApi } from '@/api/testcaseStep'
import { getListBytestCycle, passInstance } from '@/api/testcycle'
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
    async handleOperate(index, row, e, list) {
      let indexs = e.target.innerText == '通过' ? 1 : e.target.innerText == '失败' || e.target.innerText == '失败&缺陷（自动）' || e.target.innerText == '失败&缺陷' ? 2 : e.target.innerText == '停滞' ? 4 : e.target.innerText == '无效(NA)' ? 0 : ''``
      let Row = {
        "projectId": localStorage.getItem("projectId"),
        "testCycleId": this.$route.query.id,
        "testCaseId": row.testCaseId,

        "testStep": row.testStep,
        "expectedResult": row.expectedResult,
        "actualResult": row.actualResult ? row.actualResult : '',
        "testData": row.testData,
        "remarks": row.remarks,
        "testStepId": row.testStepId,
        "testStepNo": row.id,
        "teststepExpand": row.teststepExpand,
        "teststepCondition": row.teststepCondition,
        "statusCode": `${indexs}`
      }
      console.log('Pass按钮', index, row, list);
      if (e.target.innerText == '失败&缺陷（自动）') {
        Row = { ...Row, testCaseData: { ...list } }
      }
      await passInstance(Row).then(res => {
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
.all {
  display: flex;

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

  .content {
    ::v-deep .el-input .el-input__inner {
      border: 0;
    }

    padding: 5px 14px;
    background-color: #f2f2f2;

    .title {
      .title-up {
        margin-bottom: 3px;
      }

      .title-down {
        color: #A1A1A1;
        margin-bottom: 16px;
      }
    }

    .table {
      width: 100%;

      .table-title {

        height: 20px;
        line-height: 20px;
        // margin-bottom: 10px;
      }

      .record {
        margin-left: 6px;
        margin-top: 80px;
        margin-bottom: 44px;

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
}
</style>
