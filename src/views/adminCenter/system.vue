<template>
  <div class="system">
    <el-tabs v-model="activeName" tab-position="left" :before-leave="tabClick">
      <el-tab-pane
        v-for="(item, index) in systemData"
        :key="item.sysCustomField.id"
        :label="item.sysCustomField.fieldNameCn"
        :name="`${index}`"
      >
        <div class="item one-item">
          <i class="el-icon-circle-plus" @click="addValue(item)" />
          <el-button type="primary" :disabled="flag" @click="submitValue(item)"
            >确定</el-button
          >
        </div>
        <div class="big-height">
          <div
            v-for="(item1, index1) in item.mergeValues"
            :key="item1"
            class="item"
          >
            <span>{{ item1 }}</span>
            <i class="el-icon-remove" @click="removeValue(item, index1)" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { querySysCustomFields, updateSysCustomFields } from "@/api/admincenter";

export default {
  name: "System",
  props: {
    paramValue: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      activeName: "0",
      systemData: [],
      flag: true,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      querySysCustomFields().then((res) => {
        this.systemData = res.data;
        const index = this.systemData.findIndex(
          (item) => item.sysCustomField.fieldName === this.paramValue
        );
        console.log(this.systemData, index, this.paramValue);
        console.log(`systemData`, res.data);
        if (index > -1) {
          this.activeName = `${index}`;
        }
      });
    },
    removeValue(item, index) {
      this.flag = false;
      item.mergeValues.splice(index, 1);
    },
    addValue(item) {
      console.log(item);
      this.$prompt("请填写值：", {
        confirmButtonText: "确定",
        showCancelButton: false,
      })
        .then(({ value }) => {
          if (value) {
            item.mergeValues.push(value);
            this.flag = false;
          }
        })
        .catch({});
    },
    submitValue(item) {
      const data = {};
      data.sysCustomField = item.sysCustomField;
      data.mergeValues = item.mergeValues;
      updateSysCustomFields(data).then((res) => {
        this.getData();
        this.flag = true;
      });
    },
    tabClick() {
      if (!this.flag) {
        return this.$confirm("离开将不保存当前修改", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.flag = true;
            this.getData();
          })
          .catch(() => {
            throw new Error("取消成功！");
          });
      }
    },
  },
};
</script>
<style scoped lang="scss">
@import "index.scss";
i {
  font-size: 20px;
  cursor: pointer;
  color: $btnbgcolor;
}
.item {
  width: 35%;
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  line-height: 30px;
  align-items: center;
}
.one-item {
  margin-bottom: 10px;
}
.big-height {
  max-height: 70vh;
  overflow: auto;
}

.el-tabs {
  display: unset !important;
  flex-direction: unset !important;
  ::v-deep .el-tabs__content {
    width: unset !important;
  }
}

</style>

