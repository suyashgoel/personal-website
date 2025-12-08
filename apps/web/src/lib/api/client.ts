import { envClient } from '@/lib/config/env.client';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const isFormData = options?.body instanceof FormData;

    const response = await fetch(
      `${envClient.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        ...options,
        credentials: 'include',
        headers: {
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
          ...options?.headers,
        },
      }
    );

    if (!response.ok) {
      let errorMessage = response.statusText || 'Request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {}
      throw new ApiError(errorMessage, response.status);
    }

    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Request failed',
      0
    );
  }
}
