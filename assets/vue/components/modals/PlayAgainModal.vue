<template>
    <div class="custom-modal">
        <div class="body">
            <h4>
                {{ username }} (800) wants a rematch.
                <br>
                {{ length }} min.
            </h4>
            <div class="d-flex gap-3">
                <button href="#" class="btn btn-success" @click="emit('accept')"><i class="fa-solid fa-check"></i></button>
                <button href="#" class="btn btn-danger" @click="emit('disable')"><i class="fa-solid fa-x"></i></button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    username: String,
    length: Number
});

const emit = defineEmits(['disable', 'accept']);
</script>