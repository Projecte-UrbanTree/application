import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    server: {
        host: "0.0.0.0",
        port: 5173,
        hmr: {
            host: "localhost",
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "resources/ts"),
            "@components": path.resolve(__dirname, "resources/ts/components"),
            "@utils": path.resolve(__dirname, "resources/ts/utils"),
        },
    },
    plugins: [
        laravel({
            input: ["resources/ts/main.tsx"],
            refresh: true,
        }),
    ],
});
