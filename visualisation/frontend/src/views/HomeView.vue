<template>
  <div class="grid-container">
    <div v-for="(value, index) in values" :key="index">
      <GraphBarComponent v-if="index < 2" :data="value" :options="options" />
      <GraphLineComponent v-if="index > 1" :data="value" :options="options" />
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
    options: {
      responsive: true,
      maintainAspectRatio: false
    },
    values: [],
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
    initGraph(results) {
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
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 2%;
}
</style>
