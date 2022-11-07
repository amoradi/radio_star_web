import NextDocument, { Head, Html, Main, NextScript } from "next/document";

export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <meta
            name="description"
            content="Radio Star"
          ></meta>

          <link
            rel="shortcut icon"
            href="/star_favicon.png"
          />
        </Head>
        <body className="tracking-wide">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
