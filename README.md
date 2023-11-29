# Introduction

This application is designed to efficiently search events and convert them into a structured markdown list. It allows users to apply various filters to tailor their search, seamlessly integrating these results into a text format. This feature enables users to easily save or republish the gathered information according to their needs

# Features

* List events by several filters
  * event-id or a combination of
  * kinds (kind Highlight 9802 specifically)
  * url (where originally this highlight notes are from)
  * limit (fetch last n amount of events with the filter)
* Convert to a markdown text as an unordered list
* Do changes as you like (eg. give a title, change order, add notes etc)
* Repost them by using Nostr Wallet Connect (alby or similar extensions are required)

# How to run

> Note: This software is only for research purposes. Use at your own risk. 

Pick a nostr relay or run your own for testing and publishing events. I'd pick [nostream](https://github.com/Cameri/nostream/#quick-start-docker-compose)

Then put the relay ws address into .env variable *DEV_WRITE_RELAY*

Install dependencies

```
npm install -g bun
bun install
```

If you want to use the publish functionality: 
* to generate a new profile run `openssl rand -hex 128` and copy the key into .env file variable *SECRET*
* or copy some other private key you want to use.

Run `bun run --bun dev`, then open [http://localhost:3000/](http://localhost:3000/) in web browser with nostr wallet connect support

# How to run tests

For unit tests

`bun run test:unit`

For integration tests

`bun run --bun dev` first and in a seperate console run `bun run test:integration`

# How to run on Docker

`docker compose up -d`

It will boot up nostream and the application

Open the application in NIP-07 enabled browser (alby extension or alike)

`http://localhost:3000`

# UI Application

Fetch events using several filters. It will create a list in the markdown editor. Change the output as you like, then repost it as an article event.

# Command line tools

Useful tools to fetch specific events for easy lookup from a bunch of remote relays

* Fetch event by id
  * `bun run fetch-events -- --event-id 8b876a2370ba6cf830fa0805cc3870b3aa200f2694eff5f5002c6c53897928ba`
* Fetch events related to an event id
  * `bun run fetch-related-events -- --event-id 8b876a2370ba6cf830fa0805cc3870b3aa200f2694eff5f5002c6c53897928ba`

# TODO

- [ ] find the most zaped notes and sort by it
- [ ] find related events and create sub lists (depth?)
- [ ] append switch
