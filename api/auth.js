export default function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;

  if (!clientId) {
    return res.status(500).send('OAUTH_CLIENT_ID is not configured.');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'repo,user',
    redirect_uri: `${process.env.OAUTH_REDIRECT_ORIGIN ?? 'https://www.born.directory'}/api/callback`,
  });

  return res.redirect(`https://github.com/login/oauth/authorize?${params}`);
}
