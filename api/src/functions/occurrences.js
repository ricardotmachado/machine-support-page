const { app } = require('@azure/functions')
const { getClient } = require('../lib/supabase')

// GET /api/occurrences — list all with machine name
app.http('listOccurrences', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'occurrences',
  handler: async (request, context) => {
    if (!isAdmin(request)) return forbidden()

    const supabase = getClient()
    const { data, error } = await supabase
      .from('occurrences')
      .select('*, machines(name, brand, model)')
      .order('created_at', { ascending: false })

    if (error) return { status: 500, jsonBody: { error: error.message } }
    return { status: 200, jsonBody: data }
  },
})

// PATCH /api/occurrences/status/:id — update status + notes
app.http('updateOccurrenceStatus', {
  methods: ['PATCH'],
  authLevel: 'anonymous',
  route: 'occurrences/status/{id}',
  handler: async (request, context) => {
    if (!isAdmin(request)) return forbidden()

    const { status, notes } = await request.json()
    const supabase = getClient()

    const { data, error } = await supabase
      .from('occurrences')
      .update({ status, notes })
      .eq('id', request.params.id)
      .select()
      .single()

    if (error) return { status: 500, jsonBody: { error: error.message } }
    return { status: 200, jsonBody: data }
  },
})

// DELETE /api/occurrences/:id — delete occurrence
app.http('deleteOccurrence', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'occurrences/{id}',
  handler: async (request, context) => {
    if (!isAdmin(request)) return forbidden()

    const supabase = getClient()
    const { error } = await supabase
      .from('occurrences')
      .delete()
      .eq('id', request.params.id)

    if (error) return { status: 500, jsonBody: { error: error.message } }
    return { status: 200, jsonBody: { ok: true } }
  },
})

function isAdmin(request) {
  return request.headers.get('x-admin-token') === process.env.ADMIN_TOKEN
}
function forbidden() {
  return { status: 401, jsonBody: { error: 'Unauthorized' } }
}
