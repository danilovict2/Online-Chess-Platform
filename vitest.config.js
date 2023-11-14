import { defineConfig } from 'vitest/config';
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    test: {
        exclude: ['vendor', 'node_modules'],
        globals: true,
        environment: "jsdom",
    },
    plugins: [
        vue()
    ]
});