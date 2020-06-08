const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';

const jsLoaders = () => {
    const loaders = [
        {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
            },
        },
    ];
    if (!isProd) {
        loaders.push('eslint-loader');
    }
    return loaders;
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: ['@babel/polyfill', './index.js'],
    output: {
        filename: isProd ? 'bundle.[hash].js' : 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@core': path.resolve(__dirname, 'src'),
        },
    },
    devServer: {
        port: 3000,
        hot: !isProd,
        inline: true,
    },
    devtool: isProd ? false : 'source-map',
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html',
            minify: {
                removeComments: isProd,
                collapseWhitespace: isProd,
            },
        }),
        new MiniCssExtractPlugin({
            filename: isProd ? 'bundle.[hash].css' : 'bundle.css',
        }),
        new FaviconsWebpackPlugin({
            logo: './img/logo.png',
            publicPath: './',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: !isProd,
                            reloadAll: true,
                        },
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders(),
            },
        ],
    },
};
