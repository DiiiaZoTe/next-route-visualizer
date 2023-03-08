/**
 * Helper function to get the colors for the nodes
 * @param type 
 * @returns 
 */
export const getNodeColorsByType = (type: string) => {
  switch (type) {
    case 'Route':
      //tailwind violet-100 and violet-500
      return { color: '#ede9fe', borderColor: '#8b5cf6' };
    case 'Group':
      //tailwind rose-100 and rose-500
      return { color: '#fce7f3', borderColor: '#ec4899' };
    case 'Segment':
      //tailwind green-100 and green-500
      return { color: '#ecfdf5', borderColor: '#059669' };
    case 'Root':
      //tailwind blue-100 and blue-500
      return { color: '#dbedff', borderColor: '#2563eb' };
    case 'Colocating':
      //tailwind orange-100 and orange-500
      return { color: '#ffedd5', borderColor: '#f97316' };
    default:
      // like Route
      return { color: '#ede9fe', borderColor: '#8b5cf6' };
  }
};