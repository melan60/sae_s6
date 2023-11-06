<template>
    <div>
        <FilterComponent :stimulis="stimulis" />
        <GraphLine :data="data" :options="options" />
    </div>
</template>


<script>
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'vue-chartjs'
import FilterComponent from './FilterComponent.vue'

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
    data() {
        return {
            stimulis: ["Sonor", "Visuel"]
        }
    }
}
</script>


<style scoped></style>