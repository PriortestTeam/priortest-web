<template>
	<div>
		<el-row class="Instance">
			<!-- 左侧列表 -->
			<el-col :span="show ? 5 : 0">
				<div class="InstanceList">
					<div class="listHeader">
						添加测试用例
					</div>
					<div class="listContent">
						<div class="btns">
							<el-button type="primary" @click="addCase">添加到周期</el-button>
						</div>
						<div class="search">
							<el-input v-model="searchValue" size="mini" prefix-icon="el-icon-search" placeholder="用例UUID 或标题" clearable
								@input="handleChange"></el-input>
						</div>
						<!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
							@change="handleCheckAllChange">全选</el-checkbox>
						<div style="margin: 15px 0;"></div> -->

						<!-- <ul class="list"> -->
						<el-checkbox-group class="list" v-model="checkedlLists" @change="listItemClick">
							<el-checkbox v-for="item in fillerInstanceListData" :key="item.id" :label="item.id">{{ item.title
							}}</el-checkbox>
						</el-checkbox-group>
						<!-- <li :class="active === item.id ? 'active' : ''" v-for="item in fillerInstanceListData" :key="item.id"
								@click="listItemClick(item)">{{ item.title }}</li> -->


						<!-- </ul> -->
					</div>
				</div>
			</el-col>
			<!-- 右侧表单 -->
			<el-col class="InstanceTable" :span="show ? 19 : 24">
				<div class="btns">
					<el-button type="primary" @click="showInstanceList">添加用例</el-button>
					<el-button type="primary" @click="removeTestCase">移除用例</el-button>
					<el-button type="primary" @click="reloadTable">加载用例</el-button>
					<el-button type="primary">批量运行</el-button>
					<el-button type="primary">字段调整</el-button>
				</div>
				<el-table ref="InstanceTable" :data="InstanceTableData" :header-cell-style="tableHeader" stripe
					style="width: 100%">
					<el-table-column type="selection">
					</el-table-column>
					<el-table-column label="运行">
						<img @click="$router.push('/testcycle/useCase')" class="runIcon" src="@/icons/img/runIcon.png" alt="">
					</el-table-column>
					<el-table-column label="UUID" prop="id" width="180px">
					</el-table-column>
					<el-table-column label="标题" prop="title" width="160px">
					</el-table-column>
					<el-table-column label="发布版本" prop="version" width="120px">
					</el-table-column>
					<el-table-column label="缺陷" width="120px">
					</el-table-column>
					<el-table-column label="故事" prop="feature">
					</el-table-column>
					<el-table-column label="测试方法" prop="testMethod" width="160px">
					</el-table-column>
					<el-table-column label="运行状态" prop="runStatus" width="120px">
					</el-table-column>
					<el-table-column label="L_状态" prop="lastRunStatus">
					</el-table-column>
					<el-table-column label="L_时长" width="140px">
					</el-table-column>
					<el-table-column label="运行时间">
					</el-table-column>

					<el-table-column label="执行者">
					</el-table-column>
					<el-table-column label="操作" width="148" fixed="right">
						<template slot-scope="scope">
							<el-button type="primary" @click="removeRowTestCase(scope.row.id)">移徐</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { message } from '@/utils/common'
import {
	testCaseList
} from '@/api/testcase'
import {
	getListBytestCycle,
	saveInstance,
	deleteInstance
} from '@/api/testcycle'
export default {
	data() {
		return {
			projectId: '',
			cycleId: '',
			show: false,
			active: '',
			checkedlLists: [],
			InstanceListData: [],
			fillerInstanceListData: [],
			searchValue: '',
			selectCaseIds: [],
			InstanceTableData: [],
			cycleId: '1677883697677856769',
			tableHeader: {
				color: '#d4dce3',
				background: '#4286CD'
			} // 表头颜色加粗设置
		}
	},
	created() {
		this.projectId = this.$store.state.user.userinfo.userUseOpenProject.projectId
		this.cycleId = this.$route.query.id
		this.getInstanceListData()
		this.getInstanceTableData()
	},
	methods: {
		// 获取左侧列表数据
		getInstanceListData() {
			const data = {
				projectId: this.projectId,
				viewTreeDto: {
					id: ''
				}
			}
			const query = {
				pageNum: 1,
				pageSize: 10
			}
			testCaseList(query, data).then((res) => {
				this.InstanceListData = res.data.list
				this.fillerInstanceListData = this.InstanceListData
			})
		},
		// 搜索框过滤数据
		handleChange(value) {
			let timer = null
			if (timer !== null) {
				clearTimeout(timer)
			}
			timer = setTimeout(() => {
				this.fillerInstanceListData = this.InstanceListData.filter(item => {
					if (item.title.includes(value)) {
						return item
					}
				})
			}, 300)
		},
		// 获取表格数据
		getInstanceTableData() {
			const params = {
				testCycleId: this.cycleId
			}
			getListBytestCycle(params).then(res => {
				this.InstanceTableData = res.data.list
			})
		},
		//点击列表，选择case，高亮
		listItemClick(val) {
			this.selectCaseIds = val
			// if (this.active === item.id) {
			// 	this.active = ''
			// 	this.selectCaseIds = []
			// 	return
			// }
			// this.active = item.id
			// this.selectCaseIds = []
			// this.selectCaseIds.push(item.id)
		},
		// 添加案例
		addCase() {
			if (this.selectCaseIds.length === 0) return message('error', '请选择case')
			const data = {
				projectId: this.projectId,
				testCycleId: this.cycleId,
				testCaseIds: this.selectCaseIds
			}
			saveInstance(data).then(res => {
				console.log(res.code === '200')
				if (res.code === '200') {
					console.log(1)
					message('success', '添加成功')
					this.reloadTable()
				}
			})
		},
		// 展示左侧列表
		showInstanceList() {
			this.show = !this.show
		},
		//删除案例
		deleteCase(ids) {
			const data = {
				projectId: this.projectId,
				testCycleId: this.cycleId,
				testCaseIds: ids
			}
			deleteInstance(data).then(res => {
				console.log(res)
				if (res.code === '200') {
					message('success', '删除成功')
					this.reloadTable()
				}
			})
		},
		// 表格顶部移除测试案例按钮
		removeTestCase() {
			const selection = this.$refs['InstanceTable'].selection
			if (selection.length === 0) return message('error', '请选择case')
			const ids = selection.map(item => {
				return item.id
			})
			this.deleteCase(ids)
		},
		// 表格中移除测试案例按钮
		removeRowTestCase(id) {
			this.deleteCase([id])
		},
		//刷新表单
		reloadTable() {
			console.log('刷新')
			this.getInstanceTableData()
		}
	}
}
</script>

<style lang="scss" scoped>
.InstanceList {
	flex: 1;
	margin-right: 10px;
	border: 1px solid rgb(210, 210, 210);
	background-color: white;

	.listHeader {
		background-color: rgb(66, 134, 205);
		font-size: 14px;
		height: 30px;
		color: white;
		line-height: 30px;
	}

	.listContent {
		padding: 15px;

		.list {
			display: flex;
			flex-direction: column;
		}

		.btns {
			margin-bottom: 10px;

			.el-button {
				padding: 6px 17px;
			}
		}

		.search {
			margin-bottom: 10px;
		}
	}
}

.InstanceTable {
	.btns {
		margin-bottom: 10px;
	}

	.runIcon {
		width: 20px;
	}
}
</style>
