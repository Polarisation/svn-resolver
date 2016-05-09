var tmp = require('tmp');
var SVN = require('node.svn');

module.exports = function resolver (bower) {
	return {
		match: function (source) {
			return source.indexOf('svn+https://') === 0
		},

		// no normalisation required
		locate: function (source) {
			return source;
		},

		releases: function (source) {
			return [];
		},

		fetch: function (endpoint, cached) {
			var svnRemoteUrl = endpoint.source.replace("svn+", "");
			if(endpoint.target === "trunk")
				svnRemoteUrl += "/trunk";
			else if(endpoint.target !== undefined)
				svnRemoteUrl += "/tags/"+endpoint.target;

			var tempDir = tmp.dirSync();

			var svnConfig = { cwd: tempDir.name };
			if(bower.config.svnResolver.password !== undefined)
				svnConfig["username"] = bower.config.svnResolver.username;
			if(bower.config.svnResolver.password !== undefined)
				svnConfig["password"] = bower.config.svnResolver.password;

			var svn = new SVN(svnConfig);

			return new Promise(function (resolve, reject) {
				svn.co(svnRemoteUrl, function (err, info) {
					if(err)
						reject("Error during SVN checkout: "+err);
					else resolve({
							tempPath: tempDir.name,
							removeIgnores: true
						});
				});
			});
		}
	}
}
