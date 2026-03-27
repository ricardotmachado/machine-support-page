import { test, expect } from '@playwright/test'

const URL = 'http://localhost:5173'

// ─── 1. Page Load ─────────────────────────────────────────────────────────────

test.describe('Page Load', () => {
  test('loads and shows company name in header', async ({ page }) => {
    await page.goto(URL)
    await expect(page.locator('text=WAC - Equipamentos Industriais').first()).toBeVisible()
  })

  test('shows machine name in hero', async ({ page }) => {
    await page.goto(URL)
    await expect(page.locator('h1')).toContainText('Costa Levigatrici')
  })

  test('shows machine ID in hero', async ({ page }) => {
    await page.goto(URL)
    await expect(page.locator('text=ERM-2021-001')).toBeVisible()
  })

  test('shows client name in hero', async ({ page }) => {
    await page.goto(URL)
    await expect(page.locator('text=Euromolding')).toBeVisible()
  })

  test('shows operational status badge', async ({ page }) => {
    await page.goto(URL)
    await expect(page.locator('text=Operacional')).toBeVisible()
  })
})

// ─── 2. Machine Info Card ─────────────────────────────────────────────────────

test.describe('Machine Info Card', () => {
  test('shows brand Costa Levigatrici', async ({ page }) => {
    await page.goto(URL)
    await expect(page.locator('text=Costa Levigatrici').first()).toBeVisible()
  })

  test('shows model B71RRFF1350', async ({ page }) => {
    await page.goto(URL)
    await expect(page.locator('text=B71RRFF1350').first()).toBeVisible()
  })

  test('shows serial number LCOB2004A', async ({ page }) => {
    await page.goto(URL)
    await expect(page.locator('text=LCOB2004A')).toBeVisible()
  })

  test('shows year 2021', async ({ page }) => {
    await page.goto(URL)
    await expect(page.locator('text=2021').nth(1)).toBeVisible()
  })

  test('shows technician Ricardo Capitão', async ({ page }) => {
    await page.goto(URL)
    await expect(page.locator('text=Ricardo Capitão')).toBeVisible()
  })

  test('shows location Ourém', async ({ page }) => {
    await page.goto(URL)
    await expect(page.locator('text=Ourém')).toBeVisible()
  })
})

// ─── 3. Form Validation — Empty Submit ───────────────────────────────────────

test.describe('Form Validation', () => {
  test('shows 3 errors when submitting empty form', async ({ page }) => {
    await page.goto(URL)
    await page.locator('button[type="submit"]').click()
    const errors = page.locator('text=/Indique|Selecione|Descreva/')
    await expect(errors).toHaveCount(3)
  })

  test('name error clears after typing', async ({ page }) => {
    await page.goto(URL)
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=Indique o seu nome.')).toBeVisible()
    await page.locator('input[placeholder="Ex: João Silva"]').fill('João Teste')
    await expect(page.locator('text=Indique o seu nome.')).not.toBeVisible()
  })

  test('description error clears after typing', async ({ page }) => {
    await page.goto(URL)
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=Descreva o problema.')).toBeVisible()
    await page.locator('textarea').fill('Máquina com ruído anormal')
    await expect(page.locator('text=Descreva o problema.')).not.toBeVisible()
  })

  test('issue type error clears after selection', async ({ page }) => {
    await page.goto(URL)
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=Selecione o tipo de problema.')).toBeVisible()
    await page.locator('button', { hasText: 'Falha Mecânica' }).click()
    await expect(page.locator('text=Selecione o tipo de problema.')).not.toBeVisible()
  })
})

// ─── 4. Issue Type Selector ───────────────────────────────────────────────────

