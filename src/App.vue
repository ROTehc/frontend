<template>
  <div class="container">
    <c-box d="flex" w="100vw" h="100vh" flex-dir="column">
      <Navbar />
      <c-flex justify="center" direction="column" align="center">
        <Map />
        <c-box w="45%">
          <c-stat-group>
            <c-stat shadow="md" border-width="1px" p="2" m="2">
              <c-stat-label>Avg. CO<sub>2</sub></c-stat-label>
              <c-stat-number color="DarkOrange">420 ppm</c-stat-number>
            </c-stat>
            <c-stat shadow="md" border-width="1px" p="2" m="2">
              <c-stat-label>Avg. NO</c-stat-label>
              <c-stat-number color="ForestGreen">30 ppm</c-stat-number>
            </c-stat>
            <c-stat shadow="md" border-width="1px" p="2" m="2">
              <c-stat-label>Avg. NO<sub>2</sub></c-stat-label>
              <c-stat-number color="Crimson">200 ppm</c-stat-number>
            </c-stat>
          </c-stat-group>
        </c-box>
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
