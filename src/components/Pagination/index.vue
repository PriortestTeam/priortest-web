<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination :background="background" :current-page.sync="currentPage" :page-size.sync="pageSize" :layout="layout"
      :page-sizes="pageSizes" :total="Number(total)" v-bind="$attrs" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: [Number, String]
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(val)
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      console.log("vla:" + val, "pageSize:" + this.pageSize)
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/color.scss"; //按钮

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background: $btnbgcolor;
}

.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: $btnbgcolor;
}
</style>
<style scoped lang='scss'>
@import "@/styles/color.scss"; //按钮

.pagination-container {
  background: #fff;
  padding: 10px;

  .el-pagination {
    display: flex;
    justify-content: flex-end;
  }
}

.pagination-container.hidden {
  display: none;
}
</style>
