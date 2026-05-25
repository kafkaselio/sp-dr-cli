declare module 'gradient-string' {
  type Color = string;
  interface Gradient {
    (text: string): string;
    multiline(text: string): string;
  }
  function gradient(colors: Color[]): Gradient;
  function gradient(...colors: Color[]): Gradient;
  export = gradient;
}
