
export function setErrorText(text) 
{
  console.error(text);
  if (typeof window != 'undefined')
    alert(text);
}

export default function setError(err) 
{ 
  if (err.response?.data?.error?.message)
    setErrorText(err.response.data.error.message);
  else
  {
    console.log(err);
    setErrorText("Server error");
  } 
}  
