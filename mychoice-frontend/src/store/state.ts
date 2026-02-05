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
//import { data } from "../data";

import { computed, Ref, reactive, watch, ref } from "vue";
import { NormalizedData, Project } from "@/@types";
import { LocalStorageCache, LocalStorageCacheProjectItem } from ".";

export interface State {
  vm: any;  // Utiliser `any` ou `ComponentPublicInstance` pour Vue 3
  notifications: {
    type?: string;
    message: string;
  }[];
  readonly baseUrl: string;
  spreadsheet: string | null;
  data: NormalizedData | null;
  project: Project | null;
  searchInput: string;
  selectedSuperset: string;
  selectedSupersets: string[];
  selectedAims: number[];
  selectedCriterions: number[];
  selectedStakeholders: number[];
  mode:
    | "consensus"
    | "interplay"
    | "data-reliability"
    | "expertise"
    | "prospective"
    | "multi-stakeholder";
  readonly modes: {
    [key in State["mode"]]?: {
      name: string;
    };
  };
  globalCardType: "label" | "stakeholder";
  chartFilters?: {
    selectedAlternative: string;
    analysisPer: string;
    selectedCriterion: string;
  };
  dialog: boolean;
  compareDialog: boolean;
  openDialog: boolean;
  readonly icons: {
    [id: string]: any;
  };
  aboutDialog: boolean;
  creditsDialog: boolean;
  // dropFileInputRef: null | Ref<HTMLInputElement>;
  overlay: boolean;
  drawer: boolean;
  selectedView: string;
  errors: {
    [key: string]: boolean | string | null;
  };
  snackbar: boolean;
  readonly errorMessages: {
    [key: string]: string;
  };
  recentProjects: LocalStorageCacheProjectItem[];
  recentProjectNames: {
    [key: string]: {
      name: string;
      date: number;
    };
  };
  recentProjectSpreadsheets: {
    [key: string]: {
      name: string;
      id: string;
      date: number;
    };
  };
  fields: {
    projectName: string;
    spreadsheetUrl: string;
    nextcloudUrl: string;
  };
}

export const DEFAULTS: Pick<
  State,
  | "mode"
  | "searchInput"
  | "selectedSuperset"
  | "selectedSupersets"
  | "selectedAims"
  | "selectedCriterions"
  | "selectedStakeholders"
  | "compareDialog"
  | "dialog"
  | "openDialog"
  | "spreadsheet"
  | "selectedView"
  | "data"
  | "project"
  | "aboutDialog"
  | "creditsDialog"
  | "globalCardType"
  // | "dropFileInputRef"
> = {
  mode: "consensus",
  globalCardType: "label",
  searchInput: "",
  selectedSuperset: "",
  selectedSupersets: [],
  selectedAims: [],
  selectedCriterions: [],
  selectedStakeholders: [],
  compareDialog: false,
  dialog: false,
  openDialog: false,
  spreadsheet: null,
  selectedView: "table-view",
  data: null,
  project: null,
  aboutDialog: false,
  creditsDialog: false,
  // dropFileInputRef: null,
};

export const dropFileInputRef = ref<HTMLInputElement | null>(null);

