import { Data } from "@/@types";

import { computed } from "vue";

import { merge, omit } from "lodash";
import type { RouteLocationNormalized } from "vue-router";
import { getRouteTypeValue, PROJECT_TYPE_ROUTES, state } from ".";

export enum ProjectGroupNames {
  ICO = "ico",
  GOOGLE_SPREADSHEET = "googlespreadsheet",
  NEXTCLOUD = "nextcloud",
  XLSX = "xlsx",
}

export type LocalStorageCacheProjectItem = {
  name?: string;
  id: string;
  date: number;
  data: Data;
  type?: keyof LocalStorageCache["projects"];
};

export type LocalStorageCacheProjectGroup = {
  [id: string]: LocalStorageCacheProjectItem;
};

export type LocalStorageCache = {
  projects: {
    [ProjectGroupNames.ICO]: LocalStorageCacheProjectGroup;
    [ProjectGroupNames.GOOGLE_SPREADSHEET]: LocalStorageCacheProjectGroup;
    [ProjectGroupNames.NEXTCLOUD]: LocalStorageCacheProjectGroup;
    [ProjectGroupNames.XLSX]: LocalStorageCacheProjectGroup;
  };
};

export const initialCacheState: LocalStorageCache = {
  projects: {
    [ProjectGroupNames.ICO]: {},
    [ProjectGroupNames.GOOGLE_SPREADSHEET]: {},
    [ProjectGroupNames.NEXTCLOUD]: {},
    [ProjectGroupNames.XLSX]: {},
  },
};

export const LOCAL_STORAGE_CACHE_KEY = "MYCHOICE_CACHE";

export const getLocalStorageCache = () => {
  const cachedData = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
  return (JSON.parse(cachedData || '{}') ||
    initialCacheState) as LocalStorageCache;
};
export const getProjectsCache = () => {
  const cache = getLocalStorageCache();
  return cache?.projects || initialCacheState.projects;
};

export const getProjectFromCache = (
  type: keyof LocalStorageCache["projects"],
  id: string
) => {
  return Object.values(getProjectsCache()[type]).find((project) => {
    return project.id === id;
  });
};

export const setLocalStorageCache = (data: LocalStorageCache) => {
  localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(data));
};

export const updateLocalStorageCache = (toMerge: any) => {
  const currentCache = getLocalStorageCache();

  //   const updatedCache = { ...currentCache, ...toMerge };
  const mergedCache = merge(currentCache, toMerge);
  setLocalStorageCache(mergedCache);
};
export const removeFromLocalStorageCache = (path: string) => {
  const cache = getLocalStorageCache();

  const updatedCache = omit(cache, path);

  setLocalStorageCache(updatedCache as LocalStorageCache);
};
export const updateProjectCache = (
  type: keyof LocalStorageCache["projects"],
  projectItem: Partial<LocalStorageCacheProjectItem> &
    Pick<LocalStorageCacheProjectItem, "id">
) => {
  updateLocalStorageCache({
    projects: { [type]: { [projectItem.id]: projectItem } },
  });
};

export const saveProjectToCache = (
  type: keyof LocalStorageCache["projects"],
  projectItem: Partial<LocalStorageCacheProjectItem> &
    Pick<LocalStorageCacheProjectItem, "id" | "data">
) => {
  updateProjectCache(type, projectItem);
};

export const getRecentProjectsByTypeFromCache = (
  type: keyof LocalStorageCache["projects"]
) => {
  return getProjectsCache()[type];
};

export const getAsFlattenProjects = (
  projects: LocalStorageCache["projects"]
) => {
  if (!projects) return {};
  const recentProjects = {} as LocalStorageCacheProjectGroup;
  Object.entries(projects)
    // Limited for RESTRICTED version
    .filter(
      ([typeId]) =>
        typeId !== ProjectGroupNames.GOOGLE_SPREADSHEET &&
        typeId !== ProjectGroupNames.NEXTCLOUD
    )
    .forEach(([typeId, items]) => {
      Object.entries(items).forEach(([itemId, itemValue]) => {
        const itemFullId = getProjectFullId(
          typeId as keyof LocalStorageCache["projects"],
          itemId
        );
        recentProjects[itemFullId] = {
          ...itemValue,
          type: typeId as keyof LocalStorageCache["projects"],
        };
      });
    });
  return recentProjects;
};

export const recentProjects = computed(() => state.recentProjects);
export const hasRecentProjects = computed(() =>
  Object.keys(recentProjects.value).length ? true : false
);

