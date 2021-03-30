<template>
  <c-box w="100%" mb="4" p="4" shadow="sm">
    <div id="map"></div>
    <c-box w="25%" pl="4">
      <c-stat>
        <c-stat-label>Connected</c-stat-label>
        <c-stat-number>3</c-stat-number>
      </c-stat>
    </c-box>
  </c-box>
</template>

<script>
import { select } from "d3";
import { geoAzimuthalEquidistant, geoPath } from "d3-geo";
import * as topojson from "topojson";
import map from "../mapred.json";

export default {
  name: "Map",
  data: () => ({
    background: "#222",
    pointColor: "Aqua",
    width: 640,
    height: 240,
    filter: [], //[2, 3, 5, 8, 9, 10],
  }),
  mounted() {
    console.log(map);

    const features = topojson.merge(
      map,
      map.objects.municipios.geometries.filter((m) => {
        return !(this.filter.indexOf(m.properties.NUMERO) != -1);
      })
    );

    const data = [
      this.pointBuilder(-4.4435, 36.7626),
      this.pointBuilder(-4.4182, 36.7211),
      this.pointBuilder(-4.4699, 36.7151),
    ];

    const svg = select("#map")
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", [0, 0, this.width, this.height])
      .classed("svg-content", true);

    const projection = geoAzimuthalEquidistant().fitSize(
      [this.width, this.height],
      features
    );

    const path = geoPath().projection(projection);

    svg
      .append("path")
      .datum(features)
      .attr("fill", this.background)
      .attr("d", path);

    svg
      .append("path")
      .datum(topojson.mesh(map, map.objects.municipios, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "miter")
      .attr("stroke-width", "0.2")
      .attr("d", path);

    svg
      .append("path")
      .datum({ type: "FeatureCollection", features: data })
      .attr("d", path.pointRadius(1.5))
      .attr("fill", this.pointColor);
  },
  methods: {
    pointBuilder(lon, lat) {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lon, lat],
        },
      };
    },
  },
};
</script>
