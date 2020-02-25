const PAGE_URL = 'https://mdn.github.io/dom-examples/touchevents/Multi-touch_interaction.html';

const getBgColor = function(id) {
    const style = window.getComputedStyle(document.getElementById(id));
    return style.getPropertyValue('background-color');
}

const getBorderStyle = function(id) {
    const style = window.getComputedStyle(document.getElementById(id));
    return style.getPropertyValue('border-top-style');
}

const getCenter = function(id) {
    const node = document.getElementById(id);
    return { x: node.offsetLeft + node.offsetWidth / 2,
             y: node.offsetTop + node.offsetHeight / 2 }
}

describe('touch events', () => {
    let client;

    beforeAll(async () => { 
        await page.goto(PAGE_URL); 
        client = await browser.pageTarget(page).createCDPSession();
    });

    afterAll(async () => { await browser.close(); })

    it('page should be titled "Touch Events tutorial"', async () => {
        expect(await page.title()).toBe("Touch Events tutorial");
    });

    it('click should not change target color', async () => {
        const color = await page.evaluate(getBgColor, 'target1');
        expect(color).toBe('rgb(255, 255, 255)');
        await page.click('#target1');
    });

    it('tap should change target color', async () => {
        // await page.click('button#log');
        const { x, y } = await page.evaluate(getCenter, 'target1');
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

    it('swipe should change border style', async () => {
        const { x, y } = await page.evaluate(getCenter, 'target1');
        await client.send('Input.dispatchTouchEvent', {
            type: 'touchStart',
            touchPoints: [{ x, y }]
        });
        let border = await page.evaluate(getBorderStyle, 'target1');
        expect(border).toBe('solid');

        await client.send('Input.dispatchTouchEvent', {
            type: 'touchMove',
            touchPoints: [{ x: x-1, y }]
        });
        border = await page.evaluate(getBorderStyle, 'target1');
        expect(border).toBe('dashed');

        await client.send('Input.dispatchTouchEvent', {
            type: 'touchEnd',
            touchPoints: []
        });
        border = await page.evaluate(getBorderStyle, 'target1');
        expect(border).toBe('solid');
    });
})