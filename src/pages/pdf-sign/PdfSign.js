import React, { useEffect, useState } from "react";
import {
  Button, Grid,
} from "@material-ui/core";

// components
import PageTitle from "../../components/PageTitle";
import PdfViewer from "./components/PdfViewer/PdfViewer";
import testPayload from "./payload.json";
import b64toBlob, { b64toBytes, trimFileName } from "./helper";

import SignPad  from "./components/signpad";

export default function PdfSign(props) {
  const [pdf, setPdf] = useState();
  const [pdfBuffer, setPdfBuffer] = useState();
  const [togglePad, setTogglePad] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    console.log("[DAVID] testPayload :: ", testPayload);
    const doc = testPayload.documents[0];
    // const blob = b64toBlob(doc.documentBase64, "application/pdf");
    const pdfBytes = b64toBytes(doc.documentBase64);
    setPdfBuffer(pdfBytes);
    // const blob = new Blob([pdfBytes], {type: "application/pdf"});
    // const url = URL.createObjectURL(blob);
    // const dinfo = {
    //   url: url,
    //   filename: trimFileName(doc.name),
    //   buffer: pdfBytes
    // };
    // setPdf(dinfo);
    // console.log("[DAVID] base64Response :: ", blob, dinfo);
  }, []);

  useEffect(() => {
    if (!pdfBuffer)
      return;
    
    const blob = new Blob([pdfBuffer], {type: "application/pdf"});
    const url = URL.createObjectURL(blob);
    setPdf(pdf => ({...pdf, url}));
    console.log("[DAVID] base64Response :: ", blob, url);
  }, [pdfBuffer])

  useEffect(()=>{
    console.log("current page chaged: ", currentPage);
  }, [currentPage])

  return (
    <div>
      <PageTitle
        title=""
        button={
          <Button variant="contained" size="medium" color="secondary" onClick={()=>{setTogglePad(!togglePad)}}>
            Start Signing Session
          </Button>
        }
      />
      <Grid container>
        <PdfViewer pdf = {pdf} curPage={(page)=>setCurrentPage(page)}/>
      </Grid>
      {
          togglePad ?
            <div style={{
              width: "100%",
              height: "100%",
              position: "fixed",
              bottom: "0px",
              left: "0px",
              right: "0px",
              // top:"0px",
              backgroundColor:"white"
            }}>
              <SignPad 
                pdfBuffer = {pdfBuffer}
                update = {(buffer)=> setPdfBuffer(buffer)}
                close={()=>setTogglePad(false)}
                page={currentPage}
              />
            </div> : <></>
        }
    </div>
  );
}
