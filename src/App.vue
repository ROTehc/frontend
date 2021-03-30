<template>
  <div class="container">
    <c-box d="flex" w="100vw" h="100vh" flex-dir="column">
      <Navbar />
      <c-flex justify="center" direction="column" align="center">
        <Map :data="data" />
        <c-button-group>
          <c-button
            variant-color="green"
            @click="
              {
                if (pendingData.length > 0) data.push(pendingData.pop());
              }
            "
            >Add</c-button
          >
          <c-button
            variant-color="red"
            @click="
              {
                if (data.length > 0) pendingData.push(data.pop());
              }
            "
            >Remove</c-button
          >
        </c-button-group>
        <c-box
          :width="[
            '100%', // base
            '50%', // 480px upwards
            '70%', // 768px upwards
            '30%', // 992px upwards
          ]"
        >
          <c-stat-group>
            <Stat
              gas="CO2"
              unit="ppm"
              :avg="avgGas('co2')"
              :ok="1000"
              :high="2000"
            />
            <Stat gas="O3" unit="ppb" :avg="avgGas('o3')" :ok="55" :high="61" />
            <Stat
              gas="NO2"
              unit="ppb"
              :avg="avgGas('no2')"
              :ok="50"
              :high="100"
            />
            <Stat
              gas="SO2"
              unit="ppb"
              :avg="avgGas('so2')"
              :ok="100"
              :high="200"
            />
          </c-stat-group>
        </c-box>
      </c-flex>
    </c-box>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import Map from "@/components/Map";
import Stat from "@/components/Stat";

export default {
  name: "App",
  data: () => ({
    id: null,
    name: "",
    lon: -4.415860176086426,
    lat: 36.749613386425054,
    data: [],
    pendingData: [
      {
        id: 0,
        name: "House",
        gas: {
          co2: Math.random() * 2500 + 200,
          o3: Math.random() * 70 + 30,
          no2: Math.random() * 110 + 40,
          so2: Math.random() * 220 + 90,
        },
        coordinates: [-4.45021390914917, 36.71963561245719],
      },
      {
        id: 1,
        name: "IDK",
        gas: {
          co2: Math.random() * 2500 + 200,
          o3: Math.random() * 70 + 30,
          no2: Math.random() * 110 + 40,
          so2: Math.random() * 220 + 90,
        },
        coordinates: [-4.431438446044922, 36.73240113505636],
      },
      {
        id: 2,
        name: "ETSII",
        gas: {
          co2: Math.random() * 2500 + 200,
          o3: Math.random() * 70 + 30,
          no2: Math.random() * 110 + 40,
          so2: Math.random() * 220 + 90,
        },
        coordinates: [-4.478076696395874, 36.715215125584294],
      },
      {
        id: 3,
        name: "Airport",
        gas: {
          co2: Math.random() * 2500 + 200,
          o3: Math.random() * 70 + 30,
          no2: Math.random() * 110 + 40,
          so2: Math.random() * 220 + 90,
        },
        coordinates: [-4.490876197814941, 36.67908918792989],
      },
      {
        id: 4,
        name: "Something",
        gas: {
          co2: Math.random() * 2500 + 200,
          o3: Math.random() * 70 + 30,
          no2: Math.random() * 110 + 40,
          so2: Math.random() * 220 + 90,
        },
        coordinates: [-4.486284255981445, 36.74129146113483],
      },
      {
        id: 5,
        name: "Jardin",
        gas: {
          co2: Math.random() * 2500 + 200,
          o3: Math.random() * 70 + 30,
          no2: Math.random() * 110 + 20,
          so2: Math.random() * 220 + 40,
        },
        coordinates: [-4.415860176086426, 36.749613386425054],
      },
    ],
  }),
  methods: {
    avgGas(gas) {
      return Math.round(
        this.data.reduce((p, c) => p + c.gas[gas], 0) / this.data.length
      );
    },
  },
  components: {
    Navbar,
    Map,
    Stat,
  },
};
</script>
