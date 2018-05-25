<template>
    <div>
        <canvas :id="canvasId"></canvas>
    </div>
</template>

<script>
import veLine from 'v-charts/lib/line'
export default {
	created () {
		this.chartData = {
			column: ['温度'],
			rows: [
				{'日期':},
			]
        }
    }
}
</script>

<style scoped>
    #myCanvas {
        width: 100%;
    }
</style>