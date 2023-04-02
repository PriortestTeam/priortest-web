<template>
  <div class="system">
    <el-tabs
      v-model="activeName"
      tab-position="left"
      :before-leave="tabClick"
    >
      <el-tab-pane
        v-for="(item, index) in customData"
        :key="index"
        :label="item.fieldNameCn"
        :name="`${index}`"
      >
        <div class="item one-item">
          <i
            class="el-icon-circle-plus"
            @click="addValue(item)"
          />
          <el-button
            type="primary"
            :disabled="flag"
            @click="submitValue(item)"
          >确定</el-button>
        </div>
        <div class="big-height">
          <template v-if="item.fieldType === 'linkedDropDown'">
            <div
              v-for="(item1, index1) in item.possibleValueList"
              :key="item1.value"
              class="item"
            >
              <span>{{ item1.value }}</span>
              <span>{{ '('+item1.type +')' }}</span>
              <i
                class="el-icon-remove"
                @click="removeValue(item, index1)"
              />
            </div>
          </template>
          <template v-else>
            <div
              v-for="(item1, index1) in item.possibleValueList"
              :key="item1"
              class="item"
            >
              <span>{{ item1 }}</span>
              <i
                class="el-icon-remove"
                @click="removeValue(item, index1)"
              />
            </div>
          </template>
        </div>
      </el-tab-pane>
    </el-tabs>
    <add-possible-value
      :visible.sync="addPossibleValueVisible"
      :field="currentField"
      @refresh="getData"
    />
  </div>
</template>
<script>
import { updateValueDropDownBox } from '@/api/customFFields'
import { getAllCustomField } from '@/api/project'
import addPossibleValue from '@/views/testcase/components/addPossibleValue.vue'

export default {
  name: 'System',
  components: {
    addPossibleValue
  },
  props: {
    paramValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: '0',
      customData: [],
      flag: true,
      addPossibleValueVisible: false,
      currentField: {}
    }
  },
  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getAllCustomField({
        projectId: this.projectInfo.userUseOpenProject.projectId,
        scopeId: '3000001'
      }).then((res) => {
        if (res.code === '200') {
          this.customData = this.formatter(res.data)
        }
      })
    },
    formatter(data) {
      data.forEach((field) => {
        const { possibleValue, fieldType } = field
        if (!possibleValue) {
          field.possibleValueList = []
        } else {
          const obj = JSON.parse(possibleValue)
          const list = []
          if (['dropDown', 'number'].includes(fieldType)) {
            Object.keys(obj).forEach((key) => {
              list.push(obj[key])
            })
            field.possibleValueList = list
          } else if (fieldType === 'linkedDropDown') {
            Object.keys(obj).forEach((key) => {
              // if (obj[key] instanceof Array) {
              //   list.push(...obj[key])
              // }
              if (obj[key] instanceof Array) {
                obj[key].forEach((value) => {
                  list.push({ value, type: key })
                })
              } else {
                field.linkedOther = obj[key]
              }
            })
            field.possibleValueList = list
          } else {
            field.possibleValueList = []
          }
        }
      })
      return data
    },
    removeValue(item, index) {
      item.possibleValueList.splice(index, 1)
      this.flag = false
    },
    addValue(item) {
      console.log(item)
      this.addPossibleValueVisible = true
      this.currentField = item
    },
    submitValue(item) {
      console.log(item)
      const { possibleValueList, customFieldId, fieldType } = item
      const submitPossibleValue = {}
      if (fieldType === 'linkedDropDown') {
        // possibleValueList[this.valueType].push(newValue)
        possibleValueList.forEach(el => {
          if (submitPossibleValue[el.type]){
            submitPossibleValue[el.type].push(el.value)
          } else {
            submitPossibleValue[el.type] = [el.value]
          }
        })
        submitPossibleValue.others = item.linkedOther
      } else {
        possibleValueList.forEach((el, index) => {
          submitPossibleValue['order_' + (index + 1)] = el
        })
      }
      updateValueDropDownBox({
        customFieldId,
        fieldType,
        possibleValue: JSON.stringify(submitPossibleValue)
      }).then((res) => {
        if (res.code === '200') {
          this.$message.success('操作成功')
          this.getData()
        }
      })
    },
    tabClick() {
      if (!this.flag) {
        return this.$confirm('离开将不保存当前修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.flag = true
            this.getData()
          })
          .catch(() => {
            throw new Error('取消成功！')
          })
      }
    }
  }
}
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

