# Introduction

# Features

* List events by several filters
  * event-id or a combination of
  * kinds (kind Highlight 9802 specifically)
  * url (where originally this highlight notes are from)
  * limit (fetch last n amount of events with the filter)
* Convert to a markdown text as an unordered list
* Do changes as you like (eg. give a title, change order, add notes etc)
* Repost them by using Nostr Wallet Connect (alby or similar extensions are required)

# How to install

```npm install```

# How to run tests

```npm run test:unit```

# Command line tools

```npm run fetch-events -- --event-id 8b876a2370ba6cf830fa0805cc3870b3aa200f2694eff5f5002c6c53897928ba```