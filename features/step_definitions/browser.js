import { defineSupportCode } from 'cucumber';
// import { By, util } from 'selenium-webdriver';

defineSupportCode(({ When }) => {

    When('I have a {string} screen size', function(deviceType) {

        const { driver, devices } = this;
        const { width, height } = devices[deviceType];

        driver.manage().window().setSize(width, height);

    });

    When('I navigate to the playlist {stringInDoubleQuotes}', { timeout: -1 }, async function(playlistId) {

        const { driver, baseUri } = this;

        const playlistUri = `${baseUri}/p/${playlistId}`;

        await driver.get(playlistUri);

        // const body = await driver.findElement(By.css('body')).getText();

        // console.log(body);

        await new Promise(resolve => setTimeout(resolve, 50000));

    });


});
