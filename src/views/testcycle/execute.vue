<template>
  <div class="table app-container">
    <el-button type="text" @click="refresh">刷新</el-button>
    <el-table
      ref="stepData"
      :data="stepData"
      :header-cell-style="tableHeader"
      stripe
      style="width: 100%"
    >
      <el-table-column type="index" align="center" label="序号">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="step"
        label="步骤"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="status"
        label="状态"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.status === 2
              ? '通过'
              : scope.row.status === 1
                ? '不通过'
                : '暂无'
          }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="testDate" label="测试时间" align="center" />
      <el-table-column
        prop="expectedResult"
        label="预计结果"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="actualResult"
        label="实际结果"
        :show-overflow-tooltip="true"
        align="center"
      />

      <el-table-column label="操作(修改状态)" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            class="table-btn"
            @click.stop="action(scope.row, 2)"
          >通过
          </el-button>
          <el-button
            type="text"
            class="table-btn"
            @click.stop="action(scope.row, 1)"
          >不通过
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="stepDataToatl > 0"
      :total="stepDataToatl"
      :page.sync="stepQuery.pageNum"
      :limit.sync="stepQuery.pageSize"
      @pagination="getTestStep"
    />
  </div>
</template>
<script>
import { testCaseStep } from '@/api/testcase'
import { executeTestCase } from '@/api/testcycle'
import { message } from '@/utils/common'

export default {
  name: 'Execute',
  data() {
    return {
      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
      }, // 表头颜色加粗设置
      testCaseId: '', // 传过来的周期下面步骤的id
      testCycleId: '', // 传过来的周期的id

      stepQuery: { pageNum: 1, pageSize: 10 },
      stepData: [],
      stepDataToatl: 0

    }
  },
  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo
    }
  },

  created() {
    this.testCaseId = this.$route.query.id
    this.testCycleId = this.$route.query.testCycleId
    this.getTestStep()
  },
  methods: {
    getTestStep() {
      return new Promise((resolve, reject) => {
        testCaseStep(this.stepQuery, {
          testCaseId: this.testCaseId
        }).then(res => {
          resolve(res)
          this.stepData = res.data
          this.stepDataToatl = res.total
        })
      })
    },
    async refresh() {
      const res = await this.getTestStep()
      console.log(res)
      if (res.code === '200') {
        message('success', '刷新成功')
      }
    },
    inputValidatorInput(value) {
      return value !== '' && value.replace(/(^\s*)|(\s*$)/g, '') !== ''
    },

    action(row, num) {
      this.$prompt('', '请输入实际结果', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: this.inputValidatorInput,
        inputType: 'textarea',
        inputPlaceholder: '请填写实际结果',
        inputErrorMessage: '请填写实际结果'
      }).then(({ value }) => {
        const data = {
          testCaseId: row.testCaseId,
          testCycleId: this.testCycleId,
          testCaseStepId: row.id,
          stepStatus: num,
          actualResult: value
        }
        executeTestCase(data).then(res => {
          if (res.code === '200') {
            message('success', res.msg)
            this.getTestStep()
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
