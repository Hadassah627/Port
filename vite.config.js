import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    build: {
        chunkSizeWarningLimit: 600,
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('firebase')) {
                            return 'firebase-vendor';
                        }
                        if (id.includes('framer-motion')) {
                            return 'animation-vendor';
                        }
                        if (id.includes('react-icons')) {
                            return 'icons-vendor';
                        }
                        if (id.includes('react-router-dom') || id.includes('@tanstack/react-query') || id.includes('react-hot-toast')) {
                            return 'ui-vendor';
                        }
                        if (id.includes('react')) {
                            return 'react-vendor';
                        }
                    }
                    return undefined;
                },
            },
        },
    },
    server: {
        host: '0.0.0.0',
    },
});
