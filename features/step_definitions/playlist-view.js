import { defineSupportCode } from 'cucumber';
import { eventually } from '../support/expectly';
import { ComponentView } from '../support/dom-components';

import { find } from '../support/async';

async function getVideoComponents(driver) {

    const view = new ComponentView(driver);
    const videos = (await view.many('video')).map(videoComponent => videoComponent.parts());

    return await Promise.all(videos);

}

async function getVideosViaDOM(driver) {

    const view = new ComponentView(driver);
    const videoComponents = await view.many('video');

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

async function getPlaylistComponent(driver) {

    const view = new ComponentView(driver);

    const playlist = await view.one('playlist');

    const scrollingContainer = await playlist.queryOne('[data-scrolling-container]');

    return {
        scrollingContainer,
    };

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

        await driver.executeScript('arguments[0].scrollTop = arguments[1]', playlist.scrollingContainer, top);

    }));

    Then('I see the playlist scroll position is {int}px', eventually(async function(top) {

        const { driver } = this;

        const playlist = await getPlaylistComponent(driver);

        const actual = await driver.executeScript('return arguments[0].scrollTop', playlist.scrollingContainer);

        actual.should.equal(top);

    }));

});
