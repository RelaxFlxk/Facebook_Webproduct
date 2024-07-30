import { shopStore } from './shop'

export const namespaced = true

export const state = {
  ...shopStore.state
}

export const actions = {
  ...shopStore.actions
}

export const mutations = {
  ...shopStore.mutations
}

export const getters = {
  ...shopStore.getters
}
