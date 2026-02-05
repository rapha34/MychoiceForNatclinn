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
import { uniq, uniqBy, sortBy, groupBy, flatten } from "lodash";
import {
  Arguments,
  Argument,
  NormalizedArgument,
  Alternative,
  NormalizedObject,
  NormalizedData,
  SourceTypeEntity,
  expertiseEntity,
  Project
} from "@/@types";
import { MyChoiceError } from "./store/utils";
import { SpreadsheetArgument } from "./data-spreadsheet";

// const getUniqueValues = (data: Arguments, propertyName: T) => {
//   const allValues: Array<K> = data.map(argument => {
//     return argument.criterion;
//   });
//   const values: Array<K> = uniq(allValues);
//   return values;
// }

export const getPropertyUniqueValues = <
  D extends Arguments,
  P extends keyof Argument
>(
  data: D,
  prop: P
) => {
  const allValues = data.map(argument => {
    return argument[prop];
  });
  const values = uniq(allValues);
  return values;
};

// export const getLabels = <D extends Arguments>(data: D) => {
//   const allLabels = data.map(argument => {
//     return `${argument["property"]}:${argument["value"]}`;
//   });
//   const labels = uniq(allLabels);
//   return labels;
// };

export const getCriterions = (data: Arguments) => {
  const criterions = getPropertyUniqueValues(data, "criterion");
  return criterions;
};

// export const getAims = (data: Arguments) => {
//   const aims = getPropertyUniqueValues(data, "aim");

//   return aims;
// };

export const getAimsWithParentCriterion = (
  data: Arguments,
  criterions: NormalizedObject
) => {
  const allAimsTuples = data.map(argument => {
    return [argument["aim"], argument["criterion"]];
  });
  const aimsTuples = sortBy(
    uniqBy(allAimsTuples, joinTuple),
    ([aim, criterion]) => {
      return aim;
    }
  );
  const object: NormalizedObject & {
    [id: number]: { criterion?: number };
  } = {};
  aimsTuples.forEach((tuple, index) => {
    const aimId = tuple[0] as string;
    const criterionId = getIdFrom(criterions, tuple[1] as string, "nameCriterion");
    index++;
    object[index] = { id: index, name: aimId, criterion: criterionId };
  });
  return object;
};

export const getStakeholders = (data: Arguments) => {
  const stakeholders = getPropertyUniqueValues(data, "stakeholder");
  return stakeholders;
};

export const getProperties = (data: Arguments) => {
  const properties = getPropertyUniqueValues(data, "property");
  return properties;
};

export const getValues = (data: Arguments) => {
  const values = getPropertyUniqueValues(data, "value");
  return values;
};

export const joinTuple = <T>(array: T[]) => {
  return array.join(":");
};

export const getPropertyValueTuples = (data: Arguments) => {
  const allPropertyValueTuples = data.map(argument => {
    return [argument["property"], argument["value"]];
  });
  const propertyValueTuples = uniqBy(allPropertyValueTuples, joinTuple);
  return propertyValueTuples;
};

export const getAlternatives = (data: Arguments) => {
  const alternatives = getPropertyUniqueValues(data, "alternative");
  return alternatives;
};

// export const getAlternativesAsObject = (
//   data: Arguments
// ): Array<Omit<Alternative, "description">> => {
//   const alternatives = getPropertyUniqueValues(data, "alternative");

//   return alternatives.map(name => {
//     return {
//       name: name
//     };
//   });
// };

export const getFavorableValues = (data: Arguments) => {
  const favorables = getPropertyUniqueValues(data, "favorable");
  return favorables;
};

export const normalizeArray = <T extends keyof Argument>(
  array: Array<Extract<string, Argument[T]>>
) => {
  const object: NormalizedObject = {};
  array.forEach((name, index) => {
    index++;
    object[index] = { id: index, name };
  });
  return object;
};

export const normalizeAlternatives = (array: Alternative[]) => {
  const object: NormalizedData["alternatives"] = {};
  array.forEach((alternative, index) => {
    index++;
    object[index] = {
      id: index,
      ...alternative,
      icon:
        "mdi-" +
          alternative.icon
            .replace(/\.[^/.]+$/, "")
            .split(/(\\|\/)/g)
            .pop() || ""
    };
  });
  return object;
};

