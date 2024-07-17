/* components/linkwithquery.js */

import { useRouter } from 'next/router'
import Link from "next/link";
//import queryString from "query-string";

export default function LinkWithQuery ({ children, href, ...props }) 
{  
  const router = useRouter();
  //const query = queryString.stringify(router.query);
  const query = router?.asPath?.slice(router?.pathname?.length);

  return (
    <Link href={href + query} {...props}>
      {children}
    </Link>
  );
  
};