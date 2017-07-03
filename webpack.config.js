/* global __dirname */
import path from 'path';
import { DefinePlugin, NamedModulesPlugin, optimize } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

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

        babelConfig.plugins.push(
            ['istanbul', { exclude: ['node_modules'] }],
        );

    }

    const rules = [
        {   // js pipeline
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: babelConfig,
            },
        },
        {   // css pipeline
            test: /\.css$/,
            use: extractCss.extract({
                use: ['css-loader?modules=true&importLoaders=1&localIdentName=[hash:base64:5]', 'postcss-loader'],
            }),
        },
        {   // other assets
            test: /\.(jpe?g|png|gif|svg|eot|ttf|woff|woff2)$/,
            use: `file-loader?name=${ASSET_NAME_TEMPLATE}`,
        },
    ];

    const plugins = [

        new HtmlWebpackPlugin({
            template: './index.ejs',
            minify: { collapseWhitespace: true },
        }),

        new DefinePlugin({
            'YOUTUBE_API_KEY': JSON.stringify(appConfig.youtubeKey),
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
            new CommonsChunkPlugin({
                name: 'vendor',
                minChunks: ({ resource }) => /node_modules/.test(resource),
            }),
            new UglifyJsPlugin(),
        );

    } else {

        plugins.push(
            new NamedModulesPlugin(),
        );

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
