import { Box, Button, Grid, styled, Typography, useTheme } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
// styles
import useStyles from "./styles";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

export default function PdfViewer({ pdf }) {
  const theme = useTheme();
  const classes = useStyles(theme);
  const pageContainerRef = useRef(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [pageWidth, setPageWidth] = useState();

  function handlePageScale(parentWidth) {
    const scaleW = (parentWidth) / pageWidth;
    setScale(scaleW);
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      if (pageWidth)
      {
        // console.log("[DAVID] resizeObervation :: pageWidth = ", event[0].contentBoxSize[0].inlineSize, pageWidth);
        handlePageScale(event[0].contentBoxSize[0].inlineSize);
      }
    });

    if (pageContainerRef)
      resizeObserver.observe(pageContainerRef.current);
  }, [pageContainerRef, pageWidth]);

  function onDocumentLoadSuccess({ numPages }) {
    setTotalPages(numPages);
  }

  function onHandlePageNumber(num) {
    if (num === 0 || num > totalPages) return;
    setCurrentPage(num);
  }

  useEffect(() => {
    if (!pageWidth || !pageContainerRef.current) 
      return;
    
    console.log("[DAVID] page width changed. ", pageWidth, pageContainerRef.current.clientWidth);
    handlePageScale(pageContainerRef.current.clientWidth);
  }, [pageWidth])

  function onLoadSuccess(page) {
    setPageWidth(page.originalWidth);
  }

  return (
    <Grid
      container
      className={classes.containerCenter}
      ref = {pageContainerRef}
    >
      {pdf && (
        <Document 
          // file={{data: pdf.buffer}} 
          file={pdf.url}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page 
            pageNumber={currentPage} 
            scale={scale}
            onLoadSuccess = {onLoadSuccess}
          />
        </Document>
      )}
      <Grid container alignItems="center">
        <Grid item xs={3} className={classes.filename}>
          <Typography className={classes.text}>{pdf?.filename}</Typography>
        </Grid>
        <Grid item xs={6} container className={classes.containerCenter}>
          <Button 
            className={classes.text}
            onClick={() => onHandlePageNumber(currentPage - 1)}>
            Prev
          </Button>
          <Typography className={classes.text}>{currentPage}</Typography>
          <Button 
            className={classes.text}
            onClick={() => onHandlePageNumber(currentPage + 1)}>
            Next
          </Button>
        </Grid>
        <Grid item xs={3} className={classes.pagenum}>
          <Typography className={classes.text} style={{textAlign:"end"}}>Page 1-{totalPages} </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

