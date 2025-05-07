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
import { forEach, values } from "lodash";
import {
  Argument,
  Project,
  Alternative,
  expertiseEntity,
  SourceTypeEntity,
} from "./@types";
import { MyChoiceError, setError } from "./store/utils";

const gsheets = require("gsheets");

const KEY = "1R0UaXut1IWLe4KKk9M5Nu7NHmE7SzajBWT1povyhIUE";

// a: "/Show"
// aim: "Consuming a balanced diet"
// alternative: "Plant-based diet"
// assertion: "B12 deficiency in vegetal proteins"
// b: "/Hide"
// confidenceLevel: null
// cons: "/Show"
// criterion: "Nutrition and health"
// date: 43002
// explanation: "B12 deficiency in vegetal proteins"
// hasCoverage: 0.92
// idArgument: 1
// infValue: null
// isProspective: 0
// pro: "/Hide"
// proCon: "-"
// project.nameProject: "VITAMIN"
// propertyName: "Vitamin B12"
// propertyValue: "deficient"
// source: "Canard Enchainé - 144 - Juillet 2017"
// sourceType: "Newspaper"
// stakeholder: "Journalist"
// supValue: null
// unit: null

export type GSheetsData = {
  title: string;
  updated: string;
  worksheets: {
    [key: string]: unknown;
  }[];
};

export type SpreadsheetWorksheet = {
  data: {
    [key: string]: any;
  }[];
  title: string;
  updated?: string;
  index: number;
};

export const getSpreadsheet = async (spreadsheetId: string) => {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${process.env.VUE_APP_GSHEETS_API_KEY}`
  );
  const result = await response.json();

  return result as {
    sheets: {
      properties: {
        sheetId: number;
        title: string;
        index: number;
        sheetType: "GRID";
        gridProperties: {
          rowCount: number;
          columnCount: number;
          frozenRowCount: number;
        };
      };
    }[];
  };
};

export const fetchSpreadsheetWorksheets = async (
  id: string
): Promise<SpreadsheetWorksheet[]> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const json = await getSpreadsheet(id);
    const worksheets = json.sheets;

    const promises: Promise<SpreadsheetWorksheet>[] = [];

    const refs = {} as { [key: number]: string };

    worksheets.forEach((worksheet) => {
      refs[worksheet.properties.index] = worksheet.properties.title;
      promises.push(
        gsheets.getWorksheet(
          id,
          worksheet.properties.title,
          process.env.VUE_APP_GSHEETS_API_KEY
        )
      );
    });

    const response = await Promise.all(promises);
    // console.log(response, "RESPONSE");
    return response.map(({ data }, index) => ({
      data,
      title: refs[index],
      index,
    }));
  } catch (e) {
    throw e;
  }
};

// export interface SpreadsheetArgument {
//   idArgument: number;
//   assertion: string;
//   explanation: string;
//   date: string;
//   "stakeholder.nameStakeholder": string;
//   "property.nameProperty": string;
//   "qualvalue.qualValue": string;
//   typeProCon: string;
//   "alternative.nameAlternative": string;
//   "criterion.nameCriterion": string;
//   "source.nameSource": string;
//   "aim.description": string;
//   "typesource.nameTypeSource": string;
//   isProspective: string;
// }

export interface SpreadsheetArgument {
  idArgument: number;
  assertion: string;
  explanation: string;
  date: string;
  nameStakeHolder: string;
  nameProperty: string;
  value: string;
  typeProCon: string;
  nameAlternative: string;
  nameCriterion: string;
  nameSource: string;
  aim: string;
  nameTypeSource: string;
  isProspective: string;
  condition?: string;
}

export type SpreadsheetProject = {
  nameProject: string;
  description: string;
  image: string;
};
export type SpreadsheetAlternative = {
  nameAlternative: string;
  description: string;
  imageAlternative: string;
  iconAlternative: string;
};
export type SpreadsheetExpertise = {
  nameStakeHolder: string;
  nameCriterion: string;
};
export type SpreadsheetSourceType = {
  nameTypeSource: string;
  fiability: number;
};

export const hasExpectedProperties = <T>(obj: T, props: string[]) => {
  return new Promise((resolve, reject) => {
    let lastTestedProp = null;
    const hasAll = props.every((prop) => {
      lastTestedProp = prop;
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return true;
      } else {
        // console.log("reject");
        return false;
        // return false;
      }
    });
    if (hasAll) {
      resolve(true);
    } else {
      reject(lastTestedProp);
    }
  });
};

// export const isValidSpreadsheetArgumentItem = <T>(obj: T) => {
//   const props = [
//     "idArgument",
//     "assertion",
//     "explanation",
//     "date",
//     "nameStakeHolder",
//     "nameProperty",
//     "value",
//     "typeProCon",
//     "nameAlternative",
//     "nameCriterion",
//     "nameSource",
//     "aim",
//     "nameTypeSource",
//     "isProspective"
//   ];

//   return hasExpectedProperties(obj, props).then(
//     result => result,
//     prop => {
//       throw new MyChoiceError(
//         "SPREADSHEET_ERROR",
//         `This column name is missing or misspelled in "argument" worksheet: <b>${prop}</b>`
//       );
//     }
//   );
// };

// export const isValidProjectWorksheetItem = <T>(obj: T) => {
//   const props = ["nameProject"];

//   return hasExpectedProperties(obj, props).then(
//     result => result,
//     prop => {
//       throw new MyChoiceError(
//         "SPREADSHEET_ERROR",
//         `This column name is missing or misspelled in "project" worksheet: <b>${prop}</b>`
//       );
//     }
//   );
// };

export const isValidWorkSheet = async (worksheet: SpreadsheetWorksheet) => {
  const worksheetsExpectedProps = {
    argument: [
      "idArgument",
      "assertion",
      "explanation",
      "date",
      "nameStakeHolder",
      "nameProperty",
      "value",
      "typeProCon",
      "nameAlternative",
      "nameCriterion",
      "nameSource",
      "aim",
      "nameTypeSource",
      "isProspective",
    ],
    project: ["nameProject"],
    alternative: ["nameAlternative", "iconAlternative"],
  };

  //@ts-ignore
  const props = worksheetsExpectedProps[worksheet.title];
  const firstWorksheetItem = worksheet.data[0];

  if (firstWorksheetItem) {
    // console.log(firstWorksheetItem, "FIRST");
    return await hasExpectedProperties(firstWorksheetItem, props).then(
      (result) => result,
      (prop) => {
        throw new MyChoiceError(
          "SPREADSHEET_ERROR",
          `On <b>${worksheet.title}</b> sheet, the <b>${prop}</b> column is missing or misspelled`
        );
      }
    );
  } else {
    setError(
      "SPREADSHEET_ERROR",
      `No data found in the <b>${worksheet.title}</b> sheet`
    );
  }
};

export const checkEmptyArguments = <T extends SpreadsheetWorksheet["data"][0]>({
  spreadsheetId,
  item,
  worksheet,
  line,
  keys,
}: {
  spreadsheetId?: string;
  item: T;
  worksheet: SpreadsheetWorksheet;
  line: number;
  keys: (keyof T)[];
}) => {
  keys.forEach((key, index) => {
    if (item[key] === null) {
      // const alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
      // const letter = alphabet[index];

      // const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${gid}&range=${letter}${line}`;
      // const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

      throw new MyChoiceError(
        "SPREADSHEET_ERROR",
        // `On <b>${worksheet.title}</b> sheet, the <b>${key}</b> on <a href="${url}" target="_blank">line <b>${line}</b></a> is empty and must be filled`
        `On <b>${worksheet.title}</b> sheet, the <b>${String(key)}</b> on line <b>${line}</b> is empty and must be filled`
      );
    }
  });
};

