<template>
  <div class="comp-tree">
    <div class="new_project">
      <el-button type="primary" class="Vm">
        <!-- <router-link :to="viewUrl"> 新建/管理视图 </router-link> -->
        <div>版本管理</div>
      </el-button>
    </div>
    <div class="comp-data">
      <div class="big-width">
        <el-input
          class="search"
          placeholder="版本ID"
          prefix-icon="el-icon-search"
          v-model="input"
        >
        </el-input>
        <div class="all-btn" type="text">所有版本</div>
        <div v-for="(item, index) in setTree" :key="index" class="versiojn">
          <el-button class="all-btn" type="text">{{ item }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProjectVersion } from "@/api/customFFields";
import { getqueryFortestCycle } from "@/api/testcycle";
export default {
  name: "ViewTree_vM",
  props: {
    childScope: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      setTree: [], // tree数据,
      input: "",
      defaultProps: {
        children: "childViews",
        label: "title",
      },
      viewUrl: "/project/projectview?scope=" + this.childScope,
      projectQuery: {
        pageNum: 1,
        pageSize: 20,
      },
    };
  },
  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo;
    },
  },

  created() {
    this.queryViewTree();
  },

  methods: {
    hadleShow() {
      this.$emit("hadleTree");
    },
    getList: function (data, labels) {
      console.log("data: ", data, labels);
      const query = {
        labels: labels,
        projectId: this.projectInfo.userUseOpenProject.projectId,
        viewTreeDto: {
          id: data.id,
        },
      };

      this.$emit("childByValue", query);
    },
    async queryViewTree() {
      await getProjectVersion(localStorage.getItem("projectId")).then((res) => {
        let treelist = JSON.parse(res.data[0].possible_value);
        let index = 0;
        this.setTree = Object.values(treelist);
        // for (let key in treelist) {
        //   this.setTree[index++] = treelist[key]
        //   //
        // }
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import "../index.scss";

.comp-tree {
  // padding: 20px 0px;
  // overflow: auto;
  background: #fff;
  // padding: $spacing;
  box-sizing: border-box;
  // margin-right: 20px;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;

  .Vm {
    padding: 0 !important;
    margin: 0px !important;
    background-color: #8a8484;
    border: 1px solid #6f7e97;
    border-radius: 0px;
    opacity: 0.8;
    width: 100%;
    height: 40px;
  }
}

.comp-data {
  width: 100%;
  height: 100%;
  overflow: auto;
  overflow-y: auto;
  padding: 6px;

  .big-width {
    width: 100%;
    font-size: 14px;

    .em {
      width: 20px;
      height: 20px;
    }

    .version {
      padding: 10px 0;
      display: flex;
    }

    .search {
      margin-bottom: 10px;
    }
  }

  .versiojn {
    padding-top: 10px;
    text-align: center;
    .all-btn {
    }
  }

  .el-tree-node__content {
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 8px;
      z-index: 10;
    }
  }
}
</style>
