/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../stores'
import router from '../router'
import { createNotivue } from 'notivue'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(createNotivue(
      {
        notifications: {
          global: {
            duration: 5000
          }
        },
        position: "bottom-center"
      }
    ))
}
