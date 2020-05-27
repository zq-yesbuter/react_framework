export interface Setting {
  current: number | string;
  columns: any;
  pageSize: number;
  loading: boolean;
  selectedRowKeys: any;
  showNext: boolean;
  data: any;
  total: number | string;
  onChange: (pageNum: number, pageSize: number) => void;
  prev: () => void;
  next: () => void;
  onSizeChange: (pageSize: number) => void;
  rowKey: string;
  rowSelection: any;
  importMenu: any;
  hasImport: boolean;
  hideSelect: boolean;
  defaultCurrent?: number | string;
  formatOperation?: Function | undefined;
}
