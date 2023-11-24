<template>
    <div class="main-container">
      <div class="container-graph" v-for="(value, index) in values" :key="index">
        <div class="graph-container">
          <GraphBarComponent v-if="index < 2" :data="value" :options="options" />
          <GraphLineComponent v-if="index > 1" :data="value" :options="options" />
        </div>
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
          backgroundColor:  ['#7fdbe8', '#35a9a0', '#294f40', '#62e07f', '#2c3e50', '#6bc2e0', '#308bf4'],
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
        for (let value of res.data.data) this.initGraph(value);
      })
      .catch((e) => {
        console.log(e)
      });
  },
  methods: {
    initGraph(results) {
      this.values.push({
        labels: results.labels,
        datasets: [
          {
            label: results.titre,
            backgroundColor: '#35a9a0',
            data: results.data
          }
        ]
      })
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
</style>
