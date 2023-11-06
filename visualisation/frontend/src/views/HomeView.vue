<template>
  <div class="graphs_page">

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
.graphs_page {
  padding: 2%;
}
</style>
