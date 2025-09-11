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
  }
})