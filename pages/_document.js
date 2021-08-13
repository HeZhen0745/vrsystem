import Document, {Html, Head, Main, NextScript } from 'next/document';
import flush from 'styled-jsx/server';

export default class CustomDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage();
    const styles = flush();
    
    return { html, head, errorHtml, chunks, styles };
  }

  render() {
    return (
      <Html>
        <Head>
          <script src="/js/jquery-3.6.0.min.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
          <script src="/js/app.js"></script>
        </body>
      </Html>
    );
  }
}