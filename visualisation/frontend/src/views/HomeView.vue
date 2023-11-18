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
      for (let index = 0; index < results.length; index += 1) {
        const value = results[index];
        const labels = value.labels || (value.first && value.first.labels);

        const datasets = value.first
          ? Object.values(value).map(item => {
            return ({
              label: item.title,
              backgroundColor: '#35a9a0',
              borderColor: '#25355980',
              data: item.data
            })
          }) : [
            {
              label: value.title,
              backgroundColor: '#35a9a0',
              borderColor: '#25355980',
              data: value.data
            }
          ];

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
