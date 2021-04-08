<template>
	<div class="container">
		<c-box
			d="flex"
			w="100vw"
			h="100vh"
			flex-dir="column"
			v-bind="$theme[$store.getters.colorMode]"
		>
			<Navbar :colorMode="$store.getters.colorMode">
				<c-button
					@click="changeColor"
					:bg="$theme[$store.getters.colorMode].mapBg"
					shadow="lg"
					size="lg"
					rounded="lg"
					mr="4"
				>
					{{ $store.getters.colorMode == 'light' ? '🌚' : '🌞' }}
				</c-button>
			</Navbar>
			<c-flex justify="center" direction="column" align="center">
				<Map :nodeData="nodeData" :gases="thresholds" />
				<c-divider />
				<c-box
					:width="[
						'100%', // base
						'80%', // 480px upwards
						'70%', // 768px upwards
						'50%' // 992px upwards
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

	const API_IP = '192.168.1.137';
	const API_PORT = 3000;
	const URL = `http://${API_IP}:${API_PORT}/getData`;

	export default {
		name: 'App',
		inject: ['$chakraColorMode', '$toggleColorMode'],

		data: () => ({
			nodeData: [],
			gases: [
				{
					name: 'co2',
					unit: 'ppm',
					thresholds: { ok: 1000, hi: 2000 }
				},
				{
					name: 'o3',
					unit: 'ppb',
					thresholds: { ok: 50, hi: 100 }
				},
				{
					name: 'no2',
					unit: 'ppb',
					thresholds: { ok: 55, hi: 61 }
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
			changeColor() {
				console.log('From', this.$store.getters.colorMode);
				this.$toggleColorMode();
				this.$store.commit('changeColor', this.$chakraColorMode());
				console.log('To', this.$store.getters.colorMode);
			},
			async getAll() {
				let { data } = await axios.get(URL, {
					headers: {
						Accept: 'application/json'
					}
				});
				this.nodeData = data;
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
