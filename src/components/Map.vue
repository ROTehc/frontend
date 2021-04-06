<template>
	<c-box w="100%" mb="4" p="4" shadow="sm">
		<c-radio-group v-model="selectedGas" is-inline>
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

	export default {
		name: 'Map',
		data: () => ({
			width: 1920,
			height: 600,
			background: '#222',
			pointSize: 2,
			pointColor: 'Black',
			selectedGas: 'co2'
			// muniFilter: [], [2, 3, 5, 8, 9, 10],
		}),
		watch: {
			bayWatch: function() {
				this.drawVoronoi();
				this.drawPoints();
			}
		},
		props: {
			nodeData: Array,
			thresholds: Object
		},
		computed: {
			N() {
				return this.nodeData.length;
			},
			bayWatch() {
				return this.nodeData, this.selectedGas, Date.now();
			},
			low() {
				return this.thresholds[this.selectedGas][0];
			},
			high() {
				return this.thresholds[this.selectedGas][1];
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
				.attr('viewBox', [0, 0, this.width, this.height])
				.attr('preserveAspectRatio', 'xMinYMin meet')
				.classed('svg-content', true);

			this.clip = this.svg
				.append('defs')
				.append('clipPath')
				.attr('id', 'clip-mask');

			this.projection = geoAzimuthalEquidistant().fitSize(
				[this.width, this.height],
				this.features
			);

			this.path = geoPath().projection(this.projection);

			this.clip
				.append('path')
				.datum(this.features)
				.attr('d', this.path);

			this.svg
				.append('path')
				.datum(this.features)
				.attr('fill', this.background)
				.attr('d', this.path);

			this.voronoiNode = this.svg
				.append('g')
				.attr('fill', this.background)
				.attr('clip-path', 'url(#clip-mask)');

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
						this.path.pointRadius((this.pointSize * 4) / this.N)
					)
					.attr('fill', this.pointColor)
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
						console.log('Coloring');
						if (g < this.low) return 'forestgreen';
						else if (g < this.high) return 'Gold';
						else return 'FireBrick';
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
