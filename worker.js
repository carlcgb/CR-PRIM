/**
 * Cloudflare Worker pour l'API CRM Agences
 * Remplace le serveur Express pour fonctionner sur Cloudflare Workers
 */

export default {
  async fetch(request, env) {
    // Gestion CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Ajouter les headers CORS à toutes les réponses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
      // Routes API
      if (path === '/api/agencies' && request.method === 'GET') {
        return handleGetAgencies(env, corsHeaders);
      }

      if (path.startsWith('/api/agencies/') && request.method === 'GET') {
        const id = path.split('/')[3];
        return handleGetAgency(id, env, corsHeaders);
      }

      if (path === '/api/agencies' && request.method === 'POST') {
        const body = await request.json();
        return handleCreateAgency(body, env, corsHeaders);
      }

      if (path.startsWith('/api/agencies/') && request.method === 'PUT') {
        const id = path.split('/')[3];
        const body = await request.json();
        return handleUpdateAgency(id, body, env, corsHeaders);
      }

      if (path.startsWith('/api/agencies/') && request.method === 'DELETE') {
        const id = path.split('/')[3];
        return handleDeleteAgency(id, env, corsHeaders);
      }

      if (path.startsWith('/api/agencies/') && path.endsWith('/notes') && request.method === 'POST') {
        const id = path.split('/')[3];
        const body = await request.json();
        return handleAddNote(id, body, env, corsHeaders);
      }

      if (path.includes('/notes/') && request.method === 'DELETE') {
        const parts = path.split('/');
        const agencyId = parts[3];
        const noteId = parts[5];
        return handleDeleteNote(agencyId, noteId, env, corsHeaders);
      }

      if (path === '/api/stats' && request.method === 'GET') {
        return handleGetStats(env, corsHeaders);
      }

      return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders,
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};

// GET toutes les agences
async function handleGetAgencies(env, corsHeaders) {
  const result = await env.DB.prepare(
    'SELECT * FROM agencies ORDER BY updatedAt DESC'
  ).all();

  const agencies = result.results.map(agency => ({
    ...agency,
    notes_list: agency.notes_list ? JSON.parse(agency.notes_list) : [],
  }));

  return new Response(JSON.stringify(agencies), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// GET une agence par ID
async function handleGetAgency(id, env, corsHeaders) {
  const result = await env.DB.prepare(
    'SELECT * FROM agencies WHERE id = ?'
  ).bind(id).first();

  if (!result) {
    return new Response(JSON.stringify({ error: 'Agence non trouvée' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  result.notes_list = result.notes_list ? JSON.parse(result.notes_list) : [];

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// POST créer une nouvelle agence
async function handleCreateAgency(body, env, corsHeaders) {
  const { name, url, description, sector, status, notes, notes_list, email, phone, contact_person } = body;

  if (!name || !url) {
    return new Response(JSON.stringify({ error: 'Le nom et l\'URL sont requis' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const notesListJson = notes_list ? JSON.stringify(notes_list) : '[]';

  const result = await env.DB.prepare(
    `INSERT INTO agencies (name, url, description, sector, status, notes, notes_list, email, phone, contact_person) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    name,
    url,
    description || '',
    sector || 'Tous types d\'emplois',
    status || 'nouveau',
    notes || '',
    notesListJson,
    email || '',
    phone || '',
    contact_person || ''
  ).run();

  const newAgency = await env.DB.prepare(
    'SELECT * FROM agencies WHERE id = ?'
  ).bind(result.meta.last_row_id).first();

  newAgency.notes_list = newAgency.notes_list ? JSON.parse(newAgency.notes_list) : [];

  return new Response(JSON.stringify(newAgency), {
    status: 201,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// PUT mettre à jour une agence
async function handleUpdateAgency(id, body, env, corsHeaders) {
  const { name, url, description, sector, status, notes, notes_list, email, phone, contact_person } = body;

  const notesListJson = notes_list ? JSON.stringify(notes_list) : null;

  const result = await env.DB.prepare(
    `UPDATE agencies SET name = ?, url = ?, description = ?, sector = ?, status = ?, 
     notes = ?, notes_list = COALESCE(?, notes_list), email = ?, phone = ?, contact_person = ?, 
     updatedAt = datetime('now') WHERE id = ?`
  ).bind(
    name,
    url,
    description || '',
    sector || 'Tous types d\'emplois',
    status || 'nouveau',
    notes || '',
    notesListJson,
    email || '',
    phone || '',
    contact_person || '',
    id
  ).run();

  if (result.meta.changes === 0) {
    return new Response(JSON.stringify({ error: 'Agence non trouvée' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const updatedAgency = await env.DB.prepare(
    'SELECT * FROM agencies WHERE id = ?'
  ).bind(id).first();

  updatedAgency.notes_list = updatedAgency.notes_list ? JSON.parse(updatedAgency.notes_list) : [];

  return new Response(JSON.stringify(updatedAgency), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// DELETE supprimer une agence
async function handleDeleteAgency(id, env, corsHeaders) {
  const result = await env.DB.prepare(
    'DELETE FROM agencies WHERE id = ?'
  ).bind(id).run();

  if (result.meta.changes === 0) {
    return new Response(JSON.stringify({ error: 'Agence non trouvée' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ message: 'Agence supprimée avec succès', id: parseInt(id) }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// POST ajouter une note
async function handleAddNote(agencyId, body, env, corsHeaders) {
  const { content } = body;

  if (!content || !content.trim()) {
    return new Response(JSON.stringify({ error: 'Le contenu de la note est requis' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const agency = await env.DB.prepare(
    'SELECT notes_list FROM agencies WHERE id = ?'
  ).bind(agencyId).first();

  if (!agency) {
    return new Response(JSON.stringify({ error: 'Agence non trouvée' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let notesList = [];
  if (agency.notes_list) {
    try {
      notesList = JSON.parse(agency.notes_list);
    } catch (e) {
      notesList = [];
    }
  }

  const newNote = {
    id: Date.now(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };
  notesList.unshift(newNote);

  await env.DB.prepare(
    'UPDATE agencies SET notes_list = ?, updatedAt = datetime(\'now\') WHERE id = ?'
  ).bind(JSON.stringify(notesList), agencyId).run();

  const updatedAgency = await env.DB.prepare(
    'SELECT * FROM agencies WHERE id = ?'
  ).bind(agencyId).first();

  updatedAgency.notes_list = notesList;

  return new Response(JSON.stringify(updatedAgency), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// DELETE supprimer une note
async function handleDeleteNote(agencyId, noteId, env, corsHeaders) {
  const agency = await env.DB.prepare(
    'SELECT notes_list FROM agencies WHERE id = ?'
  ).bind(agencyId).first();

  if (!agency) {
    return new Response(JSON.stringify({ error: 'Agence non trouvée' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let notesList = [];
  if (agency.notes_list) {
    try {
      notesList = JSON.parse(agency.notes_list);
    } catch (e) {
      notesList = [];
    }
  }

  notesList = notesList.filter(note => note.id != noteId);

  await env.DB.prepare(
    'UPDATE agencies SET notes_list = ?, updatedAt = datetime(\'now\') WHERE id = ?'
  ).bind(JSON.stringify(notesList), agencyId).run();

  const updatedAgency = await env.DB.prepare(
    'SELECT * FROM agencies WHERE id = ?'
  ).bind(agencyId).first();

  updatedAgency.notes_list = notesList;

  return new Response(JSON.stringify(updatedAgency), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// GET statistiques
async function handleGetStats(env, corsHeaders) {
  const result = await env.DB.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'nouveau' THEN 1 ELSE 0 END) as nouveau,
      SUM(CASE WHEN status = 'contacté' THEN 1 ELSE 0 END) as contacté,
      SUM(CASE WHEN status = 'en négociation' THEN 1 ELSE 0 END) as 'en négociation',
      SUM(CASE WHEN status = 'accord verbal' THEN 1 ELSE 0 END) as 'accord verbal',
      SUM(CASE WHEN status = 'gagné' THEN 1 ELSE 0 END) as gagné,
      SUM(CASE WHEN status = 'perdu' THEN 1 ELSE 0 END) as perdu,
      SUM(CASE WHEN status IN ('contacté', 'en négociation', 'accord verbal') THEN 1 ELSE 0 END) as actives
    FROM agencies
  `).first();

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

