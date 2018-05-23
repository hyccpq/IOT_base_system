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
        <div id="chart" ref="chart"></div>
        <schart :canvasId="canvasId" :type="type" :data="newData" :options="options"></schart>
    </div>
</template>

<script>
    import { Table, TableColumn } from 'element-ui'
    import Schart from '../plugin/chart'
    import c3 from 'c3'
    import { getAllTem } from '../../lib/all_api'
	export default {
		name: "temComponent",
        components: {
			elTable:Table,
            elTableColumn: TableColumn,
	        schart: Schart
        },
		data() {
			return {
				value: 0,
				// allTem:[],
				tableData: [],
				ws: {},

				canvasId: 'myCanvas',
				type: 'line',
				width: 500,
				height: 400,
				newData: [],
				options: {
					padding: 50,                   // canvas 内边距
					bgColor: '#FFFFFF',            // 默认背景颜色
					title: '温度记录折线图',           // 图表标题
					titleColor: '#000000',         // 图表标题颜色
					titlePosition: 'bottom',      // 图表标题位置: top / bottom
					yEqual: 2,                     // y轴分成10等分
					fillColor: '#1E9FFF',          // 默认填充颜色
					contentColor: '#eeeeee',       // 内容横线颜色
					axisColor: '#666666',          // 坐标轴颜色
				}
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
            let name = [], value = []
		    allTem.data.tem.forEach(item => {
		    	let tem = item.temperature
                let date = this.toLocalTime(item.meta.createdAt)
		    	this.tableData.push({
                    tem,
                    date
                })
                this.newData.push({
                    name: date,
                    value: tem
                })
                name.push((new Date(date)).format("yyyy-MM-dd hh:mm:ss"))
                value.push(tem)
            })
                console.log(value);
            this.data = this.tableData
            let chart = c3.generate({
                bindto: '#chart',
                size: {width:600, height:300},
                data: {
                	columns: [
                		['时间',...name],
                        ['温度',...value]
                    ],
                    x: '时间',
                    xFormat: '%Y.%m.%d %H:%M:%S',
                    colors: { '温度': '#ff6600' }
                },
                axis:{
                	x:{
                		type: 'timeseries',
                        tick: {
                			retate: 30
                        }
                    }
                }
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
                    console.log(tem);
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