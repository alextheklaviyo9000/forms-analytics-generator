import { test, expect, Page, Locator, BrowserContext } from "@playwright/test";

import { faker } from "@faker-js/faker";

class FormPage {
  private readonly form: Locator;
  private readonly submitButton: Locator;
  private readonly emailInput: Locator;
  private readonly url: string;
  private readonly formId: string;
  private readonly storageStateId: string;

  constructor(
    public readonly page: Page,
    public readonly context: BrowserContext
  ) {
    this.storageStateId = "klaviyoOnsite";
    this.emailInput = this.page.getByPlaceholder("Email");
    this.submitButton = this.page.getByRole("button", { name: "Unlock Offer" });
    this.formId = "V55pmx";
    this.form = page.getByTestId(`klaviyo-form-${this.formId}`);
    this.url = "http://localhost:4321";
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async isFormVisible() {
    return this.form.isVisible();
  }

  async scroll(): Promise<boolean> {
    await this.page.mouse.wheel(0, 1500);
    return this.form.isVisible();
  }

  async exit(): Promise<boolean> {
    await this.page.mouse.move(800, 800);
    await this.page.mouse.move(-1, -1, { steps: 50 });
    return this.form.isVisible();
  }

  async wait(): Promise<boolean> {
    await this.form.waitFor({ timeout: 480000 });
    return this.form.isVisible();
  }

  async variation() {
    const storageState = await this.context.storageState();
    const klaviyoLocalStorage = storageState?.origins[0]?.localStorage?.find(
      (item) => item.name === this.storageStateId
    );
    if (klaviyoLocalStorage) {
      return JSON.parse(klaviyoLocalStorage.value).viewedForms.modal
        .viewedForms[this.formId];
    }
  }

  async submit() {
    const variationId = await this.variation();
    expect(variationId).toBeTruthy();
    if (this.shouldSubmit({ variationId })) {
      await this.emailInput.fill(faker.internet.email());
      await this.submitButton.click();
    }
  }

  submitMap = {
    "12034407": 0.2,
    "12034408": 0.8,
  };

  shouldSubmit = ({ variationId }: { variationId: string }) => {
    return Math.random() < this.submitMap[variationId];
  };
}

const iterations = Array.from({ length: 100 }, (e, i) => i + 1);

test.describe.configure({ mode: "parallel" });

for (const iteration of iterations) {
  test(`should display the sign up popup form #1, iteration #${iteration}`, async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const formPage = new FormPage(page, context);
    await formPage.goto();

    expect(
      (await formPage.scroll()) ||
        (await formPage.exit()) ||
        (await formPage.wait())
    ).toBe(true);

    await formPage.submit();
  });
}
