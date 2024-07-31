
export default function getBaseURL() 
{
  return process.env.NEXT_PUBLIC_STRAPI_HOST ? process.env.NEXT_PUBLIC_STRAPI_HOST : "http://localhost:1337";
} 
