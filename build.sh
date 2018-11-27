echo $1

if [ -z $1 ]; then
    SUBDIR="testnet"
elif [ $1 = "testnet" ]; then
    SUBDIR="testnet"
elif [ $1 = "mainnet" ]; then
    SUBDIR="mainnet"
else
    echo Usage:
    echo "\tbuild [args]"
    echo 
    echo args: \(Default is testnet\)
    echo "\ttestnet\t\tbuild testnet"
    echo "\tmainnet\t\tbuild mainnet"
fi

echo ${SUBDIR}

if [ ${SUBDIR} = "mainnet" ]; then
  echo install mainnet config
  \cp ./src/config.mainnet.json ./src/config.json
elif [ ${SUBDIR} = "testnet" ]; then
  echo install testnet config
  \cp ./src/config.testnet.json ./src/config.json
fi
npm run build