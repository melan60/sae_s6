<template>
  <div style="height: 400px;">
    <Bar :data="data" :options="options"/>
  </div>
</template>


<script>
import {BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip} from 'chart.js'
import {Bar} from 'vue-chartjs'

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
