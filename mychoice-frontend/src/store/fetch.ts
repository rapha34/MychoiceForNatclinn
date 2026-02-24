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
import {
  getSpreadsheetData,
  setError,
  MyChoiceError,
  getNextcloudDownloadUrlFromId,
  getNextcloudDataFromUrl,
  openXlsxFromFile,
  dropFileInputRef
} from "@/store";
import { PROJECT_TYPE_ROUTES } from "./routes";
import {
  setData,
  getIcoItemsData,
  getIcoProjectData,
  getIcoData,
} from "./project";
import { state, getProjectName, showOverlay, hideOverlay } from "./state";
import dataJson from "../../public/data.json";
import projectJson from "../../public/project.json";

import {
  getProjectDataCacheFromRoute,
  isProjectCached,
  ProjectGroupNames,
  saveToRecentProjects,
  setProjectCache,
} from "./cache";
import { RouteLocationNormalized, RouteLocationAsPathGeneric } from 'vue-router';
import router from "@/router";

export const getIcoApiUrl = () => {
  const proxyUrl = process.env.BASE_URL + "api/";
  const productionApiUrl = process.env.VUE_APP_API_URL || proxyUrl;
  return process.env.NODE_ENV === "development"
    ? proxyUrl
    : productionApiUrl;
};

export const fetchIcoData = async (projectId: string) => {
  let json = null;
  const url = getIcoApiUrl() + "arguments?project=" + projectId;
  try {
    if (!projectId) {
      throw Error();
    }
    const response = await fetch(url);

    json = await response.json();
  } catch (e) {
    console.warn("Fetch error, unable to fetch arguments: " + url);
    throw e;
    // const response = await fetch(process.env.BASE_URL + "data.json");
    // json = await response.json();
  }
  return json;
};

export const fetchIcoProject = async (projectId: string) => {
  let json = null;
  const url = getIcoApiUrl() + "project?name=" + projectId;
  try {
    if (!projectId) {
      throw Error();
    }
    const response = await fetch(url);

    json = await response.json();
  } catch (e) {
    console.warn("Fetch error, unable to fetch project:" + url);
    throw e;
    // const response = await fetch(process.env.BASE_URL + "project.json");
    // json = await response.json();
  }

  return json;
};



export const loadProject = () => {};


export const getProjectTypeFromRoute = (route: RouteLocationNormalized) => {
  if (
    Object.prototype.hasOwnProperty.call(
      route.query,
      PROJECT_TYPE_ROUTES.GOOGLE_SPREADSHEET
    )
  ) {
    return ProjectGroupNames.GOOGLE_SPREADSHEET;
  } else if (
    Object.prototype.hasOwnProperty.call(route.query, PROJECT_TYPE_ROUTES.ICO)
  ) {
    return ProjectGroupNames.ICO;
  } else if (
    Object.prototype.hasOwnProperty.call(route.query, PROJECT_TYPE_ROUTES.XLSX)
  ) {
    return ProjectGroupNames.XLSX;
  } else if (
    Object.prototype.hasOwnProperty.call(
      route.query,
      PROJECT_TYPE_ROUTES.NEXTCLOUD
    )
  ) {
    return ProjectGroupNames.NEXTCLOUD;
  } else {
    return null;
  }
};
export const getRouteTypeFromProjectType = (type: ProjectGroupNames) => {
  if (type === ProjectGroupNames.GOOGLE_SPREADSHEET) {
    return PROJECT_TYPE_ROUTES.GOOGLE_SPREADSHEET;
  } else if (type === ProjectGroupNames.ICO) {
    return PROJECT_TYPE_ROUTES.ICO;
  } else if (type === ProjectGroupNames.XLSX) {
    return PROJECT_TYPE_ROUTES.XLSX;
  } else if (type === ProjectGroupNames.NEXTCLOUD) {
    return PROJECT_TYPE_ROUTES.NEXTCLOUD;
  } else {
    return null;
  }
};

export const getRouteTypeValue = (route: RouteLocationNormalized) => {
  if (
    Object.prototype.hasOwnProperty.call(
      route.query,
      PROJECT_TYPE_ROUTES.GOOGLE_SPREADSHEET
    )
  ) {
    return route.query[PROJECT_TYPE_ROUTES.GOOGLE_SPREADSHEET] as string;
  } else if (
    Object.prototype.hasOwnProperty.call(route.query, PROJECT_TYPE_ROUTES.ICO)
  ) {
    return route.query[PROJECT_TYPE_ROUTES.ICO] as string;
  } else if (
    Object.prototype.hasOwnProperty.call(route.query, PROJECT_TYPE_ROUTES.XLSX)
  ) {
    return route.query[PROJECT_TYPE_ROUTES.XLSX] as string;
  } else if (
    Object.prototype.hasOwnProperty.call(
      route.query,
      PROJECT_TYPE_ROUTES.NEXTCLOUD
    )
  ) {
    return route.query[PROJECT_TYPE_ROUTES.NEXTCLOUD] as string;
  } else {
    return null;
  }
};

