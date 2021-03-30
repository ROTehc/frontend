<template>
  <div class="container">
    <c-box d="flex" w="100vw" h="100vh" flex-dir="column">
      <Navbar />
      <c-flex justify="center" direction="column" align="center">
        <Map />
        <c-stat>
          <c-stat-label>Connected devices</c-stat-label>
          <c-stat-number>37</c-stat-number>
        </c-stat>
      </c-flex>
    </c-box>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import Map from "@/components/Map";
export default {
  name: "App",
  components: {
    Navbar,
    Map,
  },
};
</script>
