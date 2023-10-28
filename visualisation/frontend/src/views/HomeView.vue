<template>
  <div>

    <div v-for="(value, index) in values" :key="index">
      <div v-if="index < 2" class="container-graph">
        <GraphBarComponent :data="value" :options="options" class="graphique" />
      </div>

      <div v-if="index > 1" class="container-graph">
        <GraphLineComponent :data="value" :options="options" class="graphique" />
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
.container-graph {
  display: flex;
  flex-wrap: wrap;
}

.graphique {
  width: 50%;
}
</style>
