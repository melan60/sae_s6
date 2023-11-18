<template>
    <GraphLineComponent v-if="values[0]" :data="values[0]" :options="options" />
</template>


<script>
import axios from "axios";
import GraphLineComponent from '@/components/GraphLineComponent.vue';

export default {
    name: 'CustomerView',
    components: {
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
        axios.get(`http://localhost:5000/graphs/users?id_user=${"6558ba5d766209507677bed8"}`) // TODO this.store.user._id
            .then(res => {
                this.initGraph(res.data.data);
            })
            .catch((e) => {
                console.log(e)
            });
    },
    methods: {
        initGraph(value) {
            const colors = ["#CF0071", "#830090"]
            const labels = value.first.labels;

            const datasets = Object.values(value).map((item, index) => {
                return ({
                    label: item.title,
                    backgroundColor: colors[index % colors.length],
                    borderColor: colors[index % colors.length],
                    data: item.data
                })
            });

            this.values.push({
                labels: labels,
                datasets: datasets
            });
        }
    }
}
</script>


<style scoped></style>
  