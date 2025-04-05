export interface EmployeeBase {
  id: string;
  tel: string;
  username: string;
  password?: string;
  fullname: string;
  birthday: Date;
  email: string;
  created_at: Date;
}
