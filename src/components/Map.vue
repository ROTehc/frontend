<template>
  <div id="map"></div>
</template>

<script>
import { select } from "d3";
import { geoIdentity, geoPath } from "d3-geo";
import * as topojson from "topojson";
import malaga from "../malaga.json";

export default {
  name: "Map",
  data: () => ({
    data: [
      { geometry: { type: "Point", coordinates: [0, 0] } },
      { geometry: { type: "Point", coordinates: [0, 1] } },
      { geometry: { type: "Point", coordinates: [1, 0] } },
      { geometry: { type: "Point", coordinates: [1, 1] } },
    ],
    map: {
      width: 360,
      height: 144,
    },
  }),
  mounted() {
    const featureCollection = topojson.feature(
      malaga,
      malaga.objects.collection
    );

    const svg = select("#map").append("svg").attr("viewBox", [0, 0, 360, 144]);
    const projection = geoIdentity()
      .reflectY(true)
      .fitSize([this.map.width, this.map.height], featureCollection);
    const path = geoPath().projection(projection);
    const g = svg.append("g").attr("fill", "grey");

    g.selectAll("path")
      .data(featureCollection.features)
      .enter()
      .append("path")
      .attr("d", path);

    svg
      .append("path")
      .datum({ type: "FeatureCollection", features: this.data })
      .attr("d", geoPath(projection).pointRadius(1.5));
  },
};
</script>
