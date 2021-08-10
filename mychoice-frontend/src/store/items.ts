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
import { state, sortObject } from "@/store";
import { uniqBy, sortBy, isEqual, property } from "lodash";
import { NormalizedArgument, SubType, NormalizedObject } from "@/@types";
import { getAlternativesAsArray } from "@/store/alternatives";
import { getAims, getAimsAsArray } from "@/store/aims";
import { getCriterionsAsArray } from "@/store/criterions";

import { filter, groupBy, flatten } from "lodash";

export const getAllItems = function() {
  const items = state!.data!.items;
  // if (state.mode === "interplay") {
  //   return getInterplayItems(items);
  // }
  return items;
};

// export const getInterplayItems = function(items: NormalizedArgument[]) {
//   const propertyGroups = groupBy(items, "property");

//   const propertyGroupsWithMultipleAims = Object.values(propertyGroups).filter(
//     groupItems => {
//       const aimGroups = groupBy(groupItems, "aim");

//       if (Object.keys(aimGroups).length > 1) {
//         return groupItems;
//       }
//     }
//   );

//   const interplayItems = flatten(propertyGroupsWithMultipleAims);

//   return interplayItems;
// };

export const getFilteredItems = function() {
  let items = filterItemsByValue(getAllItems(), state.searchInput);

  if (state.selectedAims.length) {
    items = items.filter(item => {
      //@ts-ignore
      return state.selectedAims.includes(item["aim"]);
    });
  }
  if (state.selectedStakeholders.length) {
    items = items.filter(item => {
      //@ts-ignore
      return state.selectedStakeholders.includes(item["stakeholder"]);
    });
  }

  if (state.selectedCriterions.length) {
    items = items.filter(item => {
      //@ts-ignore
      return state.selectedCriterions.includes(
        Number(getAims()[item["aim"]].criterion)
      );
    });
  }

  return items;
};

export const filterItemsBy = <
  T extends Partial<NormalizedArgument>,
  P extends keyof NormalizedArgument,
  V extends NormalizedArgument[P]
>(
  items: NormalizedArgument[],
  payload: T
) => {
  const entries = Object.entries(payload) as [P, V][];
  return items.filter(item => {
    return entries.every(([property, value]) => {
      return item[property] === value;
    });
  });
};

export const getItemsBy = function<T extends Partial<NormalizedArgument>>(
  payload: T
) {
  return payload ? filterItemsBy(getAllItems(), payload) : [];
};

//export const get _.uniqWith(objects, _.isEqual);

export const getLabel = function(payload: Partial<NormalizedArgument>) {
  return `${payload.property}:${payload.value}`;
};

export const getDuplicatesGroups = function<
  T extends Partial<NormalizedArgument>
>(payload: T[]) {
  return Object.values(
    groupBy(
      payload,
      ({ property, value, assertion, explanation, stakeholder }) =>
        JSON.stringify({ property, value, assertion, explanation, stakeholder })
    )
  );
};

export const getFilteredItemsBy = function<
  T extends Partial<NormalizedArgument>
>(payload: T) {
  return filterItemsBy(getFilteredItems(), payload);
};

export const filterByPropValue = function<
  P extends keyof NormalizedArgument,
  V extends NormalizedArgument[P]
>(items: NormalizedArgument[], prop: P, value: V) {
  return items.filter(item => {
    return item[prop] === value;
  });
};

export const getItemsByPropValue = function<
  P extends keyof NormalizedArgument,
  V extends NormalizedArgument[P]
>(prop: P, value: V) {
  return filterByPropValue(getAllItems(), prop, value);
};

export const getFilteredItemsByPropValue = function<
  P extends keyof NormalizedArgument,
  V extends NormalizedArgument[P]
>(prop: P, value: V) {
  return filterByPropValue(getFilteredItems(), prop, value);
};

export const getUniqueItemsBy = <
  T extends Partial<NormalizedArgument>,
  P extends keyof NormalizedArgument
>(
  payload: T,
  uniqProp: P
) => {
  return uniqBy(getItemsBy(payload), uniqProp);
};

export const getItemsFromUniqueProperty = ({
  criterion,
  aim,
  property,
  value
}: {
  criterion: number;
  aim: number;
  property: string;
  value: string;
}) => {
  return getAllItems().filter(
    item =>
      item.criterion === criterion &&
      item.aim === aim &&
      item.property === property &&
      item.value === value
  );
};

export const filterItemsByValue = function<T>(
  items: NormalizedArgument[],
  input: string
) {
  return items.filter(o =>
    Object.keys(o).some(k => {
      if (["property", "value"].includes(k)) {
        //@ts-ignore
        const value = o[k];
        // console.log(k, "value");

        // try {

        return value
          .toString()
          .toLowerCase()
          .includes(input.toString().toLowerCase());
        // } catch (e) {
        //   console.log(o, "prop");
        //   console.log(k, "val");
        //   console.log(value, "VALUE");
        //   throw e;
        // }
      }
    })
  );
};

/* -------- ^ we keep it */

// export const getItemsByAimId = function(aimId: number) {
//   return getAllItems().filter(item => {
//     return item.aim === aimId;
//   });
// };
// export const getUniqueItemsByAimId = function(aimId: number) {
//   return uniqBy(getItemsByPropValue("aim", aimId), "property");
// };

