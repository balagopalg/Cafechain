pragma solidity >=0.4.0 <0.6.0;

contract CafeChain {
    struct Item {
        string product;
        uint value;
        address payable shop;
        bool complete;
        uint orderCount;
        mapping(address => bool) selector;
    }

    Item[] public menu;
    address public manager;
    uint public minimumamount;
    mapping(address => bool) buyer;
    uint public custmorCount;

    modifier onlyowner() {
        require(msg.sender == manager);
        _;
    }
    constructor() public {
        manager = msg.sender;
        
    }
    function createItem(string memory product, uint  value, address payable shop) public onlyowner {
        Item memory newItem = Item({
            product: product,
            value: value,
            shop: shop,
            complete: false,
            orderCount: 0
        });
        menu.push(newItem);
    }

    function selectItem(uint index) public {
        Item storage item = menu[index];
        buyer[msg.sender]=true;
        custmorCount++;
    }
    function contribute(uint index) public payable {
        Item storage item = menu[index];
        require(buyer[msg.sender]);
        require(msg.value==item.value);
        item.selector[msg.sender] = true;
        item.orderCount++;
    }
    function transfer(uint index) public onlyowner {
    Item storage item = menu[index];
    require(!item.complete);

        item.shop.transfer(item.value);
        item.complete =false;
    }  
}