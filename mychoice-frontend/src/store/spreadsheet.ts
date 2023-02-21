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
import { state } from "./state";
import {
  fetchSpreadsheetWorksheets,
  getRenamedSpreadsheetItems,
  getRenamedSpreadsheetProject,
} from "../data-spreadsheet";
import { Argument, Data, Project } from "@/@types";

export const setSpreadsheet = (id: string) => {};

export const getSpreadsheetData = async (id: string) => {
  try {
    const worksheets = await fetchSpreadsheetWorksheets(id);

    const renamedSpreadsheetItems = await getRenamedSpreadsheetItems(
      worksheets,
      id
    );

    const renamedProject = await getRenamedSpreadsheetProject(worksheets);

    return {
      items: renamedSpreadsheetItems,
      project: renamedProject,
    } as Data;
  } catch (e) {
    throw e;
  }
};

// export const exportToMultipleCSV = async (id: string) => {
//   const worksheets = await fetchSpreadsheetWorksheets(id);

//   const zip = new JSZip();

//   worksheets.forEach(worksheet => {
//     const data = worksheet.data;
//     const CSV = getCSVFromJSON(data);
//     const filename = worksheet.title + ".csv";
//     const blob = getAsCSVBlob(CSV);
//     zip.file(filename, blob);
//   });
//   zip.generateAsync({ type: "blob" }).then(function(content) {
//     // see FileSaver.js
//     saveAs(content, state.project.name + ".zip");
//   });
// };

export const getSpreadsheetIdFromUrl = (url: string) => {
  const matches = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(url);
  if (matches) {
    const spreadsheetId = matches![1];
    return spreadsheetId;
  } else {
    return url;
  }
};
