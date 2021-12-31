<template>
  <div class="step-one">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item :label="dataStrorageList[0].groupLabelCN+':'" prop="dataStrorage">
        <el-radio-group v-model="form.dataStrorage">
          <el-radio v-for="item in dataStrorageList" :key="item.value" :label="item.value">{{ item.key }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="apiCallList[0].groupLabelCN+':'" prop="apiCall">
        <el-radio-group v-model="form.apiCall">
          <el-radio v-for="item in apiCallList" :key="item.value" :label="item.value">{{ item.key }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="serviceDurationList[0].groupLabelCN+':'" prop="serviceDuration">
        <el-radio-group v-model="form.serviceDuration">
          <el-radio v-for="item in serviceDurationList" :key="item.value" :label="item.value">{{ item.key }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="subscribtionList[0].groupLabelCN+':'" prop="subScription">
        <el-radio-group v-model="form.subScription">
        <el-radio
          v-for="item in subscribtionList"
          v-show="subscribtionObj[item.value]"
          :key="item.value"
          :label="item.value"
        >{{ item.key }}
        </el-radio>
        </el-radio-group>
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
import { systemConfigAPI } from '@/api/systemConfig'
export default {
  name: 'StepOne',
  props: {
    servicePlanUiList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      form: {
        dataStrorage: '',
        apiCall: '',
        serviceDuration: '',
        subScription: '',
        currentPrice: null,
        originalPrice: null
      },
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
        dataStrorage: [
          { required: true, message: '请选择数据存储', trigger: 'change' }
        ],
        apiCall: [
          { required: true, message: '请选择API请求', trigger: 'change' }
        ],
        serviceDuration: [
          { required: true, message: '请选择服务周期', trigger: 'change' }
        ],
        subScription: [
          { required: true, message: '请选择采购模式', trigger: 'change' }
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
    'form.dataStrorage': function(val) {
      this.calculateOrderPrice()
    },
    'form.apiCall': function(val) {
      this.calculateOrderPrice()
    },
    'form.serviceDuration': function(val) {
      this.form.subScription = ''
      this.form.currentPrice = ''
      this.form.originalPrice = ''
      this.changeServiceDuration()
      this.calculateOrderPrice()
    },
    'form.subScription': function(val) {
      this.calculateOrderPrice()
    }
  },
  created() {
    this.intServicePlanUi()
  },
  methods: {
    changeServiceDuration() {
      const that = this
      const serviceDuration = that.form.serviceDuration
      switch (serviceDuration) {
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
    async intServicePlanUi() {
      const that = this
      /* eslint-disable */
      _.forEach(that.servicePlanUiList, (item, key) => {
        if (item.group === 'DataStrorage') {
          that.dataStrorageList.push(item)
        } else if (item.group === 'APICall') {
          that.apiCallList.push(item)
        } else if (item.group === 'ServiceDuration') {
          that.serviceDurationList.push(item)
        } else if (item.group === 'Subscribtion') {
          that.subscribtionList.push(item)
        }
      })
    },
    // 服务计划-订单折扣模块
    async calculateOrderPrice() {
      const that = this
      const { apiCall, dataStrorage, subScription, serviceDuration } = { ...that.form };
      if (apiCall === '' || dataStrorage === '' || subScription === '' || serviceDuration === '') {
        return
      }
      const params = {
        'apiCall': apiCall,
        'dataStrorage': dataStrorage,
        'subScription': subScription,
        'serviceDuration': serviceDuration,
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
        this.$store.commit('common/setServicePlan', JSON.stringify(that.form))
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
