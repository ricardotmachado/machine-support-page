const { app } = require('@azure/functions')
const { getClient } = require('../lib/supabase')

app.http('getMachine', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'machine/{stickerId}',
  handler: async (request, context) => {
    const stickerId = request.params.stickerId

    const supabase = getClient()
    const { data, error } = await supabase
      .from('sticker_assignments')
      .select('machine_id, machines(*)')
      .eq('sticker_code', stickerId)
      .single()

    if (error || !data) {
      return { status: 404, jsonBody: { error: 'Sticker not assigned' } }
    }

    return { status: 200, jsonBody: data.machines }
  },
})
