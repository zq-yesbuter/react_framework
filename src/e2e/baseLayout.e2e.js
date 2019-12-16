const { uniq } = require('lodash');
const RouterConfig = require('../../config/config').default.routes;

const BASE_URL = `http://localhost:${process.env.PORT || 8000}`;

function formatter(routes, parentPath = '') {
  const fixedParentPath = parentPath.replace(/\/{1,}/g, '/');
  let result = [];
  routes.forEach(item => {
    if (item.path) {
      result.push(`${fixedParentPath}/${item.path}`.replace(/\/{1,}/g, '/'));
    }
    if (item.routes) {
      result = result.concat(
        formatter(item.routes, item.path ? `${fixedParentPath}/${item.path}` : parentPath)
      );
    }
  });
  return uniq(result.filter(item => !!item));
}

describe('Ant Design Pro E2E test', () => {
  const testPage = path => async () => {
    // eslint-disable-next-line no-undef
    await page.goto(`${BASE_URL}${path}`);
    // eslint-disable-next-line no-undef
    await page.waitForSelector('footer', {
      timeout: 2000,
    });
    // eslint-disable-next-line no-undef
    const haveFooter = await page.evaluate(
      () => document.getElementsByTagName('footer').length > 0
    );
    expect(haveFooter).toBeTruthy();
  };

  const routers = formatter(RouterConfig);
  routers.forEach(route => {
    it(`test pages ${route}`, testPage(route));
  });
});