// export const getFilteredItemsMatchingObject = function<
//   T extends Partial<NormalizedArgument>
// >(payload: T) {
//   const entries = Object.entries(payload);
//   const items = getFilteredItems().filter(item => {
//     return entries.every(([property, value]) => {
//       //@ts-ignore
//       return item[property] === value;
//     });
//   });

//   return items;
// };

export const getItemById = function(itemId: number) {
  return getAllItems().find(item => item.id === itemId);
};

// export const getItemsBy = function<K extends keyof NormalizedArgument>(
//   prop: K,
//   id: number
// ) {
//   id = Number(id);
//   return getAllItems().filter(item => {
//     // @ts-ignore
//     return item[prop] === id;
//   });
// };

// export const getItemsByCriterionId = function(criterionId: number) {
//   return getAllItems().filter(item => {
//     return item.criterion === criterionId;
//   });
// };

// export const getUniqueItemsBy = function<K extends keyof NormalizedArgument>(
//   prop: K,
//   id: number,
//   uniqProp: K
// ) {
//   const items = getItemsBy({
//     [prop]: id
//   });
//   return uniqBy(items, uniqProp);
// };

// export const getItemsByProperty = function(value: string) {
//   return getAllItems().filter(argument => {
//     return argument.property === value;
//   });
// };

// export const filterByAimAndCriterion = ({
//   items,
//   aimId,
//   criterionId
// }: {
//   items: NormalizedArgument[];
//   aimId: number;
//   criterionId: number;
// }) => {
//   return items.filter(
//     item => item.criterion === criterionId && item.aim === aimId
//   );
// };

// export const filterByAimAndAlternative = ({
//   items,
//   aimId,
//   alternativeId
// }: {
//   items: NormalizedArgument[];
//   aimId: number;
//   alternativeId: number;
// }) => {
//   return items.filter(
//     item => item.alternative === alternativeId && item.aim === aimId
//   );
// };

// export const getFilteredItemsByAimAndAlternative = ({
//   aimId,
//   alternativeId
// }: {
//   aimId: number;
//   alternativeId: number;
// }) => {
//   return filterByAimAndAlternative({
//     items: getFilteredItems(),
//     aimId,
//     alternativeId
//   });
// };

export const normalizeByAlternative = (items: NormalizedArgument[]) => {
  let obj: {
    [id: string]: NormalizedArgument[];
  } = {};
  const alternatives = getAlternativesAsArray();

  alternatives.forEach(alternativeId => {
    const filteredItems = items.filter(
      argument => argument.alternative === alternativeId
    );
    obj[alternativeId] = filteredItems;
  });

  return obj;
};

export const normalizeByAim = (items: NormalizedArgument[]) => {
  let obj: {
    [id: string]: NormalizedArgument[];
  } = {};
  const aims = getAimsAsArray();

  aims.forEach(aimId => {
    const filteredItems = items.filter(argument => argument.aim === aimId);
    obj[aimId] = filteredItems;
  });

  return obj;
};

export const normalizeByCriterion = (items: NormalizedArgument[]) => {
  let obj: {
    [id: string]: NormalizedArgument[];
  } = {};
  const criterions = getCriterionsAsArray();

  criterions.forEach(criterionId => {
    const filteredItems = items.filter(
      argument => argument.criterion === criterionId
    );
    obj[criterionId] = filteredItems;
  });

  return obj;
};

// DEPRECATED
export const getNormalizedItemsByUniqueProperties = function(filtered = true) {
  const normalizedObject: {
    [id: string]: NormalizedArgument[];
  } = {};

  const items = filtered ? getFilteredItems() : getAllItems();

  items.forEach(item => {
    if (normalizedObject[item.property]) {
      normalizedObject[item.property].push(item);
    } else {
      normalizedObject[item.property] = [item];
    }
  });

  return sortObject(normalizedObject);
};

export const getNormalizedItemsByUniqueItemProp = function(
  itemProp: keyof SubType<NormalizedArgument, string | number>,
  filtered = true
) {
  const normalizedObject: {
    [id: string]: NormalizedArgument[];
  } = {};

  const items = filtered ? getFilteredItems() : getAllItems();

  items.forEach(item => {
    const itemPropValue = item[itemProp];
    if (normalizedObject[itemPropValue]) {
      normalizedObject[itemPropValue].push(item);
    } else {
      normalizedObject[itemPropValue] = [item];
    }
  });

  return sortObject(normalizedObject);
};

export const filterNormalizedObjectByItemProp = (
  normalizedObject: NormalizedObject,
  itemProp: keyof NormalizedArgument
) => {
  return Object.keys(normalizedObject)
    .map(key => Number(key))
    .filter(id => {
      return getAllItems().some(item => {
        return item[itemProp] === id;
      });
    })
    .reduce((filteredNormalizedObject: NormalizedObject, id: number) => {
      filteredNormalizedObject[id] = normalizedObject[id];
      return filteredNormalizedObject;
    }, {});
};

export const getFilteredItemsGroupByProp = (
  payload: Partial<NormalizedArgument>,
  prop: keyof NormalizedArgument
) => {
  return groupBy(getFilteredItemsBy(payload), prop);
};
