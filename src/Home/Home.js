import React, {useEffect} from 'react'
import ReactMarkdown from 'react-markdown'
import {Footer, SectionTitle} from "../common/CommonUI";
import { isAdminUser } from "../authentication/authentication";

import './Home.css';

import termsFrPath from '../static/posts/Home.md'
import termsFrPathAdmin from '../static/posts/HomeAdmin.md'


function Home () {
  const [terms, setTerms] = React.useState(null);


  useEffect(() => {
    let terms = isAdminUser() ? termsFrPathAdmin : termsFrPath;
    fetch(terms
    ).then((response) => response.text()
    ).then((text) => {
      setTerms(text);
    })
  }, []);

  return (
    <div>
      <SectionTitle
        title={"ARIAVT"}
        subtitle={"Automatic Retinal Image Analysis and Visualization Tool"}
      />
      <div className="markdown">
        <ReactMarkdown children={terms} />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
