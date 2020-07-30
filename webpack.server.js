const path = require('path');
const nodeExternals = require('webpack-node-externals');
const svgToMiniDataURI = require('mini-svg-data-uri');
module.exports = {
    // the root file
    target: "node",
    entry: './index.js',
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, 'build')
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.svg$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            generator: (content) => svgToMiniDataURI(content.toString()),
                        },
                    },
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
                use: [
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/[hash].[ext]',
                        }
                    },
                ],
            },
        ]
    },
    externals: [nodeExternals()]

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    // tell webpack to run babel on every file it runs through
}