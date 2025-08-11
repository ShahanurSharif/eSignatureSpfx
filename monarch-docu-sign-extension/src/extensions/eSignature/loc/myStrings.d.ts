declare interface IESignatureCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'ESignatureCommandSetStrings' {
  const strings: IESignatureCommandSetStrings;
  export = strings;
}
