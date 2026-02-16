/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * WebMCP (Web Model Context Protocol) type declarations.
 * Extends React's JSX types for declarative WebMCP form attributes.
 * @see https://webmachinelearning.github.io/webmcp/
 */
declare module "react" {
  interface FormHTMLAttributes<T> {
    toolname?: string;
    tooldescription?: string;
    toolautosubmit?: string;
  }
  interface InputHTMLAttributes<T> {
    toolparamtitle?: string;
    toolparamdescription?: string;
  }
  interface SelectHTMLAttributes<T> {
    toolparamtitle?: string;
    toolparamdescription?: string;
  }
  interface TextareaHTMLAttributes<T> {
    toolparamtitle?: string;
    toolparamdescription?: string;
  }
}

export {};
