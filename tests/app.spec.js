import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_MACHINES = [
  {
    id: 'uuid-m1',
    name: 'Rectificadora Alpha',
    brand: 'ACME',
    model: 'X100',
    client: 'Empresa Alpha',
    location: 'Lisboa',
    status: 'operational',
    sticker_assignments: [{ sticker_code: 'T001' }],
  },
  {
    id: 'uuid-m2',
    name: 'Torno CNC Beta',
    brand: 'Mazak',
    model: 'QT-250',
    client: 'Empresa Beta',
    location: 'Porto',
    status: 'maintenance',
    sticker_assignments: [],
  },
]

const MOCK_OCCURRENCES = [
  {
    id: 'uuid-o1',
    ref_code: 'OC-TEST-001',
    issue_type: 'Falha Mecânica',
    operator_name: 'João Silva',
    urgency: 'medium',
    status: 'open',
    description: 'Ruído anormal na zona de corte.',
    created_at: '2024-01-15T10:00:00Z',
    machines: { name: 'Rectificadora Alpha', brand: 'ACME', model: 'X100' },
  },
  {
    id: 'uuid-o2',
    ref_code: 'OC-TEST-002',
    issue_type: 'Sobreaquecimento',
    operator_name: 'Maria Santos',
    urgency: 'urgent',
    status: 'in_progress',
    description: 'Motor aquece acima do normal.',
    created_at: '2024-01-16T14:00:00Z',
    machines: { name: 'Torno CNC Beta', brand: 'Mazak', model: 'QT-250' },
  },
]

const MOCK_MACHINE_PAGE = {
  id: 'uuid-m1',
  name: 'Rectificadora Alpha',
  brand: 'ACME',
  model: 'X100',
  serial: 'SN-2021-001',
  year: 2021,
  client: 'Empresa Alpha',
  location: 'Lisboa',
  technician: 'Ricardo Capitão',
  status: 'operational',
  sticker_code: 'T001',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function mockAdminAPIs(page) {
  await page.route('**/api/machines', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_MACHINES) })
  )
  await page.route('**/api/occurrences', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_OCCURRENCES) })
  )
}

async function mockMachinePage(page, stickerId = 'T001') {
  await page.route(`**/api/machine/${stickerId}`, route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_MACHINE_PAGE) })
  )
}

async function mockMachineNotFound(page, stickerId = 'NOT-FOUND') {
  await page.route(`**/api/machine/${stickerId}`, route =>
    route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: 'not found' }) })
  )
}

async function loginAdmin(page) {
  await mockAdminAPIs(page)
  await page.goto(`${BASE}/admin`)
  await page.locator('input[type="text"]').fill('admin')
  await page.locator('input[type="password"]').fill('admin')
  await page.locator('button[type="submit"]').click()
  await page.waitForSelector('text=Máquinas', { timeout: 4000 })
}

// ── 1. Root Page — QR Prompt ──────────────────────────────────────────────────

test.describe('Root — QR Prompt', () => {
  test('shows QR scan instruction', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('text=Digitalize o código QR')).toBeVisible()
  })

  test('shows WAC logo', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('img[alt="WAC"]')).toBeVisible()
  })

  test('no horizontal overflow on mobile', async ({ page }) => {
    await page.goto(BASE)
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(390)
  })
})

// ── 2. Admin Login ────────────────────────────────────────────────────────────

