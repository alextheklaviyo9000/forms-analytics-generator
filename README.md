# Form Analytics Generator

## Setup

1. Clone repo
2. `npm install` to install Playwright, it's dependencies, and the project dependencies
3. Update the `FormPage` constructor as needed with:
    - Your site address
    - The `Locator` for your submit button on the form
    - The `Locator` for your email input field on the form
    - The `formId` for your Form so Playwright can find it on screen
    - The `submitMap` to allow you to adjust the distribution of submits across variations
  

## Execution

1. Run `npx playwright test non-shopify.spec.ts`
2. Optionally add `--ui` to the above to see the tests run, but this will run more slowly, but helpful for debugging
3. Optionally adjust the `timeout` in `playwright.config.ts` from it's default of 480 seconds
