#AngularJS Lazy loading dynamically defined programs using AngularAMD and RequireJS (Development version)

A demonstration of loading sub-programs within an angular application that have been defined dynamically. (Here by a json file, but just as easily by a call to a backend service.)

Concepts are that the main program should have no dependancies on the child programs at all (other than them having an expected structure when program that's used as a state), and everything is as self contained as possible, with dependancies resolved using requireJS.