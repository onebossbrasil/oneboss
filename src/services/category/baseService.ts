
// Utility for consistent logging in category services
export const logServiceAction = (action: string, data?: any) => {
  const timestamp = new Date().toISOString().substring(11, 23);
  console.log(`[${timestamp}][CategoryService] ${action}`, data !== undefined ? data : '');
};
