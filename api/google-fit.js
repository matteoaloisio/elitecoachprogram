// api/google-fit.js
export default async function handler(req, res) {
const { action, code } = req.query;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT = 'https://elitecoachprogram-fit-mnea.vercel.app/api/google-fit';
if (action === 'auth') {
const url = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
client_id: CLIENT_ID, redirect_uri: REDIRECT+'?action=callback',
response_type: 'code', scope: 'https://www.googleapis.com/auth/fitness.activity.read '
+ 'https://www.googleapis.com/auth/fitness.body.read',
access_type: 'offline', prompt: 'consent'
});
return res.redirect(url);
}
if (action === 'callback') {
const r = await fetch('https://oauth2.googleapis.com/token', {
method: 'POST', headers: {'Content-Type':'application/x-www-form-urlencoded'},
body: new URLSearchParams({ code, client_id: CLIENT_ID,
client_secret: CLIENT_SECRET, redirect_uri: REDIRECT+'?action=callback',
grant_type: 'authorization_code' })
});
const tokens = await r.json();
return res.redirect(
`/?googlefit_token=${tokens.access_token}&refresh;=${tokens.refresh_token}`
);
}
}
