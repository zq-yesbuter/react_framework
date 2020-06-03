// 格式化分页

export default function formatPagingRequest(formatRequest, formatResponse) {
  if (typeof formatRequest !== 'function') {
    formatRequest = ({ limit, page, ...props }) => {
      return {
        ...props,
        start: page ? (page - 1) * limit : 0,
        length: limit * 1 || 20,
      };
    };
  }
  if (typeof formatResponse !== 'function') {
    formatResponse = ({ data, total, curPage, pageSize, totalPage }) => {
      return {
        list: data || [],
        total: total * 1,
        limit: pageSize * 1 || 20,
        page: curPage,
        totalPage,
      };
    };
  }
  return function*(call, fetch, params) {
    return formatResponse(yield call(fetch, formatRequest(params)));
  };
}
