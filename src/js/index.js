var cafeChain;
var userAccount;

function startApp() {
    var cafeChainAddress = "0xCA716BeC0c0C286F299e7D9896553C5fc6C199f2";
    var cafeChainABI = web3.eth.contract('../build/cafeChain.json');
    cafeChain = new web3js.eth.Contract(cafeChainABI, cafeChainAddress);

    var accountInterval = setInterval(function() {
      // Check if account has changed
      if (web3.eth.accounts[0] !== userAccount) {
        userAccount = web3.eth.accounts[0];
        // Call a function to update the UI with the new account
        buyer(userAccount)
        .then(customerCount);
      }
    }, 100);

    // Start here
  }

  function customerCount(ids) {
    $("#item").empty();
    for (id of ids) {
      
      selector(id)
      .then(function(Item) {
        // Using ES6's "template literals" to inject variables into the HTML.
        // Append each one to our #Item div
        $("#zombies").append(`<div class="Item">
          <ul>
          <li>product: ${Item.product}</li>
          <li>value: ${Item.value}</li>
          <li>shop: ${Item.shop}</li>
          
            
          </ul>
        </div>`);
      });
    }
  }

  function createItem(product, value, shop) {
    // This is going to take a while, so update the UI to let the user know
    // the transaction has been sent
    $("#submit").text("Creating new zombie on the blockchain. This may take a while...");
    // Send the tx to our contract:
    return cafeChain.methods.createItem(product, value, shop)
    .send({ from: userAccount })
    .on("receipt", function(receipt) {
      $("#submit").text("Successfully created " + product, value, shop + "!");
      // Transaction was accepted into the blockchain, let's redraw the UI
      buyer(userAccount).then(customerCount);
    })
    .on("error", function(error) {
      // Do something to alert the user their transaction has failed
      $("#submit").text(error);
    });
  }

  function selectItem(index) {
    $("#select").text("select a food for you");
    return cafeChain.methods.selectItem(index)
    .send({ from: userAccount })
    .on("receipt", function(receipt) {
      $("#select").text("succefully select you product!");
      buyer(userAccount).then(customerCount);
    })
    .on("error", function(error) {
      $("#select").text(error);
    });
  }

  function contribute(index) {
    $("#valuerequired").text("paying for product");
    return cafeChain.methods.contribute(index)
    .send({ from: userAccount, value: web3.utils.toWei("0.001", "ether") })
    .on("receipt", function(receipt) {
      $("#valuerequired").text("your payment is sucessfull");
    })
    .on("error", function(error) {
      $("#valuerequired").text(error);
    });
  }

  function selector(id) {
    return cafeChain.methods.selector(id).call()
  }

  function buyer(owner) {
    return cafeChain.methods.buyer(owner).call()
  }

  window.addEventListener('load', function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      web3js = new Web3(web3.currentProvider);
    } else {
      // Handle the case where the user doesn't have Metamask installed
      // Probably show them a message prompting them to install Metamask
    }

    // Now you can start your app & access web3 freely:
    startApp()

  })