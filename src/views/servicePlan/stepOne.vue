<template>
  <div class="step-one">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="支付方式:" prop="PaymentType">
        <el-radio v-for="item in paymentTypeList" :key="item.value" v-model="form.PaymentType" :label="item.value">{{ item.key }}</el-radio>
      </el-form-item>
      <el-form-item label="数据存储:" prop="DataStrorage">
        <el-radio v-for="item in dataStrorageList" :key="item.value" v-model="form.DataStrorage" :label="item.value">{{ item.key }}</el-radio>
      </el-form-item>
      <el-form-item label="API 请求:" prop="APICall">
        <el-radio v-for="item in apiCallList" :key="item.value" v-model="form.APICall" :label="item.value">{{ item.key }}</el-radio>
      </el-form-item>
      <el-form-item label="服务周期:" prop="ServiceDuration">
        <el-radio v-for="item in serviceDurationList" :key="item.value" v-model="form.ServiceDuration" :label="item.value">{{ item.key }}</el-radio>
      </el-form-item>
      <el-form-item label="采购模式:" prop="Subscribtion">
        <el-radio
          v-for="item in subscribtionList"
          v-show="subscribtionObj[item.value]"
          :key="item.value"
          v-model="form.Subscribtion"
          :label="item.value"
        >{{ item.key }}
        </el-radio>
      </el-form-item>
      <el-form-item label="现价:" prop="currentPrice">
        {{ form.currentPrice }}元
      </el-form-item>
      <el-form-item label="原价:" prop="originalPrice">
        {{ form.originalPrice }}元
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" class="wd100 form-box" @click="next">下一步</el-button>
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
        PaymentType: '',
        DataStrorage: '',
        APICall: '',
        ServiceDuration: '',
        Subscribtion: '',
        currentPrice: null,
        originalPrice: null
      },
      paymentTypeList: [], // 支付方式
      dataStrorageList: [], // 数据存储
      apiCallList: [], // API 请求
      serviceDurationList: [], // 服务周期
      subscribtionList: [], // 采购模式
      subscribtionObj: {
        'Yearly': true,
        'Monthly': true,
        'Quarterly': true,
        'HalfYear': true,
        'All': true
      },
      rules: {
        PaymentType: [
          { required: true, message: '请选择支付方式', trigger: 'blur' }
        ],
        DataStrorage: [
          { required: true, message: '请选择数据存储', trigger: 'blur' }
        ],
        APICall: [
          { required: true, message: '请选择API请求', trigger: 'blur' }
        ],
        ServiceDuration: [
          { required: true, message: '请选择服务周期', trigger: 'blur' }
        ],
        Subscribtion: [
          { required: true, message: '请选择采购模式', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    projectUserInfo() {
      return this.$store.state.user.userinfo
    }
  },
  watch: {
    'form.DataStrorage': function(val) {
      this.calculateOrderPrice()
    },
    'form.APICall': function(val) {
      this.calculateOrderPrice()
    },
    'form.ServiceDuration': function(val) {
      this.form.Subscribtion = ''
      this.changeServiceDuration()
      this.calculateOrderPrice()
    },
    'form.Subscribtion': function(val) {
      this.calculateOrderPrice()
    }
  },
  created() {
    this.getServicePlanUi()
  },
  methods: {
    changeServiceDuration() {
      const that = this
      const ServiceDuration = that.form.ServiceDuration
      switch (ServiceDuration) {
        case 'Monthly':
          that.subscribtionObj.Monthly = false
          that.subscribtionObj.Yearly = false
          that.subscribtionObj.Quarterly = false
          that.subscribtionObj.HalfYear = false
          that.subscribtionObj.All = true
          break
        case 'Yearly':
          that.subscribtionObj.Monthly = true
          that.subscribtionObj.Yearly = false
          that.subscribtionObj.Quarterly = true
          that.subscribtionObj.HalfYear = true
          that.subscribtionObj.All = true
          break
        case 'Quarterly':
          that.subscribtionObj.Monthly = true
          that.subscribtionObj.Yearly = false
          that.subscribtionObj.Quarterly = false
          that.subscribtionObj.HalfYear = false
          that.subscribtionObj.All = true
          break
        case 'HalfYear':
          that.subscribtionObj.Monthly = true
          that.subscribtionObj.Yearly = false
          that.subscribtionObj.Quarterly = true
          that.subscribtionObj.HalfYear = false
          that.subscribtionObj.All = true
          break
        case 'Perpetual':
          that.subscribtionObj.Monthly = true
          that.subscribtionObj.Yearly = true
          that.subscribtionObj.Quarterly = true
          that.subscribtionObj.HalfYear = true
          that.subscribtionObj.All = false
          break
      }
    },
    // 服务计划
    async getServicePlanUi() {
      const that = this
      const res = await systemConfigAPI.getServicePlanUi()
      if (res.code === '200') {
        /* eslint-disable */
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
    // 服务计划-订单折扣模块
    async calculateOrderPrice() {
      const that = this
      const { APICall, DataStrorage, Subscribtion, ServiceDuration } = { ...that.form };
      if (APICall === '' || DataStrorage === '' || Subscribtion === '' || ServiceDuration === '') {
        return
      }
      const params = {
        'apiCall': APICall,
        'dataStrorage': DataStrorage,
        'subScription': Subscribtion,
        'serviceDuration': ServiceDuration,
        'userClass': that.projectUserInfo.userClass
      }
      const res = await systemConfigAPI.calculateOrderPrice(params)
      if (res.code === '200') {
        that.form.currentPrice = res.data.currentPrice
        that.form.originalPrice = res.data.originalPrice
      }
    },
    async next() {
      const that = this
      try {
        await that.$refs.form.validate()
        that.$emit('activeNum', 1)
      } catch (error) {
        console.log(error)
      }
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
