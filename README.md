# M2TP Service for VentrOS

This service allows apps to utilize M2TP without re-write wrapper for the library. Just fetch `ventros://m2tp.service` to send and receive data between hardware or processes.

## Installation

1. Clone this repo via git
   ```sh
   git clone https://github.com/ventros-project/service-m2tp
   ```
2. Download node modules with this command
   ```sh
   npm install
   ```
   ...or with Yarn
   ```sh
   yarn install
   ```
3. Copy this folder into `services` inside SDCard and rename it to `m2tp`

## Configuration

Duplicate `.env.example` and rename it to `.env` then modify it.
