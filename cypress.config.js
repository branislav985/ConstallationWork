const { defineConfig } = require('cypress');

module.exports = defineConfig({
	watchForFileChanges: false,
	defaultCommandTimeout: 5000,
	viewportHeight: 1920,
	viewportWidth: 1440,
	chromeWebSecurity: false,
	e2e: {
		BaseUrl: 'https://constel-social-network.vercel.app',
		experimentalRunAllSpecs: true,
		exprimentalSessionAndOrigin: true,
		// We've imported your old cypress plugins here.
		// You may want to clean this up later by importing these.
		setupNodeEvents(on, config) {
			const data = {};
			// `on` is used to hook into various events Cypress emits
			// `config` is the resolved Cypress config
			on('task', {
				save(object) {
					data[object.index] = object.value;
					return null;
				},
				load(index) {
					return data[index] || null;
				},
			});
		},
	},
});
