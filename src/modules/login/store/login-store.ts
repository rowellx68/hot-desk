import { defineStore } from 'pinia'
import { VueGapi } from 'vue-gapi'

export const useLoginStore = defineStore('login', {
  state: () => {
    return {
      loggedIn: false,
      name: '',
      image: '',
    }
  },
  actions: {
    /**
     * Initiate the login flow
     * 
     * @param gapi - The instance of the Google API Client
     */
    async login(gapi: VueGapi) {
      try {
        const { hasGrantedScopes, currentUser } = await gapi.login()

        if (!hasGrantedScopes) {
          return
        }

        const details = currentUser.getBasicProfile()

        this.$patch({
          loggedIn: currentUser.isSignedIn(),
          name: details.getName(),
          image: details.getImageUrl(),
        })
      } catch (error) {
        error
      }
    },
  },
})
