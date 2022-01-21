// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AnteqToken {
    string private _name = "AnteqToken";
    string private _symbol = "ANQ";
    uint8 private _decimals = 18;
    uint256 private _totalSupply = 1000000 * (10**_decimals); // 1 million tokens

    mapping(address => uint256) private _balanceOf;
    mapping(address => mapping(address => uint256)) private _allowance;

    constructor() {
        _balanceOf[msg.sender] = _totalSupply;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return _balanceOf[_owner];
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(
            _balanceOf[msg.sender] >= _value,
            "Not enought token on sender address."
        );
        _balanceOf[msg.sender] = _balanceOf[msg.sender] - _value;
        _balanceOf[_to] = _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(
            _allowance[_from][msg.sender] >= _value,
            "Not allowance to sender to send this amount tokens"
        );
        require(
            _balanceOf[_from] >= _value,
            "Not enought token on _from address."
        );
        _balanceOf[_from] -= _value;
        _balanceOf[_to] += _value;
        _allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        require(_spender != address(0));
        _allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256 remaining)
    {
        return _allowance[_owner][_spender];
    }
}
