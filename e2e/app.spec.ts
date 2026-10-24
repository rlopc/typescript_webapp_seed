import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// The e2e suite runs against the production build without a backend: the API
// is stubbed at the network layer, so only the frontend is under test.
test.beforeEach(async ({ page }) => {
  await page.route('**/api/health', (route) =>
    route.fulfill({ json: { status: 'ok' } }),
  );
});

test('navigates from the home page to the API status page', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'TypeScript web app seed',
  );

  await page.getByRole('link', { name: 'API status' }).click();

  await expect(page).toHaveURL('/status');
  await expect(page.getByRole('status')).toHaveText('API status: ok');
});

test('serves client-side routes on a direct visit', async ({ page }) => {
  await page.goto('/status');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'API status',
  );
});

test('shows the not-found page for an unknown path', async ({ page }) => {
  await page.goto('/does-not-exist');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Page not found',
  );
});

for (const path of ['/', '/status']) {
  test(`has no detectable accessibility violations on ${path}`, async ({
    page,
  }) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });
}
