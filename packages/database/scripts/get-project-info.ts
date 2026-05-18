const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
if (!TOKEN) {
  console.error("Error: SUPABASE_ACCESS_TOKEN environment variable is not defined.");
  process.exit(1);
}

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
