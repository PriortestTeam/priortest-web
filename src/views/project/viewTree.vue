<template>
  <div class="comp-tree">
    <div class="new_project">
      <el-button type="primary" round>
        <router-link :to="viewUrl"> 新建视图 </router-link>
      </el-button>
      <el-button type="primary" round>
        <router-link :to="viewUrl"> 管理视图 </router-link>
      </el-button>
    </div>
    <div class="comp-data">
         <span class="icon-box">
         <i class="el-icon-search"></i>
         <i class="el-icon-plus" @click="() => append(data)"></i>
      </span>
      <div class="big-width">
        <el-tree
          :data="setTree"
          :props="defaultProps"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
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
    childScope: String,
    require: true,
  },
  data() {
    return {
      setTree: [], // tree数据,
      defaultProps: {
        children: "childViews",
        label: "title",
      },
      viewUrl: "/project/projectview?scope=" + this.childScope,
    };
  },

  created() {
    this.queryViewTree();
  },
  methods: {
    append(data) {
      const newChild = { id: id++, label: "testtest", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
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
.comp-data {
  width: 100%;
  overflow: auto;
  position: relative;
  .big-width {
    width: 100%;
    font-size: 14px;
  }

  .icon-box {
    color: $btnbgcolor;
    font-size: 18px;
    background: #fff;
    position: absolute;
    z-index: 100;
    right: 5%;
    i {
      margin-left: 15px;
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
