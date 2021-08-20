import cookie from 'cookie';

// Helper function to parse cookie
// Return the cookie from headers if the cookie exists
// otherwise return an empty string
export function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || '' : '');
}
