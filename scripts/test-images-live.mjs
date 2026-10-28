const urls = [
  'http://localhost:4321/virgen-de-fatima/milagro-del-sol/',
  'http://localhost:4321/ciencia-y-fe/sabana-santa-de-turin/',
  'http://localhost:4321/ciencia-y-fe/virgen-de-guadalupe-tilma/',
  'http://localhost:4321/milagros-eucaristicos/lanciano/',
  'http://localhost:4321/milagros-eucaristicos/buenos-aires/',
  'http://localhost:4321/santos/carlo-acutis/',
  'http://localhost:4321/santos/faustina-kowalska/',
  'http://localhost:4321/padre-pio/estudios-medicos-y-santo-oficio/',
  'http://localhost:4321/jesus/el-buen-samaritano/'
];

async function run() {
  let allOk = true;
  for (const pageUrl of urls) {
    const res = await globalThis.fetch(pageUrl);
    const html = await res.text();
    const match = html.match(/<img[^>]+src="(\/_astro\/[^"]+)"/);
    if (!match) {
      console.error(`❌ Sin imagen en: ${pageUrl}`);
      allOk = false;
      continue;
    }
    const imgUrl = 'http://localhost:4321' + match[1];
    const imgRes = await globalThis.fetch(imgUrl);
    if (imgRes.status === 200) {
      console.log(`✅ [200 OK] ${pageUrl} -> ${match[1]}`);
    } else {
      console.error(`❌ [${imgRes.status}] Error al cargar imagen: ${imgUrl}`);
      allOk = false;
    }

    const sourceMatch = html.match(/href="(https:\/\/commons\.wikimedia\.org\/wiki\/File:[^"]+)"/);
    if (sourceMatch) {
      const sourceUrl = sourceMatch[1];
      const sourceRes = await globalThis.fetch(sourceUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (sourceRes.status === 200) {
        console.log(`   🔗 [Wikimedia 200 OK] ${sourceUrl}`);
      } else {
        console.error(`   ❌ [Wikimedia ${sourceRes.status}] Enlace roto: ${sourceUrl}`);
        allOk = false;
      }
    }
  }

  if (allOk) {
    console.log('\n🎉 ¡Todas las imágenes están verificadas y respondiendo 200 OK en el servidor!');
  } else {
    process.exit(1);
  }
}

run();
