<template>
  <div class="home">
    <GraphBarComponent :donnees="value" :filter="true" />
    <!--
      :label_abscisse="Caractéristiques individuelles"
      :label_ordonnee="Temps de réaction "
      :titre=" Graphique " -->
  </div>
</template>

<script>

import GraphBarComponent from '@/components/GraphBarComponent.vue'

export default {
  name: 'HomeView',
  components: {
    GraphBarComponent
  },
  data: () => ({
    value: {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      datasets: [
        {
          label: 'Data One',
          backgroundColor: '#f87979',
          data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
        }
      ]
    }
  })
}
</script>
