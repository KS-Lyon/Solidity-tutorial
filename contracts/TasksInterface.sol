// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

interface TasksInterface {

    //    @createTask is called for creating task, it sets the caller as the owner
    //      of the task and sets the arguments as provided.
    function createTask(string memory taskName, uint256 taskEndingTime) external;

    //    @getTaskInfo is called for getting all Info (address, name,
    //      endingTime, AprrovedStatus and Complete Status) of a Task.
    function getTaskInfo(uint index) external view returns (address, string memory, uint, bool, bool);

    //    @registerMember is called for registering a member,
    //     It handles if the member is already registered or not through a modifier @checkAddress.
    function registerMember() external;

    //    @finalizeTask is called only by the owner of contract and
    //      only when Time is over (current Time is greater that Task's ending time),
    //      Task is neither approved, nor complete (no member voted false and not every member voted),
    //     This all is done through modifiers.
    function finalizeTask(uint taskId) external;

    //    @getTotalTasks returns total Number of Tasks that are registered (approved + not-approved + complete).
    function getTotalTasks() external view returns (uint);


    //    TaskCreated event gives length of Total Tasks everyTime when a new Task is created.
    event TaskCreated(uint);

    //    MemberRegistered event gives length of Total Members everyTime when a new Member is registered.
    event MemberRegistered(uint);
}