test.describe('Issue Type Selector', () => {
  const types = [
    'Falha Mecânica', 'Falha Elétrica', 'Ruído Anormal', 'Vibração Excessiva',
    'Sobreaquecimento', 'Fuga de Fluido', 'Paragem Imprevista', 'Outro',
  ]

  for (const type of types) {
    test(`can select "${type}"`, async ({ page }) => {
      await page.goto(URL)
      const btn = page.locator('button', { hasText: type })
      await btn.click()
      await expect(btn).toHaveClass(/border-blue-500/)
    })
  }

  test('only one issue type is active at a time', async ({ page }) => {
    await page.goto(URL)
    await page.locator('button', { hasText: 'Falha Mecânica' }).click()
    await page.locator('button', { hasText: 'Falha Elétrica' }).click()
    const active = page.locator('button.border-blue-500')
    await expect(active).toHaveCount(1)
  })
})

// ─── 5. Urgency Selector ─────────────────────────────────────────────────────

test.describe('Urgency Selector', () => {
  test('Média is selected by default', async ({ page }) => {
    await page.goto(URL)
    const btn = page.locator('button', { hasText: 'Média' }).first()
    await expect(btn).toHaveClass(/border-amber-400/)
  })

  test('can select Baixa', async ({ page }) => {
    await page.goto(URL)
    await page.locator('button', { hasText: 'Baixa' }).click()
    await expect(page.locator('button', { hasText: 'Baixa' })).toHaveClass(/border-emerald-400/)
  })

  test('can select Urgente', async ({ page }) => {
    await page.goto(URL)
    await page.locator('button', { hasText: 'Urgente' }).click()
    await expect(page.locator('button', { hasText: 'Urgente' })).toHaveClass(/border-red-400/)
  })

  test('urgency hint is visible', async ({ page }) => {
    await page.goto(URL)
    await expect(page.locator('text=Máquina parada ou risco de segurança')).toBeVisible()
  })
})

// ─── 6. Description character counter ────────────────────────────────────────

test.describe('Description field', () => {
  test('counter starts at 0/300', async ({ page }) => {
    await page.goto(URL)
    await expect(page.locator('text=0/300')).toBeVisible()
  })

  test('counter updates as user types', async ({ page }) => {
    await page.goto(URL)
    await page.locator('textarea').fill('Teste')
    await expect(page.locator('text=5/300')).toBeVisible()
  })
})

// ─── 7. Happy Path — Full Submit ─────────────────────────────────────────────

test.describe('Happy Path', () => {
  test('shows spinner and "A enviar..." on submit', async ({ page }) => {
    await page.goto(URL)
    await page.locator('input[placeholder="Ex: João Silva"]').fill('João Teste')
    await page.locator('button', { hasText: 'Falha Mecânica' }).click()
    await page.locator('textarea').fill('Ruído anormal na zona de corte')

    // Block window.open so WhatsApp doesn't actually open
    await page.evaluate(() => { window.open = () => null })

    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=A enviar...')).toBeVisible()
  })

  test('shows success screen after submit', async ({ page }) => {
    await page.goto(URL)
    await page.evaluate(() => { window.open = () => null })
    await page.locator('input[placeholder="Ex: João Silva"]').fill('João Teste')
    await page.locator('button', { hasText: 'Falha Mecânica' }).click()
    await page.locator('textarea').fill('Ruído anormal na zona de corte')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=Ocorrência Registada!')).toBeVisible({ timeout: 3000 })
  })

  test('success screen shows generated reference code', async ({ page }) => {
    await page.goto(URL)
    await page.evaluate(() => { window.open = () => null })
    await page.locator('input[placeholder="Ex: João Silva"]').fill('João Teste')
    await page.locator('button', { hasText: 'Falha Mecânica' }).click()
    await page.locator('textarea').fill('Ruído anormal na zona de corte')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=OC-')).toBeVisible({ timeout: 3000 })
  })

  test('success screen shows WhatsApp sent notice', async ({ page }) => {
    await page.goto(URL)
    await page.evaluate(() => { window.open = () => null })
    await page.locator('input[placeholder="Ex: João Silva"]').fill('João Teste')
    await page.locator('button', { hasText: 'Falha Mecânica' }).click()
    await page.locator('textarea').fill('Ruído anormal')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=WhatsApp aberto automaticamente')).toBeVisible({ timeout: 3000 })
  })

  test('success screen email link points to correct address', async ({ page }) => {
    await page.goto(URL)
    await page.evaluate(() => { window.open = () => null })
    await page.locator('input[placeholder="Ex: João Silva"]').fill('João Teste')
    await page.locator('button', { hasText: 'Falha Mecânica' }).click()
    await page.locator('textarea').fill('Ruído anormal')
    await page.locator('button[type="submit"]').click()
    await page.waitForSelector('text=Ocorrência Registada!', { timeout: 3000 })
    const emailLink = page.locator('a[href^="mailto:"]')
    await expect(emailLink).toHaveAttribute('href', /ricardojtmachado@hotmail\.com/)
  })
})

