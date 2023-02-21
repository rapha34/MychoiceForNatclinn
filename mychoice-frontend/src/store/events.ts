import { setRecentProjectsState } from ".";

export const onAppInit = async () => {
  setRecentProjectsState();
};

export const onProjectLoad = () => {};
