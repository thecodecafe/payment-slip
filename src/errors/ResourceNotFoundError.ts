export class ResourceNotFoundError extends Error {
  constructor(message?: string){
    super(message || "The resource is either doesn't exist or has been moved to a new location.")
  }
}
