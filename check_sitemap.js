import https from 'https';

https.get('https://www.pagebuild.tech/sitemap.xml', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log('Body:', data.substring(0, 500)));
}).on('error', (e) => {
  console.error(e);
});
