import { html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { ZeltTemplateAppProvider } from "./provider.app.js";
import { globalStyles } from "./styles.global.js";

@customElement("zelt-template-example-page")
export class ZeltTemplateExamplePage extends ZeltTemplateAppProvider {
  params = parseRouteParams("/example/:id", window.location.pathname);

  static override styles = [globalStyles];

  override render(): TemplateResult {
    return html`
      <main>
        <h1>Hello from the Example Page: ${this.params.id}</h1>
      </main>
    `;
  }
}
