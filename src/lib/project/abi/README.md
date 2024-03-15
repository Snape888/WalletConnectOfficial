<details>
  <summary>
  Mortgage Contracts Description :

  ERC721 NFT contract, this is what borrowers hold after a taking a loan.Recieve an NFT from this contract

  
  </summary>

  - mortgagecontracts.json
  - mortgagecontracts.dbg.json

  Functions: 
  ---------------View Functions-------------
  balanceOf(1)
  DEFAULT_ADMIN_ROLE(0)
  getApproved(1)
  getRoleAdmin(1)
  getRoleMember(2)
  getRoleMemberCount(1)
  hasRole(2)
  isApprovedForAll(2)
  MINTER_ROLE(0)
  name(0)
  ownerOf(1)
  paused(0)
  PAUSER_ROLE(0)
  supportsInterface(1)
  symbol(0)
  tokenByIndex(1)
  tokenOfOwnerByIndex(2)
  tokenURI(1)
  totalSupply(0)
  ---------------Write Functions---------------
  approve(2)
  burn(1)
  grantRole(2)
  mint(1)
  multicall(1)
  pause(0)
  renounceRole(2)
  revokeRole(2)
  safeTransferFrom(3)
  safeTransferFrom(4)
  setApprovalForAll(2)
  transferFrom(3)
  unpause(0)

</details>

---------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------
<details>
  <summary>
  Mortgage Conversion Vault:

  Deposit erc20 borrowable assets in here (aaveMatic) approve mortgage conversion vault
  Stablecoins come in from pool, accepts borrowable asset and slowly sends to pool address
  Mints and share upon deposit
  
  </summary>

  Functions:

  - mortgageconversionvault.dbg.json
  - mortgageconversionvault.json

  Description:

  Functions: 
  - allowance(2)
  - approve(2) - Write
  - asset(0)
  - balanceOf(1)
  - convertToAssets(1)
  - convertToShares(1)
  - decimals(0)
  - deposit(2) - Write
  - DOMAIN_SEPARATOR(0)
  - entryCoin(0)
  - lst(0)
  - maxDeposit(1)
  - maxMint(1)
  - maxRedeem(1)
  - maxWithdraw(1)
  - mint(2) - Write
  - mortgagePoolContract(0)
  - multicall(1)
  - name(0)
  - nonces(1)
  - permit(7)
  - previewDeposit(1)
  - previewMint(1)
  - previewRedeem(1)
  - previewWithdraw(1)
  - redeem(4)
  - symbol(0)
  - tickets(0)
  - totalAssets(0)
  - totalSupply(0)
  - transfer(2)
  - transferFrom(3)
  - withdraw(4)

</details>

---------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------
<details>
  <summary>
  Mortgage Fee Conversion Vault (ERC20 ERC721)
  
  Send in fee tokens and get rewards out

  
  </summary>

  - mortgagefeeconversionvault.dbg.json
  - mortgagefeeconversionvault.json

  Description:

  Functions: 
  - allowance(2)
  - approve(2)
  - asset(0)
  - balanceOf(1)
  - convertToAssets(1)
  - convertToShares(1)
  - decimals(0)
  - deposit(2)
  - DOMAIN_SEPARATOR(0)
  - entryCoin(0)
  - lst(0)
  - maxDeposit(1)
  - maxMint(1)
  - maxRedeem(1)
  - maxWithdraw(1)
  - mint(2)
  - mortgagePoolContract(0)
  - multicall(1)
  - name(0)
  - nonces(1)
  - permit(7)
  - previewDeposit(1)
  - previewMint(1)
  - previewRedeem(1)
  - previewWithdraw(1)
  - redeem(4)
  - symbol(0)
  - tickets(0)
  - totalAssets(0)
  - totalSupply(0)
  - transfer(2)
  - transferFrom(3)
  - withdraw(4)

</details>

---------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------
<details>
  <summary>
  Mortgage Fee Tickets
  
  NFT contracts
  
  </summary>

  - mortgagefeetickets.dbg.json
  - mortgagefeetickets.json

  Description:

  Functions: 
  - approve(2)
  - balanceOf(1)
  - burn(1)
  - DEFAULT_ADMIN_ROLE(0)
  - experation(1)
  - getApproved(1)
  - getRoleAdmin(1)
  - getRoleMember(2)
  - getRoleMemberCount(1)
  - grantRole(2)
  - hasRole(2)
  - isApprovedForAll(2)
  - mint(2)
  - MINTER_ROLE(0)
  - multicall(1)
  - name(0)
  - ownerOf(1)
  - pause(0)
  - paused(0)
  - PAUSER_ROLE(0)
  - renounceRole(2)
  - revokeRole(2)
  - safeTransferFrom(3)
  - safeTransferFrom(4)
  - setApprovalForAll(2)
  - size(1)
  - supportsInterface(1)
  - symbol(0)
  - ticketInfo(1)
  - tokenByIndex(1)
  - tokenOfOwnerByIndex(2)
  - tokenURI(1)
  - totalSupply(0)
  - transferFrom(3)
  - unpause(0)
  - use(2)

