<template>
    <div style="height: 400px;">
        <FilterComponent :stimulis="stimulis" />
        <GraphLine :data="data" :options="options" /> <!-- Use the correct component name -->
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
            stimulis: ["sonor", "visuel"]
        }
    }
}
</script>


<style scoped></style>