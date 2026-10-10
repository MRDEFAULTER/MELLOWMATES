import { randomBytes } from 'node:crypto';

export default async function handler(req, res) {
res.setHeader('Cache-Control', 'no-store');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
return res.status(500).json({ error: 'Server configuration missing' });
}

async function supabase(path, options = {}) {
return fetch("${url}/rest/v1/${path}", {
...options,
headers: {
apikey: key,
Authorization: "Bearer ${key}",
'Content-Type': 'application/json',
...options.headers
}
});
}

if (req.method === 'POST') {
const data = req.body;

if (
  !data ||
  typeof data.title !== 'string' ||
  data.title.length > 70 ||
  !Array.isArray(data.questions) ||
  data.questions.length < 1 ||
  data.questions.length > 20
) {
  return res.status(400).json({ error: 'Invalid quiz data' });
}

for (let i = 0; i < 3; i++) {
  const id = randomBytes(6).toString('base64url');

  try {
    const response = await supabase('quizzes', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify([{ id, quiz_data: data }])
    });

    if (response.ok) {
      return res.status(201).json({ id });
    }

    if (response.status !== 409) {
      console.error('Quiz save failed:', response.status);
      return res.status(500).json({ error: 'Could not save quiz' });
    }
  } catch {
    return res.status(500).json({ error: 'Could not save quiz' });
  }
}

return res.status(500).json({ error: 'Please try again' });

}

if (req.method === 'GET') {
const id = String(req.query?.id || '');

if (!/^[A-Za-z0-9_-]{6,16}$/.test(id)) {
  return res.status(400).json({ error: 'Invalid quiz ID' });
}

try {
  const response = await supabase(
    `quizzes?select=quiz_data&id=eq.${encodeURIComponent(id)}&limit=1`
  );

  if (!response.ok) {
    return res.status(500).json({ error: 'Could not load quiz' });
  }

  const rows = await response.json();

  if (!rows.length) {
    return res.status(404).json({ error: 'Quiz not found' });
  }

  return res.status(200).json(rows[0].quiz_data);
} catch {
  return res.status(500).json({ error: 'Could not load quiz' });
}

}

res.setHeader('Allow', 'GET, POST');
return res.status(405).json({ error: 'Method not allowed' });
}