export const checkUniqueAimsHasUniqueCriterions = (
  items: SpreadsheetArgument[]
) => {
  const aims: { [key: string]: string[] } = {};

  items.forEach((item) => {
    if (aims[item.aim]) {
      if (!aims[item.aim].includes(item.nameCriterion)) {
        aims[item.aim].push(item.nameCriterion);
      }
    } else {
      aims[item.aim] = [item.nameCriterion];
    }
  });

  Object.entries(aims).forEach(([key, value]) => {
    if (value.length > 1) {
      setError(
        "SPREADSHEET_ERROR_" + key,
        `The <b>${key}</b> aim should be associated with only one criterion, but has been found in ${
          value.length
        } criteria : <b>${value.join("</b>, <b>")}</b>`
      );
      // throw new MyChoiceError(
      //   "SPREADSHEET_ERROR",
      //   // `On <b>${worksheet.title}</b> sheet, the <b>${key}</b> on <a href="${url}" target="_blank">line <b>${line}</b></a> is empty and must be filled`
      //   `The <b>${key}</b> aim should be associated with only one criterion, but has been found in ${
      //     value.length
      //   } criteria : <b>${value.join("</b>, <b>")}</b>`
      // );
    }
  });
};

export const getRenamedSpreadsheetItems = async (
  worksheets: SpreadsheetWorksheet[],
  spreadsheetId?: string
) => {
  const argumentWorksheet = worksheets.find(
    (worksheet) => worksheet.title === "argument"
  );

  const rawSpreadsheetItems = worksheets[argumentWorksheet.index]!
    .data as SpreadsheetArgument[];
  const spreadsheetItems = rawSpreadsheetItems.map((item) => {
    return Object.keys(item).reduce(function (result, key) {
      try {
        //@ts-ignore
        result[key] = JSON.parse(item[key]);
      } catch (e) {
        //@ts-ignore
        result[key] = item[key];
      }
      return result;
    }, {} as SpreadsheetArgument);
  });

  try {
    // await isValidSpreadsheetArgumentItem(spreadsheetItems[0]);
    await isValidWorkSheet(argumentWorksheet);
    checkUniqueAimsHasUniqueCriterions(spreadsheetItems);
  } catch (e) {
    throw e;
  }

  return spreadsheetItems.map((item, index) => {
    // if (!isValidSpreadsheetArgumentItem(item)) {
    //   return;
    // }
    const line = index + 2; // start at 1 + header

    if (item.typeProCon !== "-" && item.typeProCon !== "+") {
      throw new MyChoiceError(
        "SPREADSHEET_ERROR",
        `On <b>${argumentWorksheet.title}</b> sheet, the <b>typeProCon</b> on line <b>${line}</b> is <b>${item.typeProCon}</b> and should be <b>-</b> or <b>+</b> `
      );
    }

    checkEmptyArguments({
      spreadsheetId,
      item,
      worksheet: argumentWorksheet,
      line,
      keys: [
        // "date",
        "nameSource",
        "idArgument",
        "nameProperty",
        "value",
        "nameStakeHolder",
        "nameAlternative",
        "nameCriterion",
        "aim",
        "nameTypeSource",
      ] as (keyof SpreadsheetArgument)[],
    });

    const renamedItem = {
      id: item.idArgument,
      stakeholder: item["nameStakeHolder"],
      property: item["nameProperty"],
      favorable: item.typeProCon === "+" ? true : false,
      alternative: item["nameAlternative"],
      criterion: item["nameCriterion"],
      source: item["nameSource"],
      sourceType: item["nameTypeSource"],
      value: item["value"],
      aim: item["aim"],
      date: item["date"] ? item["date"].toString() : null,
    };

    delete item.idArgument;
    delete item["nameStakeHolder"];
    delete item["nameProperty"];
    delete item.typeProCon;
    delete item["nameAlternative"];
    delete item["nameCriterion"];
    delete item["nameSource"];
    delete item["nameTypeSource"];
    delete item["value"];
    delete item["aim"];
    return <Argument>{
      ...item,
      ...renamedItem,
    };
  });
};

