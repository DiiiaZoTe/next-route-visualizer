/**
 * get the file name and extension from a file name
 * @param fileName 
 * @returns -> { name: string, extension: string}
 */
export const getFileNameExtension = (fileName: string) => {
  const fileNameSplit = fileName?.split('.');
  const fileNameWithoutExtension = fileNameSplit?.slice(0, -1).join('.');
  const fileExtension = fileNameSplit?.pop();
  return { name: fileNameWithoutExtension, extension: fileExtension }
}