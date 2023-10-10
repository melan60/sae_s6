<template>
    <div>
        <FilterComponent v-if="filter" :stimulis="stimulis" />
        <br>
        <p>Graphique component {{ donnees }}</p>
        <Bar :data="donnees" :options="options" />
    </div>
</template>


<script>
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import FilterComponent from '@/components/FilterComponent.vue'

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
    name: 'GraphBarComponent',
    components: {
        Bar,
        FilterComponent
    },
    props: {
        donnees: {},
        filter: Boolean
        // label_abscisse: String,
        // label_ordonnee: String,
        // titre: String
    },
    data: () => ({
        options: {
            responsive: true,
            maintainAspectRatio: false
        },
        stimulis: ["sonor", "visuel"]
    })
}
</script>


<style scoped></style>