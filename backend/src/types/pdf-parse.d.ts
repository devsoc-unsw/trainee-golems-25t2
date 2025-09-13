declare module "pdf-parse" {
  const pdfParse: (dataBuffer: Buffer) => Promise<{ text: string }>;
  export default pdfParse;
}
