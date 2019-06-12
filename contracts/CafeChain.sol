pragma solidity >=0.4.0 <0.6.0;

contract CafeChain {
    struct Item {
        string product;
        uint value;
        address payable shop;
        bool complete;
        mapping(address => bool) selector;
        uint orderCount;
    }

    Item[] public menu;
    address public manager;
    uint public minimumamount;


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

    
    function contribute(uint index) public payable {
        Item storage item = menu[index];
        require(msg.value==item.value);
        item.selector[msg.sender] = true;
        item.orderCount++;
    }
    function transfer(uint index) public onlyowner {
    Item storage item = menu[index];
    require(!item.complete);

        item.shop.transfer(item.value);
        item.complete =true;
    }  
    function summary() public pure returns(string memory product, uint  value, address payable shop, uint orderCount) {
        return (product,value,shop, orderCount);
    }
    
}