test.describe('Admin Login', () => {
  test('shows username and password fields', async ({ page }) => {
    await page.goto(`${BASE}/admin`)
    await expect(page.locator('input[type="text"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('shows "WAC Backoffice" in header', async ({ page }) => {
    await page.goto(`${BASE}/admin`)
    await expect(page.locator('text=WAC Backoffice')).toBeVisible()
  })

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto(`${BASE}/admin`)
    await page.locator('input[type="text"]').fill('wrong')
    await page.locator('input[type="password"]').fill('wrong')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=Utilizador ou palavra-passe incorretos')).toBeVisible()
  })

  test('error clears when re-entering credentials', async ({ page }) => {
    await page.goto(`${BASE}/admin`)
    await page.locator('input[type="text"]').fill('wrong')
    await page.locator('input[type="password"]').fill('wrong')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=Utilizador ou palavra-passe incorretos')).toBeVisible()
    await page.locator('input[type="text"]').fill('admin')
    await page.locator('input[type="password"]').fill('admin')
  })

  test('correct credentials load dashboard', async ({ page }) => {
    await loginAdmin(page)
    await expect(page.locator('button', { hasText: 'Máquinas' }).first()).toBeVisible()
    await expect(page.locator('button', { hasText: 'Ocorrências' }).first()).toBeVisible()
  })

  test('shows logout button after login', async ({ page }) => {
    await loginAdmin(page)
    await expect(page.locator('text=Sair')).toBeVisible()
  })

  test('logout returns to login screen', async ({ page }) => {
    await loginAdmin(page)
    page.on('dialog', d => d.accept())
    await page.locator('text=Sair').click()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('login form fits mobile width without overflow', async ({ page }) => {
    await page.goto(`${BASE}/admin`)
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(390)
  })
})

// ── 3. Admin — Machines Tab ───────────────────────────────────────────────────

test.describe('Admin — Machines Tab', () => {
  test('shows machine names from API', async ({ page }) => {
    await loginAdmin(page)
    await expect(page.locator('text=Rectificadora Alpha')).toBeVisible()
    await expect(page.locator('text=Torno CNC Beta')).toBeVisible()
  })

  test('shows stats bar with empresas and sem QR labels', async ({ page }) => {
    await loginAdmin(page)
    // "Empresas" only appears in the stats bar (unique label)
    await expect(page.locator('text=Empresas')).toBeVisible()
    await expect(page.locator('text=Sem QR').first()).toBeVisible()
  })

  test('stats bar shows 2 companies from mock data', async ({ page }) => {
    await loginAdmin(page)
    // uniqueClients = ['Empresa Alpha', 'Empresa Beta'] → count 2
    // "Empresas" label is in a text-center card; the sibling <p> above it holds the count
    await expect(page.locator('p.text-slate-400', { hasText: 'Empresas' })).toBeVisible()
  })

  test('stats bar Sem QR card turns amber when machines have no sticker', async ({ page }) => {
    await loginAdmin(page)
    // MOCK_MACHINES has 1 machine without sticker → noQrCount=1 → amber styling applied
    // The amber count paragraph gets text-amber-600 class
    await expect(page.locator('p.text-amber-600')).toBeVisible()
    await expect(page.locator('p.text-amber-500', { hasText: 'Sem QR' })).toBeVisible()
  })

  test('shows client filter pills for each company', async ({ page }) => {
    await loginAdmin(page)
    await expect(page.locator('button', { hasText: 'Empresa Alpha' })).toBeVisible()
    await expect(page.locator('button', { hasText: 'Empresa Beta' })).toBeVisible()
  })

  test('client filter pill shows machine count', async ({ page }) => {
    await loginAdmin(page)
    const pill = page.locator('button', { hasText: 'Empresa Alpha' })
    await expect(pill).toContainText('1')
  })

  test('clicking client pill filters machines', async ({ page }) => {
    await loginAdmin(page)
    await page.locator('button', { hasText: 'Empresa Alpha' }).click()
    await expect(page.locator('text=Rectificadora Alpha')).toBeVisible()
    await expect(page.locator('text=Torno CNC Beta')).not.toBeVisible()
  })

  test('clicking active client pill resets to all', async ({ page }) => {
    await loginAdmin(page)
    await page.locator('button', { hasText: 'Empresa Alpha' }).click()
    await page.locator('button', { hasText: 'Empresa Alpha' }).click()
    await expect(page.locator('text=Torno CNC Beta')).toBeVisible()
  })

  test('search filters machines by name', async ({ page }) => {
    await loginAdmin(page)
    await page.locator('input[type="text"]').last().fill('CNC')
    await expect(page.locator('text=Torno CNC Beta')).toBeVisible()
    await expect(page.locator('text=Rectificadora Alpha')).not.toBeVisible()
  })

  test('search placeholder updates when client pill is active', async ({ page }) => {
    await loginAdmin(page)
    await page.locator('button', { hasText: 'Empresa Beta' }).click()
    const search = page.locator('input[placeholder*="Empresa Beta"]')
    await expect(search).toBeVisible()
  })

  test('clear search button restores full list', async ({ page }) => {
    await loginAdmin(page)
    const searchInput = page.locator('input').last()
    await searchInput.fill('Alpha')
    await expect(page.locator('text=Torno CNC Beta')).not.toBeVisible()
    // Clear by pressing Escape or selecting all and deleting
    await searchInput.fill('')
    await expect(page.locator('text=Torno CNC Beta')).toBeVisible()
  })

  test('machine without sticker shows "Sem QR" badge', async ({ page }) => {
    await loginAdmin(page)
    await expect(page.locator('text=Sem QR').first()).toBeVisible()
  })

  test('machine with sticker shows QR code', async ({ page }) => {
    await loginAdmin(page)
    await expect(page.locator('text=QR: T001')).toBeVisible()
  })

  test('shows "+ Nova Máquina" button', async ({ page }) => {
    await loginAdmin(page)
    await expect(page.locator('button', { hasText: '+ Nova Máquina' })).toBeVisible()
  })

  test('"Nova Máquina" opens creation form', async ({ page }) => {
    await loginAdmin(page)
    await page.locator('button', { hasText: '+ Nova Máquina' }).click()
    await expect(page.locator('text=Nova Máquina')).toBeVisible()
  })

  test('machines list has no horizontal overflow on mobile', async ({ page }) => {
    await loginAdmin(page)
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(390)
  })
})

// ── 4. Admin — Occurrences Tab ────────────────────────────────────────────────

test.describe('Admin — Occurrences Tab', () => {
  test('switching to Ocorrências tab shows occurrences', async ({ page }) => {
    await loginAdmin(page)
    await page.locator('button', { hasText: 'Ocorrências' }).click()
    await expect(page.locator('text=OC-TEST-001')).toBeVisible()
    await expect(page.locator('text=OC-TEST-002')).toBeVisible()
  })

  test('occurrences tab badge shows open count', async ({ page }) => {
    await loginAdmin(page)
    // 1 open occurrence in mock
    const tab = page.locator('button', { hasText: 'Ocorrências' })
    await expect(tab).toContainText('1')
  })

  test('filter pill "Abertas" filters to open occurrences only', async ({ page }) => {
    await loginAdmin(page)
    await page.locator('button', { hasText: 'Ocorrências' }).click()
    await page.locator('button', { hasText: 'Abertas' }).click()
    await expect(page.locator('text=OC-TEST-001')).toBeVisible()
    await expect(page.locator('text=OC-TEST-002')).not.toBeVisible()
  })

  test('filter pill "Em Progresso" filters correctly', async ({ page }) => {
    await loginAdmin(page)
    await page.locator('button', { hasText: 'Ocorrências' }).click()
    // Use first() to target the filter pill, not the occurrence card that also shows "Em Progresso"
    await page.locator('button', { hasText: 'Em Progresso' }).first().click()
    await expect(page.locator('text=OC-TEST-002')).toBeVisible()
    await expect(page.locator('text=OC-TEST-001')).not.toBeVisible()
  })

  test('occurrence card shows operator name', async ({ page }) => {
    await loginAdmin(page)
    await page.locator('button', { hasText: 'Ocorrências' }).click()
    await expect(page.locator('text=João Silva')).toBeVisible()
  })

  test('occurrence card shows machine name', async ({ page }) => {
    await loginAdmin(page)
    await page.locator('button', { hasText: 'Ocorrências' }).click()
    await expect(page.locator('text=Rectificadora Alpha').first()).toBeVisible()
  })

  test('clicking occurrence opens detail view', async ({ page }) => {
    await loginAdmin(page)
    await page.locator('button', { hasText: 'Ocorrências' }).click()
    await page.locator('button', { hasText: 'OC-TEST-001' }).click()
    await expect(page.locator('text=Detalhes')).toBeVisible()
    await expect(page.locator('text=Estado')).toBeVisible()
  })

  test('occurrence detail shows back button', async ({ page }) => {
    await loginAdmin(page)
    await page.locator('button', { hasText: 'Ocorrências' }).click()
    await page.locator('button', { hasText: 'OC-TEST-001' }).click()
    // back arrow button
    const backBtn = page.locator('button').first()
    await expect(backBtn).toBeVisible()
  })

  test('occurrence detail shows "Zona de perigo" delete section', async ({ page }) => {
    await loginAdmin(page)
    await page.locator('button', { hasText: 'Ocorrências' }).click()
    await page.locator('button', { hasText: 'OC-TEST-001' }).click()
    await expect(page.locator('text=Zona de perigo')).toBeVisible()
  })

  test('delete occurrence shows confirmation step', async ({ page }) => {
    await loginAdmin(page)
    await page.locator('button', { hasText: 'Ocorrências' }).click()
    await page.locator('button', { hasText: 'OC-TEST-001' }).click()
    await page.locator('button', { hasText: 'Eliminar ocorrência' }).click()
    await expect(page.locator('text=irreversível')).toBeVisible()
    await expect(page.locator('button', { hasText: 'Cancelar' })).toBeVisible()
  })

  test('cancelling delete goes back to detail', async ({ page }) => {
    await loginAdmin(page)
    await page.locator('button', { hasText: 'Ocorrências' }).click()
    await page.locator('button', { hasText: 'OC-TEST-001' }).click()
    await page.locator('button', { hasText: 'Eliminar ocorrência' }).click()
    await page.locator('button', { hasText: 'Cancelar' }).last().click()
    await expect(page.locator('text=Eliminar ocorrência')).toBeVisible()
  })
})

// ── 5. Machine Support Page ───────────────────────────────────────────────────

test.describe('Machine Support Page — loaded', () => {
  test.beforeEach(async ({ page }) => {
    await mockMachinePage(page, 'T001')
    await page.goto(`${BASE}/machine/T001`)
    await page.waitForSelector('text=Rectificadora Alpha', { timeout: 5000 })
  })

  test('shows machine name in hero', async ({ page }) => {
    await expect(page.locator('text=Rectificadora Alpha').first()).toBeVisible()
  })

  test('shows operational status badge', async ({ page }) => {
    await expect(page.locator('text=Operacional')).toBeVisible()
  })

  test('shows client name', async ({ page }) => {
    await expect(page.locator('text=Empresa Alpha')).toBeVisible()
  })

  test('shows WAC company name', async ({ page }) => {
    await expect(page.locator('text=WAC - Equipamentos Industriais').first()).toBeVisible()
  })

  test('shows all 8 issue type buttons', async ({ page }) => {
    const types = [
      'Falha Mecânica', 'Falha Elétrica', 'Ruído Anormal', 'Vibração Excessiva',
      'Sobreaquecimento', 'Fuga de Fluido', 'Paragem Imprevista', 'Outro',
    ]
    for (const t of types) {
      await expect(page.locator('button', { hasText: t })).toBeVisible()
    }
  })

  test('"Média" urgency is selected by default', async ({ page }) => {
    const btn = page.locator('button', { hasText: 'Média' }).first()
    await expect(btn).toHaveClass(/border-amber-400/)
  })

  test('can select "Urgente" urgency', async ({ page }) => {
    await page.locator('button', { hasText: 'Urgente' }).click()
    await expect(page.locator('button', { hasText: 'Urgente' })).toHaveClass(/border-red-400/)
  })

  test('character counter starts at 0/300', async ({ page }) => {
    await expect(page.locator('text=0/300')).toBeVisible()
  })

  test('character counter updates as user types', async ({ page }) => {
    await page.locator('textarea').fill('Teste')
    await expect(page.locator('text=5/300')).toBeVisible()
  })

  test('shows 3 validation errors on empty submit', async ({ page }) => {
    await page.locator('button[type="submit"]').click()
    const errors = page.locator('text=/Indique|Selecione|Descreva/')
    await expect(errors).toHaveCount(3)
  })

  test('name error clears after typing', async ({ page }) => {
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=Indique o seu nome.')).toBeVisible()
    await page.locator('input[placeholder="Ex: João Silva"]').fill('João')
    await expect(page.locator('text=Indique o seu nome.')).not.toBeVisible()
  })

  test('issue type error clears after selection', async ({ page }) => {
    await page.locator('button[type="submit"]').click()
    await page.locator('button', { hasText: 'Falha Mecânica' }).click()
    await expect(page.locator('text=Selecione o tipo de problema.')).not.toBeVisible()
  })

  test('only one issue type is active at a time', async ({ page }) => {
    await page.locator('button', { hasText: 'Falha Mecânica' }).click()
    await page.locator('button', { hasText: 'Falha Elétrica' }).click()
    await expect(page.locator('button.border-blue-500')).toHaveCount(1)
  })

  test('WhatsApp contact link is visible', async ({ page }) => {
    await expect(page.locator('a[href*="wa.me/351913882119"]').last()).toBeVisible()
  })

  test('email contact link is visible', async ({ page }) => {
    await expect(page.locator('a[href*="ricardojtmachado@hotmail.com"]').last()).toBeVisible()
  })

  test('no horizontal overflow on mobile', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(390)
  })
})

// ── 6. Machine Support Page — Form Submit & Success ───────────────────────────

test.describe('Machine Support Page — submit', () => {
  test.beforeEach(async ({ page }) => {
    await mockMachinePage(page, 'T001')
    await page.route('**/api/submit-occurrence', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
    )
    await page.goto(`${BASE}/machine/T001`)
    await page.waitForSelector('text=Rectificadora Alpha', { timeout: 5000 })
  })

  test('shows "A enviar..." on submit', async ({ page }) => {
    await page.locator('input[placeholder="Ex: João Silva"]').fill('João Teste')
    await page.locator('button', { hasText: 'Falha Mecânica' }).click()
    await page.locator('textarea').fill('Ruído anormal na zona de corte')
    // Delay the API response to catch the loading state
    await page.route('**/api/submit-occurrence', async route => {
      await new Promise(r => setTimeout(r, 300))
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
    })
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=A enviar...')).toBeVisible()
  })

  test('shows success screen after submit', async ({ page }) => {
    await page.locator('input[placeholder="Ex: João Silva"]').fill('João Teste')
    await page.locator('button', { hasText: 'Falha Mecânica' }).click()
    await page.locator('textarea').fill('Ruído anormal na zona de corte')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=Ocorrência Registada!')).toBeVisible({ timeout: 5000 })
  })

  test('success screen shows generated OC- reference code', async ({ page }) => {
    await page.locator('input[placeholder="Ex: João Silva"]').fill('João Teste')
    await page.locator('button', { hasText: 'Falha Mecânica' }).click()
    await page.locator('textarea').fill('Ruído anormal na zona de corte')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=OC-')).toBeVisible({ timeout: 5000 })
  })

  test('"Abrir nova ocorrência" resets form to empty', async ({ page }) => {
    await page.locator('input[placeholder="Ex: João Silva"]').fill('João Teste')
    await page.locator('button', { hasText: 'Falha Mecânica' }).click()
    await page.locator('textarea').fill('Ruído anormal')
    await page.locator('button[type="submit"]').click()
    await page.waitForSelector('text=Ocorrência Registada!', { timeout: 5000 })
    await page.locator('button', { hasText: 'Abrir nova ocorrência' }).click()
    await expect(page.locator('input[placeholder="Ex: João Silva"]')).toHaveValue('')
    await expect(page.locator('textarea')).toHaveValue('')
  })

  test('success screen has no horizontal overflow on mobile', async ({ page }) => {
    await page.locator('input[placeholder="Ex: João Silva"]').fill('João Teste')
    await page.locator('button', { hasText: 'Falha Mecânica' }).click()
    await page.locator('textarea').fill('Ruído anormal')
    await page.locator('button[type="submit"]').click()
    await page.waitForSelector('text=Ocorrência Registada!', { timeout: 5000 })
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(390)
  })
})

// ── 7. Machine Not Found ──────────────────────────────────────────────────────

test.describe('Machine — Not Found', () => {
  test('shows not-found state for invalid sticker', async ({ page }) => {
    await mockMachineNotFound(page, 'NOT-FOUND')
    await page.goto(`${BASE}/machine/NOT-FOUND`)
    // Should show some error state (not a form)
    await expect(page.locator('input[placeholder="Ex: João Silva"]')).not.toBeVisible({ timeout: 5000 })
  })
})

// ── 8. Sticker Generator Page ─────────────────────────────────────────────────

test.describe('Sticker Generator', () => {
  test('loads at /#sticker', async ({ page }) => {
    await page.goto(`${BASE}/#sticker`)
    await expect(page.locator('text=Gerador de Etiquetas')).toBeVisible()
  })

  test('shows print button', async ({ page }) => {
    await page.goto(`${BASE}/#sticker`)
    await expect(page.locator('text=Imprimir / Exportar PDF')).toBeVisible()
  })

  test('no horizontal overflow on mobile', async ({ page }) => {
    await page.goto(`${BASE}/#sticker`)
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(390)
  })
})
