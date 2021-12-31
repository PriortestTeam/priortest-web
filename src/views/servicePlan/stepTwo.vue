<template>
  <div class="step-two">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="支付方式:" prop="paymentType">
        <el-radio v-for="item in paymentTypeList" :key="item.value" v-model="form.paymentType" :label="item.value">{{ item.key }}</el-radio>
      </el-form-item>
      <el-form-item :label="payCardLabel" prop="payCard">
        <el-input v-model="form.payCard" :disabled="ispaymentType" />
      </el-form-item>
      <el-form-item :label="payNameLabel" prop="payName">
        <el-input v-model="form.payName" :disabled="ispaymentType" />
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" class="wd100" @click="pre">上一步</el-button>
      <el-button type="primary" class="wd100" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { message } from '@/utils/common'
import { systemConfigAPI } from '@/api/systemConfig'
import { mapState } from 'vuex'
export default {
  name: 'StepTwo',
  props: {
    servicePlanUiList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      form: {
        paymentType: '',
        payCard: '',
        payName: ''
      },
      paymentTypeList: [], // 支付方式
      rules: {
        paymentType: [
          { required: true, message: '请选择支付方式', trigger: 'blur' }
        ],
        payCard: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        payName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      payNameLabel: '账号:',
      payCardLabel: '名称:',
      ispaymentType: true,
      payLabelObj: {
        'Wechat': {
          'payCardLabel': '微信号:',
          'payNameLabel': '用户名:'
        },
        'ZhiFuBao': {
          'payCardLabel': '支付账号:',
          'payNameLabel': '支付宝名称:'
        },
        'BankTransfer': {
          'payCardLabel': '银行卡号:',
          'payNameLabel': '账号名:'
        },
        'CreditCard': {
          'payCardLabel': '信用卡账号:',
          'payNameLabel': '信用卡账户名:'
        }
      }
    }
  },
  computed: {
    ...mapState({
      servicePlan: state => state.common.servicePlan
    })
  },
  watch: {
    'form.paymentType': function(val) {
      if (val === '') {
        this.form.payCard = ''
        this.form.payName = ''
        this.ispaymentType = true
      } else {
        this.ispaymentType = false
        this.payNameLabel = this.payLabelObj[val].payNameLabel
        this.payCardLabel = this.payLabelObj[val].payCardLabel
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 服务计划
    init() {
      const that = this
      /* eslint-disable */
      _.forEach(that.servicePlanUiList, (item, key) => {
        if (item.group === 'PaymentType') {
          that.paymentTypeList.push(item)
        }
      })
    },
    pre() {
      this.$emit('activeNum', 0)
    },
    async next() {
      const that = this
      try {
        await that.$refs.form.validate()
        return
        const params  = {...that.form,...JSON.parse(that.servicePlan)}
        params.dataStrorage = Number(params.dataStrorage.substring(0,params.dataStrorage.length - 2))
        const res = await systemConfigAPI.insertOrder(params)
        if (res.code === '200') {
          message('success', res.msg)
          that.$emit('activeNum', 2)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
  .step-two {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    .el-form {
      width: 70%;
    }
  }
</style>
