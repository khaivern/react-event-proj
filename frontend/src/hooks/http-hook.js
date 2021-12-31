import { useState } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();

  const sendRequest = async (
    url,
    method = 'POST',
    body = null,
    headers = {}
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to send request');
      }
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      throw error;
    }
  };

  const resetError = () => {
    setError();
  };

  return { isLoading, error, sendRequest, resetError };
};
