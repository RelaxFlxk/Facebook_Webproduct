import { facebookStore } from './facebook'

export const namespaced = true

export const state = {
  ...facebookStore.state
}

export const actions = {
  ...facebookStore.actions
}

export const mutations = {
  ...facebookStore.mutations
}

export const getters = {
  ...facebookStore.getters
}
