declare global {
  interface Window {
    dev: Dev; // Add the 'dev' property to the Window interface
  }
}

interface Dev {
  history: Array<{ action: string; data: HTMLElement }>;
  record: (action: string, data: HTMLElement) => void;
  undo: () => void;
  watch: () => void;
}

const dev: Dev = {
  history: [],

  record(action: string, data: HTMLElement): void {
    window.dev.history.push({
      action,
      data,
    });
  },

  undo(): void {
    const lastAction = window.dev.history.pop();
    if (lastAction?.action === 'created') {
      lastAction.data.remove();
    }
  },

  watch(): void {
    const app = window['app'];
    const logo = window['logo'];
    const history = window.dev.history;
    console.dir({ app, logo, history });
  },
};

window['dev'] = dev;

const $ = (selector: string): HTMLElement | null =>
  document.querySelector(selector);
const $$ = (selector: string): NodeListOf<Element> | null =>
  document.querySelectorAll(selector);

function copyCss(from: string, to: string, props: string[]): void {
  const fromEl = $(from);
  const toEl = $(to);

  if (!fromEl) {
    console.error(`Element ${from} not found.`);
    return;
  }

  if (!toEl) {
    console.error(`Element ${to} not found.`);
    return;
  }

  const fromStyle = window.getComputedStyle(fromEl);

  props.forEach((prop) => {
    (toEl as HTMLElement).style[prop as any] = fromStyle[prop as any];
  });
}

const navLinkClass = $('nav a:last-child')?.className || '';
const navLinkInnerClass = $('nav a:last-child > span')?.className || '';

function NavLink(url: string, text: string): string {
  return `
    <a href="${url}" class="${navLinkClass} nav-link">
      <span class='${navLinkInnerClass}'>
        <span>${text}</span>
      </span>
    </a>`;
}

function htmlToFragment(html: string): DocumentFragment {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content.cloneNode(true) as DocumentFragment;
}

function el(elementHtml: string): ChildNode | null {
  const template = document.createElement('template');
  template.innerHTML = elementHtml;
  return template.content.firstElementChild?.cloneNode(true) as ChildNode | null;
}

const positionAliases: Record<string, InsertPosition> = {
  before: 'beforebegin',
  after: 'afterend',
  start: 'afterbegin',
  end: 'beforeend',
};

// We are updating `AtFunction` type to ensure compatibility with the expected function signature for `insertFn`.
type AtFunction = (node: Element | string) => (inserted: Element) => void;

function at(pos: InsertPosition): AtFunction {
  return (node: Element | string): ((inserted: Element) => void) => {
    return (inserted: Element): void => {
      findEl(node).insertAdjacentElement(pos, inserted);
    };
  };
}

const before: AtFunction = at(positionAliases['before']);
const after: AtFunction = at(positionAliases['after']);
const start: AtFunction = at(positionAliases['start']);
const end: AtFunction = at(positionAliases['end']);

function findEl(el: Element | string): Element {
  if (el instanceof Element) {
    return el;
  }

  const found = $(el);

  if (found instanceof Element) {
    return found;
  }

  throw new Error(`Element ${el} not found or is not an HTMLElement`);
}

function insert(node: Node, where: (inserted: Element) => void): void {
  if (!node || !(node instanceof Node)) {
    throw new Error(
      'You must pass a valid Node to insert as the first argument.',
    );
  }

  where(findEl(node as HTMLElement));
}

function addNavLink(
  url: string,
  text: string,
  insertFn?: (inserted: Element) => void,
): Element | null {
  const nav = $('nav');
  if (!nav) {
    throw new Error('Navigation element not found');
  }

  const newLink = el(NavLink(url, text));
  if (!newLink) {
    throw new Error('Unable to create new link element');
  }

  if (typeof insertFn === 'function') {
    insertFn(newLink as HTMLElement);
  } else {
    nav.appendChild(newLink);
  }

  dev.record('created', newLink as HTMLElement);
  return newLink as Element;
}

document.onload = () => {
  const leftNav = el('<div id="left-nav"></div>');
  if (!leftNav) {
    throw new Error('Unable to create left navigation element');
  }

  const logo = $('nav a[href="/"]');
  if (!logo) {
    throw new Error('Logo element not found');
  }

  insert(leftNav, after(logo));

  copyCss('nav form', '#left-nav', ['borderLeft']);

  addNavLink(
    'https://www.calligo.com.br/manifesto',
    'Nosso Propósito',
    start($('#left-nav') as HTMLElement),
  );
};
export {};
