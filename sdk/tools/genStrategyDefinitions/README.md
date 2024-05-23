## Summer.fi Tools

# encode:makerGive

Generates the calldata necessary to give a Maker position (CDP) to another address. This is done by
executing the calldata on a DsProxy or DPM and using the CdpManager proxy actions to delegate the
call. The parameters of the tool are:

```
Options:
  -p, --makerProxyActions  Maker Proxy Actions address
  -c, --cdpManager         Maker CDP Manager address
  -i, --cdpId              ID of the position to give
  -t, --to                 Address to give the CDP to
  -h, --help               Show help
```

# strategy:gen

Generates the strategy definitions for the Summer.fi protocol. The parameters of the tool are:
