<template>
	<div class="container">
		<c-box d="flex" w="100vw" h="100vh" flex-dir="column">
			<Navbar />
			<c-flex justify="center" direction="column" align="center">
				<Map :nodeData="nodeData" :gases="thresholds" />
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
							v-for="g in gases"
							:key="g.name"
							:gas="g.name.toUpperCase()"
							:unit="g.unit"
							:avg="avgGas(g.name)"
							:ok="g.thresholds.ok"
							:high="g.thresholds.hi"
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

	const CSE_IP = 'http://85.136.88.194';
	const CSE_PORT = 6969;
	const URL = `${CSE_IP}:${CSE_PORT}/cse-in`;

	export default {
		name: 'App',
		data: () => ({
			nodeData: [],
			gases: [
				{
					name: 'co2',
					unit: 'ppm',
					thresholds: { ok: 1000, hi: 2000 }
				},
				{
					name: 'no2',
					unit: 'ppb',
					thresholds: { ok: 55, hi: 61 }
				},
				{
					name: 'o3',
					unit: 'ppb',
					thresholds: { ok: 50, hi: 100 }
				},
				{
					name: 'so2',
					unit: 'ppb',
					thresholds: { ok: 100, hi: 200 }
				}
			]
		}),
		computed: {
			thresholds() {
				return this.gases.reduce((obj, g) => {
					obj[g.name] = g.thresholds;
					return obj;
				}, {});
			}
		},
		mounted() {
			this.getAll();
			setInterval(this.getAll.bind(this), 10000);
		},
		methods: {
			async getAll() {
				let reqUrl = `${URL}?rcn=6&ty=2`;
				console.log(reqUrl);
				let aes = await axios.get(reqUrl, {
					'X-M2M-Origin': 'CAdmin',
					'X-M2M-RVI': 3,
					'X-M2M-RI': 123456,
					Accept: 'application/json'
				});
				console.log(aes);
				this.nodeData = this.parse(aes);
			},
			parse(res) {
				const data = res['m2m:cb']['m2m:ae'];
				return data
					.slice(1, data.length + 1)
					.map((node) => node['m2m:cnt'])
					.map(([g, c]) => ({
						coordinates: JSON.parse(
							c['m2m:cin'][0]['con'].replaceAll("'", '"')
						)['coord'],
						gas: JSON.parse(
							g['m2m:cin'][0]['con'].replaceAll("'", '"')
						)
					}));
			},
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