</details>

---------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------
<details>
  <summary>
  Mortgage Pool
  
  Mints NFT when you create a contract (using another contract)
  Holds liquidity for EARN and LOANS
  Sends incoming stable coin to conversion vault address
  Holds balances of IOU when people are exiting
  Keeps track of stablecoins
  Keeps track of the bookkeeping
  Keeps track of borrowable liquidity
  Keeps track of loan information specifics

  Deposit stabletoken assets in here (dai) approve via dai contract (send mortgage pool to the dai contract)

    
  </summary>

  - mortgagepool.dbg.json
  - mortgagepool.json

  Description:

  Functions:
---------------View Functions---------------
X-- ADMIN_ROLE(0)
allowance(2) - First field is user addy, second is the recieving contract
amountPayed(1)
balanceOf(1)
baseSize(1)
buffer(0)
calculateAPR(0)
coinsInContracts(0)
coinSize(1)
contractCoin(0) -Address Hardcoded
contracts(0) -Address Hardcoded
conversionVault(0) -Address Hardcoded
decimals(0) -Hardcoded
X-- DEFAULT_ADMIN_ROLE(0)
defaultContract(1)
expiration(1)
feeReceiver(0)
feeSize(1)
finishContract(1)
freeCoins(0)
fromLineToWallet(1)
X-- getRoleAdmin(1)
X-- hasRole(2)
inExitLine(0)
lastPoints(1)
lastYieldInteraction(0)
mySizeWaitingForExit(1)
X-- name(0) -tokenName Hardcoded
X-- nonces(1) 
openDebt(1)
Owing(1)
X-- pointMultiplier(0)
reservedForExit(0)
rewardsCoin(0) -Address Hardcoded
simulateMonthlyPayment(2)
stablecoin(0) -Address Hardcoded
stablesInContracts(0)
startDate(1)
X-- supportsInterface(1)
X-- symbol(0)
X-- totalPoints(0)
totalSupply(0)
X-- unclaimed(0)
---------------Write Functions---------------
approve(2)
burnToGetOutInLine(1)
createContract(4)
defaultContract(1)
deposit(2)
earlyRepayContractInFull(1)
X-- grantRole(2)
X-- multicall(1)
payDownContract(2)
X-- permit(7)
X-- renounceRole(2)
X-- revokeRole(2)
X-- setConversionVault(1)
X-- setFeeReceiver(1)
transfer(2)
transferFrom(3)

</details>

---------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------
<details>
  <summary>
  Mortgage Synth
  
  ERC20 Fav stablcoin
  
  </summary>

  - mortgagesynth.dbg.json
  - mortgagesynth.json

  Description:

  Functions: 
  - ADMIN_ROLE(0)
  - allowance(2)
  - approve(2)
  - balanceOf(1)
  - burn(1)
  - burnFrom(2)
  - decimals(0)
  - decreaseAllowance(2)
  - DEFAULT_ADMIN_ROLE(0)
  - getRoleAdmin(1)
  - grantRole(2)
  - hasRole(2)
  - increaseAllowance(2)
  - mint(2)
  - name(0)
  - renounceRole(2)
  - revokeRole(2)
  - supportsInterface(1)
  - symbol(0)
  - totalSupply(0)
  - transfer(2)
  - transferFrom(3)

</details>

---------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------
<details>
  <summary>
  Mortgage Tickets
  
  NFT contract ERC721
  
  </summary>

  - mortgagetickets.dbg.json
  - mortgagetickets.json

  Description:

  Functions: 
  - approve(2)
  - balanceOf(1)
  - burn(1)
  - DEFAULT_ADMIN_ROLE(0)
  - experation(1)
  - getApproved(1)
  - getRoleAdmin(1)
  - getRoleMember(2)
  - getRoleMemberCount(1)
  - grantRole(2)
  - hasRole(2)
  - isApprovedForAll(2)
  - mint(2)
  - MINTER_ROLE(0)
  - multicall(1)
  - name(0)
  - ownerOf(1)
  - pause(0)
  - paused(0)
  - PAUSER_ROLE(0)
  - renounceRole(2)
  - revokeRole(2)
  - safeTransferFrom(3)
  - safeTransferFrom(4)
  - setApprovalForAll(2)
  - size(1)
  - supportsInterface(1)
  - symbol(0)
  - ticketInfo(1)
  - tokenByIndex(1)
  - tokenOfOwnerByIndex(2)
  - tokenURI(1)
  - totalSupply(0)
  - transferFrom(3)
  - unpause(0)
  - use(2)

</details>


