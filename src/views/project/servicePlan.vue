<template>
  <div class="service-plan">
    <el-form
      ref="servicePlanForm"
      :model="servicePlanForm"
      :rules="servicePlanForm"
      label-width="120px"
    >
      <el-form-item label="支付方式" prop="email" class="form-small">
        <el-radio v-model="from.isPrivate" label="0">仅自己</el-radio>
        <el-radio v-model="from.isPrivate" label="1">公开</el-radio>
        <el-radio v-model="from.isPrivate" label="1">公开</el-radio>
        <el-radio v-model="from.isPrivate" label="1">公开</el-radio>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { message } from '@/utils/common'
import { systemConfigAPI } from '@/api/systemConfig'

export default {
  name: 'ServicePlan',
  data() {
    return {

    }
  },
  methods: {
    // 服务计划
    async getServicePlanUi() {
      const res = await systemConfigAPI.getServicePlanUi()
      if (res.code === '200') {
        console.log('getServicePlanUi--', res)
      }
    }
  }
}
</script>

<style>
</style>
