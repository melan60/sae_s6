<template>
  <div>
    <div id="bg-wrap">
      <svg viewBox="0 0 100 200" preserveAspectRatio="xMidYMid slice">
        <!-- SVG content here -->
      </svg>
    </div>

    <div class="main-content">
      <div v-if="user && user.typeUser === 'cobaye'">
        <div>
          <div class="image-container">
            <b-card
                overlay
                img-src="https://media.discordapp.net/attachments/1182622786150207548/1182630027372793866/markus-spiske-XrIfY_4cK1w-unsplash.jpg?ex=66720a4a&is=6670b8ca&hm=9cb385044e81eebcee66e08c8897d143c5bb04991e6f08d6926b923a81da4452&=&format=webp&width=1440&height=317"
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
                <GraphBarComponent v-if="index < 3" :data="value" :options="options" />
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
                {{ cobaye.name }} {{ cobaye.firstName }}
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
                <GraphBarComponent v-if="index < 3" :data="value" :options="options" />
                <GraphLineComponent v-else :data="value" :options="options" />
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="selectedUserDetails">
          <div class="grid-container">
            <div v-for="(value, index) in graphValues" :key="index" class="graph-container">
              <GraphBarComponent v-if="index < 3" :data="value" :options="options" />
              <GraphLineComponent v-else :data="value" :options="options" />
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Vous n'êtes pas connecté</p>
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
      },
      pictureHome: pictureHome,
      selectedUserId: null,
      allGraphValues: {},
      filter: '',
    };
  },
  async created() {
    await this.$store.dispatch('initializeStore');
    this.interval = setInterval(async () => {
      await this.$store.dispatch('initializeStore');
    }, 3000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
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
      graphData: state => state.graphData
    })
  },
  methods: {
    async fetchSelectedUserGraphs() {
      if (this.selectedUserId) {
        console.log('fetching user graphs for user:', this.selectedUserId);
        await this.$store.dispatch('fetchUserGraphs', this.selectedUserId);
        await this.$store.dispatch('fetchSelectedUserDetails', this.selectedUserId);
      }
    },
    async selectUser(user) {
      this.selectedUserId = user ? user._id : null;
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

<style scoped>@import '../../public/css/home.css';
</style>
