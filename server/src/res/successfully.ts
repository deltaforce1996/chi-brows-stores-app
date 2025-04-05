export class Successfully<T> {
  success: boolean;
  message: string;
  data?: T;
  offsets?: number[];

  constructor(message: string, data?: T, offsets?: number[]) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.offsets = offsets;
  }
}
