// Kasih tau TS: "Kalo ada file yang ujungnya .css, anggep aja itu modul valid ya!"
declare module "*.css" {
  const content: any;
  export default content;
}