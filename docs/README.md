# Fae - A 2D JavaScript Engine

## Contents

- [Overview](#overview)
- [Philosophy](#philosophy)
- [Get Started](#start)

<a name="overview"></a>
## Overview

Welcome to the Fae ecosystem. Fae might be a bit different than what most people are used to
in other libraries and frameworks, but the hope is to provide a solid foundation to build
you applications and frameworks upon.

At its core Fae is a collection of components, systems, and assemblages that empower users to
build amazing 2D applications. Fae isn't just a library, or a framework, but instead an ecosystem
of small modules that together can do almost anything.

While different, if you give Fae's way of doing things a try I promise you will come to appreciate
the elegance of the system.

<a name="philosophy"></a>
## Philosophy

The *Mission Statement* of Fae is:

> Fae sets out to create a powerful ecosystem of *Modular*, *Composable*, and *Reusable*
> packages that work together to power amazing 2D applications.

Like it says in the *Mission Statement*, the basic philosophy of Fae is to build a collection
*Modular*, *Composable*, *Reusable* parts. Each of these descriptors is considered a
*Core Value* of the Fae ecosystem, and is explored in more detail below. When developing for
Fae contributors and plugin authors should keep this section in mind.

### Modularity

Fae takes the concept of [modularity][modularity] very seriously. By modularizing as much as
is reasonable in order to provide the choice to the users of what they want in their builds.
A good guide is the [Unix Philosophy][unix-phil] which emphasizes building "simple, short,
clear, modular, and extensible code that can be easily maintained and repurposed by
developers other than its creators."

Most frameworks achieve something like this by allowing you to exclude or include parts of the
library, which helps with file-size. Other ecosystems like Fae and jQuery UI take it a step
further. Not only is file-size reduced but not a single CPU cycle is spent on the excluded
feature. Not even to check if the feature is active. Everyone who uses Fae may have a slightly
different build, and that is OK.

### Composability

While modularity alone can be good, it can also introduce some challenges. One specific
challenges that presents itself is that once you have a bunch of different small packages, how
do you use them together in a meaningful way?

Fae approaches this problem using a similar pattern to the [Entity Component System][ecs]
pattern, with a couple of minor differences. I wrote a detailed article about Fae's flavor
of ECS [on my blog][ecs-diff], if you are interested. Fae's flavor of ECS defines the terms
as follows:

- `Entites` are created from chains of inherited components.
- `Components` are "subclass factories," functions that return a class inheriting from
the parameter.
- `Systems` are classes that perform actions on entities and their components.

<!-- TODO: Talk about why we chose to represent components like this. Mention compat with
familiar class-oriented thought processes and applications.
-->

### Reusability

Coming Soon!

<a name="start"></a>
## Get Started

If you are ready to get started with Fae, you can head over to the [Getting Started][start]
guide.

<!-- Links -->

[start]: GettingStarted.md
[modularity]: https://en.wikipedia.org/wiki/Modularity
[unix-phil]: https://en.wikipedia.org/wiki/Unix_philosophy
[ecs]: https://en.wikipedia.org/wiki/Entity_component_system
[esc-diff]: https://englercj.github.io/2016/08/24/composition-ecs/
