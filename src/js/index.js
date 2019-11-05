App = {
    web3Provider: null,
    contracts: {},
  
    init: function() {
      return App.initWeb3();
    },
  
    initWeb3: function() {
      // Initialize web3 and set the provider to the testRPC.
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        // set the provider you want from Web3.providers
        App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
        web3 = new Web3(App.web3Provider);
      }
  
      return App.initContract();
        //This is a test
    },
  
    initContract: function() {
      $.getJSON('CafeChain.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract.
        var CafeChainArtifact = data;
        App.contracts.CafeChain = TruffleContract(CafeChainArtifact);
  
        // Set the provider for our contract.
        App.contracts.CafeChain.setProvider(App.web3Provider);
  
        return App.getProducts();
      });
  
      return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', '#submitButton', App.handleSubmission);
        $(document).on('click', '#confirmButton', App.confirmOrder);
        $(document).on('click', '#payButton', App.makeOrder);
      },
    
      handleSubmission: function(event) {
        event.preventDefault();
    
        var name = ($('#productName').val());
        var designatedaddress = $('#productAddress').val();
        var units = parseInt($('#productAmount').val());
    
        var CafeChainInstance;
    
        web3.eth.getAccounts(function(error, accounts) {
          if (error) {
            console.log(error);
          }
    
    
          App.contracts.CafeChain.deployed().then(function(instance) {
            CafeChainInstance = instance;
    
            return CafeChainInstance.createItem( name,units,designatedaddress);
                  
          }).then(function(result) {
            alert('Addition Successful!');
            return App.getProducts();
          }).catch(function(err) {
            console.log(err.message);
          });
        });
      },
      makeOrder: function(event) {
        event.preventDefault();
    
        var amount = parseInt($('#AmountofItem').val());
        
    
        var CafeChainInstance;
    
        web3.eth.getAccounts(function(error, accounts) {
          if (error) {
            console.log(error);
          }
    
          var account = accounts[0];
    
          App.contracts.CafeChain.deployed().then(function(instance) {
            CafeChainInstance = instance;
    
            return CafeChainInstance.contribute(uint);
    
          }).then(function(result) {
            alert('Order Selection Successful!');
          }).catch(function(err) {
            console.log(err.message);
          });
        });
      },
      confirmOrder: function(event) {
        event.preventDefault();
    
        var amount = parseInt($('#AmountofItem').val());
        var toAddress = $('#productAddress').val();
    
        var CafeChainInstance;
    
        web3.eth.getAccounts(function(error, accounts) {
          if (error) {
            console.log(error);
          }
    
          var account = accounts[0];
    
          App.contracts.CafeChain.deployed().then(function(instance) {
            CafeChainInstance = instance;
    
            return CafeChainInstance.transfer(uint);
    
          }).then(function(result) {
            alert('Order Confirmation Successful!');
          }).catch(function(err) {
            console.log(err.message);
          });
        });
      },
      
      getProducts: function() {
        console.log('Getting details of the product to display');
    
        var CafeChainInstance;
    
        web3.eth.getAccounts(function(error, accounts) {
          if (error) {
            console.log(error);
          }
    
          var account = accounts[0];
    
          App.contracts.CafeChain.deployed().then(function(instance) {
            CafeChainInstance = instance;
    
            return CafeChainInstance.summary(name,units,designatedaddress);
          }).then(function(result) {
            alert('Product Retrieved Successful!');
          }).catch(function(err) {
            console.log(err.message);
          });
        });
      }
    };
    
    $(function() {
      $(window).load(function() {
        App.init();
      });
    });  
      
    
