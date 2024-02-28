<script setup>
import { ref } from 'vue'

defineProps({
  
  connected: Boolean
})


</script>

<template>
    <div class="bg-white rounded-xl ">
        <div v-if="connected" class="rounded-xl bg-green px-6 py-4">
        <p class="font-roboto text-greenText">Connected</p>
    </div>
        <div v-else class="rounded-xl bg-yellow px-6 py-4">
        <p class="font-roboto text-yellowText">Not Connected</p>
    </div>
    </div>
    
 

  
</template>

<style scoped>

</style>
