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
import Router from "vue-router";
import Project from "@/views/Project.vue";
import Home from "@/views/Home.vue";
import Main from "@/views/Main.vue";
import Properties from "@/views/Properties.vue";
import Stakeholders from "@/views/Stakeholders.vue";
//import Compare from "@/views/Compare.vue";
//import ItemList from "@/components/ItemList.vue";
import { state } from "@/store";
Vue.use(Router);

const routes = [
  { name: "home", path: "/", component: Home },
  { name: "global-view", path: "/project/global-view", component: Main },
  { name: "project", path: "/project/", component: Project },
  //{ name: "aim", path: "/aim/:id", component: ItemList, props: true },
  // {
  //   name: "criterion",
  //   path: "/criterion/:id",
  //   component: ItemList,
  //   props: true
  // },
  {
    name: "property-view",
    path: "/project/property-view",
    component: Properties,
    props: true
  },
  {
    name: "stakeholder-view",
    path: "/project/stakeholder-view",
    component: Stakeholders,
    props: true
  }
  // {
  //   name: "compare",
  //   path: "/compare",
  //   component: Compare
  // }
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes // short for `routes: routes`
});

// function hasQueryParams(route: any) {
//   return !!Object.keys(route.query).length;
// }

router.beforeEach((to, from, next) => {
  state.overlay = true;
  next();
  // if (!hasQueryParams(to) && hasQueryParams(from)) {
  //   next({ name: to.name, query: from.query });
  // } else {
  //   next();
  // }
});

router.afterEach(async (to, from) => {
  if (!to.path.includes("/project")) {
    document.title = to.meta.title || "My Choice";
  }
  state.overlay = false;
});

export default router;
