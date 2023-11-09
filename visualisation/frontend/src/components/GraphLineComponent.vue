<template>
    <div style="height: 400px;">
        {{ data }}
        <FilterComponent :stimulis="stimulis" />
        <GraphLine :data="data" :options="options" /> <!-- Use the correct component name -->
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
        stimulis: null // TODO routes vers API pour récup tous les stimulis
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
    methods: {} // TODO route vers API pour filtrer data en fct type de stimulis
}
</script>


<style scoped></style>