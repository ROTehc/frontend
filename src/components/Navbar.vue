<template>
	<c-box :bg="$theme[colorMode].bg">
		<c-flex align="center" justify="space-between">
			<c-heading p="4" :color="$theme[colorMode].color"
				>ROTehc 🗿</c-heading
			>
			<c-divider orientation="vertical" />
			<slot></slot>
		</c-flex>
	</c-box>
</template>

<script>
	export default {
		props: {
			colorMode: String
		}
	};
</script>

<style></style>