export const setRecentProjectsState = () => {
  state.recentProjects = getProjectsSortedByDate(getProjectsCache());
};

export const getProjectsSortedByDate = (
  projects: LocalStorageCache["projects"]
) => {
  const merge = getAsFlattenProjects(projects);
  const recentProjects = Object.keys(merge)
    .sort((a, b) => {
      return merge[b].date - merge[a].date;
    })
    .reduce((prev: LocalStorageCacheProjectGroup, value, i) => {
      prev[i] = merge[value];
      return prev;
    }, {});

  const recentProjectsArray = Object.entries(recentProjects).map(
    ([key, value]) => {
      return value;
    }
  );

  return recentProjectsArray;
};

export const saveToRecentProjects = (
  type: keyof LocalStorageCache["projects"],
  { name, id }: Partial<LocalStorageCacheProjectItem>
) => {
  if (id === undefined) {
    return;
  }
  const isProjectInCache = Object.keys(
    getRecentProjectsByTypeFromCache(type)
  ).includes(id);
  if (!isProjectInCache) {
    updateProjectCache(type, {
      name,
      id,
      date: Date.now(),
      type,
    });
  } else {
    if (name) {
      updateProjectCache(type, { name, id });
    }
    updateProjectCache(type, { date: Date.now(), id, type });
  }
  setRecentProjectsState();
};

export const getProjectFullId = (
  type: keyof LocalStorageCache["projects"],
  id: LocalStorageCacheProjectItem["id"]
) => `${type}-${id}`;

export const removeFromRecentProjects = (
  type: keyof LocalStorageCache["projects"],
  { id }: Pick<LocalStorageCacheProjectItem, "id">
) => {
  // const fullId = getProjectFullId(type, id);
  const isProjectExist = state.recentProjects.some(
    (project: LocalStorageCacheProjectItem) =>
      project.type === type && project.id === id
  );
  

  if (isProjectExist) {
    removeProjectFromCache(type, id);
    setRecentProjectsState();
  }
};

export const removeProjectFromCache = (
  type: keyof LocalStorageCache["projects"],
  id: string
) => {
  removeFromLocalStorageCache(`projects.${type}.${id}`);
};
export const removeProjectDataFromCache = (
  type: keyof LocalStorageCache["projects"],
  id: string
) => {
  removeFromLocalStorageCache(`projects.${type}.${id}.data`);
};

export const clearProjectDataCacheFromRoute = (route: RouteLocationNormalized) => {
  if (route.query[PROJECT_TYPE_ROUTES.ICO]) {
    // clearIcoItemFromCache(
    //   router.currentRoute.query[projectNameRouteQuery] as string
    // );
    removeProjectDataFromCache(
      ProjectGroupNames.ICO,
      route.query[PROJECT_TYPE_ROUTES.ICO] as string
    );
  }
  if (route.query[PROJECT_TYPE_ROUTES.GOOGLE_SPREADSHEET]) {
    // clearSpreadsheetItemFromCache(
    //   router.currentRoute.query[spreadsheetIdRouteQuery] as string
    // );

    removeProjectDataFromCache(
      ProjectGroupNames.GOOGLE_SPREADSHEET,
      route.query[PROJECT_TYPE_ROUTES.GOOGLE_SPREADSHEET] as string
    );
  }
  if (route.query[PROJECT_TYPE_ROUTES.NEXTCLOUD]) {
    removeProjectDataFromCache(
      ProjectGroupNames.NEXTCLOUD,
      route.query[PROJECT_TYPE_ROUTES.NEXTCLOUD] as string
    );
  }
  if (route.query[PROJECT_TYPE_ROUTES.XLSX]) {
    removeProjectDataFromCache(
      ProjectGroupNames.XLSX,
      route.query[PROJECT_TYPE_ROUTES.XLSX] as string
    );
  }
};

export const isProjectCached = (route: RouteLocationNormalized) => {
  return getProjectDataCacheFromRoute(route) ? true : false;
};

