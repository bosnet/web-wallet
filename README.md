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

You can change `src/config.json`.

- `test_mode`: If you set `true`, change background and main page view.
- `api_url`: TESTNET API URL
-	`main_url`: MAINNET API URL
- `passphrases`: Horizon API Pass Phrases
- `transaction_fee`: Transaction Fee
- `minimum_balance`: Minimum Balance
- `ks_url`: Kill Switch file path or API url
- `ks_interval`: Kill Switch check cycle (second unit)
- `active_make_a_new_key`: Show 'Make a new key' Button
- `active_create_test_account`: Show 'Create new account on TestNet' Button
- `ga_id`: Google Analytics ID

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
$ sh ./build.sh testnet
#or
$ sh ./build.sh mainnet
```


## Contribution

We welcome contributions by the community. Please open issues for any bug you find, or for enhancement requests. Pull requests are also very welcome. Before submitting, please read the [contribution guidelines](https://github.com/bosnet/sebak/blob/master/CONTRIBUTING.md).
