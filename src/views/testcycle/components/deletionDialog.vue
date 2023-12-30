<template>
    <el-dialog
      :visible="dialogVisible"
      @update:visible="updateVisible"
      title="记录删除确认"
      width="200px"
      :before-close="closeDialog"
    >
      <el-form label-width="120px" @submit.native.prevent="handleSubmit">
        <el-form-item label="请输入删除记录标题:" prop="enteredTitle">
          <el-input v-model="enteredTitle" placeholder="删除记录标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dialogVisible: false,
        enteredTitle: '',
        selectedTestCycle: null,
      };
    },
    methods: {
      updateVisible(val) {
        this.dialogVisible = val;
      },
      showDialog(selectedTestCycle) {
        this.selectedTestCycle = selectedTestCycle;
        this.dialogVisible = true;
        this.enteredTitle = ''; // Reset the entered title
      },
      closeDialog() {
        this.dialogVisible = false;
        this.selectedTestCycle = null;
        this.enteredTitle = '';
      },
      handleSubmit() {
        // Emit the confirmation to the parent component
        this.$emit('confirm', this.enteredTitle, this.selectedTestCycle);
        this.closeDialog();
      },
    },
  };
  </script>
  