import { memberStore } from './member'

export const namespaced = true

export const state = {
  ...memberStore.state
}

export const actions = {
  ...memberStore.actions
}

export const mutations = {
  ...memberStore.mutations
}

export const getters = {
  ...memberStore.getters
}
