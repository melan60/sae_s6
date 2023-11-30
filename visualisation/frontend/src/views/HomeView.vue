<template>

<!--  <div class="main-container">
    <div class="container-graph" v-for="(value, index) in values" :key="index">
      <div class="graph-container">
        <GraphBarComponent v-if="index < 2" :data="value" :options="options"/>
        <GraphLineComponent v-if="index > 1" :data="value" :options="options"/>
      </div>
    </div>-->

    <div class="grid-container">
      <div v-for="(value, index) in values" :key="index">
        <GraphBarComponent v-if="index < 3" :data="value" :options="options"/>
        <GraphLineComponent v-else :data="value" :options="options"/>
      </div>
    </div>

</template>

<script>
import axios from "axios";
import GraphBarComponent from '@/components/GraphBarComponent.vue';
import GraphLineComponent from '@/components/GraphLineComponent.vue';

export default {
  name: 'HomeView',
  components: {
    GraphBarComponent,
    GraphLineComponent
  },
  data: () => ({
    chartData: {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'Scatter Dataset 1',
          fill: false,
          borderColor: '#308bf4',
          backgroundColor: ['#7fdbe8', '#35a9a0', '#294f40', '#62e07f', '#2c3e50', '#6bc2e0', '#308bf4'],
          data: [
            {
              x: -2,
              y: 4
            },
            {
              x: -1,
              y: 1
            },
            {
              x: 0,
              y: 0
            },
            {
              x: 1,
              y: 1
            },
            {
              x: 2,
              y: 4
            }
          ]
        },
        {
          label: 'Scatter Dataset 2',
          fill: false,
          borderColor: '#7acbf9',
          backgroundColor: '#7acbf9',
          data: [
            {
              x: -2,
              y: -4
            },
            {
              x: -1,
              y: -1
            },
            {
              x: 0,
              y: 1
            },
            {
              x: 1,
              y: -1
            },
            {
              x: 2,
              y: -4
            }
          ]
        }
      ]
    },
    values: [],
    options: {
      responsive: true,
      maintainAspectRatio: false,
    }
  }),
  created() {
    axios.get("http://localhost:5000/graphs/time")
        .then(res => {
          this.initGraph(res.data.data);
        })
        .catch((e) => {
          console.log(e)
        });
  },
  methods: {
    initGraph(results) { // TODO duplication de code
      const colors = ["#CF0071", "#830090"];

      for (let index = 0; index < results.length; index += 1) {
        const value = results[index];
        const labels = value.labels || (value.first && value.first.labels);

        const datasets = value.first
            ? Object.values(value).map((item, id) => {
              return ({
                label: item.title,
                backgroundColor: colors[id % colors.length],
                borderColor: colors[id % colors.length],
                data: item.data
              })
            }) : [{
              label: value.title,
              backgroundColor: colors[index % colors.length],
              borderColor: colors[index % colors.length],
              data: value.data
            }];

        this.values.push({
          labels: labels,
          datasets: datasets
        });
      }
    }
  }
}
</script>


<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
}

.container-graph {
  display: flex;
  width: 100%;
  justify-content: center;
  align-content: center;
  align-items: center;
}

.graph-container {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  width: calc(50% - 20px);
  box-sizing: border-box;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 2%;
}
</style>
