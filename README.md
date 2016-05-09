# svn-resolver
SVN [plugabble resolver](http://bower.io/docs/pluggable-resolvers/) for Bower, allowing credentials to be stored in `.bowerrc`. This will override the default Bower SVN resolution.

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

Now in bower.json we can use dependencies of the form:

    "dependencies": {
      "MyPrivateDependency": "svn+https://svn.example.com/my-private-dependency#trunk",
    }

Credentials are optional, if not provided it will use the credentials saved by SVN (if any).