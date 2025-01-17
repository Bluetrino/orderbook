import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
    font-family: Kraken Plex Mono, monospace;
  }

  #root {
    margin: 0 auto;
  }

  body {
    background-color: #121723;
  }
`;

export default GlobalStyle as any;
