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
import { NormalizedArgument, NormalizedObject } from "@/@types";
import {
  normalizeByAlternative,
  getFilteredItems,
  getFilteredItemsBy,
  normalizeByAim,
  filterItemsBy
} from "@/store";

import { getRange } from "@/store/utils";
import { alternativesIds } from "./alternatives";

export const roundNumber = (number: number) => {
  return Math.round(number * 100) / 100;
};

export const getWeightedAcceptability = (
  items: NormalizedArgument[],
  rounded = true
) => {
  const normalizedAims = normalizeByAim(items);

  const alternativeSums: {
    [id: number]: number[];
  } = {};

  const alternativeAcceptability: {
    [id: number]: number | null;
  } = {};

  Object.entries(normalizedAims).map(([j, aimsItems]) => {
    const aimId = Number(j);

    const alternativeWeigths = getWeightByAlternativeV2(aimsItems);
    Object.entries(alternativeWeigths).forEach(([k, alternativeWeight]) => {
      const alternativeId = Number(k);
      (
        alternativeSums[alternativeId] || (alternativeSums[alternativeId] = [])
      ).push(alternativeWeight);
    });
  });

  Object.entries(alternativeSums).forEach(([l, sums]) => {
    const acceptability = sumArray(sums) / items.length;
    // alternativeAcceptability[Number(l)] = acceptability
    //   ? roundNumber(acceptability)
    //   : null;
    const numberOrNull = !Number.isNaN(acceptability)
      ? rounded
        ? roundNumber(acceptability)
        : acceptability
      : null;
    alternativeAcceptability[Number(l)] = numberOrNull;
  });

  return alternativeAcceptability;
};

// export const getWeightByAlternativeV1 = (items: NormalizedArgument[]) => {
//   const normalizedAlternatives = normalizeByAlternative(items);
//   const obj: {
//     [id: number]: number;
//   } = {};
//   Object.entries(normalizedAlternatives).forEach(([key, alternativeItems]) => {
//     const alternativeId = Number(key);

//     const pro = alternativeItems.filter(argument => argument.subOption === 1);
//     const con = alternativeItems.filter(argument => argument.subOption === 2);

//     let score;
//     if (pro.length === 0 && items.length === 0) {
//       score = 0;
//     } else if (pro.length === 0 && con.length === 0 && items.length > 0) {
//       score = 0.5;
//     } else {
//       score = pro.length / alternativeItems.length;
//     }

//     const weight = score * items.length;

//     obj[alternativeId] = weight;
//   });
//   return obj;
// };

export const getWeightByAlternativeV2 = (items: NormalizedArgument[]) => {
  const normalizedAlternatives = normalizeByAlternative(items);
  const obj: {
    [id: number]: number;
  } = {};
  Object.entries(normalizedAlternatives).forEach(([key, alternativeItems]) => {
    const alternativeId = Number(key);

    const pro = alternativeItems.filter(argument => argument.subOption === 1);
    const con = alternativeItems.filter(argument => argument.subOption === 2);

    const proCount = pro.length + 1; // on initialise avec 1 argument positif et 1 argument négatif
    const conCount = con.length + 1; // on initialise avec 1 argument positif et 1 argument négatif
    const totalCount = alternativeItems.length + 2;

    //const noItemsAtAll = pro.length === 0 && items.length === 0
    const noItemsAtAll = items.length === 0;
    const noItemsForThisAlternative =
      pro.length === 0 && con.length === 0 && items.length > 0;

    let score;
    if (noItemsAtAll) {
      score = 0;
    } else if (noItemsForThisAlternative) {
      score = 0.5;
    } else {
      score = proCount / totalCount;
    }

    const weight = score * items.length;

    obj[alternativeId] = weight;
  });
  return obj;
};

export const sumArray = (arrayToSum: number[]) => {
  return arrayToSum.reduce((acc, value) => acc + value);
};

export const getAcceptabilityFromProCon = (
  items: NormalizedArgument[],
  rounded = true
) => {
  if (items.length === 0) {
    return null;
  }
  const pro = items.filter(argument => argument.subOption === 1);
  const con = items.filter(argument => argument.subOption === 2);
  const value = items.length - con.length;

  const acceptability = getRange(value, 0, items.length);
  // const round = Math.round(acceptability * 100) / 100; //
  return rounded ? roundNumber(acceptability) : acceptability;
};

export const getAcceptabilityName = (acceptability: number | null) => {
  if (acceptability === null) {
    return "";
  } else if (acceptability === 1) {
    return "pro";
  } else if (acceptability === 0) {
    return "con";
  } else {
    return "mix";
  }
};

export const getAcceptabilityFromAlternativeId = (
  alternativeId: number,
  rounded = true
) => {
  const filteredItems = getFilteredItems();
  const alternatives = normalizeByAlternative(filteredItems);
  const alternativeItems = alternatives[alternativeId];
  return getAcceptabilityFromProCon(alternativeItems);
};
