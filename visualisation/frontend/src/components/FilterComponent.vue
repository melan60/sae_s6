<template>
  <div>
    <p>Sélectionner le type de stimulus</p>
    <div v-for="(elem, index) in stimulis" :key="index">
      <input type="radio" :value="elem" v-model="$store.state.stimuli"> <!-- TODO -->
      <label>{{ elem }}</label>
      <br>
    </div>
    <b-button type="reset" class="btn-reset" @click=resetFilter>Effacer</b-button>
  </div>
</template>


<script>
export default {
  name: 'FilterComponent',
  props: {
    stimulis: Array
  },
  methods: {
    resetFilter() {
      this.$store.commit("setStimuli",  null)
    }
  }
}
</script>

<style scoped>

.btn-reset {
  background-color: #900000;
  margin: 5px;
}

.btn-reset:hover {
  background-color: #900000;
  margin: 5px;
}
</style>