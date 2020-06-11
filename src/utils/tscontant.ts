export interface Setting {
  data: any[];
  total: number;
  current: number;
  pageSize: number;
  columns: any;
  loading: boolean;
  selectedRowKeys: any;
  onSizeChange: (pageSize: number) => void;
  showNext: boolean;
  onChange: (pageNum: number, pageSize: number) => void;
  rowKey: string;
  rowSelection: any;
  importMenu?: any;
  hasImport?: boolean;
  hideSelect?: boolean;
  defaultCurrent?: number;
  formatOperation?: Function;
}
