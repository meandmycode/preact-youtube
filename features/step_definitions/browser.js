import { defineSupportCode } from 'cucumber';
import { By, util } from 'selenium-webdriver';

defineSupportCode(({ When }) => {

    When('I have a {string} screen size', function(deviceType) {

        const { driver, devices } = this;
        const { width, height } = devices[deviceType];

        driver.manage().window().setSize(width, height);

    });

    When('I navigate to the playlist {stringInDoubleQuotes}', function(playlistId) {

        const { driver, baseUri } = this;

        const playlistUri = `${baseUri}/p/${playlistId}`;

        console.log(playlistId)

        driver.get(playlistUri);

        const body = driver.findElement(By.css('body'));

        return body.then(body => {

            console.log(body);

        });

    });


});
