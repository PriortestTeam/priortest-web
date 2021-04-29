<template>
  <div>
    <el-tabs tab-position="left" v-model="activeName" :before-leave="tabClick">
      <el-tab-pane
        :label="item.sysCustomField.fieldNameCn"
        v-for="(item,index) in systemData"
        :key="item.sysCustomField.id"
        :name="`${index}`"
      >
        <div class="item one-item">
          <i class="el-icon-circle-plus" @click="addValue(item)"></i>
          <el-button type="primary" @click="submitValue(item)" :disabled="flag"
            >确定</el-button
          >
        </div>
        <div class="big-height">
          <div
            class="item"
            v-for="(item1, index1) in item.mergeValues"
            :key="item1"
          >
            <span>{{ item1 }}</span>
            <i class="el-icon-remove" @click="removeValue(item, index1)"></i>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { querySysCustomFields ,updateSysCustomFields} from "@/api/admincenter";

export default {
  name: "System",
  props:{
      paramValue:String,
      require:false
  },
  data() {
    return {
      activeName:'0',
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
        let index=this.systemData.findIndex(item=>item.sysCustomField.fieldName===this.paramValue)
        console.log( this.systemData,index,this.paramValue)
        if(index>-1){
        this.activeName=`${index}`

        }
      });
    },
    removeValue(item, index) {
      this.flag = false;
      item.mergeValues.splice(index, 1);
    },
    addValue(item) {
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
       let data={}
       data.sysCustomField=item.sysCustomField
       data.mergeValues=item.mergeValues
      updateSysCustomFields(data).then(res=>{
         this.getData();
         this.flag=true
      })
    },
    tabClick() {
      if (!this.flag) {
        return this.$confirm("离开将不保存当前修改", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.flag=true
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
</style>
