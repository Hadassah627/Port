import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';

const safeName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, '_');

export const uploadSingleFile = async (folder: string, file: File) => {
  const fileRef = ref(storage, `${folder}/${Date.now()}-${safeName(file.name)}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};

export const uploadManyFiles = async (folder: string, files: File[]) => {
  const urls = await Promise.all(files.map((file) => uploadSingleFile(folder, file)));
  return urls;
};

export const removeFileByUrl = async (url: string) => {
  await deleteObject(ref(storage, url));
};