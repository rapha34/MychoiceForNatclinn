/*
Copyright INRAE
Contact contributor(s) : Rallou Thomopoulos / Julien Cufi (26/03/2020)
MyChoice is a web application supporting collective decision.
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
import router from "@/router";
import { computed } from "vue";
import { RouteLocationNormalized, LocationQuery, RouteRecordNameGeneric } from 'vue-router';
import { state } from "@/store";

export const pushRouteWithQuery = (routeParams: Partial<RouteLocationNormalized>) => {
  const query = router.currentRoute.value.query || {};  // On récupère les paramètres de requête actuels
  
  // Vérifie si routeParams contient un `name` ou un `path`
  if (!routeParams.name && !routeParams.path) {
    throw new Error('La route doit contenir un `name` ou un `path`');
  }

  // Construire l'objet pour router.push() en fonction des paramètres passés
  const routeToPush: any = {
    query: query,  // Ajoute les paramètres de requête
    ...routeParams, // Ajoute les autres paramètres
  };

  // Si `routeParams` contient un `name`, on n'ajoute pas `path`
  if (routeParams.name) {
    delete routeToPush.path;  // Si `name` est défini, on supprime `path` car ce n'est pas nécessaire
  }
  
  // Si `routeParams` contient un `path`, on supprime `name`
  if (routeParams.path) {
    delete routeToPush.name;  // Si `path` est défini, on supprime `name`
  }

  // Appel à router.push() avec l'objet corrigé
  router.push(routeToPush);
};

export const switchToView = (routeName: RouteLocationNormalized["name"]) => {
  const route = {
    name: routeName
  };
  router.push(route);
};

export enum PROJECT_TYPE_ROUTES {
  ICO = "name",
  GOOGLE_SPREADSHEET = "spreadsheet",
  XLSX = "xlsx",
  NEXTCLOUD = "nextcloud"
}

export const projectNameRouteQuery = PROJECT_TYPE_ROUTES.ICO;
export const spreadsheetIdRouteQuery = PROJECT_TYPE_ROUTES.GOOGLE_SPREADSHEET;
export const xlsxFileRouteQuery = PROJECT_TYPE_ROUTES.XLSX;
export const nextcloudIdRouteQuery = PROJECT_TYPE_ROUTES.NEXTCLOUD;

export const getRouteProjectId = computed(() => {
  return state.vm &&
    state.vm.$route &&
    state.vm.$route.query &&
    (state.vm.$route.query.name || state.vm.$route.query.spreadsheet)
    ? state.vm.$route.query.name || state.vm.$route.query.spreadsheet
    : null;
});
