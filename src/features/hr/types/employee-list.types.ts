export type EmployeeListDepartment =
  | 'Engineering'
  | 'Sales'
  | 'Marketing'
  | 'HR'
  | 'Finance'
  | 'Operations'

export type EmployeeListStatus = 'Active' | 'On Leave' | 'Probation' | 'Resigned'

export type EmployeeListView = 'table' | 'grid'

export interface EmployeeListItem {
  id: string
  name: string
  email: string
  initials: string
  dept: EmployeeListDepartment
  position: string
  status: EmployeeListStatus
  joinDate: string
  attendance: number
}

export const EMPLOYEE_LIST_ITEMS: EmployeeListItem[] = [
  { id: 'EMP-0001', name: 'Nguyễn Thị Hoa', email: 'nthoa@digifnb.vn', initials: 'NTH', dept: 'Engineering', position: 'Frontend Engineer', status: 'Active', joinDate: '15 Jan 2023', attendance: 96 },
  { id: 'EMP-0042', name: 'Lê Văn An', email: 'lvan@digifnb.vn', initials: 'LVA', dept: 'Sales', position: 'Sales Executive', status: 'Active', joinDate: '03 Mar 2022', attendance: 88 },
  { id: 'EMP-0015', name: 'Phạm Thị Mai', email: 'ptmai@digifnb.vn', initials: 'PTM', dept: 'Marketing', position: 'Marketing Analyst', status: 'On Leave', joinDate: '22 Jun 2021', attendance: 72 },
  { id: 'EMP-0078', name: 'Trần Quốc Bảo', email: 'tqbao@digifnb.vn', initials: 'TQB', dept: 'Engineering', position: 'DevOps Engineer', status: 'Active', joinDate: '01 Sep 2020', attendance: 99 },
  { id: 'EMP-0033', name: 'Hoàng Ngọc Lan', email: 'hnlan@digifnb.vn', initials: 'HNL', dept: 'HR', position: 'HR Specialist', status: 'Active', joinDate: '10 May 2023', attendance: 93 },
  { id: 'EMP-0056', name: 'Võ Minh Khoa', email: 'vmkhoa@digifnb.vn', initials: 'VMK', dept: 'Finance', position: 'Financial Analyst', status: 'Probation', joinDate: '01 Feb 2025', attendance: 85 },
  { id: 'EMP-0091', name: 'Đặng Thị Thu', email: 'dtthu@digifnb.vn', initials: 'DTT', dept: 'Marketing', position: 'Content Manager', status: 'Active', joinDate: '18 Jul 2022', attendance: 91 },
  { id: 'EMP-0024', name: 'Bùi Thanh Tùng', email: 'bttung@digifnb.vn', initials: 'BTT', dept: 'Engineering', position: 'Backend Engineer', status: 'Active', joinDate: '05 Nov 2021', attendance: 97 },
  { id: 'EMP-0067', name: 'Nguyễn Văn Dũng', email: 'nvdung@digifnb.vn', initials: 'NVD', dept: 'Sales', position: 'Account Manager', status: 'On Leave', joinDate: '14 Apr 2020', attendance: 68 },
  { id: 'EMP-0103', name: 'Lý Thị Phương', email: 'ltphuong@digifnb.vn', initials: 'LTP', dept: 'Finance', position: 'Accountant', status: 'Active', joinDate: '20 Aug 2022', attendance: 90 },
  { id: 'EMP-0011', name: 'Trương Minh Hiếu', email: 'tmhieu@digifnb.vn', initials: 'TMH', dept: 'Engineering', position: 'QA Engineer', status: 'Active', joinDate: '09 Dec 2019', attendance: 94 },
  { id: 'EMP-0088', name: 'Phan Lan Thanh', email: 'plthanh@digifnb.vn', initials: 'PLT', dept: 'HR', position: 'Recruitment Lead', status: 'Active', joinDate: '25 Jan 2021', attendance: 87 },
  { id: 'EMP-0045', name: 'Cao Xuân Thắng', email: 'cxthang@digifnb.vn', initials: 'CXT', dept: 'Operations', position: 'Operations Manager', status: 'Active', joinDate: '11 Mar 2020', attendance: 95 },
  { id: 'EMP-0072', name: 'Đinh Thị Linh', email: 'dtlinh@digifnb.vn', initials: 'DTL', dept: 'Marketing', position: 'Digital Marketing', status: 'Probation', joinDate: '01 Mar 2025', attendance: 82 },
  { id: 'EMP-0039', name: 'Hồ Văn Sơn', email: 'hvson@digifnb.vn', initials: 'HVS', dept: 'Sales', position: 'Sales Manager', status: 'Active', joinDate: '07 Feb 2019', attendance: 89 },
  { id: 'EMP-0120', name: 'Vũ Thị Ngọc', email: 'vtngoc@digifnb.vn', initials: 'VTN', dept: 'Engineering', position: 'UI/UX Designer', status: 'Active', joinDate: '15 Oct 2022', attendance: 92 },
  { id: 'EMP-0059', name: 'Mai Đình Phúc', email: 'mdphuc@digifnb.vn', initials: 'MDP', dept: 'Finance', position: 'CFO Assistant', status: 'Active', joinDate: '03 Jun 2021', attendance: 98 },
  { id: 'EMP-0006', name: 'Tống Minh Long', email: 'tmlong@digifnb.vn', initials: 'TML', dept: 'Engineering', position: 'Tech Lead', status: 'Active', joinDate: '12 Jan 2018', attendance: 96 },
  { id: 'EMP-0134', name: 'Lê Ngọc Bích', email: 'lnbich@digifnb.vn', initials: 'LNB', dept: 'HR', position: 'HR Manager', status: 'Active', joinDate: '28 Apr 2020', attendance: 91 },
  { id: 'EMP-0099', name: 'Ngô Văn Khánh', email: 'nvkhanh@digifnb.vn', initials: 'NVK', dept: 'Operations', position: 'Logistics Coordinator', status: 'Resigned', joinDate: '02 Oct 2021', attendance: 45 },
]

export const EMPLOYEE_LIST_DEPARTMENTS: ReadonlyArray<'All' | EmployeeListDepartment> = [
  'All',
  'Engineering',
  'Sales',
  'Marketing',
  'HR',
  'Finance',
  'Operations',
]

export const EMPLOYEE_LIST_PAGE_SIZE = 10
export const EMPLOYEE_LIST_TOTAL = 134