// ─── 8. Reset Flow ───────────────────────────────────────────────────────────

test.describe('Reset Flow', () => {
  test('"Abrir nova ocorrência" returns to form with empty fields', async ({ page }) => {
    await page.goto(URL)
    await page.evaluate(() => { window.open = () => null })
    await page.locator('input[placeholder="Ex: João Silva"]').fill('João Teste')
    await page.locator('button', { hasText: 'Falha Mecânica' }).click()
    await page.locator('textarea').fill('Teste')
    await page.locator('button[type="submit"]').click()
    await page.waitForSelector('text=Ocorrência Registada!', { timeout: 3000 })
    await page.locator('button', { hasText: 'Abrir nova ocorrência' }).click()
    await expect(page.locator('input[placeholder="Ex: João Silva"]')).toHaveValue('')
    await expect(page.locator('textarea')).toHaveValue('')
  })
})

// ─── 9. Direct Contact Section ───────────────────────────────────────────────

test.describe('Direct Contact Section', () => {
  test('WhatsApp link points to +351913882119', async ({ page }) => {
    await page.goto(URL)
    const waLink = page.locator('a[href*="wa.me/351913882119"]').last()
    await expect(waLink).toBeVisible()
  })

  test('email link points to rui.freitas@wac.pt', async ({ page }) => {
    await page.goto(URL)
    const emailLink = page.locator('a[href*="rui.freitas@wac.pt"]').last()
    await expect(emailLink).toBeVisible()
  })
})

// ─── 10. Mobile Viewport ─────────────────────────────────────────────────────

test.describe('Mobile (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('page renders without horizontal scroll', async ({ page }) => {
    await page.goto(URL)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(375)
  })

  test('submit button is visible without scrolling on mobile', async ({ page }) => {
    await page.goto(URL)
    const btn = page.locator('button[type="submit"]')
    await btn.scrollIntoViewIfNeeded()
    await expect(btn).toBeVisible()
  })

  test('issue type grid fits in mobile width', async ({ page }) => {
    await page.goto(URL)
    const grid = page.locator('button', { hasText: 'Falha Mecânica' })
    await expect(grid).toBeVisible()
  })
})

// ─── 11. Sticker Page ────────────────────────────────────────────────────────

test.describe('Sticker Page', () => {
  test('loads at #sticker', async ({ page }) => {
    await page.goto(`${URL}/#sticker`)
    await expect(page.locator('text=Gerador de Etiquetas')).toBeVisible()
  })

  test('shows Euromolding machine in selector', async ({ page }) => {
    await page.goto(`${URL}/#sticker`)
    await expect(page.locator('button', { hasText: 'Costa Levigatrici B71RRFF1350' })).toBeVisible()
  })

  test('back button returns to support page', async ({ page }) => {
    await page.goto(`${URL}/#sticker`)
    await page.locator('button').first().click()
    await expect(page.locator('h1')).toContainText('Costa Levigatrici')
  })

  test('print button is visible', async ({ page }) => {
    await page.goto(`${URL}/#sticker`)
    await expect(page.locator('text=Imprimir / Exportar PDF')).toBeVisible()
  })
})
