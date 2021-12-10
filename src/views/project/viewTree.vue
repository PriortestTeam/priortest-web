<template>
  <div class="comp-tree">
    <div class="new_project">      
      <el-button type="primary" round>
        <router-link :to="viewUrl"> 新建/管理视图 </router-link>
      </el-button>
      <span class="icon-box">        
         <i class="el-icon-d-arrow-left" title="折叠" @click="hadleShow"></i>
      </span>
    </div>
    <div class="comp-data">
      <div class="big-width">
        <el-tree
          :data="setTree"
          :props="defaultProps"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <span @click="getList(node.data)">{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import { queryViewTrees } from "@/api/project";
export default {
  name: "ViewTree",
  props: {
    childScope: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      setTree: [], // tree数据,
      defaultProps: {
        children: "childViews",
        label: "title",
      },
      viewUrl: "/project/projectview?scope=" + this.childScope,
        projectQuery: {
        pageNum: 1,
        pageSize: 10
      },
    };
  },

  created() {
    this.queryViewTree();
  },
  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo
    }
  },
  methods: {
    hadleShow(){
      this.$emit('hadleTree')
    },
    getList: function (data) {
      const query = {
        projectId: this.projectInfo.userUseOpenProject.projectId,
        viewTreeDto : {
          id: data.id
        }
      }
      this.$emit('childByValue',query)
    },
    queryViewTree() {
      const params = {
        scope: this.childScope,
      };
      queryViewTrees(params).then((res) => {
        this.setTree = res.data;
        // 先找父节点
      });

    },
  },
};
</script>
<style scoped lang="scss">
@import "index.scss";
.comp-tree {
  overflow: auto;
  background: #fff;
  padding: $spacing;
  box-sizing: border-box;
  margin-right: 20px;
  height: calc(100vh - 100px);
}
.comp-data {
  width: 100%;
  overflow: auto;
  position: relative;
  .big-width {
    width: 100%;
    font-size: 14px;
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
