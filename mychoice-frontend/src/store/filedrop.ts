import router from "@/router";
import { openXlsxFromFile, state, dropFileInputRef } from "@/store";
import { computed } from "vue";
import { loadAll } from "./fetch";

export const handleLoadFile = () => {
  dropFileInputRef.value?.click();
};

export const preventDefaults = (e: any) => {
  e.preventDefault();
  e.stopPropagation();
};

export const onFileDragEnter = (e: { target: HTMLElement }) => {
  preventDefaults(e);
  highlightDrop(e);
};
export const onFileDragLeave = (e: { target: HTMLElement }) => {
  preventDefaults(e);
  unhighlightDrop(e);
};
export const onFileDragOver = (e: { target: HTMLElement }) => {
  preventDefaults(e);
  highlightDrop(e);
};
export const onFileDrop = (e: {
  target: HTMLElement;
  dataTransfer: DataTransfer;
}) => {
  preventDefaults(e);
  unhighlightDrop(e);
  const files = e.dataTransfer.files;
  dropFileInputRef.value!.files = files;
  onFileChange();
};
export const onFileChange = async () => {
  const file = dropFileInputRef.value?.files?.[0];
  const route = router.resolve(`/project?xlsx=${file.name}`);
  await loadAll(route);
  router.push(route);
};
export const getDropFileInputRef = computed(() => dropFileInputRef.value);

export const getInputFile = computed(
  () => dropFileInputRef.value?.files?.[0]
);

export const isXlsxType = (type: string) =>
  type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const highlightDrop = (e: any) => {
  e.currentTarget.classList.add("fileDropHighlight");
  if (!isXlsxType(e.dataTransfer.items[0].type)) {
    e.currentTarget.classList.add("fileDropHighlight--invalid");
  }
};
export const unhighlightDrop = (e: any) => {
  e.currentTarget.classList.remove(
    "fileDropHighlight",
    "fileDropHighlight--invalid"
  );
};

export const initDropArea = (e: any) => {
  const dropArea = document.querySelector("body");
  //@ts-ignore
  dropArea.addEventListener("dragenter", onFileDragEnter, false);
  //@ts-ignore
  dropArea.addEventListener("dragleave", onFileDragLeave, false);
  //@ts-ignore
  dropArea.addEventListener("dragover", onFileDragOver, false);
  //@ts-ignore
  dropArea.addEventListener("drop", onFileDrop, false);
};
