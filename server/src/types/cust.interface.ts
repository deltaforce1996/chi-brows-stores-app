import { UserStatus } from 'src/utils/user-status.enum';

export interface CustBase {
  id: string;
  tel: string | null;
  line: string | null;
  facebook: string | null;
  fullname: string | null;
  nickname: string | null;
  address: string | null;
  birthday: Date | null;
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
