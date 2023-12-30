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
						<div class="list">
							<el-tree :data="setTree" :props="defaultProps" node-key="id" default-expand-all
								:expand-on-click-node="false" class="list-L">
								<span slot-scope="{ node }" class="custom-tree-node">
									<span @click="getList(node.data, node.label)">{{ node.label }}</span>
								</span>
							</el-tree>
							<div class="list-R">
								<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
									@change="handleCheckAllChange">全选</el-checkbox>
								<el-checkbox-group v-model="checkedlLists" @change="listItemClick" class="list_R_D">
									<el-checkbox v-for="item in fillerInstanceListData" :key="item.id" :label="item.id">{{ item.title
									}}</el-checkbox>
								</el-checkbox-group>
							</div>

						</div>

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
						<template slot-scope="scope">
							<el-button type="primary" class="run-btn" @click="handelRun(scope.row.testCase.id)"></el-button>
						</template>
					</el-table-column>
					<!-- <el-table-column v-if="InstanceTableData.every(item => ![0, 1, 3, 5].includes(item.testCaseRun.runStatus))"
						label="再运行"> -->
					<el-table-column v-if="InstanceTableData.every(item => ![0, 1, 3, 5].includes(item.testCaseRun.runStatus))"
						label="再运行">
						<template slot-scope="scope">
							<el-button type="primary" class="run-btn"
								@click="handelReRun(scope.row.testCase.id, scope.row.testCase.title)"></el-button>
						</template>
					</el-table-column>

					<el-table-column label="UUID" prop="testCase.id" width="180px">
					</el-table-column>
					<el-table-column label="标题" prop="testCase.title" width="160px">
					</el-table-column>
					<el-table-column label="发布版本" prop="testCase.version" width="120px">
					</el-table-column>
					<el-table-column label="缺陷" width="120px">
					</el-table-column>
					<el-table-column label="故事" prop="feature">
					</el-table-column>
					<el-table-column label="测试方法" prop="testCase.testMethod" width="160px">
					</el-table-column>
					<el-table-column label="运行状态" prop="testCaseRun.runStatus" width="120px">
						<template slot-scope="scope">
							{{ interpretRunStatus(scope.row.testCaseRun.runStatus) }}
						</template>
					</el-table-column>
					<el-table-column label="运行时间" prop="testCaseRun.updateTime">
					</el-table-column>
					<el-table-column label="执行者" prop="testCaseRun.updateUserId">
					</el-table-column>
					<el-table-column label="操作" width="58" fixed="right">
						<template slot-scope="scope">
							<el-button type="primary" @click="removeRowTestCase(scope.row.testCase.id)">移徐</el-button>
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
	deleteInstance,
	testCycleListByClick
} from '@/api/testcycle'

import { axios } from '@/utils/request'

