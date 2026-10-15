# client-ui-home Specification

## Purpose

Defines the home page of the Angular client.

## Requirements

### Requirement: Home page at the root route

The client application SHALL provide a home page that is rendered at the root route.

#### Scenario: Root URL shows the home page

- **WHEN** the root URL of the application is opened
- **THEN** the home page is rendered

### Requirement: Home page shows the current application version

The home page SHALL show the current version of the application.
The version SHALL be taken from the `VERSION` file in the repository root.
The version SHALL NOT be maintained in a second place in the source code.

#### Scenario: Version is shown

- **GIVEN** the `VERSION` file contains `0.1`
- **WHEN** the home page is rendered
- **THEN** it displays `0.1`

#### Scenario: Version follows the VERSION file

- **GIVEN** the content of the `VERSION` file is changed and the application is built again
- **WHEN** the home page is rendered
- **THEN** it displays the new content of the `VERSION` file
- **AND** no source file other than `VERSION` was edited

#### Scenario: Version is shown in the container

- **WHEN** the home page is rendered from a container started from the container image
- **THEN** it displays the content of the `VERSION` file at the time the image was built

#### Scenario: Version is not available

- **WHEN** the version cannot be loaded
- **THEN** the home page still renders
- **AND** it shows a neutral placeholder instead of the version
