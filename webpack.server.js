const path = require('path');
const nodeExternals = require('webpack-node-externals');
const svgToMiniDataURI = require('mini-svg-data-uri');
module.exports = {
    // the root file
    target: "node",
    entry: './src/server.js',

    //tell webpack where to put output file that is generated
    output: {
        filename: 'bundle.js',
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
                test: /\.css$/,
                use: [
                    'css-loader',
                    'file-loader'
                ]
            },
            {
                test: /\.svg$/i,
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
                use: [
                    // Creates `style` nodes from JS strings
                    'file-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    'sass-loader',
                    // Compiles Sass to CSS
                    // {
                    //     loader: 'sass-loader',
                    //     options: {
                    //         name: 'assets/[hash].[ext]',
                    //     }
                    // }
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/[hash].[ext]',
                        }
                    },
                ],
            },
            // {
            //     test: /\.(woff|woff2|eot|ttf|otf)$/,
            //     use: [
            //         {
            //             loader: 'file-loader',
            //             options: {
            //                 name: 'assets/[name].[ext]',
            //                 esModule: true
            //             }
            //         }
            //     ],
            // },
        ]
    },
    externals: [nodeExternals()]

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    // tell webpack to run babel on every file it runs through
}