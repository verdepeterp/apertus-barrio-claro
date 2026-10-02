export function validateNotice(text){const clean=String(text||'').trim();if(clean.length<40)throw new Error('Pega un aviso de al menos 40 caracteres.');if(clean.length>5000)throw new Error('El aviso supera el límite de 5.000 caracteres.');return clean;}
export async function explainNotice(text,{fetchImpl=fetch,endpoint,apiKey}={}){
 if(!endpoint||!apiKey)throw new Error('El proveedor de inferencia de Apertus aún no está configurado.');
 const notice=validateNotice(text);const prompt='Resume este aviso público en español sencillo con Qué cambia, Para quién y Qué hacer ahora. No inventes datos. Si falta algo, di No consta en el aviso.\n\nAVISO:\n'+notice;
 const response=await fetchImpl(endpoint,{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+apiKey},body:JSON.stringify({inputs:prompt,parameters:{max_new_tokens:360,temperature:0.2}})});
 if(!response.ok)throw new Error('La inferencia de Apertus no está disponible ('+response.status+').');
 const payload=await response.json();const summary=payload?.generated_text||payload?.text||payload?.choices?.[0]?.message?.content||payload?.choices?.[0]?.text;if(!summary||typeof summary!=='string')throw new Error('La respuesta del modelo no tiene texto utilizable.');return {summary:summary.trim()};
}
