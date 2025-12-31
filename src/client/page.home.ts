import { css, html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { ZeltTemplateAppProvider } from "./provider.app.js";

@customElement("zelt-template-home-page")
export class ZeltTemplateHomePage extends ZeltTemplateAppProvider {
  static override styles = [
    globalStyles,
    css`
      zelt-template-app-config,
      zelt-template-prompt-logs {
        display: inline-block;
      }

      .title-container {
        display: flex;
        align-items: center;
        gap: var(--size-medium);
        margin-top: var(--size-medium);
      }

      .title-container h1 {
        margin: 0;
        font-size: calc(var(--font-large) * 1.5);
      }
    `,
  ];

  override render(): TemplateResult {
    return html`
      <h1>Welcome to the Zelt Stack Template!</h1>
    `;
  }
}
