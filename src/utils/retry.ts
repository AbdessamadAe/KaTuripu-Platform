export async function withRetry<T>(
    fn: () => Promise<T>,
    retries = 1
  ): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      if (retries > 0 && error?.status === 401) {
        // Optional: add a delay here
        return await withRetry(fn, retries - 1);
      }
      throw error;
    }
  }
  