# Contributing to Fae

## Code of Conduct

The Code of Conduct explains the *bare minimum* behavior
expectations that are required of contributors.
[Please read it before participating.](../CODE_OF_CONDUCT.md)

## Issue Contributions

You can report issues on [GitHub](https://github.com/Fae/fae/issues).
Please search existing issues before submitting a new one.

## Making Changes

To make changes you will need to have [nodejs](http://nodejs.org) installed.
Once you are ready you can contribute a change by following these steps:

### Step 1: Fork

Fork the project [on Github](https://github.com/Fae/fae) and checkout
your copy locally.

```text
$ git clone git@github.com:Fae/fae.git
$ cd fae
$ git remote add upstream git://github.com/Fae/fae.git
```

#### Which branch?

For developing new features and bug fixes, the `master` branch should be pulled
and built upon.

### Step 2: Branch

Create a feature/bug-fix branch and start hacking:

```text
$ git checkout -b feature/new-feature -t origin/master # or bug/fix-something
```

### Step 3: Commit

Make sure git knows your name and email address:

```text
$ git config --global user.name "J. Random User"
$ git config --global user.email "j.random.user@example.com"
```

Writing good commit logs is important. A commit log should describe what
changed and why. Follow these guidelines when writing one:

1. The first line should be 50 characters or less and contain a short
   description of the change.
2. Keep the second line blank.
3. Wrap all other lines at 72 columns.

A good commit log can look something like this:

```txt
explaining the commit in one line

Body of commit message is a few lines of text, explaining things
in more detail, possibly giving some background about the issue
being fixed, etc. etc.

The body of the commit message can be several paragraphs, and
please do proper word-wrap and keep columns shorter than about
72 characters or so. That way `git log` will show things
nicely even when it is indented.
```

The header line should be meaningful; it is what other people see when they
run `git shortlog` or `git log --oneline`.

Check the output of `git log --oneline files_that_you_changed` to find out
what subsystem (or subsystems) your changes touch.

If your patch fixes an open issue, you can add a reference to it at the end
of the log. Use the `Fixes:` prefix and the full issue URL. For example:

```txt
Fixes: https://github.com/Fae/fae/issues/1337
```

### Step 4: Rebase

Use `git rebase` (not `git merge`) to sync your work from time to time.

```text
$ git fetch upstream
$ git rebase upstream/master
```
### Step 5: Test

Bug fixes and features **should come with tests**. Add your tests in the
`test/unit/` directory. Looking at other tests to see how they should be
structured can help.

To run the tests:

```text
$ npm test
```

Make sure the linter is happy and that all tests pass. Please, do not submit
patches that fail either check.

If you want to run the linter without running tests, use `npm run lint`.

### Step 6: Push

```text
$ git push origin feature/new-feature # or bug/fix-something
```

Go to https://github.com/<yourusername>/fae and select your feature branch.
Click the 'Pull Request' button and fill out the form.

Pull requests are usually reviewed within a few days. If there are comments
to address, apply your changes in a separate commit and push that to your
feature branch. Post a comment in the pull request afterwards; GitHub does
not send out notifications when you add commits.

<a id="developers-certificate-of-origin"></a>
## Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

* (a) The contribution was created in whole or in part by me and I
  have the right to submit it under the open source license
  indicated in the file; or

* (b) The contribution is based upon previous work that, to the best
  of my knowledge, is covered under an appropriate open source
  license and I have the right under that license to submit that
  work with modifications, whether created in whole or in part
  by me, under the same open source license (unless I am
  permitted to submit under a different license), as indicated
  in the file; or

* (c) The contribution was provided directly to me by some other
  person who certified (a), (b) or (c) and I have not modified
  it.

* (d) I understand and agree that this project and the contribution
  are public and that a record of the contribution (including all
  personal information I submit with it, including my sign-off) is
  maintained indefinitely and may be redistributed consistent with
  this project or the open source license(s) involved.

## Attribution

This contribution guide is adapted from the Contribution Guide of
[Node.js](https://github.com/nodejs/node).
