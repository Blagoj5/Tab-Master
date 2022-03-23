Thanks for showing interest to contribute to Tab Master 💗, you're awesome!

When it comes to open source, there are different ways you can contribute, all
of which are valuable. Here's a few guidelines that should help you as you
prepare your contribution.

## Setup the Project

The following steps will get you up and running to contribute to Tab Master:

1. Fork the repo (click the <kbd>Fork</kbd> button at the top right of
   [this page](https://github.com/Blagoj5/Tab-Master))

2. Clone your fork locally

```sh
git clone git@github.com:<your_github_username>/Tab-Master.git
cd Tab-Master
```

3. Setup all the dependencies and packages by running `yarn`. This command will
   install dependencies and bootstrap the repo using `preconstruct`

<!-- > If you run into any issues during this step, kindly reach out to the Chakra UI
> React team here: https://discord.gg/chakra-ui -->

## Development

To improve our development process, we've set up tooling and systems. Tab Master
uses a monorepo structure and we each package is different part of the extension (modal, config page).

### Tooling

- [Testing Library](https://jestjs.io/docs/getting-started) jest together with puppeteer for End-to-End (E2E) tests
- [Changeset](https://github.com/atlassian/changesets) for changes
  documentation, changelog generation, and release management.

### Commands

**`yarn`**: bootstraps the entire project, symlinks all dependencies for
cross-component development and builds all components.

**`yarn build`**: run build for all packages.

**`yarn build:watch`**: uses nodemon to watch any changes made in the packages and rebuild when change happened

**`yarn zip`**: zips the built directory and it's ready to be published

**`yarn test`**: runs jest + puppeteer to test the extension

## Think you found a bug?

Please conform to the issue template and provide a clear path to reproduction
with a code example.

## Proposing new or changed API?

Please provide thoughtful comments and some sample API code. Proposals that
don't line up with our roadmap or don't have a thoughtful explanation will be
closed.

## Making a Pull Request?

Pull requests need only approval ✅ of atleast one or more collaborators to be merged; when
the PR author is a collaborator, that counts as one.

### Commit Convention

Before you create a Pull Request, please check whether your commits comply with
the commit conventions used in this repository.

When you create a commit we kindly ask you to follow the convention
`category(scope or module): message` in your commit message while using one of
the following categories:

- `feat / feature`: all changes that introduce completely new code or new
  features
- `fix`: changes that fix a bug (ideally you will additionally reference an
  issue if present)
- `refactor`: any code related change that is not a fix nor a feature
- `docs`: changing existing or creating new documentation (i.e. README, docs for
  usage of a lib or cli usage)
- `build`: all changes regarding the build of the software, changes to
  dependencies or the addition of new dependencies
- `test`: all changes regarding tests (adding new tests or changing existing
  ones)
- `ci`: all changes regarding the configuration of continuous integration (i.e.
  github actions, ci system)
- `chore`: all changes to the repository that do not fit into any of the above
  categories

If you are interested in the detailed specification you can visit
https://www.conventionalcommits.org/ or check out the
[Angular Commit Message Guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines).

<!-- TODO: here continue -->

### Steps to PR

1. Fork of the tab-master repository and clone your fork

2. Create a new branch out of the `main` branch. We follow the convention
   `[type/scope]`. For example `fix/accordion-hook` or `docs/menu-typo`. `type`
   can be either `docs`, `fix`, `feat`, `build`, or any other conventional
   commit type. `scope` is just a short id that describes the scope of work.

3. Make and commit your changes following the
   commit convention. As you develop, you can run `yarn pkg <module> test` to make sure everything works as expected.

4. Run `yarn changeset` to create a detailed description of your changes. This
   will be used to generate a changelog when we publish an update.
   [Learn more about Changeset](https://github.com/atlassian/changesets/tree/master/packages/cli).
   Please note that you might have to run `git fetch origin main:master` (where
   origin will be your fork on GitHub) before `yarn changeset` works.

<!-- > If you made minor changes like CI config, prettier, etc, you can run
> `yarn changeset add --empty` to generate an empty changeset file to document
> your changes. -->

### Tests

All commits that fix bugs or add features need a test.

> **Dear team:** Please do not merge code without tests

## Want to write a blog post or tutorial

That would be amazing! We would love to support you any way we can.

## License

By contributing your code to the Tab-Master GitHub repository, you agree to
license your contribution under the MIT license.
