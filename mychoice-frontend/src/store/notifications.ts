import { computed } from "@vue/composition-api";
import { uniqBy } from "lodash";
import { state } from "./state";

export const notifications = computed(() => {
  return uniqBy(state.notifications, "message");
});

export const getErrors = () => {
  const acc: string[] = [];
  Object.entries(state.errors).forEach(([key, value]) => {
    if (value !== false) {
      return acc.push(key);
    }
  });
  return acc;
};

export const getErrorMessage = (errorName: string) => {
  return state.errorMessages[errorName] || state.errors[errorName];
};

export const clearError = (errorName: string) => {
  state.errors[errorName] = false;
};
export const clearErrors = () => {
  Object.keys(state.errors).forEach((error) => {
    state.errors[error] = false;
  });
};
