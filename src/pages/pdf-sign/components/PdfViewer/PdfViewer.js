import { Box, Button, Grid, styled } from "@material-ui/core";
import { useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { Typography } from "../../../../components/Wrappers/Wrappers";
// styles
import useStyles from "./styles";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const DocWrapper = styled(Box)(() => {
  return {
    canvas: {
      width: "100%!important",
      height: "auto!important"
    },
    ".react-pdf__Page__textContent" : {
      width: "100%!important",
      overflow: "hidden!important"
    }
  };
});

export default function PdfViewer({ pdf }) {
  const classes = useStyles();
  const pageContainerRef = useRef(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setTotalPages(numPages);
  }

  function onHandlePageNumber(num) {
    if (num === 0 || num > totalPages) return;
    setCurrentPage(num);
  }

  function onLoadSuccess(page) {
    console.log("[DAVID] onPageRenderSuccess :: page = ", page, pageContainerRef);
    const scaleW = (pageContainerRef.current.clientWidth) / page.width;
    setScale(scaleW);
  }
  return (
    <Grid
      container
      className={classes.containerCenter}
      ref = {pageContainerRef}
    >
      {pdf && (
        <Document file={pdf.url} onLoadSuccess={onDocumentLoadSuccess}>
          <Page 
            pageNumber={currentPage} 
            scale={scale}
            onLoadSuccess = {onLoadSuccess}
          />
        </Document>
      )}
      <Grid container alignItems="center">
        <Grid item xs={3} className={classes.filename}>
          <Typography>{pdf?.filename}</Typography>
        </Grid>
        <Grid item xs={6} container className={classes.containerCenter}>
          <Button onClick={() => onHandlePageNumber(currentPage - 1)}>
            Prev
          </Button>
          <Typography>{currentPage}</Typography>
          <Button onClick={() => onHandlePageNumber(currentPage + 1)}>
            Next
          </Button>
        </Grid>
        <Grid item xs={3} className={classes.pagenum}>
          <Typography style={{textAlign:"end"}}>Page 1-{totalPages} </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
