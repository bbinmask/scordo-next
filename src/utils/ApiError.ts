export class ApiError extends Error {
  status: number;

  constructor(status = 500, message = "Something went wrong") {
    super(message);
    this.message = message;
    this.name = "ApiError";
    this.status = status;
  }
}
