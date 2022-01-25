<template>
  <div class="payment-details">
    <div class="title">分期付款</div>
    <el-table
      ref="installmentData"
      :data="installmentData"
      :header-cell-style="tableHeader"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="token_value" label="ID" />
      <el-table-column prop="expiration_time" label="支付截止日期" />
      <el-table-column prop="expiration_time" label="服务周期" />
      <el-table-column prop="expiration_time" label="支付方式" />
      <el-table-column prop="expiration_time" label="数据存储" />
      <el-table-column prop="expiration_time" label="API请求" />
      <el-table-column prop="expiration_time" label="采购模式" />
      <el-table-column prop="expiration_time" label="总计" />
      <el-table-column prop="expiration_time" label="本月折扣" />
      <el-table-column prop="expiration_time" label="实际支付" />
      <el-table-column prop="expiration_time" label="支付状态" />
      <el-table-column prop="expiration_time" label="发票" />
      <el-table-column prop="expiration_time" label="支付凭据" />
    </el-table>
    <pagination
      v-show="installmentTotal > 0"
      :total="installmentTotal"
      :page.sync="installment.pageNum"
      :limit.sync="installment.pageSize"
      @pagination="queryInstallment"
    />
    <div class="title">全款付款</div>
    <el-table
      ref="fullData"
      :data="fullData"
      :header-cell-style="tableHeader"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange2"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="token_value" label="ID" />
      <el-table-column prop="expiration_time" label="支付截止日期" />
      <el-table-column prop="expiration_time" label="服务周期" />
      <el-table-column prop="expiration_time" label="支付方式" />
      <el-table-column prop="expiration_time" label="数据存储" />
      <el-table-column prop="expiration_time" label="API请求" />
      <el-table-column prop="expiration_time" label="采购模式" />
      <el-table-column prop="expiration_time" label="总计" />
      <el-table-column prop="expiration_time" label="折扣" />
      <el-table-column prop="expiration_time" label="实际支付" />
      <el-table-column prop="expiration_time" label="支付状态" />
      <el-table-column prop="expiration_time" label="发票" />
      <el-table-column prop="expiration_time" label="支付凭据" />
    </el-table>
    <pagination
      v-show="fullTotal > 0"
      :total="fullTotal"
      :page.sync="full.pageNum"
      :limit.sync="full.pageSize"
      @pagination="queryFull"
    />
  </div>
</template>

<script>
export default {
  name: 'PaymentDetails',
  data () {
    return {
      tableHeader: {
        color: '#d4dce3',
        background: '#4286CD'
      },
      installmentData: [],
      installmentTotal: 10,
      installment: {
        pageNum: 1,
        pageSize: 10
      },
      multipleSelection: [],
      fullData: [],
      fullTotal: 10,
      full: {
        pageNum: 1,
        pageSize: 10
      },
      multipleSelection2: []
    }
  },
  methods: {
    // 分期多选
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 全款多选
    handleSelectionChange2 (val) {
      this.multipleSelection = val
    },
    queryInstallment () {
      console.log('queryInstallment---')
    },
    queryFull () {
      console.log('queryFull---')
    }
  }
}
</script>

<style lang="scss">
.payment-details {
  padding: 10px;
  padding-top: 0;
  .title {
    margin: 15px 0;
    font-size: 16px;
  }
}
</style>
