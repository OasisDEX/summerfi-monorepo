pragma solidity 0.8.26;

import {
IERC20,
Math,
SafeERC20,
ERC4626
} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract FleetCommander is ERC4626, AccessControl {
    using Math for uint256;
    using SafeERC20 for IERC20;

    bytes32 public constant GOVERNOR_ROLE = keccak256("GOVERNOR_ROLE");
    bytes32 public constant KEEPER_ROLE = keccak256("KEEPER_ROLE");
    uint256 public constant ALLOCATION_BASIS = 10000; // Fee comes from system parameter contract

    struct ArkInfo {
        address ark;
        uint256 maxAllocation; // Max allocation as a percentage (e.g., 100 for 1%, 10000 for 100%)
    }

    struct Rebalance {
        address fromArk;
        address toArk;
        uint256 amount;
    }

    mapping(address => ArkInfo) public arks;
    uint256 public totalQueuedFunds;
    uint256 public minFundsQueueBalance;
    uint256 public lastRebalanceTime;
    uint256 public rebalanceCooldown;

    event Rebalanced(address indexed keeper, Rebalance[] rebalances);
    event QueuedFundsCommitted(address indexed keeper, uint256 prevBalance, uint256 newBalance);
    event FundsQueueRefilled(address indexed keeper, uint256 prevBalance, uint256 newBalance);
    event MinFundsQueueBalanceUpdated(address indexed keeper, uint256 newBalance);
    event DepositCapUpdated(uint256 newCap);
    event FeeAddressUpdated(address newAddress);
    event ArkAdded(address indexed ark, uint256 maxAllocation);

    constructor(
        address governor,
        ArkInfo[] memory initialArks,
        uint256 initialFundsQueueBalance,
        uint256 initialRebalanceCooldown,
        address _asset,
        string memory _name,
        string memory _symbol
    ) ERC4626(IERC20(_asset)) ERC20(_name, _symbol) {
        _setupRole(GOVERNOR_ROLE, governor);
        _setupArks(initialArks);
        minFundsQueueBalance = initialFundsQueueBalance;
        rebalanceCooldown = initialRebalanceCooldown;
    }

    /* PUBLIC - USER */
    function withdraw(uint256 assets, address receiver, address owner) public override returns (uint256) {}
    function forceWithdraw(uint256 assets, address receiver, address owner) public returns (uint256) {}
    function deposit(uint256 assets, address receiver) public override returns (uint256) {}

    /* EXTERNAL - KEEPER */
    function rebalance(bytes calldata data) external onlyRole(KEEPER_ROLE) {}
    function commitFundsQueue(bytes calldata data) external onlyRole(KEEPER_ROLE) {}
    function refillFundsQueue(bytes calldata data) external onlyRole(KEEPER_ROLE) {}

    /* EXTERNAL - GOVERNANCE */
    function setDepositCap(uint256 newCap) external onlyRole(GOVERNOR_ROLE) {}
    function setFeeAddress(address newAddress) external onlyRole(GOVERNOR_ROLE) {}
    function addArk(address ark, uint256 maxAllocation) external onlyRole(GOVERNOR_ROLE) {}
    function setMinFundsQueueBalance(uint256 newBalance) external onlyRole(GOVERNOR_ROLE) {}
    function updateRebalanceCooldown(uint256 newCooldown) external onlyRole(GOVERNOR_ROLE) {}
    function forceRebalance(bytes calldata data) external onlyRole(GOVERNOR_ROLE) {}
    function emergencyShutdown() external onlyRole(GOVERNOR_ROLE) {}

    /* PUBLIC - FEES */
    function mintSharesAsFees() public {}

    /* INTERNAL - REBALANCE */
    function _rebalance(bytes calldata data) internal {}

    /* INTERNAL - ARK */
    function _board(address ark, uint256 amount) internal {}
    function _disembark(address ark, uint256 amount) internal {}
    function _move(address memory fromArk, address toArk, uint256 amount) internal {}
    function _setupArks(ArkInfo[] arks) internal {}
    function _addArk(address ark, uint256 maxAllocation) internal {}
}