var tmp = require('tmp');
var SVN = require('node.svn');
var run = require('gulp-run');

module.exports = function resolver (bower) {
	return {
		match: function (source) {
			return source.indexOf('svn+https://') === 0 
				|| source.indexOf('svn+http://') === 0;
		},

		// no normalisation required
		locate: function (source) {
			return source;
		},

		// returns a release corresponding to the last changed revision of the trunk
		// e.g. if the last change was revision 12345, this is translated to the semantic version 12345.0.0
		// this allows `bower update` to install the newest version from trunk
		releases: function (source) {
			var svnRemoteUrl = source.replace("svn+", "");
			var tempDir = tmp.dirSync();

			var svnConfig = { cwd: tempDir.name };
			if(bower.config.svnResolver !== undefined) {
				if(bower.config.svnResolver.password !== undefined)
					svnConfig["username"] = bower.config.svnResolver.username;
				if(bower.config.svnResolver && bower.config.svnResolver.password !== undefined)
					svnConfig["password"] = bower.config.svnResolver.password;
			}

			var svn = new SVN(svnConfig);
			return new Promise(function(resolve, reject) {
				svn.info(svnRemoteUrl, function(err, svnInfo) {
					if(err)
						reject("Error during SVN info: "+err);
					else {
						var semVar = svnInfo.lastchangedrev+".0.0";
						resolve([ { target: semVar, version: semVar } ]);
					}
				});
			});
		},

		fetch: function (endpoint, cached) {
			var svnRemoteUrl = endpoint.source.replace("svn+", "");
			if(endpoint.target === "trunk")
				svnRemoteUrl += "/trunk";
			else if(endpoint.target === "-no-trunk")
				svnRemoteUrl += ""; // don't append trunk directory
			else if(endpoint.target.match(/^([1-9][0-9]*)\.0\.0$/)) {
				var svnRevision = endpoint.target.replace(".0.0", "");
				svnRemoteUrl += "/trunk@"+svnRevision;
			} else if(endpoint.target.match(/^r([1-9][0-9]*)-no-trunk$/)) {
				var svnRevision = endpoint.target.replace("-no-trunk","").replace("r","");
				svnRemoteUrl += "/@"+svnRevision;
			} else if(endpoint.target.match(/^r([1-9][0-9]*)$/)) {
				var svnRevision = endpoint.target.replace("r","");
				svnRemoteUrl += "/trunk@"+svnRevision;
			} else if(endpoint.target !== undefined)
				svnRemoteUrl += "/tags/"+endpoint.target;

			var tempDir = tmp.dirSync();

			var svnConfig = { cwd: tempDir.name };
			if(bower.config.svnResolver !== undefined) {
				if(bower.config.svnResolver.password !== undefined)
					svnConfig["username"] = bower.config.svnResolver.username;
				if(bower.config.svnResolver && bower.config.svnResolver.password !== undefined)
					svnConfig["password"] = bower.config.svnResolver.password;
			}

			var svn = new SVN(svnConfig);

			return new Promise(function (resolve, reject) {
				svn.co(svnRemoteUrl, function (err, info) {
					if(err)
						reject("Error during SVN checkout: "+err);
					else {
						
						if ('win32' !== process.platform) {
							run('chmod -R +X '+ tempDir.name).exec();
						}
						
						resolve({
							tempPath: tempDir.name,
							removeIgnores: true
						});
					}
				});
			});
		}
	}
}
