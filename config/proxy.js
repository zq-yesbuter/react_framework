const api = process.env.API || '';

const { proxyUrl = '', proxyPort = '', proxyPath = '', pathRewrite = {} } = {
  MOCK: {
    proxyUrl: 'yapi.cbpmgt.com',
    proxyPort: '80',
    proxyPath: '/mock/276',
    pathRewrite: {
      '/api': '/',
    },
  },
  DEV: {
    proxyUrl: 'jddai.jd.com',
    proxyPort: '8088',
    proxyPath: '',
    Host: 'jddai.jd.com',
    domain: 'jddai.jd.com',
    domainPort: '8088',
  },
}[api];

const proxy = {
  '/sse': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/offer': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/tenant': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/messages': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/interview': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/resume': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/data': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/authenticate': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/ivr': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/batch': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/common': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/first_entry': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/second_entry': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/interview_research': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/image': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/config': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/operator': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/scene': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/organizations': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/organization': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/operators': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
  '/rpt': {
    target: `http://${proxyUrl}:${proxyPort}${proxyPath}`,
    changeOrigin: true,
    pathRewrite,
  },
};

module.exports = proxy;
