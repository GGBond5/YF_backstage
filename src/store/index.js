import Vue from "vue";
import Vuex from "vuex";
import * as actions from './actions.js';
import * as getters from './getters.js';
import mutations from './mutations.js';
import state from './state.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  modules: {},
});
