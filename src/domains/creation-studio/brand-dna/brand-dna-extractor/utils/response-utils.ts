/**
 * Verifica si la respuesta de la API es exitosa (status 200)
 */
export const isSuccessfulResponse = (response: { status: number }): boolean => {
  return response.status === 200;
};
