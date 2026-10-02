import {explainNotice} from '../src/apertus.mjs';
export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'Método no permitido.'});
 try{const result=await explainNotice(req.body?.notice,{endpoint:process.env.APERTUS_ENDPOINT,apiKey:process.env.APERTUS_API_KEY});res.setHeader('Cache-Control','no-store');return res.status(200).json(result);}
 catch(error){const bad=/aviso de al menos|supera el límite/.test(error.message);const missing=/aún no está configurado/.test(error.message);return res.status(bad?400:missing?503:502).json({error:bad||missing?error.message:'La explicación no está disponible ahora mismo.'});}
}
