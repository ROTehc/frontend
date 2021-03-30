<template>
  <c-box w="100%" mb="4" p="4" shadow="sm">
    <div id="map"></div>
    <c-stat pl="4">
      <c-stat-label>Connected devices</c-stat-label>
      <c-stat-number>{{
        points.length > 0
          ? `${points.length} connected`
          : "No devices connected"
      }}</c-stat-number>
    </c-stat>
  </c-box>
</template>

<script>
import { select } from "d3";
import { geoAzimuthalEquidistant, geoPath } from "d3-geo";
import { geoVoronoi } from "d3-geo-voronoi";
import * as topojson from "topojson";
import map from "../mapred.json";

export default {
  name: "Map",
  data: () => ({
    width: 512,
    height: 180,
    background: "#222",
    pointColor: "Yellow",
    // muniFilter: [], [2, 3, 5, 8, 9, 10],
  }),
  watch: {
    data: function () {
      this.drawPoints();
      this.drawVoronoi();
    },
  },
  props: {
    data: Array,
  },
  computed: {
    points() {
      return this.data.map(this.pointBuilder);
    },
  },
  mounted() {
    this.features = topojson.merge(map, map.objects.municipios.geometries);

    this.mesh = topojson.mesh(map, map.objects.municipios, (a, b) => a !== b);

    this.svg = select("#map")
      .append("svg")
      .attr("viewBox", [0, 0, this.width, this.height])
      .attr("preserveAspectRatio", "xMinYMin meet")
      .classed("svg-content", true);

    this.clip = this.svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip-mask");

    this.projection = geoAzimuthalEquidistant().fitSize(
      [this.width, this.height],
      this.features
    );

    this.path = geoPath().projection(this.projection);

    this.clip.append("path").datum(this.features).attr("d", this.path);

    this.svg
      .append("path")
      .datum(this.features)
      .attr("fill", this.background)
      .attr("d", this.path);

    this.pointNode = this.svg.append("g");
    this.voronoiNode = this.svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 0.2)
      .attr("pointer-events", "all")
      .attr("clip-path", "url(#clip-mask)");

    /*
    this.svg
      .append("path")
      .datum(this.mesh)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "miter")
      .attr("stroke-width", "0.2")
      .attr("d", this.path);
      */
  },
  methods: {
    pointBuilder({ id, name, gas, coordinates }) {
      return {
        type: "Feature",
        properties: {
          id,
          name,
          gas,
        },
        geometry: {
          type: "Point",
          coordinates,
        },
      };
    },
    drawPoints() {
      if (this.pointPath) this.pointPath.remove();
      this.pointPath = this.pointNode.append("path");
      this.pointPath
        .datum({
          type: "FeatureCollection",
          features: this.points,
        })
        .attr("d", this.path.pointRadius(1))
        .attr("fill", this.pointColor);
    },
    drawVoronoi() {
      if (this.voronoiPath) this.voronoiPath.remove();
      this.voronoiPath = this.voronoiNode.append("path");
      this.voronoiNode
        .selectAll("path")
        .data(geoVoronoi().polygons(this.points).features)
        .join("path")
        .attr("d", this.path)
        .append("title")
        .text((d) => {
          const p = d.properties.site.properties;
          console.log(p);
          return p.gas.co2;
        });
    },
  },
};
</script>
