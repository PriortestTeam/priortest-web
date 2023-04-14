<template>
  <el-dialog
    title="添加新值"
    :before-close="onClose"
    :visible.sync="visible"
    @open="onOpen"
  >
    <el-select v-if="field.fieldType === 'linkedDropDown'" v-model="valueType">
      <template v-for="(label, index) in valueTypeList">
        <el-option v-if="label != 'others'" :key="index" :value="label" />
      </template>
    </el-select>
    <el-form ref="form" :model="form">
      <el-form-item
        v-if="field.fieldType == 'number'"
        prop="newValue"
        :rules="[
          { required: true, message: '请输入新增值', trigger: 'blur' },
          { type: 'number', message: '必须为数字类型' },
        ]"
      >
        <el-input v-model.number="form.newValue" placeholder="请输入数字" />
      </el-form-item>
      <el-form-item
        v-else
        prop="newValue"
        :rules="[{ required: true, message: '请输入新增值', trigger: 'blur' }]"
      >
        <el-input v-model="form.newValue" />
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button plain @click="onClose">取消 </el-button>
      <el-button plain type="primary" @click="confirm"> 确定 </el-button>
    </template>
  </el-dialog>
</template>
<script>
import { updateValueDropDownBox } from "@/api/customFFields";
import Text from '@/views/adminCenter/text.vue';
export default {
  props: {
    field: {
      default: () => {},
      type: Object,
    },
    visible: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      form: {
        newValue: "",
      },
      valueType: "",
      valueTypeList: [],
      possibleValueList: [],
    };
  },
  computed: {},
  methods: {
    onOpen() {
      this.valueTypeList = [];
      const { possibleValue, fieldType } = this.field;
      if (possibleValue !== "null") {
        if (fieldType === "linkedDropDown") {
          Object.keys(JSON.parse(possibleValue)).forEach((key) => {
            this.valueTypeList.push(key);
          });
        }
      }
    },
    onClose() {
      this.$emit("update:visible", false);
    },
    confirm() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        const { newValue } = this.form;
        const { customFieldId, fieldType, possibleValue } = this.field;
        let possibleValueList = {};
        if (possibleValue !== "null") {
          possibleValueList = JSON.parse(possibleValue);
          if (fieldType === "linkedDropDown") {
            possibleValueList[this.valueType].push(newValue);
          } else {
            const length = Object.keys(possibleValueList).length;
            possibleValueList["order_" + (length + 1)] = newValue;
          }
        }
        const params = {
          customFieldId,
          fieldType,
          possibleValue: JSON.stringify(possibleValueList),
        };
        updateValueDropDownBox(params).then((res) => {
          if (res.code === "200") {
            this.$message.success("操作成功");
            this.$emit("refresh");
            this.onClose();
          }
        });
      });
    },
  },
};
</script>
