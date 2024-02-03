import { $ } from 'bun';

const CLIENT_ID = {
  test: 'e438a0e9-e289-4410-bd73-e9aa8a57e7b5',
};

const sharetribeSdk = require('sharetribe-flex-sdk');

const sdk = sharetribeSdk.createInstance({
  clientId: CLIENT_ID.test,
});

const SCHEMAS = {
  page: 'https://www.sharetribe.com/docs/824d710d491eb568e157eb53b980f3c6/page-asset-schema.json',
};

/*
 * Assets list
 */
const ASSETS = {
  content: {
    translations: 'content/translations.json',
  },
  design: {
    branding: 'design/branding.json',
    layout: 'design/layout.json',
  },
  general: {
    localization: 'general/localization.json',
  },
  integrations: {
    analytics: 'integrations/analytics.json',
    'google-search-console': 'integrations/google-search-console.json',
    map: 'integrations/map.json',
  },
  listings: {
    fields: 'listings/listing-fields.json',
    search: 'listings/listing-search.json',
    types: 'listings/listing-types.json',
  },
  page: pageId => `content/pages/${pageId}.json`,
  transactions: {
    'minimum-transaction-size': 'transactions/minimum-transaction-size.json',
  },
};

async function showAssets(paths) {
  await sdk
    .assetsByAlias({
      alias: 'latest',
      paths,
    })
    .then(res => console.log(JSON.stringify(res.data.data, null, 2)));
}

await showAssets([ASSETS.listings.fields, ASSETS.listings.search, ASSETS.listings.types]);
