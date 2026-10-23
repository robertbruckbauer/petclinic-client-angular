# client-language Specification

## Purpose

Defines the implementation language of the Angular client.

## Requirements

### Requirement: TypeScript is the implementation language

The client application SHALL be implemented in TypeScript.
All application and test source files SHALL be TypeScript files, and the application SHALL NOT contain hand-written JavaScript source files.
The TypeScript compiler SHALL run in `strict` mode, and the Angular compiler SHALL enable `strictTemplates`.
The TypeScript version SHALL be the latest version supported by Angular 22, as stated in the peer dependency range of `@angular/compiler-cli`.

#### Scenario: Source files are TypeScript

- **WHEN** the `src` directory of the client is inspected
- **THEN** application and test sources have the `.ts` extension
- **AND** no hand-written `.js` source file is present

#### Scenario: Strict compilation is enabled

- **WHEN** `tsconfig.json` of the client is inspected
- **THEN** `compilerOptions.strict` is `true`
- **AND** `angularCompilerOptions.strictTemplates` is `true`

#### Scenario: TypeScript is declared

- **WHEN** the dependencies of the client are inspected
- **THEN** `typescript` is declared
- **AND** its resolved version is the latest release within the `typescript` peer dependency range of `@angular/compiler-cli` 22

#### Scenario: Type errors fail the build

- **WHEN** a source file contains a type error and the build is executed
- **THEN** the build fails

### Requirement: Linting with Prettier

The client application SHALL use Prettier to enforce a consistent code style for TypeScript, HTML templates, stylesheets, JSON, and Markdown files.
Prettier SHALL be declared as a development dependency and configured in a single Prettier configuration file in the repository root.
The lint script SHALL run `prettier --check` and SHALL fail when any file is not formatted according to the configuration.
A format script SHALL run `prettier --write` to fix formatting violations.
Generated and installed files such as `node_modules`, `dist`, and `.angular` SHALL be excluded through a `.prettierignore` file.

#### Scenario: Prettier is declared and configured

- **WHEN** the dependencies and the repository root of the client are inspected
- **THEN** `prettier` is declared as a development dependency
- **AND** a Prettier configuration file is present

#### Scenario: Lint script checks formatting

- **WHEN** the lint script of the client is executed
- **THEN** it runs `prettier --check`
- **AND** it exits with a failure if a file is not formatted

#### Scenario: Unformatted file fails the lint

- **WHEN** a TypeScript source file violates the Prettier configuration and the lint script is executed
- **THEN** the lint script reports that file and fails

#### Scenario: Format script fixes violations

- **WHEN** the format script is executed on an unformatted file
- **THEN** the file is rewritten according to the Prettier configuration
- **AND** a subsequent lint script run succeeds

#### Scenario: Generated files are ignored

- **WHEN** the lint script is executed
- **THEN** files under `node_modules`, `dist`, and `.angular` are not checked
