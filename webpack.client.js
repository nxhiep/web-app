const path = require('path');
const svgToMiniDataURI = require('mini-svg-data-uri');
module.exports = {

    // the root file
    entry: './src/index.js',

    //tell webpack where to put output file that is generated
    output : {
        filename : 'bundle.js',
        path : path.resolve(__dirname ,'public')
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
                    'style-loader'
                ]
            },
            {
                test: /\.s[ac]ss$/i,
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
    // tell webpack to run babel on every file it runs through

}