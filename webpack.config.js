/* global __dirname */
import path from 'path';
import { DefinePlugin, NamedModulesPlugin, optimize } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';

const { UglifyJsPlugin, CommonsChunkPlugin } = optimize;

export default ({ production, coverage, appConfig } = {}) => {

    const outputPath = 'dist';
    const ASSET_NAME_TEMPLATE = '[name]-[hash:6].[ext]';

    const extractCss = new ExtractTextPlugin({
        filename: ASSET_NAME_TEMPLATE.replace('[ext]', 'css'),
    });

    const babelConfig = {
        compact: false,
        plugins: [],
    };

    // when running a coverage build we want to add the istanbul transform to add in instrumentation

    if (coverage) {
        babelConfig.plugins.push(['istanbul', { exclude: ['node_modules'] }]);
    }

    const rules = [
        {
            // js pipeline
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: babelConfig,
            },
        },
        {
            // css pipeline
            test: /\.css$/,
            use: extractCss.extract({
                use: [
                    'css-loader?modules=true&importLoaders=1&localIdentName=[hash:base64:5]',
                    'postcss-loader',
                ],
            }),
        },
        {
            // other assets
            test: /\.(jpe?g|png|gif|svg|eot|ttf|woff|woff2)$/,
            use: `file-loader?name=${ASSET_NAME_TEMPLATE}`,
        },
    ];

    const pwaManifest = new WebpackPwaManifest({
        name: 'Ultra rare youtube app',
        short_name: 'PreactTube',
        description: 'The rarest of youtube apps',
        background_color: '#eee',
        theme_color: '#673ab8',
        display: 'standalone',
        start_url: '/',
        icons: [{
            src: path.resolve('meta/icon.png'),
            sizes: [96, 128, 192, 256, 384, 512],
        }],

        inject: false,
    });

    const plugins = [

        new DefinePlugin({
            YOUTUBE_API_KEY: JSON.stringify(appConfig.youtubeKey),
        }),

        pwaManifest,

        new HtmlWebpackPlugin({
            template: './index.ejs',
            minify: { collapseWhitespace: true },
            manifest: pwaManifest.options,
        }),

        extractCss,
    ];

    if (production) {
        plugins.push(
            new DefinePlugin({
                'process.env': {
                    NODE_ENV: 'production',
                },
            }),
            new UglifyJsPlugin(),
        );
    } else {
        plugins.push(new NamedModulesPlugin());
    }

    return {
        context: path.resolve(__dirname, 'src'),

        entry: './index.js',

        module: {
            rules,
        },

        plugins,

        output: {
            publicPath: '/',
            path: path.resolve(outputPath),
            filename: ASSET_NAME_TEMPLATE.replace('[ext]', 'js'),
            chunkFilename: '[name]-[chunkhash].js',
        },

        resolve: {
            modules: ['node_modules'],
        },

        devtool: 'source-map',
    };
};
