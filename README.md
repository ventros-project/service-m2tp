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

## API Endpoints

- `GET /`<br>
  List all available commands
- `GET /device`<br>
  List all connected devices
- `GET /device/<class>`<br>
  Get last data from a device with that class name
- `POST /device/<class>`<br>
  Send data to a device with that class name
- `GET /topic`<br>
  List all available topics
- `GET /topic/<topic_name>`<br>
  Get last data from that topic
- `POST /topic/<topic_name>`<br>
  Broadcast to that topic
