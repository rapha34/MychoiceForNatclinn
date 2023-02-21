import { getCSVFromJSON } from "@/data-csv";
import { getRenamedItemsFromSpreadsheetToCSV } from "@/data-renamed";
import {
  fetchSpreadsheetWorksheets,
  SpreadsheetArgument,
  SpreadsheetWorksheet,
} from "@/data-spreadsheet";
import router from "@/router";
import {
  getNextcloudDownloadUrlFromId,
  getNextcloudFileFromUrl,
  getProjectTypeFromRoute,
  getRouteTypeValue,
  getXlsxWorksheets,
  state,
} from "@/store";
import { saveAs } from "file-saver";
import { Route } from "vue-router";
import { ProjectGroupNames } from "./cache";

export const isExportableToCSV = () => {
  const type = getProjectTypeFromRoute(router.currentRoute);
  if (
    type === ProjectGroupNames.GOOGLE_SPREADSHEET ||
    type === ProjectGroupNames.XLSX ||
    type === ProjectGroupNames.NEXTCLOUD
  ) {
    return true;
  } else {
    return false;
  }
};

export const exportToCSV = async (route: Route) => {
  const id = getRouteTypeValue(route);
  if (getProjectTypeFromRoute(route) === ProjectGroupNames.GOOGLE_SPREADSHEET) {
    const worksheets = await fetchSpreadsheetWorksheets(id);
    await exportWorksheetsToCSV(worksheets);
  }
  if (getProjectTypeFromRoute(route) === ProjectGroupNames.NEXTCLOUD) {
    const url = getNextcloudDownloadUrlFromId(id);
    const file = await getNextcloudFileFromUrl(url);
    const worksheets = await getXlsxWorksheets(file);
    await exportWorksheetsToCSV(worksheets);
  }
  if (getProjectTypeFromRoute(route) === ProjectGroupNames.XLSX) {
    const file = state.dropFileInputRef.value.files[0];
    const worksheets = await getXlsxWorksheets(file);
    await exportWorksheetsToCSV(worksheets);
  }
};

export const exportWorksheetsToCSV = async (
  worksheets: SpreadsheetWorksheet[]
) => {
  // const argument = worksheets[0].data;

  // const argumentWorksheet = worksheets.find(
  //   worksheet => worksheet.title === "argument"
  // ).data;
  // const projectWorksheet = worksheets.find(
  //   worksheet => worksheet.title === "project"
  // ).data;
  // console.log(projectWorksheet, "works");

  //@ts-ignore
  // const projectCSV = getCSVFromJSON(projectWorksheet);
  //@ts-ignore
  // const argumentCSV = getCSVFromJSON(argumentWorksheet);
  // saveAsCSVFile(projectCSV, "project.csv");
  // saveAsCSVFile(argumentCSV, "argument.csv");
  const headersLengths: number[] = [];
  const multiCSV: { [key: string]: string } = {};

  const headerOrder = [
    "project",
    "alternative",
    "typesource",
    "argument",
    "hasexpertise",
  ];

  worksheets.forEach((worksheet) => {
    let data = worksheet.data;
    const firstItem = data[0];
    if (worksheet.title === "parameters" || !firstItem) {
      return;
    }

    const headerLength = Object.keys(firstItem).length - 1;
    headersLengths.push(headerLength);

    if (worksheet.title === "argument") {
      data = getRenamedItemsFromSpreadsheetToCSV(data as SpreadsheetArgument[]);
    }

    const CSV = getCSVFromJSON(data);
    multiCSV[worksheet.title] = CSV;
    // const filename = worksheet.title + ".csv";
    //
  });
  const maxHeaderLength = Math.max(...headersLengths);
  const lineSeparator = ";".repeat(maxHeaderLength);

  const sortedMultiCSV = Object.entries(multiCSV)
    .sort(function ([a], [b]) {
      return headerOrder.indexOf(a) - headerOrder.indexOf(b);
    })
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

  const mergedCSV = Object.entries(sortedMultiCSV)
    .map(([key, value]) => {
      return `"${key}"${lineSeparator}\n${value}\n${lineSeparator}`;
    })
    .join("\n");
  // console.log(mergedCSV, "MERGE");
  const blob = getAsCSVBlob(mergedCSV);
  saveAs(blob, state.project.name + ".csv");
  //@ts-ignore
  // const argumentCSV = exportJSONToCSV(argumentWorksheet);
};
export const getAsFile = (data: any, filename: string) => {
  const blob = getAsCSVBlob(data);
  const file = new File([blob], filename);
  return file;
};
export const getAsCSVBlob = (data: any) => {
  return new Blob([data], { type: "text/csv;charset=utf-8;" });
};
