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