export const loadSpreadsheetFromRoute = async (
  route: RouteLocationNormalized,
  clear?: boolean
) => {
  const spreadsheetId = getRouteTypeValue(route);
  if (!spreadsheetId) throw new Error('Spreadsheet ID is required');
  
  saveToRecentProjects(ProjectGroupNames.GOOGLE_SPREADSHEET, {
    id: spreadsheetId,
  });
  let data = null;
  if (isProjectCached(route)) {
    data = getProjectDataCacheFromRoute(route);
    state.notifications.push({
      message: "Spreadsheet loaded from cache",
    });
  } else {
    data = await getSpreadsheetData(spreadsheetId);
  }
  if (!data) throw new Error('Failed to load spreadsheet data');
  
  saveToRecentProjects(ProjectGroupNames.GOOGLE_SPREADSHEET, {
    name: data.project && data.project.name ? data.project.name : undefined,
    id: spreadsheetId,
  });
  try {
    setData(data.items, data.project, clear);
    setProjectCache(route, data);
    state.spreadsheet = spreadsheetId;
  } catch (e) {
    throw e;
  }
};

export const loadIcoFromRoute = async (route: RouteLocationNormalized, clear?: boolean) => {
  const icoId = getRouteTypeValue(route);
  if (!icoId) throw new Error('ICO ID is required');

  saveToRecentProjects(ProjectGroupNames.ICO, {
    id: icoId,
  });

  let data = null;
  if (isProjectCached(route)) {
    data = getProjectDataCacheFromRoute(route);
    state.notifications.push({
      message: "Ico project loaded from cache",
    });
  } else {
    data = await getIcoData(icoId);
  }  if (!data) throw new Error('Failed to load ICO data');
  if (data.project && data.project.name) {
    saveToRecentProjects(ProjectGroupNames.ICO, {
      name: data.project.name ? data.project.name : undefined,
      id: data.project.name,
    });
    // saveToRecentProjectNames(data.project.name);
  }

  try {
    setData(data.items, data.project, clear);
    setProjectCache(route, data);
  } catch (e) {
    throw e;
  }
};

export const loadNextcloudFromRoute = async (route: RouteLocationNormalized, clear?: boolean) => {
  // console.log("Nextcloud!");
  const nextcloudId = getRouteTypeValue(route);
  if (!nextcloudId) throw new Error('Nextcloud ID is required');

  saveToRecentProjects(ProjectGroupNames.NEXTCLOUD, {
    id: nextcloudId,
  });

  let data = null;
  if (isProjectCached(route)) {
    data = getProjectDataCacheFromRoute(route);
    state.notifications.push({
      message: "Nextcloud project loaded from cache",
    });
  } else {
    //https://icotest.iate.inra.fr/nextcloud/s/iiw6WomRsepyx78/download
    const nextcloudUrl = getNextcloudDownloadUrlFromId(nextcloudId);
    data = await getNextcloudDataFromUrl(nextcloudUrl);
  }
  if (!data) throw new Error('Failed to load Nextcloud data');

  saveToRecentProjects(ProjectGroupNames.NEXTCLOUD, {
    name: data.project && data.project.name ? data.project.name : undefined,
    id: nextcloudId,
  });
  try {
    setData(data.items, data.project, clear);
    setProjectCache(route, data);
  } catch (e) {
    throw e;
  }
};



export const getHrefFromTypeId = ({
  type,
  id,
}: {
  type: ProjectGroupNames;
  id: string;
}) => {
  const routeType = getRouteTypeFromProjectType(type);

  if (!routeType) {
    throw new Error("Route type is undefined for this project type.");
  }

  // Construction des paramètres de route avec path ou name
  const routeParams: RouteLocationNormalized = {
    query: {
      [routeType]: id,
    },
    name: "project", // Assure-toi que "project" est bien un nom de route défini dans tes routes
    path: "/project", // Assure-toi que cette route "/project" existe dans tes routes
    params: {}, // Si tu n'as pas de paramètres, mets un objet vide
    matched: [], // Tableau vide si aucune correspondance n'est requise
    fullPath: "/project", // Remplacer par le chemin complet si nécessaire
    hash: "",
    redirectedFrom: undefined,
    meta: {}
  };

  // Appel de router.resolve avec un objet contenant path ou name
  const href = router.resolve(routeParams).href;
  return href;
};


export const loadAll = async (route: RouteLocationNormalized, clear?: boolean) => {
  showOverlay();

  // console.log(route.query, "query");
  try {
    /**
     * GOOGLE SPREADSHEET
     */
    if (
      getProjectTypeFromRoute(route) === ProjectGroupNames.GOOGLE_SPREADSHEET
    ) {
      await loadSpreadsheetFromRoute(route, clear);
    }

    /**
     * ICO
     */
    if (getProjectTypeFromRoute(route) === ProjectGroupNames.ICO) {
      await loadIcoFromRoute(route, clear);
    }

    /**
     * NEXTCLOUD
     */
    if (getProjectTypeFromRoute(route) === ProjectGroupNames.NEXTCLOUD) {
      await loadNextcloudFromRoute(route, clear);
    }

    /**
     * XLSX
     */
    if (getProjectTypeFromRoute(route) === ProjectGroupNames.XLSX) {
      const fileInput = dropFileInputRef.value;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        await openXlsxFromFile(file, clear);
      } else {
        console.error("No file selected or file input is not valid.");
      }
    }

    hideOverlay();
  } catch (e) {
    hideOverlay();
    if (e instanceof MyChoiceError) {
      console.warn(e.name, "MYCHOICE ERROR");
      setError(e.name, e.message);
      throw Error(e.stack);
    } else {
      // console.warn("ClassicError");
      //@ts-ignore
      setError(e.name, e.message);
      //@ts-ignore
      console.warn(e.stack, "stack");
      throw e;
    }
  }
};
