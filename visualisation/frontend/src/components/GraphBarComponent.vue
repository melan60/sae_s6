<template>
  <div style="height: 400px;">
    <Bar :data="data" :options="options" />
  </div>
</template>


<script>
import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
  name: 'GraphBarComponent',
  components: {
    Bar
  },
  props: {
    data: Object,
    options: Object
  },
}
</script>


<style scoped></style>
  