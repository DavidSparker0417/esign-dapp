import React, { useEffect, useState } from "react";
import {
  Button, Grid,
} from "@material-ui/core";

// components
import PageTitle from "../../components/PageTitle";
import PdfViewer from "./components/PdfViewer/PdfViewer";
import testPayload from "./payload.json";
import b64toBlob, { trimFileName } from "./helper";

export default function PdfSign(props) {
  const [pdf, setPdf] = useState();
  useEffect(() => {
    console.log("[DAVID] testPayload :: ", testPayload);
    const doc = testPayload.documents[0];
    const blob = b64toBlob(doc.documentBase64, "application/pdf");
    const url = URL.createObjectURL(blob);
    const dinfo = {
      url: url,
      filename: trimFileName(doc.name)
    };
    setPdf(dinfo);
    console.log("[DAVID] base64Response :: ", blob, dinfo);
  }, []);
  return (
    <>
      <PageTitle
        title=""
        button={
          <Button variant="contained" size="medium" color="secondary">
            Start Signing Session
          </Button>
        }
      />
      <Grid container>
        <PdfViewer pdf = {pdf}/>
      </Grid>
    </>
  );
}