// export const normalizeCriterions = (
//   criterions: Array<Argument['criterion']>
// ) => {
//   return normalizeArray(criterions);
// };

// export const normalizeAims = (aims: Array<Argument['aim']>) => {
//   return normalizeArray(aims);
// };

// export const normalizeAlternatives = (
//   alternatives: Array<Argument['alternative']>
// ) => {
//   return normalizeArray(alternatives);
// };

const getIdFrom = <T extends keyof Argument>(
  object: NormalizedObject,
  property: Argument[T],
  name?: keyof SpreadsheetArgument
) => {
  // console.log(object, "object");
  // console.log(property, "property");
  const result = Object.values(object).find(item => item.name === property);

  try {
    return result!.id;
  } catch (e) {
    throw new MyChoiceError(
      "SPREADSHEET_ERROR",
      `Cannot find <b>${property}</b> in ${
        name === "nameAlternative" ? `alternatives` : `<b>${name}</b>`
      }`
    );
  }
};

export const parseItems = <
  T extends {
    [id: string]: NormalizedObject;
  }
>(
  data: Arguments,
  { criterions, aims, alternatives, stakeholders }: T
): NormalizedArgument[] => {
  return data.map(item => {
    // console.log(item, "item");
    // console.log(item.alternative, " alternative");
    return {
      ...item,
      subOption:
        JSON.parse(item.favorable.toString().toLowerCase()) === true ? 1 : 2, // not sure if it's a good practice...
      criterion: getIdFrom(criterions, item.criterion, "nameCriterion"),
      stakeholder: getIdFrom(stakeholders, item.stakeholder, "nameStakeHolder"),
      aim: getIdFrom(aims, item.aim, "aim"),
      alternative: getIdFrom(alternatives, item.alternative, "nameAlternative"),
      isProspective: Number(item.isProspective) === 1 ? true : false
    };
  });
};

export const getNormalizedSubsets = (data: Arguments, project: Project) => {
  const criterions = getCriterions(data);
  const stakeholders = getStakeholders(data);
  //const alternatives = getAlternatives(data);
  const alternatives = project.alternatives;

  const normalizedCriterions = normalizeArray(criterions.sort());
  const normalizedAlternatives = normalizeAlternatives(alternatives);
  const normalizedStakeholders = normalizeArray(stakeholders.sort());
  const normalizedAims = getAimsWithParentCriterion(data, normalizedCriterions);

  const normalizedItems = parseItems(data, {
    criterions: normalizedCriterions,
    aims: normalizedAims,
    alternatives: normalizedAlternatives,
    stakeholders: normalizedStakeholders
  });

  return {
    criterions: normalizedCriterions,
    alternatives: normalizedAlternatives,
    stakeholders: normalizedStakeholders,
    aims: normalizedAims,
    items: normalizedItems
  };
};

export const getNormalizedData = (
  data: Arguments,
  project: Project
): NormalizedData => {
  // const properties = getProperties(data);
  // const values = getValues(data);

  const propertyValueTuples = getPropertyValueTuples(data);
  const properties = getProperties(data);

  const {
    criterions,
    alternatives,
    stakeholders,
    aims,
    items
  } = getNormalizedSubsets(data, project);

  const normalizedData = {
    criterions,
    alternatives,
    stakeholders,
    labels: propertyValueTuples,
    properties,
    aims,
    items,
    subOptions: {
      1: { id: 1, name: "🙂" },
      2: { id: 2, name: "🙁" }
    }
  };

  /* console.log(normalizedData, "DATA"); */

  return normalizedData as NormalizedData;
};

export const getInterplayItems = function(items: Argument[]) {
  const propertyGroups = groupBy(items, "property");

  const propertyGroupsWithMultipleAims = Object.values(propertyGroups).filter(
    groupItems => {
      const aimGroups = groupBy(groupItems, "aim");

      if (Object.keys(aimGroups).length > 1) {
        return groupItems;
      }
    }
  );

  const interplayItems = flatten(propertyGroupsWithMultipleAims);

  return interplayItems;
};

