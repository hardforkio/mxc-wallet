const MXCToken = artifacts.require('./MXCToken.sol')
import Web3 from 'web3'
import { timeTravel } from './tools/blockchain'
declare var web3: Web3
import { PERIOD_LENGTH_ON_KOVAN } from '../config'
import { assert } from './tools/chai'

const INITIAL_AMOUNT = 1000000
const BALANCE_AFTER_2_PERIODS = 2
const BALANCE_AFTER_4_PERIODS = 4
const CLIFF_PERIODS = 1
const VESTING_PERIODS = 1000000

contract('MXCToken', ([deployer, user]) => {
  it('should unlock tokens after vesting time', async () => {
    const token = await MXCToken.new({ from: deployer })
    await token.grantTokenStartNow(
      user,
      INITIAL_AMOUNT,
      CLIFF_PERIODS,
      VESTING_PERIODS,
      { from: deployer }
    )

    await timeTravel(2 * PERIOD_LENGTH_ON_KOVAN, web3)
    await token.redeemVestableToken(user, { from: user })
    const unlockedBalance2Months = await token.balanceOf(user)
    assert.equal(unlockedBalance2Months, BALANCE_AFTER_2_PERIODS)
    await timeTravel(2 * PERIOD_LENGTH_ON_KOVAN, web3)
    await token.redeemVestableToken(user, { from: user })
    const unlockedBalance4Months = await token.balanceOf(user)
    assert.equal(unlockedBalance4Months, BALANCE_AFTER_4_PERIODS)
  })
})
