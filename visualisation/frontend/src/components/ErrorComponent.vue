<template>
    <div>
        <b-modal id="bv-modal-example" hide-footer>
            <template #modal-title>
                {{ error }}
            </template>
            <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-example')">Fermer</b-button>
        </b-modal>
    </div>
</template>


<script>
export default {
    name: 'ErrorComponent',
    props: {
        error: String
    },
}
</script>