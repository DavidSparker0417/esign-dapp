export default function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });

  return blob;
} 

export function b64toBytes(b64Data) {
  const byteCharacters = atob(b64Data);
  let uint8Array = new Uint8Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    uint8Array[i] = byteCharacters.charCodeAt(i);
  }
  console.log("[DAVID] b64toBytes :: RESULT = ", uint8Array);
  return uint8Array;
} 

export function trimFileName(filename) {
  const dotPos = filename.lastIndexOf(".");
  let name = filename.slice(0, dotPos);
  const ext = filename.substr(dotPos);
  if (name?.length > 8)
    name = name.slice(0, 4) + ".." + name.slice(-4);
  name = name + ext;
  return name;
}