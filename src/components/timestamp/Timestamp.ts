import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";
import { getRelativeTime } from "../../utils/relativeTime";

const styles = css`
  :host {
  }
`;

@customElement("j-timestamp")
export default class Component extends LitElement {
  static styles = [sharedStyles, styles];

  /**
   * Value
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true }) value = "";

  /**
   * Locales
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true }) locales = "en";

  /**
   * Relative
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true }) relative = false;

  /**
   * Date style
   * @type {""|"full"|"long"|"medium"|"short"}
   * @attr
   */
  @property({ type: String, reflect: true }) dateStyle = "";

  /**
   * Timestyle
   * @type {""|"full"|"long"|"medium"|"short"}
   * @attr
   */
  @property({ type: String, reflect: true }) timeStyle = "";

  /**
   * Day period
   * @type {""|"narrow"|"short"|"long"}
   * @attr
   */
  @property({ type: String, reflect: true }) dayPeriod = "";

  /**
   * Hour cycle
   * @type {""|"h11"|"h12"|"h23"|"h24"}
   * @attr
   */
  @property({ type: String, reflect: true }) hourCycle = "";

  /**
   * Timezone
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true }) timeZone = "";

  /**
   * Weekday
   * @type {""|"long"|"short"|"narrow"}
   * @attr
   */
  @property({ type: String, reflect: true }) weekday = "";

  /**
   * Era
   * @type {""|"long"|"short"|"narrow"}
   * @attr
   */
  @property({ type: String, reflect: true }) era = "";

  /**
   * Year
   * @type {""|"numeric"|"2-digit"}
   * @attr
   */
  @property({ type: String, reflect: true }) year = "";

  /**
   * Month
   * @type {""|"numeric"|"2-digit"|"long"|"short"|"narrow"}
   * @attr
   */
  @property({ type: String, reflect: true }) month = "";

  /**
   * Day
   * @type {""|"numeric"|"2-digit"}
   * @attr
   */
  @property({ type: String, reflect: true }) day = "";

  /**
   * Hour
   * @type {""|"numeric"|"2-digit"}
   * @attr
   */
  @property({ type: String, reflect: true }) hour = "";

  /**
   * Minute
   * @type {""|"numeric"|"2-digit"}
   * @attr
   */
  @property({ type: String, reflect: true }) minute = "";

  /**
   * Second
   * @type {""|"numeric"|"2-digit"}
   * @attr
   */
  @property({ type: String, reflect: true }) second = "";

  get options(): DateTimeFormatOptions {
    if (this.dateStyle) {
      return {
        dateStyle: this.dateStyle,
        ...(this.timeStyle && { timeStyle: this.timeStyle }),
      };
    }

    return {
      ...(this.dayPeriod && { dayPeriod: this.dayPeriod }),
      ...(this.timeZone && { timeZone: this.timeZone }),
      ...(this.weekday && { weekday: this.weekday }),
      ...(this.era && { era: this.era }),
      ...(this.year && { year: this.year }),
      ...(this.month && { month: this.month }),
      ...(this.day && { day: this.day }),
      ...(this.second && { second: this.second }),
      ...(this.hour && { hour: this.hour }),
      ...(this.minute && { minute: this.minute }),
      ...(this.hourCycle && { hourCycle: this.hourCycle }),
    };
  }

  get formattedTime() {
    if (this.relative) {
      const rtf = new Intl.RelativeTimeFormat(this.locales, this.options);
      return getRelativeTime(new Date(this.value), new Date(), rtf);
    } else {
      return new Intl.DateTimeFormat(this.locales, this.options).format(
        new Date(this.value)
      );
    }
  }

  render() {
    return html`<span>${this.formattedTime}</span>`;
  }
}
