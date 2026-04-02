const { app } = require('@azure/functions')
const { getClient } = require('../lib/supabase')

// GET /api/machines — list all
app.http('listMachines', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'machines',
  handler: async (request, context) => {
    if (!isAdmin(request)) return forbidden()

    const supabase = getClient()
    const { data, error } = await supabase
      .from('machines')
      .select('*, sticker_assignments(sticker_code)')
      .order('created_at', { ascending: false })

    if (error) return { status: 500, jsonBody: { error: error.message } }
    return { status: 200, jsonBody: data }
  },
})

// POST /api/machines — create
app.http('createMachine', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'machines/create',
  handler: async (request, context) => {
    if (!isAdmin(request)) return forbidden()

    const body = await request.json()
    const supabase = getClient()

    const { data, error } = await supabase
      .from('machines')
      .insert([sanitize(body)])
      .select()
      .single()

    if (error) return { status: 500, jsonBody: { error: error.message } }
    return { status: 201, jsonBody: data }
  },
})

// PUT /api/machines/update/:id — update
app.http('updateMachine', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'machines/update/{id}',
  handler: async (request, context) => {
    if (!isAdmin(request)) return forbidden()

    const body = await request.json()
    const supabase = getClient()

    const { data, error } = await supabase
      .from('machines')
      .update(sanitize(body))
      .eq('id', request.params.id)
      .select()
      .single()

    if (error) return { status: 500, jsonBody: { error: error.message } }
    return { status: 200, jsonBody: data }
  },
})

// DELETE /api/machines/delete/:id — delete machine
app.http('deleteMachine', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'machines/delete/{id}',
  handler: async (request, context) => {
    if (!isAdmin(request)) return forbidden()

    const supabase = getClient()
    const { error } = await supabase
      .from('machines')
      .delete()
      .eq('id', request.params.id)

    if (error) return { status: 500, jsonBody: { error: error.message } }
    return { status: 200, jsonBody: { ok: true } }
  },
})

// POST /api/stickers/assign — assign sticker code to machine
app.http('assignSticker', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'stickers/assign',
  handler: async (request, context) => {
    if (!isAdmin(request)) return forbidden()

    const { sticker_code, machine_id, assigned_by } = await request.json()
    if (!sticker_code || !machine_id) {
      return { status: 400, jsonBody: { error: 'sticker_code and machine_id are required' } }
    }

    const supabase = getClient()
    const { data, error } = await supabase
      .from('sticker_assignments')
      .upsert({ sticker_code, machine_id, assigned_by, assigned_at: new Date().toISOString() })
      .select()
      .single()

    if (error) return { status: 500, jsonBody: { error: error.message } }
    return { status: 200, jsonBody: data }
  },
})

// ── Helpers ──────────────────────────────────────────────────────────────────

function isAdmin(request) {
  const token = request.headers.get('x-admin-token')
  return token === process.env.ADMIN_TOKEN
}

function forbidden() {
  return { status: 401, jsonBody: { error: 'Unauthorized' } }
}

function sanitize(body) {
  const allowed = ['name', 'brand', 'model', 'serial', 'year', 'client', 'location', 'technician', 'status', 'install_date', 'notes']
  return Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)))
}
