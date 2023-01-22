# [Scruff](https://tacodiva.github.io/Scruff/) <sub><sup>_(todo: create 'scruffy', a cute vector dog logo)_</sup></sub>


### Scruff is a <ins>very</ins> work in progress rewrite of the scratch editor.
Click the link above to see whatever I've gotten done as of right now. 



## Motivation

The source code for Scratch (see repos under [LLK](https://github.com/LLK)) as it stands right now is, in my opinion, a giant mess. It's build off of
a messy fork of Blockly, a practiacally prehistoric library made by google in 2012. The project structure of Scratch makes it very difficult to navigate
and understand the source code. It's extensiability is also very limited, with little ability to expand on Scratch's limited set of features.
It's slow (see [TurboWarp](https://turbowarp.org)), and just generally doesn't get enough love, for a project used by millions of people who love to code!

This project is an attempt to recreate Scratch in a better, faster, more modern and more extensiable way using technologies like TypeScript and Svelte.
