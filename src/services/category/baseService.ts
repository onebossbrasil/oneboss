
// Utility for consistent logging in category services
export const logServiceAction = (action: string, data?: any) => {
  console.log(`[CategoryService] ${action}`, data !== undefined ? data : '');
};
