import { makeAutoObservable } from "mobx";

export default class FileStore {
  constructor() {
    this.files = [];
    makeAutoObservable(this);
  }

  setFiles(file) {
    this.files = file;
  }

  setOne(file) {
    this.files.push(file);
  }

  getFiles() {
    return this.files;
  }
}
