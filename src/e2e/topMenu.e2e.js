const BASE_URL = `http://localhost:${process.env.PORT || 8000}`;

describe('Homepage', () => {
  it('topmenu should have footer', async () => {
    const params = '/form/basic-form?navTheme=light&layout=topmenu';
    // eslint-disable-next-line no-undef
    await page.goto(`${BASE_URL}${params}`);
    // eslint-disable-next-line no-undef
    await page.waitForSelector('footer', {
      timeout: 2000,
    });
    const haveFooter = await page.evaluate(
      () => document.getElementsByTagName('footer').length > 0
    );
    expect(haveFooter).toBeTruthy();
  });
});
