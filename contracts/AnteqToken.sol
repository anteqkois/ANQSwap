pragma solidity >= 0.4.21 < 8.11.0;

contract AnteqToken{

  string private _name = "AnteqToken";
  string public symbol = "ANQ";
  uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens
  uint256 public owner;
  uint8   public decimals = 18;

  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;


  constructor() public {
    // owner = msg.sender;
    balanceOf[msg.sender] = totalSupply;
  }

  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);

  function name() public view returns (string memory){
    return _name;
  }
  
  // function symbol() public view returns (string){
  //   return symbol;
  // }

  // function decimals() public view returns (uint8){
  //   return decimals;
  // }

  // function totalSupply() public view returns (uint256){
  //   return totalSuplly;
  // }

  // function balanceOf(address _owner) public view returns (uint256 balance)
  // function transfer(address _to, uint256 _value) public returns (bool success)
  // function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)
  // function approve(address _spender, uint256 _value) public returns (bool success)
  // function allowance(address _owner, address _spender) public view returns (uint256 remaining)

}