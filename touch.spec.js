const PAGE_URL = 'https://mdn.github.io/dom-examples/touchevents/Multi-touch_interaction.html';

const getBgColor = function(id) {
    const style = window.getComputedStyle(document.getElementById(id));
    return style.getPropertyValue('background-color');
}

describe('touch events', () => {
    beforeAll(async () => { await page.goto(PAGE_URL); });

    afterAll(async () => { await browser.close(); })

    it('page should be titled "Touch Events tutorial"', async () => {
        expect(await page.title()).toBe("Touch Events tutorial");
    });

    it('click should not change target color', async () => {
        const color = await page.evaluate(getBgColor, 'target1');
        expect(color).toBe('rgb(255, 255, 255)');
        await page.click('#target1');
    });

    fit('tap should change target color', async () => {
        // browser is chromium
        const client = await browser.pageTarget(page).createCDPSession();

        await page.click('button#log');

        const { x, y } = await page.evaluate(function() {
            const node = document.getElementById('target1');
            return { x: node.offsetLeft + node.offsetWidth / 2,
                     y: node.offsetTop + node.offsetHeight / 2 }
        });
        await client.send('Input.dispatchTouchEvent', {
            type: 'touchStart',
            touchPoints: [{ x, y }]
        });
        let color = await page.evaluate(getBgColor, 'target1');
        expect(color).toBe('rgb(255, 255, 0)');

        await client.send('Input.dispatchTouchEvent', {
            type: 'touchEnd',
            touchPoints: []
        });
        color = await page.evaluate(getBgColor, 'target1');
        expect(color).toBe('rgb(255, 255, 255)');
    });
})