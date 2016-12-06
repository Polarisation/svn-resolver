# svn-resolver
SVN [pluggable resolver](http://bower.io/docs/pluggable-resolvers/) for Bower. Bower has some support for SVN, but this resolver overrides the default to provide enhanced functionality to better support typical SVN workflows. So far it allows storage of credentials in `.bowerrc`, provides the capability to update from trunk, and allows SVN targets which do not use the typically trunk/tags structure.

[![NPM](https://nodei.co/npm/svn-resolver.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/svn-resolver/)

## Install

Either install globally with npm:

    npm install --global svn-resolver

or add as a local dependency in your package.json.


## Usage

Add the following to `.bowerrc`:

    {
      "resolvers": [
        "svn-resolver"
      ],
      "svnResolver": {
        "username": "[USERNAME]",
        "password": "[PASSWORD]"
      }
    }

Credentials are optional, if not provided it will use the credentials saved by SVN (if any). There are clearly security considerations with storing credentials in plain text within `.bowerrc`, but it may be helpful to simplify a build process.

Now in bower.json we can use dependencies of the form:

    "dependencies": {
      "MyPrivateDependency": "svn+https://svn.example.com/my-private-dependency#",
    }

Typically the target directory in SVN will need to use the conventional trunk/branches/tags directory structure. Versions are mapped as follows:

 - `#` for the latest revision from trunk (`bower update` works)
 - `#trunk` for the trunk, but `bower update` will not pull down new revisions. This probably has little use but is provided to match the default Bower behaviour.
 - `#[tag]` for `tags/[tag]` (`bower update` will not work but since tags should not change, this should not be an issue)
 - `#[revision].0.0` or `#r[revision]` will use trunk at the specified `[revision]`.

Alternatively, it is possible to use a target directory that does not use the trunk/branches/tags structure by appending `-no-trunk` to the version:

 - `#-no-trunk` for the latest revision
 - `#r[revision]-no-trunk` for a specific revision