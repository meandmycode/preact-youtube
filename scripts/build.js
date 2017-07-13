/* global process */
/* eslint-disable no-console, import/no-extraneous-dependencies */
import { writeFileSync } from 'fs';
import rimraf from 'rimraf';
import webpack from 'webpack';

import configure from '../webpack.config';

const appConfig = {
    youtubeKey: process.env.YOUTUBE_API_KEY,
};

const config = configure({ production: true, appConfig });

const statsOptions = {
    colors: true,
};

rimraf(config.output.path, err => {

    if (err) {

        console.error(err.stack || err);

        return process.exit(1);

    }

    webpack(config, (err, stats) => {

        const hasErrors = err != null || (stats && stats.hasErrors());

        if (err) {

            console.error(err.stack || err);

            if (err.details) console.error(err.details);

        }

        if (stats) process.stdout.write(stats.toString(statsOptions));

        if (hasErrors) {

            console.log('\n');
            console.log('✖️  Web application build failed!');
            console.log('\n');

            return process.exit(1);

        }

        console.log('\n');
        console.log('🌟  Web application build successful!');
        console.log('\n');

        writeFileSync('stats.json', JSON.stringify(stats.toJson()), null, 2);

    });

});
