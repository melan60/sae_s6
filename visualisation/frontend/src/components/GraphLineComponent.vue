<template>
    <div>
        <FilterComponent :stimulis="stimulis" />
      <div style="height: 300px">
        <GraphLine :data="dataGraph" :options="options" />
      </div>
    </div>
</template>


<script>
import axios from "axios";
import _ from "lodash"
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'vue-chartjs';
import FilterComponent from './FilterComponent.vue';
import { mapGetters } from "vuex";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default {
  name: 'GraphLineComponent',
  components: {
    FilterComponent,
    GraphLine: Line,
  },
  props: {
    data: Object,
    options: Object
  },
  data: () => ({
    stimulis: null,
    dataInit: null,
    dataGraph: null
  }),
  created() {
    this.dataInit = this.data;
    this.dataGraph = this.data;
    axios.get("http://localhost:5000/graphs/stimulis")
      .then(res => {
        this.stimulis = res.data.data
      })
      .catch((e) => {
        console.log(e)
      });
  },
  computed: {
    ...mapGetters(["getStimuli"])
  },
  watch: {
    getStimuli(val) {
      this.dataGraph = _.cloneDeep(this.dataInit);

      if (val) {
        axios.get("http://localhost:5000/graphs/filter?type=" + val)
          .then(res => {
            const experiences = res.data.data;
            const list_to_print = experiences.map(exp => exp.name);
            let decalage = 0;

            this.dataInit.labels.forEach((label, index) => {
              if (!list_to_print.includes(label)) {
                this.dataGraph.labels.splice(index - decalage, 1);
                this.dataGraph.datasets[0].data.splice(index - decalage, 1); //Pour le temps d'éxecution
                this.dataGraph.datasets[1].data.splice(index - decalage, 1); //Pour le temps de réaction
                decalage += 1;
              }
            });

            var modif = _.cloneDeep(this.dataGraph); // pour actualiser la vue
            this.dataGraph = modif;
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }
}
</script>


<style scoped></style>