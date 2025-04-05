export class Failure {
  success: boolean;
  message: string;
  timestamp: string;

  constructor(message: string) {
    this.success = false;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}
