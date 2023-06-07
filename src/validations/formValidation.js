const validateUrl = (url) => {
  const defaultHostPattern = /^sns\.[a-zA-Z0-9\-]{3,}\.amazonaws\.com(\.cn)?$/;
  const parsed = new URL(url);

  return parsed.protocol === 'https:' && parsed.pathname.endsWith('.pem') && defaultHostPattern.test(parsed.hostname);
};

module.exports = {
  validateUrl,
};
