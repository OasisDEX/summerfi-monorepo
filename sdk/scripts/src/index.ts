enum AaveActions {
  Deposit = 'AaveV3Deposit',
  Borrow = 'AaveV3Borrow',
  Payback = 'AaveV3Payback',
  Withdraw = 'AaveV3Withdraw',

  SetEmode = 'SetAaveV3Emode',
}

enum SparkActions {
  Deposit = 'SparkDeposit',
  Borrow = 'SparkBorrow',
  Payback = 'SparkPayback',
  Withdraw = 'SparkWithdraw',

  SetEmode = 'SetSparkEmode',
}

enum MakerActions {
  Deposit = 'MakerDeposit',
  Borrow = 'MakerBorrow',
  Payback = 'MakerPayback',
  Withdraw = 'MakerWithdraw',
}

enum MorphoActions {
  Deposit = 'MorphoBlueDeposit',
  Borrow = 'MorphoBlueBorrow',
  Payback = 'MorphoBluePayback_2',
  Withdraw = 'MorphoBlueWithdraw',
}

enum CommonActions {
  PullToken = 'PullToken_3',
  SendToken = 'SendToken_4',
  Approve = 'SetApproval_3',
  Flashloan = 'TakeFlashloan_3',
  Swap = 'SwapAction_3',
  ReturnFunds = 'ReturnFunds_3',
  PositionCreated = 'PositionCreated',
}

enum LendingActions {
  DepositBorrow = 'DepositBorrow',
  PaybackWithdraw = 'PaybackWithdraw',
}

enum Protocol {
  Aave = 'Aave',
  Spark = 'Spark',
  Maker = 'Maker',
  Morpho = 'Morpho',
}

type Actions = AaveActions | SparkActions | MakerActions | MorphoActions | CommonActions

function createProtocolVariations(entry: [LendingActions, Protocol[]]): Actions[][] {
  const action = entry[0]
  const protocols = entry[1]

  const res = protocols.map((protocol) => {
    const protocolActions =
      protocol === Protocol.Aave
        ? AaveActions
        : protocol === Protocol.Spark
          ? SparkActions
          : protocol === Protocol.Maker
            ? MakerActions
            : MorphoActions

    switch (action) {
      case LendingActions.DepositBorrow: {
        const deposit = [
          CommonActions.Approve,
          ...([Protocol.Aave, Protocol.Spark].includes(protocol)
            ? /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
              [(protocolActions as any).SetEmode]
            : []), // Only Aave and Spark have SetEmode
          protocolActions.Deposit,
        ]
        const borrow = [protocolActions.Borrow]
        return [[...deposit, ...borrow], deposit, borrow]
      }
      case LendingActions.PaybackWithdraw: {
        const payback = [CommonActions.Approve, protocolActions.Payback]
        const withdraw = [protocolActions.Withdraw]
        return [[...payback, ...withdraw], payback, withdraw]
      }
    }
  })
  return res.flat()
}

const Refinance: Actions[][][] = [
  [[CommonActions.Flashloan], []],
  createProtocolVariations([
    LendingActions.PaybackWithdraw,
    [Protocol.Aave, Protocol.Spark, Protocol.Maker, Protocol.Morpho],
  ]),
  [[CommonActions.Swap], []],
  createProtocolVariations([
    LendingActions.DepositBorrow,
    [Protocol.Aave, Protocol.Spark, Protocol.Morpho],
  ]),
  [[CommonActions.Swap], []],
  [[CommonActions.ReturnFunds], []],
  [[CommonActions.PositionCreated]],
]

function getAllPermutations(input: Actions[][][]): Actions[][] {
  let result: Actions[][] = []

  input.forEach((actionsBlocks) => {
    if (result.length === 0) {
      result = actionsBlocks
    } else {
      let temp: Actions[][] = []
      actionsBlocks.forEach((actionsBlock) => {
        const newResult = result.map((resultBlock) => [...resultBlock, ...actionsBlock])
        temp.push(...newResult)
      })
      result = temp
      temp = []
    }
    return result
  })

  return result
}

const x = getAllPermutations(Refinance)

// link to library gnosis `@morpho-labs/gnosis-tx-builder`
// https://codesandbox.io/p/sandbox/eager-maria-84gwtj?file=%2Fsrc%2Findex.ts%3A1%2C50

const res = Refinance.map((batch) => batch.length).reduce((acc, val) => acc * val, 1)

// test
console.log(x.length, res)

console.log(Refinance)
