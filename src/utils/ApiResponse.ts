export class ApiResponse {
  status: number;
  data: any;
  message: string;
  success: boolean;

  constructor(data: any, status = 201, message = "Data found successfully") {
    this.status = status;
    this.data = data;
    this.message = message;
    this.success = status < 400;
  }
}

export class ApiError extends Error {
  status: number;
  success: boolean;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.success = false;
    this.message = message;
  }
}
