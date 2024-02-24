<template>
  <div>
    <div class="mb-2">
      <el-button type="primary" @click="handleRele">关联</el-button>
      <div class="test-text"><span>测试用例 </span><el-input v-model="testCaseID" placeholder="请输入用例 ID"
          style="width: 200px;" /></div>
      <el-button type="primary" @click="handleDelRele">移除关联</el-button>

    </div>
    <el-table ref="issuelinklist" :data="issueLinkList" tooltip-effect="dark" style="width: 100%"
      @selection-change="handleSelectionChange" :header-cell-style="{ background: '#4286cd', color: '#f0e8e8' }">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column prop="targertId" label="测试用例">
        <template slot-scope="scope">{{ scope.row.targetId }}</template>
      </el-table-column>
      <el-table-column prop="Action" label="操作" show-overflow-tooltip>
        <template slot-scope="scope"><el-button type="primary" @click="handleDelReles(scope.row.id)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>

import { issueLinkList, issueLinkDelete, issueLinkSave } from '@/api/issue'
import addPossibleValue from '@/views/issue/components/addPossibleValue.vue'

import { Empty } from 'element-ui'


export default {
  components: { addPossibleValue },
  props: ['caseId'],
  data() {
    return {
      issueLinkList: [],
      issueLinkSelection: [],
      testCaseID: '',
      addPossibleValueVisible: false,
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
    //
    handleRele() {
      let objectId = this.$route.query.id
      let targetId = this.testCaseID
      let category = "ISSUE_TEST_CASE"
      let extJson = ""
      let id = ""
      let params = {
        "category": category, "objectId": objectId, "targetId": targetId
      }
      issueLinkSave(params).then(res => {
        if (res.code === '200') {
          this.$message({
            message: '关联成功',
            type: 'success'
          });
          this.getIssueLinkList()
        }
      })
    },
    // 移除关联
    handleDelRele() {
      let ids = this.issueLinkSelection.map(item => item.id)
      console.log("ids", ids);
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
    //

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
