import { css, html, LitElement, PropertyValues, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { RouteConfig, RouteName } from "../shared/type.routes.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { routes } from "../shared/service.client.js";
import { ZeltTemplateAbstractProvider } from "./provider.abstract.js";
import { ZeltTemplateToast } from "./component.toast.js";
import { ZeltTemplateSaveIndicator } from "./component.save-indicator.js";
import { SaveEventName } from "./event.save.js";
import { NavigationEventName } from "./event.navigation.js";
import { SuccessEventName } from "./event.success.js";
import { WarningEventName } from "./event.warning.js";
import "./page.home.js";
import "./page.example.js";
import "./page.not-found.js";
import "./component.toast.js";
import "./component.save-indicator.js";

@customElement("zelt-template-app")
export class ZeltTemplateApp extends LitElement {
  static override styles = [
    css`
      .app-bar {
        border-top: 3px solid transparent;
        border-image: linear-gradient(to right, var(--color-1) 10%, var(--color-2) 90%) 2;
        position: fixed;
        width: 100vw;
        top: 0;
        left: 0;
        z-index: 999;
      }
    `,
  ];
  routes: RouteConfig[] = routes;

  @property({ type: String })
  currentRoute: RouteConfig | null = this.determineRouteName();

  @property({ type: String }) toastMessage = "";
  @property({ type: String }) toastType: "error" | "warning" | "success" | "info" = "info";
  @property({ type: Boolean }) toastVisible = false;
  @query("zelt-template-toast") toast!: ZeltTemplateToast;
  @query("zelt-template-save-indicator") saveIndicator!: ZeltTemplateSaveIndicator;

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("click", this.navigate.bind(this));
    document.addEventListener(WarningEventName.value, (event: Event) => {
      const customEvent = event as CustomEvent;
      this.toast.show(customEvent.detail.message, "warning");
    });
    document.addEventListener(SuccessEventName.value, (event: Event) => {
      const customEvent = event as CustomEvent;
      this.toast.show(customEvent.detail.message, "success");
    });
    document.addEventListener(NavigationEventName.value, (event: Event) => {
      const customEvent = event as CustomEvent;
      window.history.pushState({}, "", customEvent.detail.path);
      this.currentRoute = this.determineRouteName();
      this.requestUpdate();
    });

    this.addEventListener(SaveEventName.value, this.handleSaveEvent);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener(SaveEventName.value, this.handleSaveEvent);
  }

  override render(): TemplateResult {
    const pageContent = this.currentRoute
      ? ((): TemplateResult => {
          switch (this.currentRoute!.name) {
            case RouteName.enum.home:
              return html`
                <div class="app-bar"></div>
                <zelt-template-home-page></zelt-template-home-page>
              `;
            case RouteName.enum.example:
              return html`
                <div class="app-bar"></div>
                <zelt-template-example-page></zelt-template-example-page>
              `;
            default:
              return html`
                <div class="app-bar"></div>
                <zelt-template-not-found-page></zelt-template-not-found-page>
              `;
          }
        })()
      : html`
          <zelt-template-not-found-page></zelt-template-not-found-page>
        `;

    return html`
      ${pageContent}
      <zelt-template-toast
        .message="${this.toastMessage}"
        .type="${this.toastType}"
        .visible="${this.toastVisible}"
        @close=${this.handleToastClose}></zelt-template-toast>
      <zelt-template-save-indicator></zelt-template-save-indicator>
      <zelt-template-notification-manager></zelt-template-notification-manager>
    `;
  }

  determineRouteName(): RouteConfig | null {
    const pathname = window.location.pathname;

    for (const route of this.routes) {
      try {
        const params = parseRouteParams(route.path, pathname);
        if (params !== null) {
          return route;
        }
      } catch {
        // Ignore parsing errors and continue to next route
      }
    }

    return null;
  }

  async navigate(event: Event): Promise<void> {
    let target: HTMLAnchorElement | null = null;
    for (const el of event.composedPath()) {
      if (el instanceof HTMLElement && el.tagName === "A") {
        target = el as HTMLAnchorElement;
        break;
      }
    }

    if (target && target.href && !target.hasAttribute("download")) {
      event.preventDefault();
      sessionStorage.setItem("previousUrl", "");
      const url = new URL(target.href);
      const path = url.pathname;
      window.history.pushState({}, "", path);
      this.currentRoute = this.determineRouteName();
      this.requestUpdate();
    }
  }

  protected override update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    if (this.currentRoute != null && changedProperties.has("currentRoute")) {
      const tagName = `zelt-template-${this.currentRoute.name.replace(/_/g, "-")}-page`;
      const pageElement = this.shadowRoot?.querySelector(tagName);
      const provider = pageElement as ZeltTemplateAbstractProvider;
      provider.load().then(() => provider.requestUpdate());
    }
  }

  private handleToastClose(): void {
    this.toastVisible = false;
    this.requestUpdate();
  }

  private handleSaveEvent(): void {
    this.saveIndicator.show();
  }
}
