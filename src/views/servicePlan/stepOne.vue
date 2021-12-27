<template>
  <div class="step-one">
    <el-form
      ref="form"
      :model="form"
      :rules="form"
      label-width="120px"
    >
      <el-form-item label="支付方式" class="form-small">
        <el-radio v-for="(item, i) in paymentTypeList" :key="item.key" v-model="form.paymentType[i]" :label="item.key">{{ item.value }}</el-radio>
      </el-form-item>
      <el-form-item label="数据存储" class="form-small">
        <el-radio v-for="(item, i) in dataStrorageList" :key="item.key" v-model="form.dataStrorage[i]" :label="item.key">{{ item.value }}</el-radio>
      </el-form-item>
      <el-form-item label="API 请求" class="form-small">
        <el-radio v-for="(item, i) in apiCallList" :key="item.key" v-model="form.apiCall[i]" :label="item.key">{{ item.value }}</el-radio>
      </el-form-item>
      <el-form-item label="服务周期" class="form-small">
        <el-radio v-for="(item, i) in serviceDurationList" :key="item.key" v-model="form.serviceDuration[i]" :label="item.key">{{ item.value }}</el-radio>
      </el-form-item>
      <el-form-item label="采购模式" class="form-small">
        <el-radio v-for="(item, i) in subscribtionList" :key="item.key" v-model="form.subscribtion[i]" :label="item.key">{{ item.value }}</el-radio>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="next" class="wd100 form-box">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { message } from '@/utils/common'
import { systemConfigAPI } from '@/api/systemConfig'
export default {
  name: 'StepOne',
  data() {
    return {
      form: {
        paymentType: [],
        dataStrorage: [],
        apiCall: [],
        serviceDuration: [],
        subscribtion: [],
      },
      paymentTypeList: [], //支付方式
      dataStrorageList: [], //数据存储
      apiCallList: [], //API 请求
      serviceDurationList: [], //服务周期
      subscribtionList: [] //采购模式
    }
  },
  created() {
    this.getServicePlanUi()
  },
  methods: {
    // 服务计划
    async getServicePlanUi() {
      const that = this
      const res = await systemConfigAPI.getServicePlanUi()
      if (res.code === '200') {
        console.log('getServicePlanUi--', res)
        _.forEach(res.data, (item, key) => {
          if (item.group === 'PaymentType') {
            that.paymentTypeList.push(item)
          } else if (item.group === 'DataStrorage') {
            that.dataStrorageList.push(item)
          } else if (item.group === 'APICall') {
            that.apiCallList.push(item)
          } else if (item.group === 'ServiceDuration') {
            that.serviceDurationList.push(item)
          } else if (item.group === 'Subscribtion') {
            that.subscribtionList.push(item)
          }
        })
      }
    },
    next() {
      this.$emit('activeNum', 1)
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
  .step-one {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    .el-form {
      width: 60%;
    }
  }
</style>