export const getMultiStakholderItems = function(items: Argument[]) {
  const aimGroups = groupBy(items, "aim");

  const aimGroupsWithMultipleStakeholders = Object.values(aimGroups).filter(
    groupItems => {
      const stakeholderGroups = groupBy(groupItems, "stakeholder");

      if (Object.keys(stakeholderGroups).length > 1) {
        return groupItems;
      }
    }
  );

  const multiStakeholderItems = flatten(aimGroupsWithMultipleStakeholders);

  return multiStakeholderItems;
};

export const filterDataAsExpertise = (
  expertiseEntities: expertiseEntity[],
  data: Arguments
) => {
  const expertiseArguments = data.filter(item => {
    return expertiseEntities.some(
      entity =>
        entity.nameCriterion === item.criterion &&
        entity.nameStakeHolder === item.stakeholder
    );
  });

  return expertiseArguments;
};

export const filterDataAsReliability = (
  typeSource: SourceTypeEntity[],
  data: Arguments
) => {
  typeSource;

  const prospectiveArguments = data.filter(item => {
    return typeSource.some(
      source =>
        source.nameTypeSource === item.sourceType &&
        Number(source.fiability) === (1 || 2)
    );
  });

  return prospectiveArguments;
};

export const filterDataAsProspective = (data: Arguments) => {
  const prospectiveArguments = data.filter(
    item => Number(item.isProspective) === 1
  );

  return prospectiveArguments;
};

// DEPRECETATED (to remove)
export const filterNormalizedDataAsProspective = (
  normalizedData: NormalizedData
) => {
  const prospectiveItems = normalizedData.items.filter(
    item => item.isProspective === true
  );

  const prospectiveData = {
    ...normalizedData,
    items: prospectiveItems
  };

  return prospectiveData;
};

export const filterDataAsInterplay = (data: Arguments) => {
  const interplayItems = getInterplayItems(data);

  return interplayItems;
};

export const filterDataAsMultiStakeholder = (data: Arguments) => {
  const multiStakeholderItems = getMultiStakholderItems(data);

  return multiStakeholderItems;
};

// DEPRECETATED (to remove)
export const filterNormalizedDataAsInterplay = (
  normalizedData: NormalizedData
) => {
  const itemsProps = {
    criterions: "criterion",
    aims: "aim",
    stakeholders: "stakeholder"
  };
  // const props = <Array<keyof NormalizedArgument>>[
  //   "criterion",
  //   "aim",
  //   "stakeholder"
  // ];

  const interplayData = normalizedData;
  //@ts-ignore
  interplayData.items = getInterplayItems(normalizedData.items);

  Object.entries(normalizedData).forEach(([key, normalizedObject]) => {
    if (Object.keys(itemsProps).includes(key)) {
      //@ts-ignore
      const itemPropName = itemsProps[key];
      const interplayNormalizedObject = Object.keys(normalizedObject)
        .map(key => Number(key))
        .filter(id => {
          return normalizedData.items.some(item => {
            //@ts-ignore
            return item[itemPropName] === id;
          });
        })
        .reduce((filteredNormalizedObject: NormalizedObject, id: number) => {
          filteredNormalizedObject[id] = normalizedObject[id];
          return filteredNormalizedObject;
        }, {});
      //@ts-ignore
      interplayData[key] = interplayNormalizedObject;
    }
  });

  return interplayData;
};

// export const normalizeFavorables = (
//   favorables: Array<Argument['favorable']>
// ) => {

//   return normalizeArray(favorables);
// };

const test = {
  criterions: {
    1: { id: 1, name: "Nutrition and health	" },
    2: { id: 2, name: "Economic" }
  },
  aims: {
    1: { id: 1, name: "Consuming a balanced diet", category: 1 },
    2: { id: 2, name: "Enabling proper digestion", category: 1 },
    3: { id: 3, name: "Rationalizing the ratio protein/price", category: 2 }
  },
  alternatives: {
    1: { id: 1, name: "Plant-based diet" },
    2: { id: 2, name: "Animal-based diet" }
  },
  subOptions: {
    ":)": { id: ":)", name: "🙂" },
    ":(": { id: ":(", name: "🙁" }
  }
};
