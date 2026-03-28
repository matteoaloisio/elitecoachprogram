module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { to, template, data } = req.body;

  const templates = {
    welcome: {
      subject: 'Benvenuto in EliteCoachProgram.fit!',
      html: `<h1>Ciao ${data?.name || ''}!</h1>
             <p>Il tuo account è attivo. Inizia subito il tuo percorso fitness.</p>
             <a href="https://elitecoachprogram-fit-mnea.vercel.app">Accedi alla piattaforma</a>`
    },
    payment_success: {
      subject: 'Abbonamento attivato — EliteCoachProgram.fit',
      html: `<h1>Pagamento ricevuto!</h1>
             <p>Il tuo piano Pro è attivo. Goditi tutte le funzionalità premium.</p>`
    },
    trainer_assigned: {
      subject: 'Il tuo trainer è pronto!',
      html: `<h1>${data?.trainerName || 'Il tuo coach'} è pronto</h1>
             <p>Accedi alla chat per iniziare.</p>`
    }
  };

  const tmpl = templates[template];
  if (!tmpl) return res.status(400).json({ error: 'Template non trovato' });

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
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
  res.json(result);
};
