# Rendless

**Description**: Rendless is an open source Image to API editor. The main usecase is rendering dynamic OG image

- **Technology stack**: It's using Remix as fullstack framework. Radix as style. Lucia for the authentification. Satori for the image rendering. Prisma as ORM.
- **Status**: Alpha. The software is stable but is still missing style features.

**Links**:

- **Platform link**: [Link](https://rendless.com)
- **Documentation link**: [Link](https://docs.rendless.com)

**Screenshot**:

![](reendless-screenshot.png)

## Requirements

- Nodejs: > 18
- S3 compatible bucket
- Postgresql database

## Installation

Detailed instructions on how to install, configure, and get the project running.
This should be frequently tested to ensure reliability. Alternatively, link to
a separate [INSTALL](INSTALL.md) document.

## Configuration

Some environment variables are required:

- `DATABASE_URL`: URL of the postgresql database.
- `WEBSITE_URL`: URL of the website.
- `SPACES_KEY`: accessKeyId of the s3 bucket
- `SPACES_SECRET`: Secret key of the s3 bucket

Make sure to set these environment variables before running the application.

## Usage

Show users how to use the software.
Be specific.
Use appropriate formatting when showing code snippets.

## How to test the software

If the software includes automated tests, detail how to run those tests.

## Known issues

Document any known significant shortcomings with the software.

## Getting help

Just open an Issue or [contact me](https://x.com/CypherGolem) on x.com

## Getting involved

This section should detail why people should get involved and describe key areas you are
currently focusing on; e.g., trying to get feedback on features, fixing certain bugs, building
important pieces, etc.

General instructions on _how_ to contribute should be stated with a link to [CONTRIBUTING](CONTRIBUTING.md).

---

## Open source licensing info

[LICENSE](LICENSE)

---

## Credits and references

1. [Satori](https://github.com/vercel/satori)
2. [Moveable](https://github.com/daybrush/moveable)
