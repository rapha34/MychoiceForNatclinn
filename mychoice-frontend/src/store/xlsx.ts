//@ts-ignore
import { Data } from "@/@types/data-renamed";
import {
  getRenamedSpreadsheetItems,
  getRenamedSpreadsheetProject,
  SpreadsheetWorksheet,
} from "@/data-spreadsheet";
import router from "@/router";
//@ts-ignore
import xlsxParser from "xlsx-parse-json";
import { loadAll } from "./fetch";
import { setData } from "./project";
import { computed } from "@vue/composition-api";
import { nextcloudIdRouteQuery, state } from ".";
import { Route } from "vue-router";

export const isValidNextcloudUrl = computed(() => {
  return state.fields.nextcloudUrl;

  // state.fields.nextcloudUrl.startsWith(
  //   process.env.VUE_APP_NEXTCLOUD_URL
  // );
});

export const getNextcloudDownloadUrlFromId = (nextcloudId: string) => {
  return `${process.env.VUE_APP_NEXTCLOUD_URL}${nextcloudId}/download`;
};

export const getNextcloudFileFromUrl = async (url: string) => {
  const downloadUrl = url;

  const response = await fetch(downloadUrl);
  const blob = await response.blob();

  const nextcloudId = getNextcloudIdFromUrl(url);
  const file = new File([blob], nextcloudId);
  return file;
};

export const getNextcloudDataFromUrl = async (url: string) => {
  try {
    const file = await getNextcloudFileFromUrl(url);

    const data = await geXlsxData(file);
    return data;
  } catch (e) {
    throw e;
  }
};

export const getNextcloudIdFromUrl = (url: string) => {
  const matches = new RegExp(
    `${process.env.VUE_APP_NEXTCLOUD_URL}([a-zA-Z0-9-_]+)`
  ).exec(url);
  if (matches) {
    const nextcloudId = matches![1];
    return nextcloudId;
  } else {
    return url;
  }
};

export const setDataFromXlsxFile = async (file: File, clear?: boolean) => {
  try {
    const data = await geXlsxData(file);
    setData(data.items, data.project, clear);
  } catch (e) {
    throw e;
  }
};

export const openXlsxFromFile = async (file: File, clear?: boolean) => {
  await setDataFromXlsxFile(file, clear);
};

export const getJsonFromXlsx = async (file: File) => {
  const JSON = await xlsxParser.onFileSelection(file);
  return JSON;
};

export const getXlsxWorksheets = async (file: File) => {
  const json = await getJsonFromXlsx(file);
  const worksheets = Object.entries(json).map(([key, value], index) => {
    return { title: key, data: value, index } as SpreadsheetWorksheet;
  });

  return worksheets;
};

export const geXlsxData = async (file: File) => {
  try {
    const worksheets = await getXlsxWorksheets(file);
    const renamedSpreadsheetItems = await getRenamedSpreadsheetItems(
      worksheets
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
