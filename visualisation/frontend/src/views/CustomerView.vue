<template>
    <div class="grid-container">
        <div v-for="(value, index) in values" :key="index">
            <GraphLineComponent v-if="index < 1" :data="values[0]" :options="options" />
            <GraphBarComponent v-else :data="value" :options="options" />
        </div>
    </div>
</template>


<script>
import axios from "axios";
import GraphBarComponent from '@/components/GraphBarComponent.vue';
import GraphLineComponent from '@/components/GraphLineComponent.vue';

export default {
    name: 'CustomerView',
    components: {
        GraphBarComponent,
        GraphLineComponent
    },
    data: () => ({
        options: {
            responsive: true,
            maintainAspectRatio: false
        },
        values: [],
    }),
    created() {
        axios.get(`http://localhost:5000/graphs/users?id_user=${"655f6ac4b7eb21e278e04b34"}`) // TODO this.store.user._id
            .then(res => {
                this.initGraph(res.data.data);
            })
            .catch((e) => {
                console.log(e)
            });
    },
    methods: {
        initGraph(results) { // TODO duplication de code
            const colors = ["#CF0071", "#830090"];

            for (let index = 0; index < results.length; index += 1) {
                const value = results[index];
                const labels = value.labels || (value.first && value.first.labels);

                const datasets = value.first
                    ? Object.values(value).map((item, id) => {
                        return ({
                            label: item.title,
                            backgroundColor: colors[id % colors.length],
                            borderColor: colors[id % colors.length],
                            data: item.data
                        })
                    }) : [{
                        label: value.title,
                        backgroundColor: colors[index % colors.length],
                        borderColor: colors[index % colors.length],
                        data: value.data
                    }];

                this.values.push({
                    labels: labels,
                    datasets: datasets
                });
            }
        }
    }
}
</script>


<style scoped>
.grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 2%;
}
</style>
