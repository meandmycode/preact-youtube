import { By } from 'selenium-webdriver';

import { reduce } from './async';

export const byComponent = name => By.css(`[component=${name}]`);

export class Rectangle {

    constructor({ top, left, bottom, right }) {
        this.top = top;
        this.left = left;
        this.bottom = bottom;
        this.right = right;
    }

    intersects({ top, left, bottom, right }) {

        const isOutside =
            this.left > right ||
            this.right < left ||
            this.top > bottom ||
            this.bottom < top;

        return !isOutside;

    }
}

export class ComponentView {

    constructor(driver, element) {
        this.driver = driver;
        this.element = element;
        this.context = element ? element : driver;
    }

    async parts() {

        const selector = By.js(`return [...arguments[0].querySelectorAll('[part]')].filter(el => el.closest('[component]') === arguments[0])`, this.context);
        const elements = await this.driver.findElements(selector);

        const hash = await reduce(elements, async (hash, element) => {

            const key = await element.getAttribute('part');
            hash[key] = new PartView(this.driver, element);

            return hash;

        }, {});

        return hash;

    }

    async queryOne(selector) {
        return await this.context.findElement(By.css(selector));
    }

    async queryMany(selector) {
        return await Promise.all(await this.context.findElements(By.css(selector)));
    }

    async one(name) {

        const element = await this.context.findElement(byComponent(name));
        return new ComponentView(this.driver, element);

    }

    async many(name) {

        const elements = await Promise.all(await this.context.findElements(byComponent(name)));
        const components = elements.map(element => new ComponentView(this.driver, element));

        return components;

    }

    get(key) {
        return this.driver.executeScript('return arguments[0][arguments[1]]', this.context, key);
    }

    set(key, value) {
        return this.driver.executeScript('arguments[0][arguments[1]] = arguments[2]', this.context, key, value);
    }

    async bounds() {
        return new Rectangle(await this.driver.executeScript('return arguments[0].getBoundingClientRect()', this.element));
    }

    async viewport() {

        const { width, height } = await this.driver.executeScript('return { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight }');

        return new Rectangle({
            top: 0,
            left: 0,
            right: width,
            bottom: height,
        });

    }

}

export class PartView extends ComponentView {
}
