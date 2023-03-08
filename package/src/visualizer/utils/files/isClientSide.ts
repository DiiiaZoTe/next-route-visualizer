import fs from 'fs';
import { ALLOWED_EXTENSIONS } from "../../constants";

/**
 * Check if the file is client side using the use client statement
 * @param filePath 
 * @returns 
 */
export const isClientSide = (filePath: string) => {
  // check if file has a valid extension
  const filePathSplit = filePath?.split('.');
  const fileExtension = filePathSplit?.pop();
  if (!ALLOWED_EXTENSIONS.includes(`.${fileExtension}`)) return true;

  try {
    // read the first 15 lines of the file
    const content = fs.readFileSync(filePath, { encoding: 'utf8' });
    const lines = content.split(/\r?\n/).slice(0, 15);

    // check if the file has a use client statement
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("'use client'") || line.startsWith('"use client"')) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log(error)
    return false;
  }
}