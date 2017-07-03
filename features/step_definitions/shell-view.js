import { defineSupportCode } from 'cucumber';
import { eventually } from '../support/expectly';
import { ComponentView } from '../support/dom-components';

async function getShellComponent(driver) {

    const view = new ComponentView(driver);
    const shell = await view.one('shell');

    return await shell.parts();

}

defineSupportCode(({ When }) => {

    When('I click on the back link', eventually(async function() {

        const { driver } = this;

        const shell = await getShellComponent(driver);

        await shell.backlink.context.click();

    }));

});
