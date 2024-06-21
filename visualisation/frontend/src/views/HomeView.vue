<template>
  <div>
    <div class="main-content">
      <div v-if="user && user.typeUser === 'cobaye'">
        <div>
          <div class="image-container">
            <b-card
                overlay
                img-src="https://media.discordapp.net/attachments/1182622786150207548/1182630027372793866/markus-spiske-XrIfY_4cK1w-unsplash.jpg?ex=6674ad4a&is=66735bca&hm=d7f0f33525bd75f0db9f784168cb1f8b022f5519f5992076a15ddbc2fb6ecdbd&=&format=webp&width=881&height=193"
                text-variant="#2c3e50"
                class="text-center cardbackground">
              <div class="centered-container">
                <div class="centered-text">
                  Bienvenue {{ user.firstName }} {{ user.name }}
                </div>
                <div class="centered-sub-text">
                  Voici les derniers résultats de vos tests de réflexes !
                </div>
              </div>
            </b-card>
            <div class="grid-container">
              <div v-for="(value, index) in graphValues" :key="index" class="graph-container">
                <GraphBarComponent v-if="index < 4" :data="value" :options="options" />
                <GraphLineComponent v-else :data="value" :is="options" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="user && user.typeUser === 'admin'">
        <h1 class="h1" style="margin: 20px">TABLEAU DE BORD ADMINISTRATEUR</h1>
        <div class="filter-container mb-3">
          <div class="dropdown-container mb-3">
            <b-dropdown id="dropdown-basic" variant="custom" class="btn-custom-dropdown">
              <template #button-content>
                <i class="fa fa-user mr-2"></i>Sélectionner un cobaye
              </template>
              <b-dropdown-item @click="selectUser(null)">
                Voir tous les graphiques
              </b-dropdown-item>
              <b-dropdown-item v-for="cobaye in filteredCobayeUsers" :key="cobaye._id" @click="selectUser(cobaye)">
                {{ cobaye.firstName }} {{ cobaye.name }}
              </b-dropdown-item>
            </b-dropdown>
          </div>
          <div class="input-container mb-3">
            <b-form-input v-model="filter" placeholder="Rechercher un cobaye..." />
          </div>
        </div>
        <div v-if="selectedUserId && selectedUserDetails">
          <div class="details-card-container">
            <b-card class="details-card">
              <h3 class="card-title">Détails de l'utilisateur {{ selectedUserDetails.firstName }} {{ selectedUserDetails.name }}</h3>
              <p><strong class="highlighted">Email:</strong> {{ selectedUserDetails.email }}</p>
              <p><strong class="highlighted">Âge:</strong> {{ selectedUserDetails.age }}</p>
              <p><strong class="highlighted">Sexe:</strong> {{ selectedUserDetails.gender }}</p>
            </b-card>
          </div>
        </div>
        <div v-if="!selectedUserId">
          <div v-for="cobaye in filteredCobayeUsers" :key="cobaye._id">
            <h3 class="mt-4">{{ cobaye.firstName }} {{ cobaye.name }}</h3>
            <div class="grid-container">
              <div v-for="(value, index) in allGraphValues[cobaye._id]" :key="index" class="graph-container">
                <GraphBarComponent v-if="index < 4" :data="value" :options="options" />
                <GraphLineComponent v-else :data="value" :options="options" />
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="selectedUserDetails">
          <div class="grid-container">
            <div v-for="(value, index) in graphValues" :key="index" class="graph-container">
              <GraphBarComponent v-if="index < 4" :data="value" :options="options" />
              <GraphLineComponent v-else :data="value" :options="options" />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="not-connected">
        <h2>Bienvenue sur notre site !</h2>
        <p>Veuillez vous connecter pour accéder à votre tableau de bord et voir les résultats de vos tests de réflexes.</p>
        <b-button class="login-button" @click="$router.push('/login')">Se connecter</b-button>
        <div class="general-data-overview">
          <h3>Vue d'ensemble des données</h3>
          <p class="p">Voici les statistiques générales basées sur les données des utilisateurs :</p>

          <div class="grid-container">
            <div v-for="(value, index) in averageGraphValues" :key="index" class="graph-container">
              <GraphBarComponent v-if="index < 4" :data="value" :options="options" />
              <GraphLineComponent v-else :data="value" :options="options" />
            </div>
          </div>
        </div>
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
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false, // Disable animation
      },
      pictureHome: pictureHome,
      selectedUserId: null,
      allGraphValues: {},
      filter: '',
      averageGraphValues: []
    };
  },
  async beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      // Initialize store to fetch user data and graphs
      await vm.$store.dispatch('initializeStore');
      await vm.fetchAverageGraphs();

      // Set selected user ID from Vuex state
      if (vm.$store.state.selectedUserId) {
        vm.selectedUserId = vm.$store.state.selectedUserId;
        await vm.fetchSelectedUserGraphs();
      }
    });
  },
  async beforeRouteUpdate(to, from, next) {
    if (this.$store.state.selectedUserId) {
      this.selectedUserId = this.$store.state.selectedUserId;
      await this.fetchSelectedUserGraphs();
    }
    next();
  },
  mounted() {
    this.startGraphRefreshInterval();
  },
  beforeDestroy() {
    clearInterval(this.graphRefreshInterval);
  },
  watch: {
    cobayeUsers: {
      handler() {
        this.fetchAllUserGraphs();
      },
      immediate: true,
    },
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    graphValues() {
      return this.$store.state.graphData ? this.initGraph(this.$store.state.graphData) : [];
    },
    cobayeUsers() {
      return this.$store.getters.getCobayeUsers;
    },
    filteredCobayeUsers() {
      if (!this.filter) return this.cobayeUsers;
      return this.cobayeUsers.filter(cobaye => {
        const fullName = `${cobaye.firstName} ${cobaye.name}`.toLowerCase();
        return fullName.includes(this.filter.toLowerCase());
      });
    },
    selectedUserDetails() {
      return this.selectedUserId ? this.$store.getters.getSelectedUserDetails : null;
    },
    ...mapState({
      graphData: state => state.graphData,
      averageGraphData: state => state.averageGraphData
    })
  },
  methods: {
    startGraphRefreshInterval() {
      this.graphRefreshInterval = setInterval(async () => {
        await this.fetchSelectedUserGraphs();
        await this.fetchAverageGraphs();
      }, 5000); // Refresh every 5 seconds
    },
    async fetchSelectedUserGraphs() {
      if (this.selectedUserId) {
        console.log('fetching user graphs for user:', this.selectedUserId);
        await this.$store.dispatch('fetchUserGraphs', this.selectedUserId);
        await this.$store.dispatch('fetchSelectedUserDetails', this.selectedUserId);
      }
    },
    async selectUser(user) {
      this.selectedUserId = user ? user._id : null;
      this.$store.commit('setSelectedUserId', this.selectedUserId); // Add this line
      if (!this.selectedUserId) {
        this.$store.commit('setSelectedUserDetails', null);
      }
      await this.fetchSelectedUserGraphs();
    },
    async fetchAllUserGraphs() {
      for (let user of this.cobayeUsers) {
        await this.$store.dispatch('fetchUserGraphs', user._id);
        const graphData = this.$store.getters.getGraphData;
        this.$set(this.allGraphValues, user._id, graphData ? this.initGraph(graphData) : []);
      }
    },
    async fetchAverageGraphs() {
      try {
        await this.$store.dispatch('fetchReactAndExecTime');
        this.averageGraphValues = this.initGraph(this.averageGraphData);
      } catch (error) {
        console.error('Error fetching average graphs:', error);
      }
    },
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
@import '../../public/css/home.css';

.not-connected {
  text-align: center;
  margin-top: 50px;
}

.login-button {
  background-color: #2c3e50;
  color: white;
  border: none;
}

.login-button:hover {
  background-color: #6bc2e0;
}

.general-data-overview {
  margin-top: 30px;
}

.summary-statistics {
  margin-top: 20px;
}

.p {
  text-align: center;
  margin: 10px;
  font-weight: normal;
  color: #35a9a0;
}
</style>
