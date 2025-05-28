import { UserStatus } from 'src/utils/user-status.enum';

export interface CustBase {
  id: string;
  tel: string;
  line: string;
  facebook: string;
  fullname: string;
  nickname: string;
  address: string;
  birthday: Date;
  created_at: Date;
  status: UserStatus;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CustomerListResponse {
  items: CustBase[];
  pagination: Pagination;
}
