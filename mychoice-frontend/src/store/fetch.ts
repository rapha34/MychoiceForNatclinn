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
import { Route } from "vue-router";
import router from "@/router";

export const getIcoApiUrl = () => {
  const proxyUrl = process.env.BASE_URL + "api/";
  return process.env.NODE_ENV === "development"
    ? proxyUrl
    : process.env.VUE_APP_API_URL;
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

// export const loadSpreadsheetData = async () => {
//   // let data = null;
//   // if (localStorage.data) {
//   //   data = JSON.parse(localStorage.data);
//   // } else {
//   //   data = await getSpreadsheetData();
//   //   localStorage.data = JSON.stringify(data);
//   // }
// };

// export const saveToRecentProjectNames = (name: string) => {
//   if (!Object.keys(state.recentProjectNames).includes(name)) {
//     state.recentProjectNames = {
//       ...state.recentProjectNames,
//       [name]: {
//         name,
//         date: Date.now()
//       }
//     };
//   } else {
//     state.recentProjectNames[name].date = Date.now();
//   }
//   localStorage.recentProjectNames = JSON.stringify(state.recentProjectNames);
// };
// export const saveToRecentProjectSpreadsheets = ({
//   name,
//   id
// }: {
//   name?: string;
//   id: string;
// }) => {
//   if (!Object.keys(state.recentProjectSpreadsheets).includes(id)) {
//     /* state.recentProjectSpreadsheets[name] = {
//       name,
//       id,
//       date: Date.now()
//     }; */
//     state.recentProjectSpreadsheets = {
//       ...state.recentProjectSpreadsheets,
//       [id]: {
//         name,
//         id,
//         date: Date.now()
//       }
//     };
//   } else {
//     if (name) {
//       state.recentProjectSpreadsheets[id].name = name;
//     }
//     state.recentProjectSpreadsheets[id].date = Date.now();
//   }
//   localStorage.recentProjectSpreadsheets = JSON.stringify(
//     state.recentProjectSpreadsheets
//   );
// };

export const loadProject = () => {};

// export const loadAll = async (route: any, clear?: boolean) => {
//   showOverlay();
//   try {
//     const spreadsheetRouteParam = <string | null>(
//       route.query[PROJECT_TYPE_ROUTES.GOOGLE_SPREADSHEET]
//     );
//     const nextcloudIdRouteParam = <string | null>(
//       route.query[PROJECT_TYPE_ROUTES.NEXTCLOUD]
//     );
//     const xlsxFileRouteParam = <string | null>(
//       route.query[PROJECT_TYPE_ROUTES.XLSX]
//     );
//     const icoRouteParam = <string | null>route.query[PROJECT_TYPE_ROUTES.ICO];
//     if (spreadsheetRouteParam) {
//       //setSpreadsheet(spreadsheetRouteParam);

//       // saveToRecentProjectSpreadsheets({
//       //   id: spreadsheetRouteParam
//       // });
//       saveToRecentProjects(ProjectGroupNames.GOOGLE_SPREADSHEET, {
//         id: spreadsheetRouteParam
//       });

//       let data = null;
//       console.log(isSpreadsheetCached(spreadsheetRouteParam), "cached?");
//       if (isSpreadsheetCached(spreadsheetRouteParam)) {
//         data = getSpreadsheetProjectDataFromCache(spreadsheetRouteParam);
//         state.notifications.push({
//           message: "Spreadsheet loaded from cache"
//         });
//       } else {
//         data = await getSpreadsheetData(spreadsheetRouteParam);
//       }
//       // saveToRecentProjectSpreadsheets({
//       //   name: data.project.name ? data.project.name : undefined,
//       //   id: spreadsheetRouteParam
//       // });
//       saveToRecentProjects(ProjectGroupNames.GOOGLE_SPREADSHEET, {
//         name: data.project && data.project.name ? data.project.name : undefined,
//         id: spreadsheetRouteParam
//       });

//       try {
//         setData(data.items, data.project, clear);
//         setSpreadsheetProjectToCache(spreadsheetRouteParam, data);
//         state.spreadsheet = spreadsheetRouteParam;
//       } catch (e) {
//         throw e;
//       }
//     } else if (icoRouteParam) {
//       // const project = await loadProject(projectRouteParam);
//       // const items = await loadItems(projectRouteParam);

//       let data = null;
//       if (localStorage.ico && localStorage.ico[icoRouteParam]) {
//         data = getSpreadsheetProjectDataFromCache(icoRouteParam);
//       } else {
//         const [project, items] = await Promise.all([
//           await getProjectData(icoRouteParam),
//           await getItemsData(icoRouteParam)
//         ]);
//         data = { project, items };
//       }

//       if (data.project && data.project.name) {
//         saveToRecentProjects(ProjectGroupNames.ICO, {
//           name: data.project.name ? data.project.name : undefined,
//           id: data.project.name
//         });
//         // saveToRecentProjectNames(data.project.name);
//       }

//       try {
//         setData(data.items, data.project, clear);
//         setIcoProjectToCache(data.project.name, data);
//       } catch (e) {
//         throw e;
//       }
//       //}
//     } else if (route.query["demo"]) {
//       console.log("DEMO !");
//       //@ts-ignore
//       setData(dataJson, projectJson, clear);
//     } else if (xlsxFileRouteParam) {
//       console.log("XLSX !");
//       const file = state.dropFileInputRef.value.files[0];
//       await openXlsxFromFile(file, clear);
//     } else if (nextcloudIdRouteParam) {
//       console.log("Nextcloud !");

//       //https://icotest.iate.inra.fr/nextcloud/s/iiw6WomRsepyx78/download
//       const nextcloudUrl = getNextcloudDownloadUrlFromId(nextcloudIdRouteParam);
//       await openXlsxFromUrl(nextcloudUrl);
//     } else {
//       console.info("NOTHING TO LOAD");
//     }
//     if (route && route.path.includes("/project")) {
//       document.title = getProjectName.value + " | My Choice";
//     }

//     hideOverlay();
//   } catch (e) {
//     hideOverlay();

//     if (e instanceof MyChoiceError) {
//       console.warn(e.name, "MYCHOICE ERROR");
//       setError(e.name, e.message);
//       throw Error(e.stack);
//     } else {
//       console.warn("ClassicError");
//       //@ts-ignore
//       setError(e.name, e.message);
//       //@ts-ignore
//       console.log(e.stack, "stack");
//       throw e;
//     }
//   }
// };

export const getProjectTypeFromRoute = (route: Route) => {
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

export const getRouteTypeValue = (route: Route) => {
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
  route: Route,
  clear?: boolean
) => {
  const spreadsheetId = getRouteTypeValue(route);
  //setSpreadsheet(spreadsheetId);
  // saveToRecentProjectSpreadsheets({
  //   id: spreadsheetId
  // });
  saveToRecentProjects(ProjectGroupNames.GOOGLE_SPREADSHEET, {
    id: spreadsheetId,
  });
  let data = null;
  // console.log(isProjectCached(route), "cached?");
  if (isProjectCached(route)) {
    data = getProjectDataCacheFromRoute(route);
    state.notifications.push({
      message: "Spreadsheet loaded from cache",
    });
  } else {
    data = await getSpreadsheetData(spreadsheetId);
  }
  // saveToRecentProjectSpreadsheets({
  //   name: data.project.name ? data.project.name : undefined,
  //   id: spreadsheetId
  // });
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

export const loadIcoFromRoute = async (route: Route, clear?: boolean) => {
  const icoId = getRouteTypeValue(route);

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
  }

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

export const loadNextcloudFromRoute = async (route: Route, clear?: boolean) => {
  // console.log("Nextcloud!");
  const nextcloudId = getRouteTypeValue(route);

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

// export const loadBy = async ({
//   type,
//   id,
// }: {
//   type: ProjectGroupNames;
//   id: string;
// }) => {
//   const routeType = getRouteTypeFromProjectType(type);
//   console.log(routeType, "ROUTE TYPE");
//   const routeParams: Partial<Route> = {
//     query: {
//       [routeType]: id,
//     },
//     name: "project",
//     path: "/project",
//   };

//   const route = router.resolve(routeParams).resolved;
//   console.log(route, "ROUT");
//   await loadAll(route);
//   router.push(routeParams);
// };

export const getHrefFromTypeId = ({
  type,
  id,
}: {
  type: ProjectGroupNames;
  id: string;
}) => {
  const routeType = getRouteTypeFromProjectType(type);
  // console.log(routeType, "ROUTE TYPE");
  const routeParams: Partial<Route> = {
    query: {
      [routeType]: id,
    },
    name: "project",
    path: "/project",
  };

  const href = router.resolve(routeParams).href;
  return href;
};

export const loadAll = async (route: Route, clear?: boolean) => {
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
      // console.log("XSLSX");
      const file = state.dropFileInputRef.value.files[0];
      await openXlsxFromFile(file, clear);
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
