import {api} from '../../backend/api.mjs';
export const handler=async(event)=>{
 const host=event.headers.host;const request=new Request(`https://${host}${event.path}${event.rawQuery?'?'+event.rawQuery:''}`,{method:event.httpMethod,headers:event.headers,...(event.body?{body:event.isBase64Encoded?Buffer.from(event.body,'base64'):event.body}:{} )});
 const response=await api(request,process.env);return {statusCode:response.status,headers:Object.fromEntries(response.headers),body:await response.text()};
};
