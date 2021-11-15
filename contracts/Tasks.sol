// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
import "./TasksInterface.sol";

contract Tasks is TasksInterface {
    struct Task {
        address taskOwner;
        string name;
        uint endingTime;
        bool approved;
        bool complete;
    }
    Task[] public tasks;

    address public owner;
    mapping(address => bool) public members;
    uint public totalMembers;

    constructor() public {
        owner = msg.sender;
    }

    modifier checkAddress (address sender) {
        require(!members[sender]);
        _;
    }

    modifier ifMember (address sender) {
        require(members[sender]);
        _;
    }

    function registerMember() checkAddress(msg.sender) public override {
        members[msg.sender] = true;
        totalMembers++;
        emit MemberRegistered(totalMembers);
    }

    function createTask (string memory taskName, uint256 taskEndingTime) ifMember(msg.sender) public override {
        Task memory newTask = Task({
        taskOwner: msg.sender,
        name: taskName,
        endingTime: taskEndingTime,
        approved: false,
        complete: false
        });
        tasks.push(newTask);
        emit TaskCreated(tasks.length);
    }

    function getTaskInfo (uint index) public override view returns(address, string memory, uint, bool, bool) {
        Task storage temp = tasks[index];
        return (temp.taskOwner, temp.name, temp.endingTime, temp.approved, temp.complete);
    }

    function getTotalTasks() public override view returns(uint) {
        return tasks.length;
    }

    function finalizeTask(uint taskId) public override {
        require(members[msg.sender] == true);

        Task storage task = tasks[taskId];
        require(msg.sender == task.taskOwner);
        task.complete = true;
    }
}