// import axios from 'axios'

export const actions = {
  async facebookgetpsid ({ commit, state, rootGetters }) {
    try {
      const psid = rootGetters['facebookStore/GET_PSID']
      // const IPPotocalENVDeveloper = 'http://localhost'
      // const IPPotocalENVProduction = 'https://api-beloyalty-productions.betaskthai.com/'
      // if (process.env.NODE_ENV === 'development') {
      //   this.url = IPPotocalENVDeveloper + ':5001'
      // } else {
      //   this.url = IPPotocalENVProduction
      // }
      commit('SET_PSID', psid)
    } catch (error) {
      console.log('facebookgetpsid error', error.message)
    }
  }
}
