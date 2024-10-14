<template>
	<div>
		<el-main>
			<div style="margin: 10px 0">
				<el-input style="width: 200px" placeholder="请输入用户名" v-model="username">
					<template #prefix>
						<el-icon>
							<Search />
						</el-icon>
					</template>
				</el-input>
				<el-input style="width: 200px" placeholder="请输入邮箱" v-model="email" class="icon-right">
					<template #prefix>
						<el-icon>
							<Message />
						</el-icon>
					</template>
				</el-input>
				<el-input style="width: 200px" placeholder="请输入地址" v-model="address" class="icon-right">
					<template #prefix>
						<el-icon>
							<Position />
						</el-icon>
					</template>
				</el-input>
				<el-button type="primary" @click="load1" class="icon-right">搜索</el-button>
				<el-button type="warning" @click="reset">重置</el-button>
			</div>

			<div style="margin: 10px 0">
				<el-button type="primary" @click="handleAdd">
					新增<el-icon class="icon-right">
						<CirclePlus />
					</el-icon>
				</el-button>
				<el-popconfirm width="220" confirm-button-text="是的，删除" cancel-button-text="不，点错了" :icon="InfoFilled"
					icon-color="#626AEF" title="你真的要批量删除这些信息吗？" @confirm="delBatch">
					<template #reference>
						<el-button type="danger" class="my-button" @click="handleClick">批量删除 <el-icon
								class="icon-right">
								<Delete />
							</el-icon></el-button>
					</template>
				</el-popconfirm>
				<el-upload action="http://localhost:8080/user/import" :show-file-list="false" accept="xlsx"
					:on-success="handleExcelImportSuccess" class="my-button" @click="handleClick">
					<el-button type="primary">导入
						<el-icon class="icon-right">
							<Download />
						</el-icon>
					</el-button>
				</el-upload>
				<el-button type="primary" class="my-button" @click="exp">导出
					<el-icon class="icon-right">
						<Upload />
					</el-icon>
				</el-button>
			</div>

			<el-table :data="tableData" border stripe :header-cell-class-name="headerBg"
				@selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" />
				<el-table-column prop="username" label="用户名" width="140"></el-table-column>
				<el-table-column prop="password" label="密码" width="140"></el-table-column>
				<el-table-column prop="role" label="权限" width="120"></el-table-column>
				<el-table-column prop="email" label="邮箱"></el-table-column>
				<el-table-column prop="phone" label="电话"></el-table-column>
				<el-table-column prop="address" label="地址"></el-table-column>
				<el-table-column label="操作" width="200" align="center">
					<template v-slot:default="scope">
						<el-button type="success" @click="handleEdit(scope.row)">编辑 <el-icon class="icon-right">
								<Delete />
							</el-icon></el-button>
						<el-popconfirm width="220" confirm-button-text="是的，删除" cancel-button-text="不，点错了"
							:icon="InfoFilled" icon-color="#626AEF" title="你真的要删除这条信息吗？" @confirm="del(scope.row.id)">
							<template #reference>
								<el-button type="danger" @click="handleClick">删除<el-icon class="icon-right">
										<Delete />
									</el-icon></el-button>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>

			<div style="padding: 10px 0">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="pageNum" :page-sizes="[2, 5, 10, 20]" :page-size="pageSize"
					layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>

			<el-dialog title="用户信息" v-model="dialogFormVisible" width="500" :before-close="handleClose">
				<el-form :model="form" label-width="80px" size="small">
					<el-form-item label="用户名">
						<el-input v-model="form.username" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="密码">
						<el-input v-model="form.password" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="权限">
						<el-input v-model="form.role" autocomplete="off" @input="validateRole"></el-input>
					</el-form-item>
					<el-form-item label="邮箱">
						<el-input v-model="form.email" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="电话">
						<el-input v-model="form.phone" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="地址">
						<el-input v-model="form.address" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<template #footer>
					<div class="dialog-footer">
						<el-button @click="handleClickAndCloseDialog">取消</el-button>
						<el-button type="primary" @click="save">确定</el-button>
					</div>
				</template>
			</el-dialog>
		</el-main>
	</div>
