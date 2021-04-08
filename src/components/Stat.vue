<template>
	<c-stat
		shadow="lg"
		rounded="lg"
		:border-width="$store.getters.colorMode == 'light' ? '' : '2px'"
		:borderColor="color"
		:bg="$theme[$store.getters.colorMode].mapBg"
		p="2"
		m="2"
	>
		<c-stat-label>Avg. {{ gas }}</c-stat-label>
		<c-stat-number :color="color" fontFamily="mono" fontSize="2xl">
			{{ text }}
		</c-stat-number>
	</c-stat>
</template>

<script>
	export default {
		props: {
			gas: String,
			unit: String,
			avg: Number,
			ok: Number,
			high: Number
		},
		computed: {
			text() {
				return isNaN(this.avg) ? 'No data' : `${this.avg} ${this.unit}`;
			},
			color() {
				if (isNaN(this.avg)) return '';
				if (this.avg < this.ok) return this.$theme.gas.lo;
				else if (this.avg < this.high) return this.$theme.gas.ok;
				else return this.$theme.gas.hi;
			}
		}
	};
</script>

<style></style>
