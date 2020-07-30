const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin'); 
const svgToMiniDataURI = require('mini-svg-data-uri');
module.exports = {

    // the root file
    entry: './src/index.js',

    //tell webpack where to put output file that is generated
    output : {
        filename : 'bundle.js',
        path : path.resolve(__dirname,'public')
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    'css-loader',
                    'style-loader'
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
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
        ]
    },
    plugins: [new HtmlWebpackPlugin()]
    // tell webpack to run babel on every file it runs through

}