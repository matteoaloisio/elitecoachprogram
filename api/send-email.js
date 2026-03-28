module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { to, template, data } = req.body;

  if (!to || !template) {
    return res.status(400).json({ error: 'Parametri mancanti' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY non configurata su Vercel' });
  }

  const templates = {
    welcome: (d) => ({
      subject: 'Benvenuto in EliteCoachProgram.fit!',
      html: '<h1>Ciao ' + (d && d.name ? d.name : '') + '!</h1><p>Il tuo account e attivo.</p><a href="https://elitecoachprogram-fit-mnea.vercel.app">Accedi</a>'
    }),
    payment_success: () => ({
      subject: 'Abbonamento attivato',
      html: '<h1>Pagamento ricevuto!</h1><p>Il tuo piano Pro e attivo.</p>'
    }),
    trainer_assigned: (d) => ({
      subject: 'Il tuo trainer e pronto!',
      html: '<h1>' + (d && d.trainerName ? d.trainerName : 'Il tuo coach') + ' e pronto</h1>'
    })
  };

  const tmplFn = templates[template];
  if (!tmplFn) return res.status(400).json({ error: 'Template non trovato' });
  const tmpl = tmplFn(data || {});

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'EliteCoach <onboarding@resend.dev>',
        to: [to],
        subject: tmpl.subject,
        html: tmpl.html
      })
    });
    const result = await response.json();
    res.status(response.status).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
