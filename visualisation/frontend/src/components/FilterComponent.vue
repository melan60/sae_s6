<template>
  <div>
    <p>Sélectionner le type de stimulus</p>
    <div v-for="(elem, index) in stimulis" :key="index">
      <input type="radio" :value="elem" v-model="stimulus">
      <label>{{ elem }}</label>
      <br>
    </div>
    <button type="submit">Valider</button>
    <button type="reset">Effacer</button>
  </div>
</template>


<script>
export default {
  name: 'FilterComponent',
  props: {
    stimulis: Array
  },
  data: () => ({
    stimulus: null
  }),
}
</script>


<style scoped></style>