(async function main(){
  try{
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Please briefly explain the importance of fast AI inference.' }],
        model: 'openai/gpt-oss-120b'
      })
    });
    console.log('status', res.status);
    const txt = await res.text();
    console.log(txt);
  } catch (err) {
    console.error('error', err);
  }
})();
