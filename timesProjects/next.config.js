const withStylus = require("@zeit/next-stylus");
module.exports = withStylus({
	/* config options here */
	pageExtensions: ["mdx", "jsx", "js", "ts", "tsx", "styl"],
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	webpack: (
		config,
		{ buildId, dev, isServer, defaultLoaders, webpack, pluginOptions }
	) => {
		// Note: we provide webpack above so you should not `require` it
		// Perform customizations to webpack config
		// Important: return the modified config
		config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//));
		// config.module.rules.push({
		// 	test: /\.styl/,
		// 	use: [
		// 		"style-loader",
		// 		"css-loader",
		// 		{
		// 			loader: "stylus-loader",
		// 		},
		// 	],
		// });
		return config;
	},
	webpackDevMiddleware: (config) => {
		// Perform customizations to webpack dev middleware config
		// Important: return the modified config
		return config;
	},
});
