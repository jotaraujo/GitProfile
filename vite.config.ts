/// <reference types='vitest' />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), svgr(), tailwindcss()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./', import.meta.url)),
		}
	},
	test: {
		exclude: ['**/node_modules/**', '**/.agents/**', '**/dist/**'],
		environment: 'jsdom',
		setupFiles: ['./tests/setup.ts'],
	},
})
