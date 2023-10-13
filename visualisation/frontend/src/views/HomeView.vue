<template>
  <div>

    <div class="container-graph">
      <GraphBarComponent :data="value" :options="options" class="graphique" />
      <GraphBarComponent :data="value" :options="options" class="graphique" />
    </div>

    <div class="container-graph">
      <GraphLineComponent :data="chartData" :options="options" class="graphique" />
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
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July'
      ],
      datasets: [
        {
          label: 'Data One',
          backgroundColor: '#f87979',
          data: [40, 39, 10, 40, 39, 80, 40]
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
