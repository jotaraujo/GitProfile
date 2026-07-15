/// <reference types='vitest' />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), svgr(), tailwindcss()],
	test: {
		exclude: ['**/node_modules/**', '**/.agents/**', '**/dist/**'],
	},
})