export const getRenamedSpreadsheetProject = async (
  worksheets: SpreadsheetWorksheet[]
) => {
  const projectWorksheet = worksheets.find(
    (worksheet) => worksheet.title === "project"
  );

  // const projectItems = projectWorksheet!.data;

  try {
    await isValidWorkSheet(projectWorksheet);
  } catch (e) {
    throw e;
  }

  const spreadsheetProject = projectWorksheet!.data[0] as SpreadsheetProject;

  const alternativeWorksheet = worksheets.find(
    (worksheet) => worksheet.title === "alternative"
  );

  try {
    await isValidWorkSheet(alternativeWorksheet);

    alternativeWorksheet.data.forEach((item, index) => {
      const line = index + 2;
      if (item.iconAlternative === null) {
        throw new MyChoiceError(
          "SPREADSHEET_ERROR",
          `On <b>${alternativeWorksheet.title}</b> sheet, the <b>iconAlternative</b> on line <b>${line}</b> is <b>empty</b> and should be a valid icon name`
        );
      }
    });
  } catch (e) {
    throw e;
  }

  const spreadsheetAlternatives = alternativeWorksheet!
    .data as SpreadsheetAlternative[];

  const renamedAlternatives: Alternative[] = spreadsheetAlternatives.map(
    (k) => ({
      name: k.nameAlternative,
      description: k.description,
      image: k.imageAlternative,
      icon: k.iconAlternative,
    })
  );

  const expertiseWorksheet = worksheets.find(
    (worksheet) => worksheet.title === "hasexpertise"
  );
  const spreadsheetExpertises = expertiseWorksheet!
    .data as SpreadsheetExpertise[];

  const renamedExpertiseEntities: expertiseEntity[] = spreadsheetExpertises.map(
    (k) => ({
      nameStakeHolder: k["nameStakeHolder"],
      nameCriterion: k["nameCriterion"],
    })
  );

  const sourceTypeWorksheet = worksheets.find(
    (worksheet) => worksheet.title === "typesource"
  );
  const spreadsheetSourceType = sourceTypeWorksheet!
    .data as SpreadsheetSourceType[];

  const renamedSourceTypeEntities: SourceTypeEntity[] =
    spreadsheetSourceType.map((k) => ({
      fiability: k.fiability.toString(),
      nameTypeSource: k.nameTypeSource,
    }));

  const renamedProject: Project = {
    name: spreadsheetProject.nameProject,
    image: spreadsheetProject.image,
    description: spreadsheetProject.description,
    alternatives: renamedAlternatives,
    expertiseEntities: renamedExpertiseEntities,
    sourceTypeEntities: renamedSourceTypeEntities,
  };

  return renamedProject;
};
