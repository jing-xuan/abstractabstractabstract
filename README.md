# abstractabstractabstract

In place of the current VM that runs sourceD, implement a time-stamped CESK* machine that can run using the same program stack.

C -> an object which contains a PC and the current operand stack

E -> a hashmap which maps names to addresses

S -> a hashmap which maps addresses to values

K*-> an address which points to a state stored in the store

STATES -> an array which contains all the states. the index of the state shall serve as an "id"

STATE -> a struct which contains: 1. CESK* of the current state, 2. the prev state 3. the possible next states

At each PC, create a state which stores the current CESK*, and do a step to the next instruction.
