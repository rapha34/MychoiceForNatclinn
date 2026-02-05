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
  spreadsheetIdRouteQuery,
  projectNameRouteQuery,
  nextcloudIdRouteQuery,
} from "./routes";
import { fetchIcoData, fetchIcoProject, loadAll } from "./fetch";
import router from "@/router";
import type { RouteLocationNormalized } from "vue-router";
import { getSpreadsheetIdFromUrl } from "./spreadsheet";

import { getIcoRenamedItems, getIcoRenamedProject } from "@/data-renamed";
import {
  getNormalizedData,
  filterDataAsProspective,
  filterDataAsInterplay,
  filterDataAsReliability,
  filterDataAsExpertise,
  filterDataAsMultiStakeholder,
} from "@/data-parser";
import {
  clearAppDialogs,
  state,
  clearAll,
  clearAppDataAndProject,
  clearErrors,
} from "@/store";

import { Data } from "@/@types";
// import Vue from "vue";
import { getNextcloudIdFromUrl } from "./xlsx";

export const openSpreadsheet = async (spreadsheetUrl: string) => {
  const spreadsheetId = getSpreadsheetIdFromUrl(spreadsheetUrl);
  const routeParams = {
    query: {
      [spreadsheetIdRouteQuery]: spreadsheetId,
    },
    name: "project",
    path: "/project",
  };
  // routeParams.query[spreadsheetIdRouteQuery] = spreadsheetId;
  const route = router.resolve(routeParams);
  await router.push(route);
  // try {
  await loadAll(route);
  // } catch (e) {
  //   // if (e.name !== "NavigationDuplicated") {
  //   //   state.errors.FAILED_TO_FETCH_SPREADSHEET = true;
  //   // }
  // }
};

export const openIco = async (projectName: string) => {
  const routeParams = {
    query: {
      [projectNameRouteQuery]: projectName,
    },
    name: "project",
  };
  // routeParams.query[projectNameRouteQuery] = projectName;
  const route = router.resolve(routeParams);
  await router.push(route);
  // try {
  await loadAll(route as RouteLocationNormalized);
  // } catch (e) {
  // console.error(e);
  // state.errors.FAILED_TO_FETCH_ICO = true;
  // throw e;
  // }
};

export const openNextcloudUrl = async (url: string) => {
  const nextcloudId = getNextcloudIdFromUrl(url);
  const routeParams = {
    query: {
      [nextcloudIdRouteQuery]: nextcloudId,
    },
    name: "project",
    path: "/project",
  };
  // routeParams.query[nextcloudIdRouteQuery] = nextcloudId;
  const route = router.resolve(routeParams);
  await router.push(routeParams);
  // try{
  await loadAll(route as RouteLocationNormalized);
};

// export const getRecentProjects = () => {
//   // const merge = {
//   //   ...state.recentProjectNames,
//   //   ...state.recentProjectSpreadsheets
//   // };

//   const merge = getRecentProjectsFromCache();

//   const recentProjects = Object.keys(merge)
//     .sort((a, b) => {
//       return merge[b].date - merge[a].date;
//     })
//     .reduce((prev: { [key: string]: {} }, curr, i) => {
//       prev[i] = merge[curr];
//       return prev;
//     }, {});

//   const recentProjectsArray = Object.entries(recentProjects).map(
//     ([key, value]) => {
//       return value;
//     }
//   );

//   return recentProjectsArray;
// };

export const getIcoData = async (icoId: string) => {
  const [project, items] = await Promise.all([
    await getIcoProjectData(icoId),
    await getIcoItemsData(icoId),
  ]);
  const data = { project, items };
  return data;
};

export const getIcoProjectData = async (icoId: string) => {
  try {
    let project = null;
    // if (localStorage.project) {
    //   project = JSON.parse(localStorage.project);
    // } else {

    const projectSource = await fetchIcoProject(icoId);
    project = getIcoRenamedProject(projectSource);
    //localStorage.project = JSON.stringify(project);
    //}
    //state.project = project;
    return Promise.resolve(project);
    //console.info(state.project, "Project source");
  } catch (e) {
    throw e;
  }
};

export const getIcoItemsData = async (icoId: string) => {
  try {
    let data = null;
    // if (localStorage.data) {
    //   data = JSON.parse(localStorage.data);
    // } else {
    const dataSource = await fetchIcoData(icoId);

    data = getIcoRenamedItems(dataSource);
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
  rawProject: Data["project"],
  clear?: boolean
) => {
  // console.log(clear, "CLEAR ?");
  if (clear !== false) {
    clearAll();
  } else {
    clearAppDialogs();
    clearAppDataAndProject();
  }
  clearErrors();

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
    state.data = parsedData;
    state.project = rawProject;
    // console.log(state, "STATE");
  } catch (e) {
    throw e;
  }
  //state.filteredItems = parsedData.items;
 
};
