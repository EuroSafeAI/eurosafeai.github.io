/**
 * Integration tests for /certificates/[slug] download pages.
 *
 * Prerequisites: the static export must exist in out/ before running.
 *   npm run test:e2e:full   # full pipeline: certs → build → test
 *   npm run test:e2e        # if out/ is already up-to-date
 */

import { test, expect } from '@playwright/test'
import { readdirSync, existsSync } from 'fs'
import { resolve } from 'path'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CERT_DIR = resolve(process.cwd(), 'public/certificates')

/** Slugs for which a PDF was generated on disk (available at build time). */
function generatedSlugs(): string[] {
  if (!existsSync(CERT_DIR)) return []
  return readdirSync(CERT_DIR)
    .filter((f) => f.endsWith('.pdf'))
    .map((f) => f.replace(/\.pdf$/, ''))
}

// Pick a slug we know will always be present when the full pipeline ran.
// Falls back to the first available slug so tests still work after data changes.
const ANCHOR_SLUG = generatedSlugs().includes('apertus-1')
  ? 'apertus-1'
  : generatedSlugs()[0] ?? 'apertus-1'

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe('Certificate slug pages', () => {
  // ── Single known-good slug ────────────────────────────────────────────────

  test.describe(`valid slug: ${ANCHOR_SLUG}`, () => {
    test('page returns HTTP 200', async ({ page }) => {
      const res = await page.goto(`/certificates/${ANCHOR_SLUG}`)
      expect(res?.status()).toBe(200)
    })

    test('displays the model name as a heading', async ({ page }) => {
      await page.goto(`/certificates/${ANCHOR_SLUG}`)
      // Next.js injects the model name into the <h1>
      const heading = page.getByRole('heading', { level: 1 })
      await expect(heading).toBeVisible()
      await expect(heading).not.toBeEmpty()
    })

    test('shows the "downloading…" status message', async ({ page }) => {
      await page.goto(`/certificates/${ANCHOR_SLUG}`)
      await expect(page.getByText(/downloading/i)).toBeVisible()
    })

    test('download button is visible and links to the correct PDF', async ({ page }) => {
      await page.goto(`/certificates/${ANCHOR_SLUG}`)
      const btn = page.getByRole('link', { name: /download certificate/i })
      await expect(btn).toBeVisible()
      await expect(btn).toHaveAttribute('href', `/certificates/${ANCHOR_SLUG}.pdf`)
      // The anchor must carry the download attribute so the browser saves the file
      await expect(btn).toHaveAttribute('download')
    })

    test('DownloadTrigger auto-fires a file download on page load', async ({ page }) => {
      // Set up the download listener BEFORE navigation so we don't miss the event
      const downloadPromise = page.waitForEvent('download', { timeout: 10_000 })
      await page.goto(`/certificates/${ANCHOR_SLUG}`)
      const download = await downloadPromise
      // Suggested filename should include the slug
      expect(download.suggestedFilename()).toContain(ANCHOR_SLUG)
    })

    test('"back to leaderboard" link navigates to /certificates', async ({ page }) => {
      await page.goto(`/certificates/${ANCHOR_SLUG}`)
      await page.getByRole('link', { name: /back to the leaderboard/i }).click()
      await expect(page).toHaveURL(/\/certificates\/?$/)
    })
  })

  // ── Invalid slug → 404 ────────────────────────────────────────────────────

  test.describe('invalid slug', () => {
    test('a non-existent slug does not show a download page', async ({ page }) => {
      await page.goto('/certificates/this-model-does-not-exist-xyz-999', {
        waitUntil: 'domcontentloaded',
      })
      // The download button must NOT be present — whether the server returns
      // 404 or a fallback page, the certificate UI must not be shown.
      await expect(
        page.getByRole('link', { name: /download certificate/i })
      ).not.toBeVisible()
    })

    test('a non-existent slug returns a 404 HTTP status', async ({ page }) => {
      const res = await page.goto('/certificates/this-model-does-not-exist-xyz-999')
      expect(res?.status()).toBe(404)
    })
  })

  // ── Parameterised: every generated certificate ────────────────────────────

  test.describe('all generated certificates', () => {
    const slugs = generatedSlugs()

    // Guard: skip the whole block if no PDFs have been generated yet
    if (slugs.length === 0) {
      test('skipped — no certificates found in public/certificates/', async () => {
        test.skip(true, 'Run `npm run certs` first to generate certificate PDFs')
      })
    }

    for (const slug of slugs) {
      test(`${slug}: page loads and download link is correct`, async ({ page }) => {
        const res = await page.goto(`/certificates/${slug}`)
        expect(res?.status()).toBe(200)

        const btn = page.getByRole('link', { name: /download certificate/i })
        await expect(btn).toBeVisible()
        await expect(btn).toHaveAttribute('href', `/certificates/${slug}.pdf`)
        await expect(btn).toHaveAttribute('download')
      })
    }
  })
})
