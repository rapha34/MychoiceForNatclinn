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
import {
  state,
  getSpreadsheetData,
  spreadsheetIdRouteQuery,
  projectNameRouteQuery,
  setError,
  MyChoiceError
} from "@/store";
import { getRenamedItems, getRenamedProject } from "@/data-renamed";
import {
  getNormalizedData,
  filterDataAsProspective,
  filterDataAsInterplay,
  filterDataAsReliability,
  filterDataAsExpertise,
  filterDataAsMultiStakeholder
} from "@/data-parser";
import {
  clearAppDialogs,
  clearErrors,
  getProjectName,
  getCurrentRoute,
  clearAll,
  clearAppDataAndProject
} from "./state";
import dataJson from "../../public/data.json";
import projectJson from "../../public/project.json";
import { Data } from "@/@types";
import Vue from "vue";
import router from "@/router";

export const getApiUrl = () => {
  const proxyUrl = process.env.BASE_URL + "api/";
  return process.env.NODE_ENV === "development"
    ? proxyUrl
    : process.env.VUE_APP_API_URL;
};

export const fetchData = async (projectId: string) => {
  let json = null;
  const url = getApiUrl() + "arguments?project=" + projectId;
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

export const fetchProject = async (projectId: string) => {
  let json = null;
  const url = getApiUrl() + "project?name=" + projectId;
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

export const saveToRecentProjectNames = (name: string) => {
  if (!Object.keys(state.recentProjectNames).includes(name)) {
    state.recentProjectNames = {
      ...state.recentProjectNames,
      [name]: {
        name,
        date: Date.now()
      }
    };
  } else {
    state.recentProjectNames[name].date = Date.now();
  }
  localStorage.recentProjectNames = JSON.stringify(state.recentProjectNames);
};
export const saveToRecentProjectSpreadsheets = ({
  name,
  id
}: {
  name?: string;
  id: string;
}) => {
  if (!Object.keys(state.recentProjectSpreadsheets).includes(id)) {
    /* state.recentProjectSpreadsheets[name] = {
      name,
      id,
      date: Date.now()
    }; */
    state.recentProjectSpreadsheets = {
      ...state.recentProjectSpreadsheets,
      [id]: {
        name,
        id,
        date: Date.now()
      }
    };
  } else {
    if (name) {
      state.recentProjectSpreadsheets[id].name = name;
    }
    state.recentProjectSpreadsheets[id].date = Date.now();
  }
  localStorage.recentProjectSpreadsheets = JSON.stringify(
    state.recentProjectSpreadsheets
  );
};

export const isSpreadsheetCached = (spreadsheetId: string) => {
  return localStorage.getItem("spreadsheet-" + spreadsheetId) !== null
    ? true
    : false;
};
export const getIcoProjectFromCache = (projectName: string) => {
  return JSON.parse(localStorage.getItem("ico-" + projectName));
};
export const getSpreadsheetProjectFromCache = (spreadsheetId: string) => {
  return JSON.parse(localStorage.getItem("spreadsheet-" + spreadsheetId));
};
export const setIcoProjectToCache = (
  projectName: string,
  data: Data
) => {
  localStorage.setItem("ico-" + projectName, JSON.stringify(data));
};

export const setSpreadsheetProjectToCache = (
  spreadsheetId: string,
  data: Data
) => {
  localStorage.setItem("spreadsheet-" + spreadsheetId, JSON.stringify(data));
};

export const removeFromRecentProjectNames = (name: string) => {
  // if (localStorage.recentProjectNames) {
  //   state.recentProjectNames = JSON.parse(localStorage.recentProjectNames);
  // }
  if (state.recentProjectNames[name]) {
    delete state.recentProjectNames[name];
    localStorage.recentProjectNames = JSON.stringify(state.recentProjectNames);
  }
};

export const removeFromRecentProjectSpreadsheets = (spreadsheetId: string) => {
  // if (localStorage.recentProjectSpreadsheets) {
  //   state.recentProjectSpreadsheets = JSON.parse(
  //     localStorage.recentProjectSpreadsheets
  //   );
  // }
  if (state.recentProjectSpreadsheets[spreadsheetId]) {
    delete state.recentProjectSpreadsheets[spreadsheetId];
    localStorage.recentProjectSpreadsheets = JSON.stringify(
      state.recentProjectSpreadsheets
    );
  }
};

export const loadAll = async (route: any, clear = true) => {
  if (clear) {
    clearAll();
  } else {
    clearAppDialogs();
    clearAppDataAndProject();
  }
  clearErrors();

  state.overlay = true;
  try {
    const spreadsheetRouteParam = <string | null>(
      route.query[spreadsheetIdRouteQuery]
    );
    const projectRouteParam = <string | null>route.query[projectNameRouteQuery];
    if (spreadsheetRouteParam) {
      //setSpreadsheet(spreadsheetRouteParam);

      saveToRecentProjectSpreadsheets({
        id: spreadsheetRouteParam
      });

      let data = null;
      if (isSpreadsheetCached(spreadsheetRouteParam)) {
        data = getSpreadsheetProjectFromCache(spreadsheetRouteParam);
        state.notifications.push({
          message: "Spreadsheet loaded from cache"
        });
      } else {
        data = await getSpreadsheetData(spreadsheetRouteParam);
      }
      saveToRecentProjectSpreadsheets({
        name: data.project.name ? data.project.name : undefined,
        id: spreadsheetRouteParam
      });

      try {
        setData(data.items, data.project);
        setSpreadsheetProjectToCache(spreadsheetRouteParam, data);
        state.spreadsheet = spreadsheetRouteParam;
      } catch (e) {
        throw e;
      }
    } else if (projectRouteParam) {
      // const project = await loadProject(projectRouteParam);
      // const items = await loadItems(projectRouteParam);

      let data = null;
      if (localStorage.ico && localStorage.ico[projectRouteParam]) {
        data = getSpreadsheetProjectFromCache(projectRouteParam);
      } else {
        const [project, items] = await Promise.all([
          await getProjectData(projectRouteParam),
          await getItemsData(projectRouteParam)
        ]);
        data = { project, items };
      }

      if (data.project.name) {
        saveToRecentProjectNames(data.project.name);
      }

      try {
        setData(data.items, data.project);
        setIcoProjectToCache(data.project.name, data);
      } catch (e) {
        throw e;
      }
      //}
    } else if (route.query["demo"]) {
      console.log("DEMO !");
      //@ts-ignore
      setData(dataJson, projectJson);
    } else {
      console.info("NOTHING TO LOAD");
    }
    if (route && route.path.includes("/project")) {
      document.title = getProjectName.value + " | My Choice";
    }

    state.overlay = false;
  } catch (e) {
    state.overlay = false;

    if (e instanceof MyChoiceError) {
      console.warn(e.name, "MYCHOICE ERROR");
      setError(e.name, e.message);
      throw Error(e.stack);
    } else {
      console.warn("ClassicError");
      setError(e.name, e.message);
      console.log(e.stack, "stack");
      throw e;
    }
  }
};

export const getProjectData = async (projectId: string) => {
  try {
    let project = null;
    // if (localStorage.project) {
    //   project = JSON.parse(localStorage.project);
    // } else {

    const projectSource = await fetchProject(projectId);
    project = getRenamedProject(projectSource);
    //localStorage.project = JSON.stringify(project);
    //}
    //state.project = project;
    return Promise.resolve(project);
    //console.info(state.project, "Project source");
  } catch (e) {
    throw e;
  }
};

export const getItemsData = async (projectId: string) => {
  try {
    let data = null;
    // if (localStorage.data) {
    //   data = JSON.parse(localStorage.data);
    // } else {
    const dataSource = await fetchData(projectId);

    data = getRenamedItems(dataSource);
    //localStorage.data = JSON.stringify(data);
    //}
    return Promise.resolve(data);
    //const project = renamedProject(projectSource);
  } catch (e) {
    throw e;
  }
};

export const setData = (
  rawItems: Data["items"],
  rawProject: Data["project"]
) => {
  try {
    let parsedData;

    if (state.mode === "interplay") {
      //const normalizedData = getNormalizedData(data);
      //const interplayData = filterNormalizedDataAsInterplay(normalizedData);
      const interplayData = filterDataAsInterplay(rawItems);
      const normalizedInterplayData = getNormalizedData(
        interplayData,
        rawProject
      );
      parsedData = Object.freeze(normalizedInterplayData);
    } else if (state.mode === "prospective") {
      const prospectiveData = filterDataAsProspective(rawItems);
      const normalizedProspectiveData = getNormalizedData(
        prospectiveData,
        rawProject
      );
      parsedData = Object.freeze(normalizedProspectiveData);
    } else if (state.mode === "data-reliability") {
      const reliabilityData = filterDataAsReliability(
        rawProject.sourceTypeEntities,
        rawItems
      );
      const normalizedReliabilityData = getNormalizedData(
        reliabilityData,
        rawProject
      );
      parsedData = Object.freeze(normalizedReliabilityData);
    } else if (state.mode === "expertise") {
      const expertiseData = filterDataAsExpertise(
        rawProject.expertiseEntities,
        rawItems
      );
      const normalizedExpertiseData = getNormalizedData(
        expertiseData,
        rawProject
      );
      parsedData = Object.freeze(normalizedExpertiseData);
    } else if (state.mode === "multi-stakeholder") {
      const multiStakeholderData = filterDataAsMultiStakeholder(rawItems);
      const normalizedMultiStakeholderData = getNormalizedData(
        multiStakeholderData,
        rawProject
      );
      parsedData = Object.freeze(normalizedMultiStakeholderData);
    } else {
      const normalizedData = getNormalizedData(rawItems, rawProject);
      parsedData = Object.freeze(normalizedData);
    }
    // state.data = parsedData;
    // state.project = rawProject;
    Vue.set(state, "data", parsedData);
    Vue.set(state, "project", rawProject);
  } catch (e) {
    throw e;
  }
  //state.filteredItems = parsedData.items;
  //Vue.set(state, "filteredItems", parsedData.items);
};
