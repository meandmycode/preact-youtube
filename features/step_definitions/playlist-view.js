import { defineSupportCode } from 'cucumber';
import { By } from 'selenium-webdriver';

const byComponent = name => By.css(`:not([component=${name}]) [component=${name}]`);

async function reduce(source, reducer, seed) {

    let last = seed;
    let i = 0;

    for (const item of source) {
        last = await reducer(last, item, i++);
    }

    return last;

}

class ComponentView {

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

    async one(name) {

        const element = await this.context.findElement(byComponent(name));
        return new ComponentView(element);

    }

    async many(name) {

        const elements = await this.context.findElements(byComponent(name));
        const components = elements.map(element => new ComponentView(element));

        return components;

    }

}

class PartView extends ComponentView {
}

async function getVideosViaDOM(driver) {

    const view = new ComponentView(driver);
    const videoComponents = await Promise.all(await view.many('video'));

    const descriptors = videoComponents.map(async videoComponent => {

        const parts = await videoComponent.parts();

        const title = await parts.title.context.getText();
        const published = await parts.published.context.getText();
        const summary = await parts.description.context.getText();
        const thumbnail = await parts.thumbnail.context.getAttribute('src');

        return {
            title,
            published,
            summary,
            thumbnail,
        };

    });

    return await Promise.all(descriptors);

}

defineSupportCode(({ When }) => {

    When('I see a list of videos:', async function(videos) {

        const { driver } = this;

        const expected = videos.hashes();
        const actual = await getVideosViaDOM(driver);

        actual.should.equal(expected);

    });

});
