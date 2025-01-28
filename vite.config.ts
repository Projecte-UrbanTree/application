import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'
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
            '@resources': path.resolve(__dirname, "resources"),
            "@components": path.resolve(__dirname, "resources/ts/components"),
            "@utils": path.resolve(__dirname, "resources/ts/utils"),
        },
    },
    plugins: [
        tailwindcss(),
        laravel({
            input: ["resources/ts/main.tsx"],
            refresh: true,
        }),
    ],
    build: {
        rollupOptions: {
            onwarn(warning, warn) {
                if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
                    return
                }
                warn(warning)
            },
        },
    },
});
