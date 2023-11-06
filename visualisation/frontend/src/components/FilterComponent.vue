<template>
  <div>
    <p>Sélectionner le type de stimulus</p>
    <div v-for="(elem, index) in stimulis" :key="index">
      <input type="radio" :value="elem" v-model="stimulus">
      <label>{{ elem }}</label>
      <br>
    </div>
    <b-button type="submit" class="btn-submit" @click=submitFilter>Valider</b-button>
    <b-button type="reset" class="btn-reset" @click=resetFilter>Effacer</b-button>
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
  methods: {
    submitFilter() {
      if (this.stimulus == null) {
        // popup erreur
      }
      else {
        console.log("appel methode du composant parents");
      }
    },
    resetFilter() {
      this.stimulus = null;
    }
  }
}
</script>


<style scoped>
.btn-submit {
  background-color: #4CD078;
  margin: 5px;
}

.btn-submit:hover {
  background-color: #4CD078;
  margin: 5px;
}

.btn-reset {
  background-color: #900000;
  margin: 5px;
}

.btn-reset:hover {
  background-color: #900000;
  margin: 5px;
}
</style>