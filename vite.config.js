import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        signin: 'sign_in.html',
        signup: 'sign_up.html',
        task: 'task.html',
        tasknew: 'task_new.html',
        resetpassword: 'reset_password.html',
        taskedit: 'task_edit.html',
        profile: 'profile.html',
        profileedit: 'profile_edit.html',
        resetPassconfirm: 'resetPass_confirm.html'
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
