import http from 'http';

http.get('http://localhost:9222/json/version', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('CDP Version Info:');
    console.log(data);
  });
}).on('error', (err) => {
  console.error('Error connecting to CDP:', err.message);
});
