import { By } from 'selenium-webdriver';

import { reduce } from './async';

export const byComponent = name => By.css(`:not([component=${name}]) [component=${name}]`);


export class ComponentView {

    constructor(context) {
        this.context = context;
    }

    async parts() {

        const elements = await this.context.findElements(By.css(':not([component]) [part]'));

        const hash = await reduce(elements, async (hash, element) => {

            const key = await element.getAttribute('part');
            hash[key] = new PartView(element);

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
        return new ComponentView(element);

    }

    async many(name) {

        const elements = await Promise.all(await this.context.findElements(byComponent(name)));
        const components = elements.map(element => new ComponentView(element));

        return components;

    }

}

export class PartView extends ComponentView {
}
