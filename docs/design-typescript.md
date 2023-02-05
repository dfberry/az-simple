# TypeScript design decisions

## Re-export of dependency types

If a dependency type needs to be exposed up to client using this SDK, the dependency types should be in a separate file named so that it is obvious it is the types (models) of the dependency. 

That model file is then imported into the integration layer integration layer doc as well as re-exported at the top level doc. 

* Pros
    * Clarity of what is exposed up to SDK's client
    * Simplicity of importing or re-exporting single types doc for dependency
* Cons
    * No enforcement of process at this point - TBD: is there a way to enforce this with eslint or TypeScript?