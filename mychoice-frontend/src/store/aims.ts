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
import { state } from "@/store";
import { getFilteredItems } from "@/store/items";
import { NormalizedAims, NormalizedArgument } from "@/@types";
import { uniqBy } from "lodash";

export const getAims = function() {
  const aims = state.data!.aims;
  // if (state.mode !== "consensus") {
  //   return filterNormalizedObjectByItemProp(aims, "aim");
  // }
  return aims;
};

export const aimsIds = function() {
  return Object.keys(getAims()).map(id => Number(id));
};

export const getAimsAsArray = function() {
  const aims = Object.keys(getAims());

  return aims.map(aim => Number(aim));
};
export const getAimById = function(aimId: number) {
  return getAims()[aimId];
};

export const getAimsBy = <
  T extends keyof NormalizedAims[keyof NormalizedAims],
  V
>(
  property: T,
  value: V
) => {
  const aims = Object.values(getAims()).filter(item => {
    return Number(item[property]) === Number(value);
  });

  return aims;
};

export const getAimName = function(aimId: number) {
  return getAims()[aimId] && getAims()[aimId].name;
};

export const getFilteredAims = () => {
  return aimsIds().filter(aimId => {
    return getFilteredItems().some(item => {
      return item.aim === aimId;
    });
  });
};

export const getFilteredAimsBy = <
  T extends keyof NormalizedAims[keyof NormalizedAims],
  V
>(
  property: T,
  value: V
) => {
  const filteredAims = getAimsBy(property, value).filter(aim => {
    return getFilteredItems().some(item => {
      return item.aim === aim.id;
    });
  });
  return filteredAims;
};

export const getAimsFromItems = (items: NormalizedArgument[]) => {
  return uniqBy(items, "aim").map(item => item.aim);
};

export const getAimsCountFromAimsAndCriterion = (
  aims: number[],
  criterionId: number
) => {
  return aims.filter(aimId => getAimById(aimId).criterion === criterionId)
    .length;
};
