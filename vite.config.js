import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' -> chemins relatifs, indispensable pour un déploiement
// sous-répertoire type GitHub Pages (https://user.github.io/repo/).
export default defineConfig({
  base: './',
  plugins: [react()],
})
