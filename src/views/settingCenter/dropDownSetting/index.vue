<template>
  <div class="dropDown-setting">
    <el-tabs v-model="activeName" tab-position="left">
      <el-tab-pane
        v-for="(field, index) in data"
        :key="index"
        :label="field.fieldNameCn"
        :name="`${index}`"
      >
        <div class="m-b-10">
          <el-button @click="add" type="primary" plain>添加</el-button>
          <el-button @click="confirm" type="primary" plain :disabled="hasNullValue || !canConfirm">确定</el-button>
          <el-button @click="cancel" type="danger">放弃</el-button>
        </div>
        <div class="possible-list">
          <div
          v-for="(item, index) in possibleValueList"
          :key="index"
          class="m-b-10"
        >
          <span class="m-r-10">
            <el-button
              icon="el-icon-minus"
              circle
              text
              size="mini"
              type="primary"
              @click="handleDel(item, index)"
            ></el-button>
            <el-button
              icon="el-icon-edit"
              circle
              text
              size="mini"
              type="primary"
              @click="handleEdit(item)"
            ></el-button>
          </span>
          <el-select
            v-model="item.type"
            :disabled="!item.edit"
            v-if="['linkedDropDown'].includes(currentField.fieldType)"
          >
            <template v-for="(label, index) in valueTypeList">
              <el-option v-if="label != 'others'" :key="index" :value="label" />
            </template>
          </el-select>
          <span v-if="!item.edit">{{ item.value }}</span>
          <!-- 编辑状态 -->
          <template v-else>
            <el-input
              class="inputClass"
              v-if="['number'].includes(currentField.fieldType)"
              v-model.number="item.value"
              placeholder="请输入数字"
              @input="inputChange"
            />
            <el-input
              class="inputClass"
              v-if="
                ['linkedDropDown', 'dropDown','userList','multiList'].includes(currentField.fieldType)
              "
              v-model="item.value"
              @input="inputChange"
            />
          </template>
        </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { updateValueDropDownBox } from "@/api/customFFields";
import { systemListAPI } from "@/api/customFFields";
import text from "@/views/adminCenter/text.vue";
export default {
  components: { text },
  data() {
    return {
      data: [],
      activeName: 0,
      form: "",
      valueTypeList: [],
      possibleValueList: [],
      canConfirm:false
    };

      },

  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo;
    },
    currentField() {
      return this.data[this.activeName] ? this.data[this.activeName] : {};
    },
    hasNullValue(){
      return !this.possibleValueList.every(item=>item.value!="")
    },
  },
  mounted() {
    //this.init();
  },
  watch: {
    activeName: {
      handler(newVal) {
        this.initData();
        console.log(this.currentField);
      },
      immediate: true,
    },
  },

  methods: {
    initData() {
      this.possibleValueList = [];
      this.valueTypeList = [];
      const { possibleValue, fieldType } = this.currentField;
      if (["dropDown", "number","userList","multiList"].includes(fieldType)) {
        let obj = JSON.parse(possibleValue);
        Object.keys(obj).forEach((key) => {
          this.possibleValueList.push({ value: obj[key], edit: false });
        });
      } else if (["linkedDropDown"].includes(fieldType)) {
        let obj = JSON.parse(possibleValue);
        Object.keys(obj).forEach((key) => {
          this.valueTypeList.push(key);
          if (obj[key] instanceof Array) {
            obj[key].forEach((el) => {
              this.possibleValueList.push({
                value: el,
                type: key,
                edit: false,
              });
            });
          }
        });
        console.log(this.valueTypeList);
      }
    },
    handleDel(item, index) {
      this.possibleValueList.splice(index, 1);
      this.canConfirm = true
    },
    handleEdit(item) {
      item.edit = !item.edit;
    },
    add() {
      this.possibleValueList.push({ type: "", value: "", edit: true });
      this.canConfirm = true
    },
    confirm() {
      const { customFieldId, fieldType, possibleValue } = this.currentField;
      let obj = {};
      let possibleValueTemp = JSON.parse(possibleValue);
      if (possibleValue !== "null") {
        if (["linkedDropDown"].includes(fieldType)) {
          this.valueTypeList.forEach((type) => {
            if (type !== "others") {
              obj[type] = [];
            }
          });
          console.log(obj)
          this.possibleValueList.forEach((el) => {
            obj[el.type].push(el.value);
          });
          obj.others = possibleValueTemp.others;
        } else if (["dropDown", "number","userList","multiList"].includes(fieldType)) {
          this.possibleValueList.forEach((el, index) => {
            obj["order_" + (index + 1)] = el.value;
          });
        }
      }
      const params = {
        customFieldId,
        fieldType,
        possibleValue: JSON.stringify(obj),
      };
      updateValueDropDownBox(params).then((res) => {
        if (res.code === "200") {
          this.$message.success("操作成功");
          this.canConfirm = false
        }
        this.init();
      });
    },
    cancel() {
      this.$confirm("是否要放弃编辑？").then(() => {
        this.init();
      });
    },
    init() {
      systemListAPI( { projectId: this.projectInfo.userUseOpenProject.projectId } ).then((res) => {
        if (res.code == 200) {
          this.data = res.data;
          this.initData();
        }
      });
    },
    inputChange(){
      console.log("input change")
      this.canConfirm = true
    }
  },
};
</script>
<style lang="scss" scoped>
.dropDown-setting{
  height: calc(100vh - 142px);
}
.possible-list{
  height: 100%;
  overflow: auto;
  padding-bottom: 40px;
}
.m-b-10 {
  margin-bottom: 10px;
}
.m-r-10 {
  margin-right: 10px;
}
.inputClass {
  width: 60%;
  margin-left: 10px;
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
  display: flex;
  flex-direction: unset !important;
  ::v-deep .el-tabs__content {
    width: unset !important;
  }
}
</style>
