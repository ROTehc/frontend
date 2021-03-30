<template>
  <c-stat shadow="md" border-width="1px" p="2" m="2">
    <c-stat-label>Avg. {{ gas }}</c-stat-label>
    <c-stat-number :color="color">{{ text }}</c-stat-number>
  </c-stat>
</template>

<script>
export default {
  props: {
    gas: String,
    unit: String,
    avg: Number,
    ok: Number,
    high: Number,
  },
  computed: {
    text() {
      return isNaN(this.avg) ? "No data" : `${this.avg} ${this.unit}`;
    },
    color() {
      if (isNaN(this.avg)) return "";
      if (this.avg < this.ok) return "Green";
      else if (this.avg < this.high) return "DarkOrange";
      else return "Red";
    },
  },
};
</script>

<style>
</style>