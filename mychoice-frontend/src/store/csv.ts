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
  dropFileInputRef
} from "@/store";
import { saveAs } from "file-saver";
import type { RouteLocationNormalized } from "vue-router";
import { ProjectGroupNames } from "./cache";

export const isExportableToCSV = () => {
  const type = getProjectTypeFromRoute(router.currentRoute.value);
  return (
    type === ProjectGroupNames.GOOGLE_SPREADSHEET ||
    type === ProjectGroupNames.XLSX ||
    type === ProjectGroupNames.NEXTCLOUD
  );
};

export const exportToCSV = async (route: RouteLocationNormalized) => {
  const id = getRouteTypeValue(route);
  if (!id) return;
  
  const projectType = getProjectTypeFromRoute(route);

  if (projectType === ProjectGroupNames.GOOGLE_SPREADSHEET) {
    const worksheets = await fetchSpreadsheetWorksheets(id);
    await exportWorksheetsToCSV(worksheets);
  }

  if (projectType === ProjectGroupNames.NEXTCLOUD) {
    const url = getNextcloudDownloadUrlFromId(id);
    const file = await getNextcloudFileFromUrl(url);
    const worksheets = await getXlsxWorksheets(file);
    await exportWorksheetsToCSV(worksheets);
  }

  if (projectType === ProjectGroupNames.XLSX) {
    const inputElement = dropFileInputRef.value;

    if (inputElement?.files?.length) {
      const file = inputElement.files[0];
      const worksheets = await getXlsxWorksheets(file);
      await exportWorksheetsToCSV(worksheets);
    }
    else {
      console.error("Aucun fichier XLSX sélectionné.");
    }
  }
  
};

export const exportWorksheetsToCSV = async (
  worksheets: SpreadsheetWorksheet[]
) => {
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
  });

  const maxHeaderLength = Math.max(...headersLengths);
  const lineSeparator = ";".repeat(maxHeaderLength);

  const sortedMultiCSV = Object.entries(multiCSV)
    .sort(([a], [b]) => headerOrder.indexOf(a) - headerOrder.indexOf(b))
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

  const mergedCSV = Object.entries(sortedMultiCSV)
    .map(([key, value]) => `"${key}"${lineSeparator}\n${value}\n${lineSeparator}`)
    .join("\n");

  const blob = getAsCSVBlob(mergedCSV);
  const projectName = state.project?.name || 'project';
  saveAs(blob, projectName + ".csv");
};

export const getAsFile = (data: any, filename: string) => {
  const blob = getAsCSVBlob(data);
  return new File([blob], filename);
};

export const getAsCSVBlob = (data: any) => {
  return new Blob([data], { type: "text/csv;charset=utf-8;" });
};
