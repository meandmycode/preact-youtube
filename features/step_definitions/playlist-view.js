import { defineSupportCode } from 'cucumber';
import { eventually } from '../support/expectly';
import { ComponentView } from '../support/dom-components';

import { find, filter } from '../support/async';

async function getVideoComponents(driver) {

    const view = new ComponentView(driver);
    const videos = (await view.many('video')).map(videoComponent => videoComponent.parts());

    return await Promise.all(videos);

}

async function getVideosViaDOM(driver) {

    const view = new ComponentView(driver);
    const viewport = await view.viewport();

    const videoComponents = await view.many('video');

    const visibleVideoComponents = await filter(videoComponents, async videoComponent => viewport.intersects(await videoComponent.bounds()));

    const descriptors = visibleVideoComponents.map(async videoComponent => {

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

async function getPlaylistComponent(driver) {

    const view = new ComponentView(driver);

    const playlist = await view.one('playlist');

    return await playlist.parts();

}

const getExpectationsFromSummaries = summaries => summaries.map(({ thumbnail: filename, published: publishDate, ...etc }) => {

    const published = `Published on ${publishDate}`;
    const thumbnail = `https://fake-static-domain/${filename}`;

    return { published, thumbnail, ...etc };

});

defineSupportCode(({ Then, When }) => {

    Then('I see a list of videos:', eventually(async function(videos) {

        const { driver } = this;

        const expected = getExpectationsFromSummaries(videos.hashes());

        const actual = await getVideosViaDOM(driver);

        actual.should.eql(expected);

    }));

    When('I click on the video title {stringInDoubleQuotes}', eventually(async function(videoName) {

        const { driver } = this;

        const videos = await getVideoComponents(driver);

        const video = await find(videos, async video => {

            const title = await video.title.context.getText();

            return title.trim() === videoName;

        });

        await video.title.context.click();

    }));

    When('I wait', { timeout: -1 }, () => new Promise(resolve => setTimeout(resolve, 100000)));

    When('I click on the video thumbnail with the title {stringInDoubleQuotes}', eventually(async function(videoName) {

        const { driver } = this;

        const videos = await getVideoComponents(driver);

        const video = await find(videos, async video => {

            const thumbnail = await video.thumbnail.context.getAttribute('title');

            return thumbnail.trim() === videoName;

        });

        await video.thumbnail.context.click();

    }));

    When('I scroll the playlist by {int}px', eventually(async function(top) {

        const { driver } = this;

        const playlist = await getPlaylistComponent(driver);

        await playlist.items.set('scrollTop', top);

    }));

    Then('I see the playlist scroll position is {int}px', eventually(async function(top) {

        const { driver } = this;

        const playlist = await getPlaylistComponent(driver);

        const actual = await playlist.items.get('scrollTop');

        actual.should.equal(top);

    }));

});
