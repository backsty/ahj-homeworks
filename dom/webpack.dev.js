import { merge } from 'webpack-merge';
import webpack from 'webpack';
import baseConfig from './webpack.config.js';

export default merge(baseConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        open: true,
        hot: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
});