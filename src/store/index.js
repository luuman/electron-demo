import Vuex from 'vuex'
import modules from './modules'
import getters from './getters'

const createStore = new Vuex.Store({
  modules,
  getters
})
// console.log(createStore.state.user.token)
export default createStore
