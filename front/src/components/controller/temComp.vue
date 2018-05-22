<template>
    <div>
        <div>当前温度为 {{ this.value }}</div>
        <el-table
            :data="tableData"
            border
            style="width: 360px">
            <el-table-column
                prop="date"
                label="日期"
                width="180">
            </el-table-column>
            <el-table-column
                prop="tem"
                label="温度"
                width="180">
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    import { Table, TableColumn } from 'element-ui'
    import { getAllTem } from '../../lib/all_api'
	export default {
		name: "temComponent",
        components: {
			elTable:Table,
            elTableColumn: TableColumn
        },
        data() {
			return {
				value: 0,
                // allTem:[],
                tableData: []
            }
        },
        methods:{
		    toLocalTime(UTCTime){
		    	let time = new Date(UTCTime)
                let localTime = time.toLocaleString()
                return localTime
            }
        },
        async beforeCreate(){
		    let allTem = await getAllTem()
		    allTem.data.tem.forEach(item => {
		    	this.tableData.push({
                    date: this.toLocalTime(item.meta.createdAt),
                    tem: item.temperature
                })
            })
        },
        mounted(){
			this.ws = new WebSocket('ws://localhost:2333')
                // console.log("新建一个")
            this.ws.onopen = ev => {
				console.log('连接已经打开');
            }
            this.ws.onmessage = ev => {
                let tem = JSON.parse(ev.data)
                this.value = tem.T
            }
        },
        beforeDestroy(){
		    console.log("断开socket")
		    this.ws.close()
            this.ws = {}
        },
	}
</script>

<style scoped>

</style>