export const getProjectCacheFromRoute = (route: RouteLocationNormalized) => {
  const id = getRouteTypeValue(route);
  if (!id) return undefined;
  
  if (route.query[PROJECT_TYPE_ROUTES.GOOGLE_SPREADSHEET]) {
    return getProjectFromCache(ProjectGroupNames.GOOGLE_SPREADSHEET, id);
  }
  if (route.query[PROJECT_TYPE_ROUTES.ICO]) {
    return getProjectFromCache(ProjectGroupNames.ICO, id);
  }
  if (route.query[PROJECT_TYPE_ROUTES.NEXTCLOUD]) {
    return getProjectFromCache(ProjectGroupNames.NEXTCLOUD, id);
  }
  if (route.query[PROJECT_TYPE_ROUTES.XLSX]) {
    return getProjectFromCache(ProjectGroupNames.XLSX, id);
  }
};

export const setProjectCache = (route: RouteLocationNormalized, data: Data) => {
  const id = getRouteTypeValue(route);
  if (!id) return;
  
  if (route.query[PROJECT_TYPE_ROUTES.GOOGLE_SPREADSHEET]) {
    saveProjectToCache(ProjectGroupNames.GOOGLE_SPREADSHEET, {
      id,
      data,
    });
  }
  if (route.query[PROJECT_TYPE_ROUTES.ICO]) {
    saveProjectToCache(ProjectGroupNames.ICO, {
      id,
      data,
    });
  }
  if (route.query[PROJECT_TYPE_ROUTES.NEXTCLOUD]) {
    saveProjectToCache(ProjectGroupNames.NEXTCLOUD, {
      id,
      data,
    });
  }
  if (route.query[PROJECT_TYPE_ROUTES.XLSX]) {
    saveProjectToCache(ProjectGroupNames.XLSX, {
      id,
      data,
    });
  }
};

export const getProjectDataCacheFromRoute = (route: RouteLocationNormalized) => {
  const result = getProjectCacheFromRoute(route);
  return result?.data;
};

// export const isSpreadsheetCached = (spreadsheetId: string) => {
//   return getSpreadsheetProjectDataFromCache(spreadsheetId) ? true : false;
//   // return localStorage.getItem("spreadsheet-" + spreadsheetId) !== null
//   //   ? true
//   //   : false;
// };
// export const isIcoProjectCached = (projectName: string) => {
//   return getIcoProjectDataFromCache(projectName) ? true : false;
// };

// export const getIcoProjectFromCache = (projectName: string) => {
//   return getProjectFromCache(ProjectGroupNames.ICO, projectName);
//   // return JSON.parse(localStorage.getItem("ico-" + projectName));
// };
// export const getIcoProjectDataFromCache = (projectName: string) => {
//   const { data } = getIcoProjectFromCache(projectName);
//   return data;
// };
// export const getSpreadsheetProjectFromCache = (spreadsheetId: string) => {
//   return getProjectFromCache(
//     ProjectGroupNames.GOOGLE_SPREADSHEET,
//     spreadsheetId
//   );
//   // return JSON.parse(localStorage.getItem("spreadsheet-" + spreadsheetId));
// };
// export const getSpreadsheetProjectDataFromCache = (spreadsheetId: string) => {
//   const { data } = getSpreadsheetProjectFromCache(spreadsheetId);
//   return data;
// };

// export const setIcoProjectToCache = (projectName: string, data: Data) => {
//   saveProjectToCache(ProjectGroupNames.ICO, {
//     id: projectName,
//     data,
//   });
//   // localStorage.setItem("ico-" + projectName, JSON.stringify(data));
// };
// export const setSpreadsheetProjectToCache = (
//   spreadsheetId: string,
//   data: Data
// ) => {
//   // localStorage.setItem("spreadsheet-" + spreadsheetId, JSON.stringify(data));
//   saveProjectToCache(ProjectGroupNames.GOOGLE_SPREADSHEET, {
//     id: spreadsheetId,
//     data,
//   });
// };

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
  // if (state.recentProjectSpreadsheets[spreadsheetId]) {
  //   delete state.recentProjectSpreadsheets[spreadsheetId];
  //   localStorage.recentProjectSpreadsheets = JSON.stringify(
  //     state.recentProjectSpreadsheets
  //   );
  // }

  removeFromRecentProjects(ProjectGroupNames.GOOGLE_SPREADSHEET, {
    id: spreadsheetId,
  });
};

export const clearLocalStorage = function () {
  return localStorage.clear();
};

// export type RecentProjectNamesArray = []{}

// export const recentProjectsNames = computed(() => {
//   const cache = getLocalStorageCache();
//   return Object.entries(cache).reduce((acc, [key, items]) => {
//     const [itemId, itemValue] = Object.entries(items);
//     acc.push({ [`${key}-${itemId}`]: itemValue });
//   }, []);
// });
