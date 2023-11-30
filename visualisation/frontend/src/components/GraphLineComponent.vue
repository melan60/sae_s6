<template>
    <div>
        <FilterComponent :stimulis="stimulis" />
      <div style="height: 300px">
        <GraphLine :data="data" :options="options" />
      </div>
    </div>
</template>


<script>
import axios from "axios";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'vue-chartjs';
import FilterComponent from './FilterComponent.vue';

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
        stimulis: null
    }),
    created() {
        axios.get("http://localhost:5000/graphs/stimulis")
            .then(res => {
                this.stimulis = res.data.data
            })
            .catch((e) => {
                console.log(e)
            });
    },
    methods: {}, // TODO route vers API pour filtrer data en fct type de stimulis
}
</script>


<style scoped></style>