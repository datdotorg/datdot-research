# datdot-dev
code conventions and methods and tools of working together to develop datdot further

see also: https://github.com/datdotorg/datdot-terminal


see: https://github.com/playproject-io/datdot-research/issues/16

## `@todo` - Strategy for writing CODE & SPECIFICATION
> 1. start with DATA OVER THE WIRE => WORK BACKWARDS
> 2. derive this from ROLES in the SLIDES

3. make modules to be re-usabel in
  * cli
  * electron
  * browser
4. try to use "standard hyper components"
6. work without necessity of merge/rebase/pullrequests
  * => but rather independent modules
  * => make that into an app for all playproject contractors to work with
    * => instead of explaining people how to work together!
    * => make onboarding easy ... think about DATDOT-DEV (onchain) process
7. SUBSTACK: => waiting for modular architecture
  * but i think next we need some idea of what messages each component
  * will need and then we can start building out the components
8. SPEC QUESTIONS
  * What else is not defined in detail?
  * Where should we keep the list of all these 'todos'? Issues?



## `@todo`
* [ ] markdown file to document all
  * the public substrate methods
    * update API in mermaid sequence diagram
  * the arguments and types needed
  * the events emitted by substrate to listen to
    * update events in mermaid sequence diagram
* [ ] list of custom types we use for JS
  * => try to set up rustdocs and stabilized api
  * => do some tests in Rust
  * => put together proper integration tests in JS

