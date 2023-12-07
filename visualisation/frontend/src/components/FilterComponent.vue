<template>
  <div class="filter-wrapper">
    <p>Sélectionner le type de stimulus</p>
<!--    Switches -->
    <div v-for="(stimulus, index) in stimulis" :key="index" class="form-check form-switch">
      <input class="form-check-input me-3" type="radio" :value="stimulus" v-model="$store.state.stimuli">
      <label class="form-check-label" >{{ stimulus }}</label>
    </div>

  <!--  Clear buttons-->
    <div class="button-group">
      <button class="btn btn-block button" @click="resetFilter">Effacer</button>
    </div>
  </div>
<!--  <div>
    <p>Sélectionner le type de stimulus</p>
    <div v-for="(elem, index) in stimulis" :key="index">
      <input type="radio" :value="elem" v-model="$store.state.stimuli">
      <label>{{ elem }}</label>
      <br>
    </div>
    <b-button type="reset" class="btn-reset" @click=resetFilter>Effacer</b-button>
  </div>-->
</template>

<script>
export default {
  name: 'FilterComponent',
  props: {
    stimulis: Array
  },
  data: () => ({
    selectedStimulus: {}
  }),

  created() {
    // Initialize selectedStimulus with false for all stimulus types
    this.stimulis.forEach(stimulus => {
      this.$set(this.selectedStimulus, stimulus, false);
    });
  },
  methods: {
    validate() {
      // Logic for validation when the button is clicked
      if (this.selectedStimulus == null) {
        // popup erreur
      } else {
        console.log("appel methode du composant parents");
      }
    },
    resetFilter() {
      this.$store.commit("setStimuli", null)
    },
  }
}
</script>

<style scoped>

.filter-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
}
.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.button {
  border: 0 !important;
  background-color: #35a9a0 !important;
}


.button-validate {
  border: 0 !important;
  background-color: #62e07f !important;
}

.button-validate:hover {
  background-color: #2c3e50 !important;
  color: white !important;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #2c3e50 !important;
  color: white !important;
  transition: background-color 0.3s ease;
}
</style>

