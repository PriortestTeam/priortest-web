<template>
  <div class="service-plan">
    <el-steps :active="active" align-center finish-status="success">
      <el-step title="服务计划" />
      <el-step title="支付方式" />
      <el-step title="用户信息" />
    </el-steps>
    <keep-alive>
      <StepOne v-if="active === 0 && servicePlanUiList.length > 0" v-bind="$attrs" :service-plan-ui-list="servicePlanUiList" @activeNum="activeNum" v-on="$listeners" />
      <StepTwo v-if="active === 1" v-bind="$attrs" :service-plan-ui-list="servicePlanUiList" @activeNum="activeNum" v-on="$listeners" />
      <StepThree v-if="active === 2" v-bind="$attrs" @activeNum="activeNum" v-on="$listeners" />
    </keep-alive>
  </div>
</template>

<script>
import StepOne from '@/views/servicePlan/stepOne'
import StepTwo from '@/views/servicePlan/stepTwo'
import StepThree from '@/views/servicePlan/stepThree'
import { systemConfigAPI } from '@/api/systemConfig'
export default {
  name: 'ServicePlan',
  components: {
    StepOne,
    StepTwo,
    StepThree
  },
  data () {
    return {
      active: 0,
      servicePlanUiList: []
    }
  },
  created () {
    this.getServicePlanUi()
  },
  methods: {
    // 服务计划
    async getServicePlanUi () {
      const that = this
      const res = await systemConfigAPI.getServicePlanUi()
      if (res.code === '200') {
        that.servicePlanUiList = res.data
        that.active = 0
        /* eslint-disable */
        /* _.forEach(res.data, (item, key) => {
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
        }) */
      }
    },
    activeNum(num) {
      this.active = num
      console.log('this.active---', this.active)
    }
  }
}
</script>

<style lang="scss">
  .service-plan {
    width: 70%;
    margin-left: 15%;
    margin-top: 10px;
    .el-steps {
      margin-bottom: 20px;
    }
  }
</style>
