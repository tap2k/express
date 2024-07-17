/* pages/probe.js */

import { Alert } from "reactstrap";
import Prober from "../components/prober";
import LinkWithQuery from "../components/linkwithquery";

export default () => {  
  return (
    <div>
    <Alert color="primary">
      <h1 style={{display: 'inline-block'}}>express</h1>
    </Alert>
    <Prober /> 
    </div>
  );
};
