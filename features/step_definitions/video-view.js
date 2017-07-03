import { defineSupportCode } from 'cucumber';
import { eventually } from '../support/expectly';
import { ComponentView } from '../support/dom-components';

async function getVideoViaDOM(driver) {

    const view = new ComponentView(driver);
    const video = await view.one('video');

    const parts = await video.parts();

    const title = await parts.title.context.getText();
    const published = await parts.published.context.getText();
    const summary = await parts.description.context.getText();
    const embed = await parts.embed.context.getAttribute('src');

    return {
        embed,
        title,
        published,
        summary,
    };

}

const getExpectation = ({ id, published: publishDate, ...etc }) => {

    const published = `Published on ${publishDate}`;
    const embed = `https://www.youtube.com/embed/${id}`;

    return { published, embed, ...etc };

};

defineSupportCode(({ Then }) => {

    Then('I see the video:', eventually(async function(video) {

        const { driver } = this;

        const expected = getExpectation(video.rowsHash());

        const actual = await getVideoViaDOM(driver);

        actual.should.eql(expected);

    }));

});
