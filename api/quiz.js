const { createClient } = require('@supabase/supabase-js');
const { randomBytes } = require('crypto');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!process.env.SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Server configuration missing' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (req.method === 'POST') {
    const data = req.body;

    if (!data || !Array.isArray(data.questions) ||
        data.questions.length < 1 || data.questions.length > 20 ||
        typeof data.title !== 'string' ||
        data.title.length > 70) {
      return res.status(400).json({ error: 'Invalid quiz data' });
    }

    for (let attempt = 0; attempt < 3; attempt++) {
      const id = randomBytes(5).toString('base64url');

      const { error } = await supabase.from('quizzes').insert({
        id,
        quiz_data: data
      });

      if (!error) return res.status(201).json({ id });

      if (error.code !== '23505') {
        console.error('Quiz insert failed:', error.code);
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

    const { data, error } = await supabase
      .from('quizzes')
      .select('quiz_data')
      .eq('id', id)
      .maybeSingle();

    if (error) return res.status(500).json({ error: 'Could not load quiz' });
    if (!data) return res.status(404).json({ error: 'Quiz not found' });

    return res.status(200).json(data.quiz_data);
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
};
