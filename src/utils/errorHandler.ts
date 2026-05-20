/**
 * Extrae y limpia los mensajes de error provenientes del backend.
 * @param err Objeto de error capturado en el catch.
 * @param defaultMessage Mensaje a mostrar si el backend no envía detalles.
 * @returns String con el mensaje de error limpio.
 */
export const extractErrorMessage = (err: any, defaultMessage: string): string => {
  const backendMessage = err.response?.data?.message;
  
  if (backendMessage) {
    return backendMessage.includes(":") 
      ? backendMessage.split(":")[1].trim() 
      : backendMessage;
  }
  
  return defaultMessage;
};