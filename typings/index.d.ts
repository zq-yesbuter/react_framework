declare module '*.css';
declare module '*.less' {
  const resource: { [key: string]: string };
  export = resource;
}
declare module '*.scss';
declare module '*.svg';
