# BOScoin Wallet For Web

## Install

```sh
$ yarn # or npm install
```

## Run

```sh
$ yarn start # or npm run start
```

## Config

You can set environment variables.

- `TEST_MODE`: If you set `true`, change background and main page view.
- `API_URL`: SEBAK API URL
- `NETWORK_ID`: SEBAK network id
- `KS_URL`: Kill Switch file path or API url
- `KS_INTERVAL`: Kill Switch check cycle (second unit)
- `ANGELBOT_URL`: angelbot URL to create an account for test purpose
- `PASSPHRASES`: Horizon API Pass Phrases
- `TRANSACTION_FEE`: Transaction Fee
- `MINIMUM_BALANCE`: Minimum Balance
- `ACTIVE_MAKE_A_NEW_KEY`: Show 'Make a new key' Button
- `ACTIVE_CREATE_TEST_ACCOUNT`: Show 'Create new account on TestNet' Button
- `GA_ID`: Google Analytics ID

## Kill Switch data format

```json
{
  "start_time": "2017-10-07T18:17:00.588208",
  "end_time": "2017-10-07T18:18:00.588221",
  "message": "XHTML Message<br/>Here"
}
```

## Build

```sh
$ ./build.sh testnet
#or
$ ./build.sh mainnet
```


## Contribution

We welcome contributions by the community. Please open issues for any bug you find, or for enhancement requests. Pull requests are also very welcome. Before submitting, please read the [contribution guidelines](https://github.com/bosnet/sebak/blob/master/CONTRIBUTING.md).
