const https = require('https');
const fs = require('fs');

const data = JSON.stringify({
  model: 'gpt-image-2',
  prompt: 'A hand-drawn style knowledge card infographic about parenting and child education for 3rd-4th grade students (ages 8-10). Chinese text with sketched pencil style and soft watercolor touches on warm beige paper background. Title: "三四年级转折期家庭教育指南". Key sections: 1) "转折期特征" - self-awareness, independence, emotional volatility, desire for autonomy vs dependence; 2) "三大挑战" - learning difficulty increase, habit formation period, complex peer relationships; 3) "成绩下滑解码" - onion theory peeling layers to find root causes; 4) "不想上学三级" - mild (complaints), urgent (specific fears), severe (physical symptoms); 5) "角色转变" - from supervisor to consultant, from enemy to ally. Include hand-drawn icons: parent and child figures, onion layers, warning signs, handshake symbol. Use warm colors, hand-lettered Chinese text, notebook sketch style with arrows and bullet points. Educational and supportive tone.',
  n: 1,
  size: '1024x1024'
});

const options = {
  hostname: 'api.suchuang.vip',
  path: '/v1/images/generations',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-w0V20fsgKFWm1tiAMUi4Mof7KREdI1AoFDdfOp2GDnOjzplt',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  // Handle redirects
  if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
    console.log('Redirect to:', res.headers.location);
    return;
  }
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const json = JSON.parse(body);
      if (json.data && json.data[0]) {
        const img = json.data[0];
        if (img.url) {
          console.log('IMAGE_URL:' + img.url);
          // Download the image
          https.get(img.url, (imgRes) => {
            const imgData = [];
            imgRes.on('data', chunk => imgData.push(chunk));
            imgRes.on('end', () => {
              const savePath = 'C:\\Users\\11387\\Desktop\\ai_knowledge_card.png';
              fs.writeFileSync(savePath, Buffer.concat(imgData));
              console.log('SAVED_TO:' + savePath);
            });
          });
        } else if (img.b64_json) {
          const savePath = 'C:\\Users\\11387\\Desktop\\ai_knowledge_card.png';
          fs.writeFileSync(savePath, Buffer.from(img.b64_json, 'base64'));
          console.log('SAVED_TO:' + savePath);
        }
      } else {
        console.log('Response:', body.substring(0, 3000));
      }
    } catch(e) {
      console.log('Parse error:', e.message);
      console.log('Raw:', body.substring(0, 3000));
    }
  });
});

req.on('error', (e) => {
  console.log('Request error:', e.message);
});

req.setTimeout(180000, () => {
  console.log('Request timed out after 180s');
  req.destroy();
});

req.write(data);
req.end();
