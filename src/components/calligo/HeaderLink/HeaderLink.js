import { default as NamedLink } from '../../NamedLink/NamedLink';
import { FormattedMessage } from '../../../util/reactIntl';

/**
 * HeaderLink component
 *
 * Renders a link with internationalized text for the header.
 *
 * @param {object} props - The properties for the HeaderLink component.
 * @param {string} props.id - The unique identifier for the link, used for CSS classes and internationalization keys.
 * @param {string} props.routeName - The name of the route to link to (unused, consider removing if not needed).
 * @param {object} props.params - The parameters for the route.
 * @param {object} props.css - An object containing CSS class names, indexed by link identifiers.
 * @returns {JSX.Element} The HeaderLink component.
 */
const HeaderLink = ({ id, routeName, params, css }) => {
  return (
    <NamedLink className={css[`${id}Link`]} name={routeName} params={params}>
      <span className={css[id]}>
        <FormattedMessage id={`NavLink.${id}`} />
      </span>
    </NamedLink>
  );
};

/**
 * Creates an array of HeaderLink components for the given pages array.
 *
 * The pages array can contain either:
 * - Page IDs as strings, which are treated as the `pageId` parameter of the `CMSPage` route.
 * - Page objects, which must include:
 *    - `id` (string): The unique identifier for the page.
 *    - `routeName` (string): The name of the route to link to.
 *    - `params` (Object, optional): Any additional route parameters.
 *
 * @param {Array.<string|{id: string, routeName: string, params?: Object}>} pages -
 *        A list of page identifiers or page objects with details for creating header links.
 *
 * @returns {Array.<HeaderLink>} An array of HeaderLink React elements
 *
 * @throws {Error} If an item in the pages array is an object but missing the required `id` or `routeName` property
 *
 * @example
 * ```js
 * createHeaderLinks([
 *   'page-1',
 *   {id: 'page-2', routeName: 'PageRoute', params: {slug: 'page-2'}},
 * ], cssModule)
 * ```
 */
export function createHeaderLinks(pages, css) {
  return pages.map((page, i) => {
    if (typeof page === 'string') {
      // page is a string id, treat as the pageId param of the CMSPage route
      return <HeaderLink id={page} routeName="CMSPage" params={{ pageId: page }} css={css} />;
    } else {
      // page is an object, expect it to have an id and routeName
      const { id, routeName, params } = page;

      if (id && routeName) {
        return <HeaderLink id={id} routeName={routeName} params={params} css={css} />;
      } else {
        throw new Error(
          `Each page in the array must either be a string with the page id or an object with id, routeName, and (optionally) params.
            The item ${i + 1} is missing the params: ` +
            (id ? '' : 'id ') +
            (routeName ? '' : 'routeName ')
        );
      }
    }
  });
}

export default HeaderLink;
