// import * as React from "react";
// import { PrimaryButton } from "@fluentui/react";
// import SignaturePad from "react-signature-canvas";
// import SignatureCanvas from "react-signature-canvas";
// import { GlobalWorkerOptions } from "pdfjs-dist";
// import "./eSignature.scss";

// const pdfjsWorker = require("pdfjs-dist/build/pdf.worker.entry");
// GlobalWorkerOptions.workerSrc = pdfjsWorker;

// type IESignatureProps = {
//   setSignBuffer(pngImageBytes: ArrayBuffer): void;
//   closeModal(): void;
// };

// const ESignature: React.FC<IESignatureProps> = ({
//   setSignBuffer,
//   closeModal,
// }) => {
//   const sigCanvas = React.useRef<SignatureCanvas>(null);

//   const signPDF = async () => {
//     if (sigCanvas && sigCanvas.current && sigCanvas.current) {
//       const pngDataUrl = sigCanvas?.current.toDataURL("image/png");
//       const pngImageBytes = await fetch(pngDataUrl).then((res) =>
//         res.arrayBuffer()
//       );
//       setSignBuffer(pngImageBytes);
//       closeModal();
//     }
//   };

//   return (
//     <>
//       <div>
//         <SignaturePad
//           ref={sigCanvas}
//           canvasProps={{ className: "sigCanvas" }}
//         />
//       </div>
//       <PrimaryButton text="Sign" onClick={signPDF} />
//     </>
//   );
// };

// export default ESignature;
