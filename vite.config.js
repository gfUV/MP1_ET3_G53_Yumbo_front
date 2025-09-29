import { defineConfig } from 'vite'

/**
 * Vite configuration for building and previewing the application.
 *
 * This configuration defines custom HTML entry points
 * for different pages and sets up the preview server
 * for deployment on Render.
 *
 * @module ViteConfig
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        /** Main page  */
        index: 'index.html',

        /** Sign in page  */
        signin: 'sign_in.html',

        /** Sign up page  */
        signup: 'sign_up.html',

        /** Task list page  */
        task: 'task.html',

        /** New task creation page */
        tasknew: 'task_new.html',

        /** Reset password page  */
        resetpassword: 'reset_password.html',

        /** Edit task page (Editar tarea) */
        taskedit: 'task_edit.html',

        /** User profile page (Perfil) */
        profile: 'profile.html',

        /** User profile edit page  */
        profileedit: 'profile_edit.html',

         /** About us page  */
        aboutus: 'about_us.html',

        /** Site map  */
        sitemap: 'site_map.html'

      }
    }
  },
  preview: {
    /**
     * Preview server configuration.
     *
     * @property {number|string} port - Uses the port assigned by Render or defaults to 8080.
     * @property {boolean} host - Allows external connections (0.0.0.0).
     * @property {string[]} allowedHosts - List of allowed hosts, including the Render domain.
     */
    port: process.env.PORT || 8080,  
    host: true,                      
    allowedHosts: [
      'mp1-et3-g53-yumbo.onrender.com' 
    ]
  }
})
