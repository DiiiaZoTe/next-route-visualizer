import fs from 'fs';
import { ALLOWED_EXTENSIONS, NEXT_FILES } from "../../constants";
import { getFileNameExtension } from "./getFileNameExtension";

/**
 * Is the path an allowed file
 * @param path 
 * @returns boolean
 */
export const isNextFile = (path: string) => {
  try {
    // Check if file
    if (!fs.lstatSync(path).isFile()) return false;

    // File name processing
    // split path by / and get last element
    const fileName = path.split('/').pop() ?? 'file-name-error';
    // extract file name and extension
    const { name: fileNameWithoutExtension, extension: fileExtension } = getFileNameExtension(fileName);

    // Check if file name is allowed
    if (!NEXT_FILES.includes(`${fileNameWithoutExtension}.`)) return false;
    // Check if file extension is allowed
    if (!ALLOWED_EXTENSIONS.includes(`.${fileExtension}`)) return false;
    return true;
  } catch (error) {
    return false;
    // throw new Error(`Path ${path} is not a next file or does not exist`);
  }
};