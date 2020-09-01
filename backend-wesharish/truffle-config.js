module.exports = {
  rpc: {
      host:"localhost",
      port:8545
  },
  compilers: {
  solc: {
    version: "0.4.24",
    settings: {
      optimizer: {
        enabled: true, // Default: false
        runs: 200     // Default: 200
      },
      evmVersion: "homestead"  // Default: "byzantium"
    }
  }
},
networks: {
  development: {
    host: "localhost",
    port: 8545,
    network_id: "*",
    gas: 1815315,
    from: "0xee783754fd5812aee50b19492c916e32b1916c27"
  //  gasLimit: 2100000
  }

 },
compilers: {
solc: {
  version: "0.5.0",
  }
},
solc: {
  optimizer: {
    enabled: true,
    runs: 500
  }
}
};
