<template>
  <div>
    <div v-if="user && user.typeUser === 'cobaye'">
      <div>
        <div class="image-container">
          <b-card
              overlay
              img-src="https://media.discordapp.net/attachments/1182622786150207548/1182630027372793866/markus-spiske-XrIfY_4cK1w-unsplash.jpg?ex=66565aca&is=6655094a&hm=34f3ac40a44ca2edbffa55ba08ead51595d9e7fed0e1649b68ef5a21d9f25368&=&format=webp&width=1440&height=317"
              text-variant="#2c3e50"
              class="text-center">
            <div class="centered-container">
              <div class="centered-text">
                Bienvenue {{ user.firstName }} {{ user.name }}
              </div>
              <div class="centered-sub-text">
                Voici les derniers résultats de vos tests de réflexes !
              </div>
            </div>
          </b-card>
        </div>
      </div>
    </div>
    <div v-else-if="user && user.typeUser === 'admin'">
      <!-- Admin can see all data -->
      <p>hellooo test</p>
    </div>

    <div v-else>
      <p>Vous n'êtes pas connecté</p>
    </div>
    <div class="grid-container">
      <div v-for="(value, index) in graphValues" :key="index" class="graph-container">
        <GraphBarComponent v-if="index < 3" :data="value" :options="options" />
        <GraphLineComponent v-else :data="value" :options="options" />
      </div>
    </div>
  </div>
</template>

<script>
import GraphBarComponent from '@/components/GraphBarComponent.vue';
import GraphLineComponent from '@/components/GraphLineComponent.vue';
import pictureHome from "../../public/images/home.jpg";
import { mapState } from "vuex";

export default {
  name: 'HomeView',
  components: {
    GraphBarComponent,
    GraphLineComponent,
  },
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
    pictureHome: pictureHome
  }),
  async created() {
    if (this.$store.state.userId) {
      // Fetch user graphs
      await this.$store.dispatch('fetchUserGraphs');
      // Set interval to fetch user graphs every 5 seconds
      this.interval = setInterval(() => {
        this.$store.dispatch('fetchUserGraphs');
        console.log('Loaded graph!');
      }, 5000);
    }
  },

  beforeDestroy() {
    clearInterval(this.interval);
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    graphValues() {
      const graphData = this.$store.getters.getGraphData;
      return graphData ? this.initGraph(graphData) : [];
    },
    ...mapState({
      graphData: state => state.graphData
    })
  },
  methods: {
    initGraph(results) {
      const values = [];
      const colors = ["#35a9a0", "#7fdbe8"];
      let value, labels, datasets;

      for (let index = 0; index < results.length; index += 1) {
        value = results[index];
        labels = value.labels || (value.first && value.first.labels);

        datasets = value.first
            ? Object.values(value).map((item, id) => ({
              label: item.title,
              backgroundColor: colors[id % colors.length],
              borderColor: colors[id % colors.length],
              data: item.data
            }))
            : [{
              label: value.title,
              backgroundColor: colors[index % colors.length],
              borderColor: colors[index % colors.length],
              data: value.data
            }];

        values.push({
          labels: labels,
          datasets: datasets
        });
      }
      return values;
    }
  }
}
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
}

.container-graph {
  display: flex;
  width: 100%;
  justify-content: center;
  align-content: center;
  align-items: center;
}

.graph-container {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin: 10px auto;
  width: calc(100% - 20px);
  box-sizing: border-box;
  max-width: 100%; /* Graphs will take up at most 100% of their parent container width */
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 2%;
}

.image-container {
  position: relative;
  text-align: center;
  overflow: hidden;
}

.centered-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background: rgba(255, 255, 255, 0.5); /* semi-transparent white */
  border-radius: 10px;
  max-width: 90%; /* Adjust as needed */
  text-align: center; /* Centers text within the 'centered-container' */
}

.centered-text {
  font-size: 2.5vw;
  margin-bottom: 0.5em;
  color: #2c3e50;
}

.centered-sub-text {
  font-size: 1.5vw;
  color: #2c3e50;
}

.centered-container {
  padding: 10px; /* Smaller padding for smaller screens */
  max-width: 100%; /* Allows text container to fill image container */
}

@media (max-width: 100px) {
  .centered-text, .centered-sub-text {
    font-size: 4vw; /* Larger size for smaller screens */
  }
}

@media (max-width: 768px) {
  .grid-container {
    display: block; /* Stack graph containers vertically on smaller screens */
  }

  .graph-container {
    width: 100%; /* Each graph container takes full width of its parent on smaller screens */
    margin-bottom: 20px; /* Add space between stacked graph containers */
  }
}
</style>
