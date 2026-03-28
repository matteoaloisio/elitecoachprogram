export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { to, template, data } = req.body;

  const templates = {
    welcome: {
      subject: 'Benvenuto in EliteCoachProgram.fit!',
      html: `<h1>Ciao ${data?.name || ''}!</h1><p>Il tuo account è attivo.</p>`
    },
    payment_success: {
      subject: 'Abbonamento attivato!',
      html: `<h1>Pagamento ricevuto!</h1><p>Il tuo piano Pro è attivo.</p>`
    },
    trainer_assigned: {
      subject: 'Il tuo trainer è pronto!',
      html: `<h1>Il tuo coach è pronto</h1><p>Accedi alla chat.</p>`
    }
  };

  const tmpl = templates[template];
  if (!tmpl) return res.status(400).json({ error: 'Template non trovato' });

  const key = process.env.RESEND_API_KEY;
  
  // DEBUG: logga se la chiave esiste
  console.log('RESEND KEY presente:', !!key, 'lunghezza:', key?.length);

  if (!key) {
    return res.status(500).json({ error: 'RESEND_API_KEY non trovata nel server' });
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: [to],
      subject: tmpl.subject,
      html: tmpl.html
    })
  });

  const result = await response.json();
  res.json(result);
}
