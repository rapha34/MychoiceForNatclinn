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
import { state } from "@/store";

import { getAllItems } from "@/store/items";
import { Superset } from "@/@types";

export const getSupersetsBy = <T extends Superset>(payload: T): T[] => {
  const arr: string[] = [];
  const entries = Object.entries(payload);

  const result = getAllItems()
    .filter(item => {
      let hash = getPayloadHash(payload);
      if (arr.indexOf(hash) === -1) {
        arr.push(hash);
        return entries.every(([property, value]) => {
          //@ts-ignore
          return item[property] === value;
        });
      }
      return false;
    })
    .map(item => {
      let superset = <T>{};
      superset["alternative"] = item["alternative"];
      superset["subOption"] = item["subOption"];
      Object.keys(payload).forEach(key => {
        //@ts-ignore
        superset[key] = item[key];
      });
      return superset;
    });
  return result;
};

export const getPayloadHash = (payload: Superset) => {
  //return `${payload.criterion}:${payload.aim}:${payload.property}:${payload.value}`;
  // return Object.keys(payload)
  //   .sort()
  //   .map(key => {
  //     return `${key}-${payload[key]}`;
  //   })
  //   .join(":");
  const ordered = {};
  Object.keys(payload)
    .sort()
    .forEach(function(key) {
      //@ts-ignore
      ordered[key] = payload[key];
    });
  return JSON.stringify(ordered);
};

export const getSelectedSupersets = () => state.selectedSupersets;

export const selectSuperset = function(payload: Superset) {
  state.selectedSuperset = getPayloadHash(payload);
};
export const unselectSuperset = function(payload: Superset) {
  state.selectedSuperset = "";
};
export const toggleSuperset = function(payload: Superset) {
  if (state.selectedSuperset === getPayloadHash(payload)) {
    unselectSuperset(payload);
  } else {
    selectSuperset(payload);
  }
};
export const addSupersetInSelection = function(payload: Superset) {
  if (!findSuperset(payload)) {
    state.selectedSupersets.push(getPayloadHash(payload));
  }
};
export const removeSupersetInSelection = function(payload: Superset) {
  const string = getPayloadHash(payload);
  var index = getSelectedSupersets().indexOf(string);
  if (index > -1) {
    state.selectedSupersets.splice(index, 1);
  }
};
export const toggleSupersetInSelection = function(payload: Superset) {
  if (findSuperset(payload)) {
    removeSupersetInSelection(payload);
  } else {
    addSupersetInSelection(payload);
  }
};

export const findSuperset = function(payload: Superset) {
  return getSelectedSupersets().find(
    stringifiedObject => stringifiedObject === getPayloadHash(payload)
  );
};