</template>
<script>
import request from "@/utils/request";
export default {
	data() {
		return {
			tableData: [],
			total: 0,
			pageNum: 1,
			pageSize: 10,
			username: "",
			email: "",
			address: "",
			form: {},
			dialogFormVisible: false,
			multipleSelection: [],
			headerBg: 'headerBg',
		}
	},
	watch: {
		'form.role'(newVal, oldVal) {
			this.previousRole = oldVal;
		}
	},
	created() {
		// 请求分页查询数据
		this.load()
	},
	computed: {
		filteredList() {
			const username = this.$store.state.userInfo.username;
			return this.listConf.list.filter(item => item.username === username);
		}
	},
	methods: {
		load() {
			this.$request.get("/user/page", {
				params: {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					username: this.username,
					email: this.email,
					address: this.address,
				}
			}).then(res => {
				this.tableData = res.records
				this.total = res.total
			})
		},
		load1(event) {
			this.handleClick(event)
			this.$request.get("/user/page", {
				params: {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					username: this.username,
					email: this.email,
					address: this.address,
				}
			}).then(res => {
				this.tableData = res.records
				this.total = res.total
			})
		},
		save(event) {
			this.handleClick(event)
			this.$request.post("/user", this.form).then(res => {
				if (res) {
					this.$message.success("保存成功")
					this.dialogFormVisible = false
					this.load()
				} else {
					this.$message.error("保存失败")
				}
			})

		},
		handleAdd(event) {
			this.dialogFormVisible = true
			this.form = {}
			this.handleClick(event)
		},

		handleEdit(row) {
			this.form = JSON.parse(JSON.stringify(row))
			this.dialogFormVisible = true
		},
		del(id) {
			request.delete("/user/" + id).then(res => {
				if (res) {
					this.$message.success("删除成功")
					this.load()
				} else {
					this.$message.error("删除失败")
				}
			})
		},
		handleSelectionChange(val) {
			console.log(val)
			this.multipleSelection = val
		},
		delBatch() {
			let ids = this.multipleSelection.map(v => v.id)  // [{}, {}, {}] => [1,2,3]
			request.post("/user/del/batch", ids).then(res => {
				if (res) {
					this.$message.success("批量删除成功")
					this.load()
				} else {
					this.$message.error("批量删除失败")
				}
			})
		},
		reset(event) {
			this.handleClick(event)
			this.username = ""
			this.email = ""
			this.address = ""
			this.load()
		},
		handleSizeChange(pageSize) {
			this.pageSize = pageSize
			this.load()
		},
		handleCurrentChange(pageNum) {
			this.pageNum = pageNum
			this.load()
		},
		exp(event) {
			window.open("http://localhost:8080/user/export")
			this.handleClick(event)
		},
		handleExcelImportSuccess() {
			this.$message.success("导入成功")
			this.load()
		},
		validateRole() {
			const validRoles = ['管理员', '普通用户'];
			if (!validRoles.includes(this.form.role)) {
				this.form.role = this.previousRole;
				this.$message.warning('只能输入"管理员"或"普通用户"！');
			} else {
				this.previousRole = this.form.role;
			}
		},
		handleClick(event) {
			// 点击后鼠标移开恢复按钮默认样式(如果按钮没有加icon图标的话，target.nodeName == "I"可以去掉)
			let target = event.target;
			if (target.nodeName == "I" || target.nodeName == "SPAN") {
				target = event.target.parentNode;
			}
			target.blur();
			//进行其他操作
		},
		handleClickAndCloseDialog(event) {
			// 点击后鼠标移开恢复按钮默认样式  
			let target = event.target;
			if (target.nodeName == "I" || target.nodeName == "SPAN") {
				target = event.target.parentNode;
			}
			// 移除焦点  
			if (target && target.blur) {
				target.blur();
			}
			// 关闭对话框  
			this.dialogFormVisible = false;
		}
	}
}
</script>

<style>
.headerBg {
	background: #eee !important;
}

.my-button {
	margin-right: 10px;
	/* 调整按钮间距 */
	display: inline-block;
	/* 确保按钮是内联块级元素 */
	vertical-align: middle;
	/* 确保按钮垂直居中 */
}

/* 最后一个按钮不需要右边距 */
.my-button:last-child {
	margin-right: 0;
}

/* 如果图标导致布局问题，可以调整图标样式 */
.icon-right {
	margin-left: 5px;
	/* 调整图标与文本之间的间距 */

}
</style>