import React, { Component } from "react";
import SignaturePad from "signature_pad";
import Button from '@material-ui/core/Button';

import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

import testJson from "../../payload.json";




class SignPad extends Component {
    constructor(props) {
        super(props);
        this.clearSign = this.clearSign.bind(this);
        this.uploadSign = this.uploadSign.bind(this);
    }

    signaturePad = null;

    componentDidMount() {
        const canvas = document.querySelector("#canvas");

        window.addEventListener("resize", this.resizeCanvas);
        this.resizeCanvas();
    
        this.signaturePad = new SignaturePad(canvas);
    }

    clearSign() {
        this.signaturePad.clear();
    }

    async uploadSign() {

        const pngDataUrl = await this.signaturePad.toDataURL(); 
        const pngImageBytes = await fetch(pngDataUrl).then((res) => res.arrayBuffer())
        const pdfDoc = await PDFDocument.load(testJson.documents[0].documentBase64);
        const pngImage = await pdfDoc.embedPng(pngImageBytes)
        const pngDims = pngImage.scale(1.0);
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();

        firstPage.drawImage(pngImage, {
            x: firstPage.getWidth() / 2 - pngDims.width / 2 + 75,
            y: firstPage.getHeight() / 2 - pngDims.height + 250,
            width: pngDims.width,
            height: pngDims.height,
        })

        const pdfBytes = await pdfDoc.save();
        console.log("pdfBytes", pdfBytes);

        var bytes = new Uint8Array(pdfBytes); // pass your byte response to this constructor
        var blob = new Blob([bytes], { type: "application/pdf" });// change resultByte to bytes
        
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "signed.pdf";
        link.click();

    }

    resizeCanvas() {
        const ratio =  Math.max(window.devicePixelRatio || 1, 1);
        const canvas = document.querySelector("#canvas");
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
        if (this.signaturePad)
            this.signaturePad.clear(); // otherwise isEmpty() might return incorrect value
    }
    

    render() {
        return (
            <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
                <div style={{ flex: 1, backgroundColor: "pink" }}>
                    <canvas id="canvas" style={{ width: "100%", height: "100%" }} />
                </div>
                <div style={{ display: "flex", height: "60px", margin: "20px 10px", justifyContent: "space-around" }}>
                    <Button
                        variant='contained'
                        size='small'
                        color='primary'
                        onClick={this.clearSign}
                    >
                        DRAW SIGNATURE
                    </Button>
                    <Button
                        variant='contained'
                        size='small'
                        color='primary'
                        onClick={this.uploadSign}
                    >
                        DO SIGN
                    </Button>
                </div>
            </div>
        );
    }
}

export default SignPad;