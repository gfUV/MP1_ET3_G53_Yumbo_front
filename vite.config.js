import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        signin: 'sign_in.html',
        signup: 'sign_up.html',
        resetpassword: 'reset_password.html'
      }
    }
  },
  preview: {
    port: process.env.PORT || 8080,  // Usa el puerto que Render asigna
    host: true,                      // Permite conexiones externas (0.0.0.0)
    allowedHosts: [
      'mp1-et3-g53-yumbo.onrender.com' // Dominio de tu app en Render
    ]
  }
})
