<template>
	<c-box
		w="100%"
		mb="4"
		p="4"
		shadow="md"
		:bg="$theme[$store.getters.colorMode].mapBg"
	>
		<c-radio-group v-model="selectedGas" is-inline variant-color="primary">
			<c-radio value="co2">CO2</c-radio>
			<c-radio value="o3">O3</c-radio>
			<c-radio value="no2">NO2</c-radio>
			<c-radio value="so2">SO2</c-radio>
		</c-radio-group>
		<div id="map"></div>
		<c-stat pl="4">
			<c-stat-label>Connected devices</c-stat-label>
			<c-stat-number>{{
				N > 0 ? `${N} connected` : 'No devices connected'
			}}</c-stat-number>
		</c-stat>
	</c-box>
</template>

<script>
	import { select } from 'd3';
	import { geoAzimuthalEquidistant, geoPath } from 'd3-geo';
	import { geoVoronoi } from 'd3-geo-voronoi';
	import * as topojson from 'topojson';
	import map from '../mapred.json';

	const width = 1920;
	const height = 600;
	const pointSize = 5;

	export default {
		name: 'Map',
		data: () => ({
			selectedGas: 'co2'
			// muniFilter: [], [2, 3, 5, 8, 9, 10],
		}),
		watch: {
			bayWatch: function() {
				this.drawVoronoi();
				this.drawPoints();
			},
			background: function() {
				this.drawMap();
				this.createVoronoiNode();
				this.drawVoronoi();
				this.drawPoints();
			}
		},
		props: {
			nodeData: Array,
			gases: Object
		},
		computed: {
			N() {
				return this.nodeData.length;
			},
			background() {
				return this.$theme[this.$store.getters.colorMode].color;
			},
			bayWatch() {
				return this.nodeData, this.selectedGas, Date.now();
			},
			ok() {
				return this.gases[this.selectedGas].ok;
			},
			hi() {
				return this.gases[this.selectedGas].hi;
			},
			points() {
				return this.nodeData.map(this.pointBuilder);
			}
		},
		mounted() {
			this.features = topojson.merge(
				map,
				map.objects.municipios.geometries
			);

			this.mesh = topojson.mesh(
				map,
				map.objects.municipios,
				(a, b) => a !== b
			);

			this.svg = select('#map')
				.append('svg')
				.attr('viewBox', [0, 0, width, height])
				.attr('preserveAspectRatio', 'xMinYMin meet')
				.classed('svg-content', true);

			this.clip = this.svg
				.append('defs')
				.append('clipPath')
				.attr('id', 'clip-mask');

			this.projection = geoAzimuthalEquidistant().fitSize(
				[width, height],
				this.features
			);

			this.path = geoPath().projection(this.projection);

			this.clip
				.append('path')
				.datum(this.features)
				.attr('d', this.path);

			this.drawMap();

			this.createVoronoiNode();

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
			drawMap() {
				if (this.mapPath) {
					this.mapPath.remove();
				}
				this.mapPath = this.svg
					.append('path')
					.datum(this.features)
					.attr('fill', this.background)
					.attr('d', this.path);
			},
			createVoronoiNode() {
				this.voronoiNode = this.svg
					.append('g')
					.attr('fill', this.background)
					.attr('clip-path', 'url(#clip-mask)');
			},
			pointBuilder({ gas, coordinates }) {
				return {
					type: 'Feature',
					properties: {
						gas
					},
					geometry: {
						type: 'Point',
						coordinates: coordinates.map((c) => c.toFixed(6))
					}
				};
			},
			drawPoints() {
				if (this.pointPath) this.pointPath.remove();
				this.pointPath = this.svg
					.append('path')
					.datum({
						type: 'FeatureCollection',
						features: this.points
					})
					.attr(
						'd',
						this.path.pointRadius(pointSize / Math.sqrt(this.N + 1))
					)
					.attr('fill', this.$theme.dark.mapBg)
					.attr('clip-path', 'url(#clip-mask)');
			},
			drawVoronoi() {
				if (this.voronoiSubNode) this.voronoiSubNode.remove();
				this.voronoiSubNode = this.voronoiNode
					.append('g')
					.selectAll('path')
					.data(geoVoronoi().polygons(this.points).features)
					.enter()
					.append('path')
					.attr('d', this.path)
					.attr('pointer-events', 'all')
					.attr('fill', (p) => {
						const g =
							p.properties.site.properties.gas[this.selectedGas];
						if (g < this.ok) return this.$theme.gas.lo;
						else if (g < this.hi) return this.$theme.gas.ok;
						else return this.$theme.gas.hi;
					});

				this.voronoiSubNode.append('title').text((node) => {
					let gs = node.properties.site.properties.gas;
					const cs = node.properties.sitecoordinates;
					return `Lon: ${cs[0]}, Lat: ${cs[1]}\nCO2: ${gs.co2}\nNO2: ${gs.no2}\nO3:  ${gs.o3}\nSO2: ${gs.so2}`;
				});
			}
		}
	};
</script>
