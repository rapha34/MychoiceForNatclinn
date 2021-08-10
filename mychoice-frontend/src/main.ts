/*
Copyright INRAE
Contact contributor(s) : Rallou Thomopoulos / Julien Cufi (26/03/2020)
MyChoice is a web application supporting collective decision.
See more on https://ico.iate.inra.fr/MyChoice
This application is registered to the European organization for the
protection of authors and publishers of digital creations with
the following identifier: IDDN.FR.001.280002.000.R.P.2020.000.20900 

This software is governed by the CeCILL-C license under French law and
abiding by the rules of distribution of free software.  You can  use, 
modify and/ or redistribute the software under the terms of the CeCILL-C
license as circulated by CEA, CNRS and INRIA at the following URL
"http://www.cecill.info". 
As a counterpart to the access to the source code and  rights to copy,
modify and redistribute granted by the license, users are provided only
with a limited warranty  and the software's author,  the holder of the
economic rights,  and the successive licensors  have only  limited
liability. 
In this respect, the user's attention is drawn to the risks associated
with loading,  using,  modifying and/or developing or reproducing the
software by the user in light of its specific status of free software,
that may mean  that it is complicated to manipulate,  and  that  also
therefore means  that it is reserved for developers  and  experienced
professionals having in-depth computer knowledge. Users are therefore
encouraged to load and test the software's suitability as regards their
requirements in conditions enabling the security of their systems and/or 
data to be ensured and,  more generally, to use and operate it in the 
same conditions as regards security. 
The fact that you are presently reading this means that you have had
knowledge of the CeCILL-C license and that you accept its terms.
*/
import Vue from "vue";
import App from "./App.vue";
import router from "./router";

//import { getSpreadsheetData } from "./data-spreadsheet";
//import { data } from "./data";

import {
  state,
  loadAll,
  clearApplicationCache,
  projectNameRouteQuery,
  spreadsheetIdRouteQuery
} from "@/store";
import vuetify from "./plugins/vuetify";
import "./plugins/text-highlight";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";

//Vue.config.performance = true;

Vue.config.productionTip = false;

Vue.config.errorHandler = (err, vm, info) => {
  // err: error trace
  // vm: component in which error occured
  // info: Vue specific error information such as lifecycle hooks, events etc.

  // TODO: Perform any custom logic or log to server
  console.error(err);
  // console.info(vm, "vm");
  // console.info(info, "info");
};

// register globally

(async () => {
  router.onReady(async () => {
    if (
      router.currentRoute.query[projectNameRouteQuery] ||
      router.currentRoute.query[spreadsheetIdRouteQuery] ||
      router.currentRoute.query["demo"]
    ) {
      try {
        await loadAll(router.currentRoute);
      } catch (e) {
        console.info("LOAD FAIL, RETRY WITHOUT CACHE!");
        clearApplicationCache();
        await loadAll(router.currentRoute);
      }
    }
  });

  state.vm = new Vue({
    router,
    //@ts-ignore
    vuetify,
    render: h => h(App)
  }).$mount("#app");
})();
