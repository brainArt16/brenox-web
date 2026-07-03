export class EngineApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message)
    this.name = "EngineApiError"
  }
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof EngineApiError) return error.message
  if (error instanceof Error) return error.message
  return fallback
}
