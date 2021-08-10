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
import { findKey } from "lodash";
import {
  ServerProject,
  Project,
  ServerArguments,
  Argument,
  Data,
  ServerArgument
} from "./@types";
import { SpreadsheetArgument } from "./data-spreadsheet";

export const getRenamedProject = (
  sourceProject: ServerProject
): Data["project"] => {
  let item = sourceProject;
  const renamedItem: Omit<Project, "description" | "image"> = {
    stakeholders: item.nameStakeholder,
    name: item.nameProject,
    aims: item.aim,
    criterions: item.nameCriterion,
    alternatives: item.alternatives.map(alternative => {
      const renamedAlternative = {
        name: alternative.nameAlternative,
        image: alternative.imageAlternative,
        icon: alternative.iconAlternative
      };
      delete alternative.nameAlternative;
      return {
        ...alternative,
        ...renamedAlternative
      };
    }),
    sourceTypeEntities: item.typeSource,
    expertiseEntities: item.hasExpertise
  };
  delete item.typeSource;
  delete item.hasExpertise;
  delete item.nameStakeholder;
  delete item.aim;
  delete item.nameProject;
  delete item.nameCriterion;
  return {
    ...item,
    ...renamedItem
  };
};

export const getRenamedItems = (
  sourceArguments: ServerArguments
): Data["items"] => {
  return sourceArguments.map(item => {
    const renamedItem = {
      id: item.idArgument,
      stakeholder: item.nameStakeHolder,
      property: item.nameProperty,
      favorable: item.typeProCon,
      alternative: item.nameAlternative,
      criterion: item.nameCriterion,
      source: item.nameSource,
      sourceType: item.nameTypeSource
    };
    delete item.idArgument;
    delete item.nameStakeHolder;
    delete item.nameProperty;
    delete item.typeProCon;
    delete item.nameAlternative;
    delete item.nameCriterion;
    delete item.nameSource;
    delete item.nameTypeSource;

    // console.log(renamedItem, "renamedItem");
    return <Argument>{
      ...item,
      ...renamedItem
    };
  });
};

export interface CSVArgument {
  idArgument: number;
  assertion: string;
  explanation: string;
  date: string;
  "stakeholder.nameStakeholder": string;
  "property.nameProperty": string;
  "qualvalue.qualValue": string;
  typeProCon: string;
  "alternative.nameAlternative": string;
  "criterion.nameCriterion": string;
  "source.nameSource": string;
  "aim.description": string;
  "typesource.nameTypeSource": string;
  isProspective: string;
  infValue?: unknown;
  supValue?: unknown;
  unit?: unknown;
  hasCoverage?: unknown;
  confidenceLevel?: unknown;
  condition?: string;
}

export type EquivalentSources = "csv" | "server" | "spreadsheet";

export const getEquivalentTable = () => {
  const appArgument: Argument = null;
  const serverArgument: ServerArgument = null;
  const spreadsheetArgument: SpreadsheetArgument = null;

  const equivalentTable: {
    [K in keyof Argument]: {
      csv: keyof CSVArgument;
      server: keyof ServerArgument;
      spreadsheet: keyof SpreadsheetArgument;
    };
  } = {
    id: {
      csv: "idArgument",
      server: "idArgument",
      spreadsheet: "idArgument"
    },
    aim: {
      csv: "aim.description",
      server: "aim",
      spreadsheet: "aim"
    },
    alternative: {
      csv: "alternative.nameAlternative",
      server: "nameAlternative",
      spreadsheet: "nameAlternative"
    },
    assertion: {
      csv: "assertion",
      server: "assertion",
      spreadsheet: "assertion"
    },
    criterion: {
      csv: "criterion.nameCriterion",
      server: "nameCriterion",
      spreadsheet: "nameCriterion"
    },
    date: {
      csv: "date",
      server: "date",
      spreadsheet: "date"
    },
    explanation: {
      csv: "explanation",
      server: "explanation",
      spreadsheet: "explanation"
    },
    favorable: {
      csv: "typeProCon",
      server: "typeProCon",
      spreadsheet: "typeProCon"
    },
    isProspective: {
      csv: "isProspective",
      server: "isProspective",
      spreadsheet: "isProspective"
    },
    property: {
      csv: "property.nameProperty",
      server: "nameProperty",
      spreadsheet: "nameProperty"
    },
    source: {
      csv: "source.nameSource",
      server: "nameSource",
      spreadsheet: "nameSource"
    },
    sourceType: {
      csv: "typesource.nameTypeSource",
      server: "nameTypeSource",
      spreadsheet: "nameTypeSource"
    },
    stakeholder: {
      csv: "stakeholder.nameStakeholder",
      server: "nameStakeHolder",
      spreadsheet: "nameStakeHolder"
    },
    value: {
      csv: "qualvalue.qualValue",
      server: "value",
      spreadsheet: "value"
    },
    condition: {
      csv: "condition",
      server: "condition",
      spreadsheet: "condition"
    }
  };

  return equivalentTable;
};

export const getEquivalentAppPropFromSource = (
  source: EquivalentSources,
  property: keyof CSVArgument | keyof ServerArgument | keyof SpreadsheetArgument
) => {
  return findKey(getEquivalentTable(), function(k) {
    return k[source] === property;
  }) as keyof Argument;
};

export const getEquivalentSourcePropFromApp = (
  source: EquivalentSources,
  property: keyof Argument
) => {
  const equivalent =
    getEquivalentTable()[property] && getEquivalentTable()[property][source];
  return equivalent ? equivalent : null;
};

export const getRenamedItemPropFromTo = (
  from: EquivalentSources,
  to: EquivalentSources,
  property: keyof CSVArgument | keyof ServerArgument | keyof SpreadsheetArgument
) => {
  const appProperty = getEquivalentAppPropFromSource(from, property);
  const toProperty = getEquivalentSourcePropFromApp(to, appProperty);

  return toProperty ? toProperty : null;
};

export const getRenamedItemsFromSpreadsheetToCSV = (
  spreadsheetItems: SpreadsheetArgument[]
): CSVArgument[] => {
  return spreadsheetItems.map(item => {
    const renamedItem = {};
    Object.entries(item).forEach(([k, v]) => {
      //@ts-ignore
      const renamedProp = getRenamedItemPropFromTo("spreadsheet", "csv", k);
      if (renamedProp) {
        //@ts-ignore
        renamedItem[renamedProp] = v;
      }
    });
    return renamedItem as CSVArgument;
  });
};
