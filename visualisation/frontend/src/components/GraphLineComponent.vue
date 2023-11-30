<template>
  <div style="height: 400px;">
    <FilterComponent :stimulis="stimulis"/>
    <GraphLine :data="dataGraph" :options="options"/>
  </div>
</template>


<script>
import axios from "axios";
import _ from "lodash"
import {Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js';
import {Line} from 'vue-chartjs';
import FilterComponent from './FilterComponent.vue';
import {mapGetters} from "vuex";

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

                  var list_experience_a_afficher = []

                  for (let i = 0; i < this.dataGraph.labels.length; i++) { // TODO filter modif api rqte contains

                    experiences.forEach(experience => {

                      if (this.dataGraph.labels[i] == experience.name) {
                        list_experience_a_afficher.push(i)
                      }
                    });
                  }

                  var copy_datatGraph = _.cloneDeep(this.dataInit);

                  for (let i = 0; i < copy_datatGraph.labels.length; i++) {
                    experiences.forEach(experience => {
                    if (copy_datatGraph.labels[i] != experience.name && !list_experience_a_afficher.includes(i)) {
                      console.log("test3")
                      this.dataGraph.labels.splice(i, 1)
                      this.dataGraph.datasets[0].data.splice(i, 1) //Pour le temps d'éxecution
                      this.dataGraph.datasets[1].data.splice(i, 1) //Pour le temps de réaction
                    }
                    });
                  }

                  var modif = _.cloneDeep(this.dataGraph);

                  this.dataGraph = modif;
                }
            )
            .catch((e) => {
              console.log(e)
            });
      }
    }
  }
  ,
  methods: {} // TODO route vers API pour filtrer data en fct type de stimulis
}
</script>


<style scoped></style>