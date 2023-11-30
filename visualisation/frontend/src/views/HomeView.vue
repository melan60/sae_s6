<template>
  <div class="grid-container">
    <div v-for="(value, index) in values" :key="index">
      <GraphBarComponent v-if="index < 3" :data="value" :options="options" />
      <GraphLineComponent v-else :data="value" :options="options" />
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
  async created() {
    const user = this.$store.getters.getUser;
    try {
      const res = user ? await axios.get(`http://localhost:5000/graphs/users?id_user=${user._id}`) :
        await axios.get("http://localhost:5000/graphs/time");
      this.initGraph(res.data.data);
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    initGraph(results) {
      const colors = ["#CF0071", "#830090"];
      let value, labels, datasets;

      for (let index = 0; index < results.length; index += 1) {
        value = results[index];
        labels = value.labels || (value.first && value.first.labels);

        datasets = value.first
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
