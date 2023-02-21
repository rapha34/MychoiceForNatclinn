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
export * from "./state";
export * from "./routes";
export * from "./notifications";
export * from "./fetch";
export * from "./items";
export * from "./aims";
export * from "./criterions";
export * from "./alternatives";
export * from "./suboptions";
export * from "./stakeholders";
export * from "./supersets";
export * from "./acceptability";
export * from "./utils";
export * from "./labels";
export * from "./select";
export * from "./spreadsheet";
export * from "./project";
export * from "./filedrop";
export * from "./xlsx";
export * from "./cache";
export * from "./csv";

import { state } from "./state";

import { NormalizedData, NormalizedArgument } from "@/@types";
import router from "@/router";
import { loadAll } from "./fetch";
import { clearProjectDataCacheFromRoute } from "./cache";

export const getSearchInput = () => {
  return state.searchInput;
};

export const getPropById = function <K extends keyof NormalizedData>(
  prop: K,
  id: number
) {
  return state.data![prop][id];
};

export const getUniqueOrBlank = (
  items: NormalizedArgument[],
  prop: keyof NormalizedArgument
) => {
  const arr: NormalizedArgument[] & null[] = [];
  items.forEach((item) => {
    //@ts-ignore
    if (arr.indexOf(item[prop]) === -1) {
      arr.push(item);
    } else {
      arr.push(null);
    }
  });
  return arr;
};

// Clear all cache except
// export const clearLocalStorageExcept = (excludedKeys: string[]) => {
//   const toRestore: any = {};
//   excludedKeys.forEach(key => {
//     toRestore[key] = localStorage.getItem(key);
//   });

//   localStorage.clear();

//   Object.keys(toRestore).forEach(key => {
//     localStorage.setItem(key, toRestore[key]);
//   });
// };

export const refreshProject = async () => {
  clearProjectDataCacheFromRoute(router.currentRoute);
  await loadAll(router.currentRoute);
};

// DEPRECATED
// export const clearSpreadsheetItemFromCache = (spreadsheetId: string) => {
//   localStorage.removeItem("spreadsheet-" + spreadsheetId);
// };
// export const clearIcoItemFromCache = (projectName: string) => {
//   localStorage.removeItem("ico-" + projectName);
// };
// export const clearApplicationCache = () => {
//   const excludedKeys = ["recentProjectNames", "recentProjectSpreadsheets"];
//   clearLocalStorageExcept(excludedKeys);
// };
