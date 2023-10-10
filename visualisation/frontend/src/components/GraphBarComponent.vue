<template>
    <div>
      <!-- Afficher le composant de filtre si "filter" est vrai -->
      <FilterComponent v-if="filter" :stimulis="stimulis" />
  
      <!-- Conteneur du graphique avec une hauteur maximale et défilement vertical si nécessaire -->
      <div class="chart-container">
        <p>Graphique component {{ donnees }}</p>
        <Bar :data="donnees" :options="options" />
      </div>
    </div>
  </template>
  
  <script>
  import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
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
      donnees: Object, 
      filter: Boolean
    },
    data() {
      return {
        options: {
          responsive: true,
          maintainAspectRatio: false
        },
        stimulis: ["sonor", "visuel"]
      }
    }
  }
  </script>
  
  <style scoped>
  /* Style pour le conteneur du graphique */
  .chart-container {
    max-height: 400px; 
    overflow-y: auto; 
  }
  </style>
  