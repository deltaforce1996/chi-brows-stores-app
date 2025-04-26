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

interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface EmployeeSearchResponse {
  items: EmployeeBase[];
  pagination: Pagination;
}