export const state = reactive<State>({
  vm: null,
  notifications: [],
  baseUrl: process.env.BASE_URL,
  selectedView: DEFAULTS.selectedView,
  spreadsheet: DEFAULTS.spreadsheet,
  data: DEFAULTS.data,
  project: DEFAULTS.project,
  searchInput: DEFAULTS.searchInput,
  selectedSuperset: DEFAULTS.selectedSuperset,
  selectedSupersets: DEFAULTS.selectedSupersets,
  selectedAims: DEFAULTS.selectedAims,
  selectedCriterions: DEFAULTS.selectedCriterions,
  selectedStakeholders: DEFAULTS.selectedStakeholders,
  mode: DEFAULTS.mode,
  modes: {
    consensus: {
      name: "Consensus",
    },
    interplay: {
      name: "Interplay",
    },
    prospective: {
      name: "Prospective",
    },
    expertise: {
      name: "Expertise",
    },
    "data-reliability": {
      name: "Data reliability",
    },
    "multi-stakeholder": {
      name: "Multi Stakeholder",
    },
  },
  globalCardType: "label",
  chartFilters: {
    selectedAlternative: "all-merged",
    analysisPer: "criteria",
    selectedCriterion: "",
  },
  dialog: DEFAULTS.dialog,
  compareDialog: DEFAULTS.compareDialog,
  openDialog: DEFAULTS.openDialog,
  aboutDialog: DEFAULTS.aboutDialog,
  creditsDialog: DEFAULTS.creditsDialog,
  // dropFileInputRef: ref<HTMLInputElement | null>(null),
  icons: {
    subOption: {
      1: "mdi-emoticon-happy-outline",
      2: "mdi-emoticon-sad-outline",
    },
    compare: "mdi",
  },
  overlay: false,
  drawer: false,
  errors: {
    FAILED_TO_FETCH_SPREADSHEET: false,
    FAILED_TO_FETCH_ICO: false,
  },
  snackbar: false,
  fields: {
    projectName: "",
    spreadsheetUrl: "",
    nextcloudUrl: "",
  },
  errorMessages: {
    FAILED_TO_FETCH_SPREADSHEET:
      "The Spreadsheet isn't published or doesn't exist",
    FAILED_TO_FETCH_ICO:
      "This project name doesn't exist (note: name is case-sensitive)",
  },
  recentProjects: [],
  recentProjectNames:
    localStorage.recentProjectNames &&
    JSON.parse(localStorage.recentProjectNames) !== null
      ? JSON.parse(localStorage.recentProjectNames)
      : {},
  recentProjectSpreadsheets:
    localStorage.recentProjectSpreadsheets &&
    JSON.parse(localStorage.recentProjectSpreadsheets) !== null
      ? JSON.parse(localStorage.recentProjectSpreadsheets)
      : {},
});

export const clearAppDataAndProject = () => {
  state.data = DEFAULTS.data;
  state.project = DEFAULTS.project;
  state.spreadsheet = DEFAULTS.spreadsheet;
};

export const clearAppMode = () => {
  state.mode = DEFAULTS.mode;
};

export const clearAll = () => {
  clearAppDataAndProject();
  clearAppFilters();
  clearAppMode();
  clearAppDialogs();
};

export const clearAppDialogs = () => {
  state.selectedSuperset = DEFAULTS.selectedSuperset;
  state.selectedSupersets.splice(0); // Clear the array
  state.compareDialog = DEFAULTS.compareDialog;
  state.dialog = DEFAULTS.dialog;
  state.openDialog = DEFAULTS.openDialog;
};

export const clearAppFilters = () => {
  state.searchInput = DEFAULTS.searchInput;
  state.selectedAims = DEFAULTS.selectedAims;
  state.selectedCriterions = DEFAULTS.selectedCriterions;
  state.selectedStakeholders = DEFAULTS.selectedStakeholders;
};

export const getImagePath = (url: string) => {
  const regex = new RegExp("^(?:[a-z]+:)?//", "i");
  const isAbsoluteUrl = regex.test(url);
  return isAbsoluteUrl
    ? url
    : process.env.VUE_APP_ROOT_URL + "img/" + state.project!.name + "/" + url;
};

export const isSpreadsheet = computed(() =>
  state.vm &&
  state.vm.$route &&
  state.vm.$route.query &&
  state.vm.$route.query.spreadsheet
    ? true
    : false
);

export const getCurrentRoute = computed(() =>
  state.vm && state.vm.$route ? state.vm.$route : null
);

export const isLoading = computed(() => state.overlay);
export const isEmptyProject = computed(() => state.project === null);

export const getSpreadsheetLink = (spreadsheetId: string) =>
  `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

export const getProjectName = computed(() =>
  state.project && state.project.name ? state.project.name : null
);

export const is1stLevelStakeholdersMode = computed(() =>
  state.globalCardType === "stakeholder" ? true : false
);

export const selectedSupersets = computed(() => state.selectedSupersets);

export const showOverlay = () => {
  state.overlay = true;
};

export const hideOverlay = () => {
  state.overlay = false;
};

watch(
  () => state.globalCardType,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      clearAppDialogs();
    }
  }
);

export const recentSpreadsheetProjects = computed(() => {
  return Object.entries(state.recentProjects).filter(
    ([key, { type }]) => type === "googlespreadsheet"
  );
});

export const recentIcoProjects = computed(() => {
  return Object.entries(state.recentProjects).filter(
    ([key, { type }]) => type === "ico"
  );
});

export const recentNextcloudProjects = computed(() => {
  return Object.entries(state.recentProjects).filter(
    ([key, { type }]) => type === "nextcloud"
  );
});
