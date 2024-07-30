import { lineStore } from './line'

export const namespaced = true

export const state = {
  ...lineStore.state
}

export const actions = {
  ...lineStore.actions
}

export const mutations = {
  ...lineStore.mutations
}

export const getters = {
  ...lineStore.getters
}
