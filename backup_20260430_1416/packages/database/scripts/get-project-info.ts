

const TOKEN = 'sbp_f92ce82ac622fa61e3745bcc412523de696c9207';

async function getProjectInfo() {
  try {
    const ref = 'angthjyayhrbexeaeoqm';
    const response = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/database/pooler`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    const data = await response.json();
    console.log('Pooler Config:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error fetching pooler info:', err);
  }
}

getProjectInfo();
