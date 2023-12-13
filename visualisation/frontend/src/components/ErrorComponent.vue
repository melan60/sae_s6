<template>
  <b-container fluid class="p-0" data-aos="fade-down" data-aos-duration="800">
    <b-alert :show="alertCountDown" variant="danger"
             @dismiss-count-down="onCountDownChange"
             class="mb-3"
             data-aos="fade-down"
             data-aos-anchor-placement="top-bottom"
             data-aos-duration="800">
      <h5 class="text-danger"
          data-aos="fade-down"
          data-aos-anchor-placement="top-bottom"
          data-aos-delay="100"
          data-aos-duration="800">{{ error }}</h5>
      <b-button class="close-button-right" @click="onDismissed" style="border: none; background-color: transparent; padding: 0;">
        <span aria-hidden="true">&times;</span>
      </b-button>


      <b-progress
          variant="danger"
          :max="alertMax"
          :value="alertCountDown"
          height="4px"
          data-aos="zoom-in"
          data-aos-anchor-placement="top-bottom"
          data-aos-delay="100"
          data-aos-duration="800">
      </b-progress>
    </b-alert>
  </b-container>
</template>

<script>
export default {
  props: {
    error: String,
    countdown: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      alertCountDown: 0,
      alertMax: 20,
    };
  },
  watch: {
    error(newValue) {
      if (newValue) {
        this.alertCountDown = this.countdown;
      }
    }
  },
  methods: {
    onCountDownChange(countDown) {
      this.alertCountDown = countDown;
    },
    onDismissed() {
      this.alertCountDown = 0;
      // Emit an event if parent component needs to be notified
      this.$emit('alertDismissed');
    },
  },

}
</script>

<style scoped>
.close-button-right {
  position: absolute;
  right: 3rem;
  top: 0.5rem;
  color: #d9534f; /* Adjust the color to match your design */
  font-size: 1.5rem; /* Adjust the size as needed */
}

</style>
