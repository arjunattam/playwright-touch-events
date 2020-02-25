const PAGE_URL = 'https://mdn.github.io/dom-examples/touchevents/Multi-touch_interaction.html';

describe('touch events', () => {
    beforeAll(async () => {
        await page.goto(PAGE_URL);
    });

    it('should be titled "Touch Events tutorial"', async () => {
        expect(await page.title(), "Touch Events tutorial");
    });
})