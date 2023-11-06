<template>
  <div class="main-container">
    <div class="container-graph">
      <div class="graph-container">
        <GraphBarComponent :data="value" :options="options" class="graphique" />
      </div>
      <div class="graph-container">
        <GraphBarComponent :data="value" :options="options" class="graphique" />
      </div>
    </div>

    <div class="container-graph">
      <div class="graph-container">
        <GraphLineComponent :data="value" :options="options" class="graphique" />
      </div>
      <div class="graph-container">
        <GraphLineComponent :data="chartData" :options="options" class="graphique" />
      </div>
    </div>

  </div>
</template>

<script>
import GraphBarComponent from '@/components/GraphBarComponent.vue'
import GraphLineComponent from '@/components/GraphLineComponent.vue'

export default {
  name: 'HomeView',
  components: {
    GraphBarComponent,
    GraphLineComponent
  },
  data: () => ({
    value: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Data One',
          backgroundColor: ['#7fdbe8', '#35a9a0', '#294f40', '#62e07f', '#2c3e50', '#6bc2e0', '#308bf4'],
          data: [40, 39, 10, 40, 39, 80, 40]
        }
      ]
    },
    chartData: {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'Scatter Dataset 1',
          fill: false,
          borderColor: '#308bf4',
          backgroundColor: ['#308bf4', '#7fdbe8'],
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
    options: {
      responsive: true,
      maintainAspectRatio: true
    }
  })
}
</script>


<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container-graph {
  display: flex;
  width: 100%;
  justify-content: center;
}

.graphique {
  width: 100%;
}

.graph-container {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  width: 45%;
  box-sizing: border-box;
}
</style>