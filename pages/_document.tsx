import {
  createDOMRenderer,
  renderToStyleElements,
} from '@fluentui/react-components';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // 👇 creates a renderer
    const renderer = createDOMRenderer();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        // 👇 this is required by pass the same instance to <App />
        // eslint-disable-next-line react/display-name
        enhanceApp: (App) => (props) => <App {...props} renderer={renderer} />,
      });

    const initialProps = await Document.getInitialProps(ctx);
    const styles = renderToStyleElements(renderer);

    return {
      ...initialProps,
      // 👇 adding our styles elements to output
      // @ts-ignore
      styles: [...initialProps.styles, ...styles],
    };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
