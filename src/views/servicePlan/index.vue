<template>
  <div class="service-plan">
    <el-steps :active="active" align-center finish-status="success">
      <el-step title="服务计划" />
      <el-step title="用户信息" />
    </el-steps>
    <keep-alive>
      <StepOne v-if="active === 0" v-bind="$attrs" @activeNum="activeNum" v-on="$listeners" />
      <StepTwo v-if="active === 1" v-bind="$attrs" @activeNum="activeNum" v-on="$listeners" />
    </keep-alive>
  </div>
</template>

<script>
import StepOne from '@/views/servicePlan/stepOne'
import StepTwo from '@/views/servicePlan/stepTwo'
export default {
  name: 'ServicePlan',
  components: {
    StepOne,
    StepTwo
  },
  data() {
    return {
      active: 0
    }
  },
  methods: {
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
