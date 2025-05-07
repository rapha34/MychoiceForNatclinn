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
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { state } from "./state";
dayjs.extend(customParseFormat);

export class MyChoiceError extends Error {
  constructor(name: string, ...args: any) {
    super(...args);
    // this.name = this.constructor.name;
    this.name = name;
    //@ts-ignore
    if (typeof Error.captureStackTrace === "function") {
      //@ts-ignore
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(this.message).stack;
    }
  }
}

// class GoodError extends Error {
//   constructor(...args) {
//       super(...args)
//       Error.captureStackTrace(this, GoodError)
//   }
// }

export const setError = (errorName: string, errorValue: boolean | string) => {
  // state.errors[errorName] = errorValue;
  (state.errors as any)[errorName] = errorValue;
};

export const formatDate = (date: string) => {
  return dayjs(date, "DD/MM/YY").format("MMMM YYYY");
};

export const getRange = function (value: number, min: number, max: number) {
  let range = (value - min) / (max - min);
  if (!isFinite(range)) {
    range = value;
  }
  return range;
};

export const orderByPropName = <T extends {}>(list: T[], propName: keyof T) => {
  return list.sort((a, b) => (a[propName] > b[propName] ? 1 : -1));
};

//@ts-ignore
export const sortObject = (o) => {
  return (
    Object.keys(o)
      .sort()
      //@ts-ignore
      .reduce((r, k) => ((r[k] = o[k]), r), {})
  );
};

export const pluralize = function (
  str: string,
  object: {
    [key: string]: string | number;
  },
  suffix = "s"
) {
  //let formatted = this;
  //const entries = Object.entries(object);
  let formatted = str;
  const regex = /{([^:}]+)(?:(?::)([^}]+))?}/g;
  let match;

  while ((match = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width match
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    if (match[2] === undefined) {
      const regex = new RegExp("\\{" + match[1] + "\\}", "g");
      formatted = formatted.replace(regex, `${object[match[1]]}`);
    }
    if (match[2] !== undefined) {
      const wordToPluralize = match[1];
      const linkedVar = match[2];
      const value = object[linkedVar];

      const regex = new RegExp(
        "\\{" + wordToPluralize + ":" + linkedVar + "\\}",
        "g"
      );
      if (Number(value) > 1 && object.plural) {
        formatted = formatted.replace(regex, `${object.plural}`);
      } else {
        formatted = formatted.replace(
          regex,
          `${wordToPluralize}${Number(value) > 1 ? suffix : ""}`
        );
      }
    }
  }

  // entries.forEach(([key, value]) => {
  //   entries.forEach(([countKey, countValue]) => {
  //     //const regexp = new RegExp("\\{" + key + ":" + countKey + "\\}", "gi");

  //     formatted = formatted.replace(
  //       regexp,
  //       `${countValue}${countValue !== 1 ? suffix : ""}`
  //     );
  //   });
  //   const regexp2 = new RegExp("\\{" + key + "\\}", "gi");
  //   formatted = formatted.replace(regexp2, value);
  // });

  return formatted;
};

export const setDocumentTitle = (title: string) => {
  document.title = title;
};

/* const pluralize = (count, noun, suffix = "s") =>
    `${count} ${noun}${count !== 1 ? suffix : ""}`;
  
  "The {0} is dead. Don't code {0}. Code {1} that is open source!".format(
    "ASP",
    "PHP"
  );
   */