import { queryViewTrees } from '@/api/project'
import { title } from '@/settings'
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
			isIndeterminate: true,
			checkAll: false,

			cycleId: '',
			tableHeader: {
				color: '#d4dce3',
				background: '#4286CD'
			}, // 表头颜色加粗设置,
			setTree: [], // tree数据,
			defaultProps: {
				children: 'childViews',
				label: 'title'
			},
		}
	},
	created() {
		// 仅在整个视图都被渲染之后才会运行的代码
		this.projectId = this.$store.state.user.userinfo.userUseOpenProject.projectId
		this.cycleId = this.$route.query.id
		this.getInstanceTableData()
	},
	methods: {
		// 获取左侧列表数据
		getList: function (data, labels) {
			console.log("data: ", data, labels)
			const query = {
				labels: labels,
				projectId: JSON.parse(localStorage.getItem('projectId')),
				viewTreeDto: {
					id: data.id
				}


			}
			const p = {
				scope: 'testCase',
				viewId: data.id,
			}
			let pageSize = ''

			testCycleListByClick(p, {

			},).then(res => {
				console.log('viewClick: ', res.data.total, p)
				pageSize = res.data.total
			}).then(() => {
				testCycleListByClick(p, {
					pageNum: 1,
					pageSize: pageSize
				},

				).then(res => {
					console.log('viewClick: ', res.data.total, p)
					this.InstanceListData = res.data.list
					this.fillerInstanceListData = this.InstanceListData
				}).catch(() => {
					this.InstanceListData = []
					this.fillerInstanceListData = []
				})
			})


		},
		getInstanceListData() {
			queryViewTrees({
				"scope": "3000001"
			}).then((res) => {
				this.setTree = res.data
				console.log("tree", this.setTree);
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
		// 全选
		handleCheckAllChange(val) {
			this.selectCaseIds = this.checkedlLists = val ? this.fillerInstanceListData.map(item => {
				return item.id
			}) : []
			this.isIndeterminate = false
		},
		// 获取表格数据
		getInstanceTableData() {
			if (!this.cycleId) return
			const params = {
				testCycleId: this.cycleId
			}
			console.log(params);
			getListBytestCycle(params).then(res => {
				getListBytestCycle(params, { pageNum: 1, pageSize: res.data.total }).then(res => {
					this.InstanceTableData = res.data.list
				})

			})

		},

		interpretRunStatus(runStatus) {
			switch (runStatus) {
				case 0:
					return '无效';
				case 1:
					return '通过';
				case 2:
					return '失败';
				case 3:
					return '跳过';
				case 4:
					return '停滞';
				case 5:
					return '未运行';
				case 6:
					return '未完成';

			}
		},
		//点击列表，选择case，高亮
		listItemClick(val) {
			console.log(val);
			this.selectCaseIds = val
			this.checkedlLists = val
			let checkedCount = val.length;
			this.checkAll = checkedCount === this.fillerInstanceListData.length;
			this.isIndeterminate = checkedCount > 0 && checkedCount < this.fillerInstanceListData.length;

		},
		// 添加案例
		addCase() {
			if (this.selectCaseIds.length === 0) return message('error', '请选择case')
			const data = {
				projectId: this.projectId,
				testCycleId: this.cycleId,
				testCaseIds: this.selectCaseIds
			}
			console.log(data);
			saveInstance(data).then(res => {
				console.log(res.code === '200')
				if (res.code === '200') {
					console.log(11, data)
					message('success', '添加成功')
					this.checkedlLists = []
					this.isIndeterminate = true
					this.checkAll = false
					this.reloadTable()
				}
			})
		},
		// 展示左侧列表
		showInstanceList() {
			this.show = !this.show
			this.show ? this.getInstanceListData() : ""
		},

		//运行
		handelRun(tcId) {
			const data = {
				projectId: this.projectId,
				testCycleId: this.cycleId,
				testCaseId: tcId,
				runCountIndicator: true
			};
			console.log('Data to be sent:', data);
			// Perform the API call
			//axios.post('/testCycle/instance/listByTestCycle', data)
			axios.post('/testCycle/caseRun/execute', data)
				.then(response => {
					console.log('API call successful:', response);
					// Once the API call is completed, navigate to the desired route
					this.$router.push({ name: 'runCase', query: { id: this.cycleId, tableid: tcId } });
				})
				.catch(error => {
					console.error('Error executing test case or navigating:', error);
				});
		},

		//再运行
		async handelReRun(tcId, testCaseTitle) {
			const data = {
				projectId: this.projectId,
				testCycleId: this.cycleId,
				testCaseId: tcId,
				runCountIndicator: false
			};
			try {
				//const response = await fetch('re-run.api');
				const response = await axios.post('/testCycle/caseRun/execute', data)
				const data1 = response.data;

				// Assuming Vue Router is used for navigation
				if (response.code === '200') {
					this.$router.push({ name: 'reRunCase', query: { dataList: data1.list, testCaseTitle: testCaseTitle } });
				} else {
					console.error('Invalid API response');
				}
			} catch (error) {
				console.error('Error occurred while fetching data:', error);
			}

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
		overflow-x: scroll !important;
		overflow-y: scroll !important;

		.list {

			display: flex;
			justify-content: start;
			flex-wrap: nowrap !important;
			// overflow: hidden;

			.list-R {

				height: 60vh;
				display: flex;
				flex-direction: column;

				.list_R_D {
					flex: 1;


					// background-color: aqua;
					display: flex;
					flex-direction: column;
					flex-wrap: nowrap !important;
				}
			}

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

	.run-btn {
		width: 22px;
		height: 22px;
		background-image: url("../../../icons/img/runIcon.png");
		background-size: cover;
		/* 控制背景图片的大小，cover 表示尽可能填充整个元素 */
		background-repeat: no-repeat;
		/* 禁止背景图片重复 */
		border: none;
		/* 去掉按钮的边框 */
		background-color: (#00ff00);
		border-radius: 50%;


	}

	.runIcon {
		width: 20px;
	}
}
</style>
