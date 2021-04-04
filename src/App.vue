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
					<c-button-group>
						<c-button
							variant-color="green"
							@click="
								{
									if (pendingData.length > 0)
										nodeData.push(pendingData.pop());
								}
							"
							>Add</c-button
						>
						<c-button
							variant-color="red"
							@click="
								{
									if (nodeData.length > 0)
										pendingData.push(nodeData.pop());
								}
							"
							>Remove</c-button
						>
					</c-button-group>
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
			this.pendingData = [
				{
					gas: this.genGases(),
					coordinates: [-4.45021390914917, 36.71963561245719]
				},
				{
					gas: this.genGases(),
					coordinates: [-4.431438446044922, 36.73240113505636]
				},
				{
					gas: this.genGases(),
					coordinates: [-4.478076696395874, 36.715215125584294]
				},
				{
					gas: this.genGases(),
					coordinates: [-4.490876197814941, 36.67908918792989]
				},
				{
					gas: this.genGases(),
					coordinates: [-4.486284255981445, 36.74129146113483]
				},
				{
					gas: this.genGases(),
					coordinates: [-4.415860176086426, 36.749613386425054]
				}
			];
		},
		methods: {
			genGases() {
				return {
					co2: this.genGas(200, 2000),
					o3: this.genGas(30, 70),
					no2: this.genGas(20, 110),
					so2: this.genGas(30, 220)
				};
			},
			genGas(low, high) {
				return Math.round(Math.random() * high + low);
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
