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

const getLeftHalf = function(id) {
    const node = document.getElementById(id);
    return { x: node.offsetLeft + node.offsetWidth / 4,
             y: node.offsetTop + node.offsetHeight / 2 }
}

const getRightHalf = function(id) {
    const node = document.getElementById(id);
    return { x: node.offsetLeft + (3 * node.offsetWidth / 4),
             y: node.offsetTop + node.offsetHeight / 2 }
}

const dispatchTouch = async (client, type, touchPoints) => {
    await client.send('Input.dispatchTouchEvent', { type, touchPoints });
}

describe('touch events', () => {
    let client;

    beforeEach(async () => { 
        await page.goto(PAGE_URL); 
        client = await browser.pageTarget(page).createCDPSession();
        await page.click('button#log')
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
        const { x, y } = await page.evaluate(getCenter, 'target1');
        await dispatchTouch(client, 'touchStart', [{ x, y }]);
        let color = await page.evaluate(getBgColor, 'target1');
        expect(color).toBe('rgb(255, 255, 0)');

        await dispatchTouch(client, 'touchEnd', []);
        color = await page.evaluate(getBgColor, 'target1');
        expect(color).toBe('rgb(255, 255, 255)');
    });

    it('swipe should change border style', async () => {
        const { x, y } = await page.evaluate(getCenter, 'target1');
        await dispatchTouch(client, 'touchStart', [{ x, y }]);
        let border = await page.evaluate(getBorderStyle, 'target1');
        expect(border).toBe('solid');

        await dispatchTouch(client, 'touchMove', [{ x: x-1, y }]);
        border = await page.evaluate(getBorderStyle, 'target1');
        expect(border).toBe('dashed');

        await dispatchTouch(client, 'touchEnd', []);
        border = await page.evaluate(getBorderStyle, 'target1');
        expect(border).toBe('solid');
    });

    it('2 taps should show pink', async () => {
        const { x: lx, y: ly } = await page.evaluate(getLeftHalf, 'target1');
        const { x: rx, y: ry } = await page.evaluate(getRightHalf, 'target1');
        await dispatchTouch(client, 'touchStart', [{ x: lx, y: ly }, { x: rx, y: ry }]);

        color = await page.evaluate(getBgColor, 'target1');
        expect(color).toBe('rgb(255, 192, 203)');
    });
})