<template>
  <div>

    <div class="container-graph">
      <GraphBarComponent :data="value" :options="options" class="graphique" />
      <GraphBarComponent :data="value" :options="options" class="graphique" />
    </div>

    <div class="container-graph">
      <GraphLineComponent :data="value" :options="options" class="graphique" />
      <GraphLineComponent :data="chartData" :options="options" class="graphique" />
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
          backgroundColor: '#f87979',
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
          borderColor: '#f87979',
          backgroundColor: '#f87979',
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
      maintainAspectRatio: false
    }
  })
}
</script>


<style scoped>
.container-graph {
  display: flex;
  flex-wrap: wrap;
}

.graphique {
  width: 50%;
}
</style>
