import fs from 'fs';

/**
 * Is the path a directory
 * @param path 
 * @returns boolean
 */
export const isDirectory = (path: string) => {
  try {
    return fs.lstatSync(path).isDirectory();
  } catch (error) {
    return false
    // throw new Error(`Path ${path} is not a directory`);
  }
};