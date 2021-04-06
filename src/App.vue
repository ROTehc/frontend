<template>
	<div class="container">
		<c-box d="flex" w="100vw" h="100vh" flex-dir="column">
			<Navbar />
			<c-flex justify="center" direction="column" align="center">
				<Map :nodeData="nodeData" :thresholds="thresholds" />
				<c-box
					:width="[
						'100%', // base
						'50%', // 480px upwards
						'70%', // 768px upwards
						'40%' // 992px upwards
					]"
				>
					<c-stat-group>
						<Stat
							gas="CO2"
							unit="ppm"
							:avg="avgGas('co2')"
							:ok="1000"
							:high="2000"
						/>
						<Stat
							gas="O3"
							unit="ppb"
							:avg="avgGas('o3')"
							:ok="55"
							:high="61"
						/>
						<Stat
							gas="NO2"
							unit="ppb"
							:avg="avgGas('no2')"
							:ok="50"
							:high="100"
						/>
						<Stat
							gas="SO2"
							unit="ppb"
							:avg="avgGas('so2')"
							:ok="100"
							:high="200"
						/>
					</c-stat-group>
				</c-box>
			</c-flex>
		</c-box>
	</div>
</template>

<script>
	import Navbar from '@/components/Navbar';
	import Map from '@/components/Map';
	import Stat from '@/components/Stat';
	import axios from 'axios';

	export default {
		name: 'App',
		data: () => ({
			nodeData: [],
			thresholds: {
				co2: [1000, 2000],
				no2: [55, 61],
				o3: [50, 100],
				so2: [100, 200]
			}
		}),
		mounted() {
			setInterval(
				async function() {
					let { data } = await axios.get(
						'http://192.168.1.137:3000',
						{
							'Access-Control-Allow-Origin': '*'
						}
					);
					data = Object.keys(data).map((k) => data[k]);
					console.table(data);
					this.nodeData = data;
				}.bind(this),
				2500
			);
		},
		methods: {
			avgGas(gas) {
				return Math.round(
					this.nodeData.reduce((p, c) => p + c.gas[gas], 0) /
						this.nodeData.length
				);
			}
		},
		components: {
			Navbar,
			Map,
			Stat
		}
	};
</script>
