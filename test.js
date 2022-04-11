/* 

Virtual machine for language Source §1-

using virtual machine SVML1, Lecture Week 5 of CS4215

Instructions: press "Run" to evaluate an example expression
              (scroll down and un-comment one example)
              
The language Source §1- is defined as follows:

stmt    ::= expr ;
         |  const x = expr ;
         |  return expr ;
         |  stmt stmt ;

expr    ::= number
         |  true | false
         |  expr ? expr : expr
         |  expr && expr
         |  expr || expr
         |  expr binop expr
         |  unop expr
         |  expr ( expr (, expr)* )
         |  ( params ) => { stmt } ;
binop   ::= + | - | * | / | < | > | <= | >= | === | !==
unop    ::= !              
params  ::= ε | name ( , name ) . . .
*/

// OP-CODES

// op-codes of machine instructions, used by compiler
// and machine
const START = 0
const LDCN = 1 // followed by: number
const LDCB = 2 // followed by: boolean
const LDCU = 3
const PLUS = 4
const MINUS = 5
const TIMES = 6
const EQUAL = 7
const LESS = 8
const GREATER = 9
const LEQ = 10
const GEQ = 11
const NOT = 12
const DIV = 13
const POP = 14
const ASSIGN = 15 // followed by: index of value in environment
const JOF = 16 // followed by: jump address
const GOTO = 17 // followed by: jump address
const LDF = 18 // followed by: max_stack_size, address, env extensn count
const CALL = 19
const LD = 20 // followed by: index of value in environment
const RTN = 21
const DONE = 22

// some auxiliary constants
// to keep track of the inline data

const LDF_MAX_OS_SIZE_OFFSET = 1
const LDF_ADDRESS_OFFSET = 2
const LDF_ENV_EXTENSION_COUNT_OFFSET = 3

// get a the name of an opcode, for debugging
function get_name (op) {
    // printing opcodes for debugging
    const OPCODES = list(
        pair(START, 'START  '),
        pair(LDCN, 'LDCN   '),
        pair(LDCB, 'LDCB   '),
        pair(LDCU, 'LDCU   '),
        pair(PLUS, 'PLUS   '),
        pair(MINUS, 'MINUS  '),
        pair(TIMES, 'TIMES  '),
        pair(EQUAL, 'EQUAL  '),
        pair(LESS, 'LESS   '),
        pair(GREATER, 'GREATER'),
        pair(LEQ, 'LEQ    '),
        pair(GEQ, 'GEQ    '),
        pair(NOT, 'NOT    '),
        pair(DIV, 'DIV    '),
        pair(POP, 'POP    '),
        pair(ASSIGN, 'ASSIGN '),
        pair(JOF, 'JOF    '),
        pair(GOTO, 'GOTO   '),
        pair(LDF, 'LDF    '),
        pair(CALL, 'CALL   '),
        pair(LD, 'LD     '),
        pair(RTN, 'RTN    '),
        pair(DONE, 'DONE   ')
    )

    function lookup (opcodes) {
        return is_null(opcodes)
            ? error(op, 'unknown opcode')
            : op === head(head(opcodes))
            ? tail(head(opcodes))
            : lookup(tail(opcodes))
    }
    return lookup(OPCODES)
}

// pretty-print the program
function print_program (P) {
    let i = 0
    while (i < array_length(P)) {
        let s = stringify(i)
        const op = P[i]
        s = s + ': ' + get_name(P[i])
        i = i + 1
        if (
            op === LDCN ||
            op === LDCB ||
            op === GOTO ||
            op === JOF ||
            op === ASSIGN ||
            op === LDF ||
            op === LD ||
            op === CALL
        ) {
            s = s + ' ' + stringify(P[i])
            i = i + 1
        } else {
        }
        if (op === LDF) {
            s = s + ' ' + stringify(P[i]) + ' ' + stringify(P[i + 1])
            i = i + 2
        } else {
        }
        console.log(s)
    }
}

// COMPILER FROM SOURCE TO SVML
// parse given string and compile it to machine code
// return the machine code in an array
function parse_and_compile (string) {
    // Functions from SICP JS Section 4.1.2
    // with slight modifications

    function is_tagged_list (expr, the_tag) {
        return is_pair(expr) && head(expr) === the_tag
    }

    // names are tagged with "name".

    function is_name (stmt) {
        return is_tagged_list(stmt, 'name')
    }
    function symbol_of_name (stmt) {
        return head(tail(stmt))
    }

    function is_literal (stmt) {
        return is_tagged_list(stmt, 'literal')
    }

    function literal_value (component) {
        return head(tail(component))
    }

    function make_literal (value) {
        return list('literal', value)
    }

    function is_undefined_expression (stmt) {
        return is_name(stmt) && symbol_of_name(stmt) === 'undefined'
    }

    // constant declarations are tagged with "constant_declaration"
    // and have "name" and "value" properties

    function is_constant_declaration (stmt) {
        return is_tagged_list(stmt, 'constant_declaration')
    }
    function declaration_symbol (component) {
        return symbol_of_name(head(tail(component)))
    }
    function constant_declaration_value (stmt) {
        return head(tail(tail(stmt)))
    }
    function make_constant_declaration (name, value_expression) {
        return list('constant_declaration', name, value_expression)
    }
    function is_declaration (component) {
        return (
            is_tagged_list(component, 'constant_declaration') ||
            is_tagged_list(component, 'variable_declaration') ||
            is_tagged_list(component, 'function_declaration')
        )
    }

    // applications are tagged with "application"
    // and have "operator" and "operands"

    function is_application (component) {
        return is_tagged_list(component, 'application')
    }
    function function_expression (component) {
        return head(tail(component))
    }
    function arg_expressions (component) {
        return head(tail(tail(component)))
    }

    // we distinguish primitive applications by their
    // operator name

    function is_operator_combination (component) {
        return (
            is_unary_operator_combination(component) ||
            is_binary_operator_combination(component)
        )
    }
    function is_unary_operator_combination (component) {
        return is_tagged_list(component, 'unary_operator_combination')
    }
    function is_binary_operator_combination (component) {
        return is_tagged_list(component, 'binary_operator_combination')
    }
    function operator_symbol (component) {
        return list_ref(component, 1)
    }
    function first_operand (component) {
        return list_ref(component, 2)
    }
    function second_operand (component) {
        return list_ref(component, 3)
    }

    // logical compositions are tagged
    // with "logical_composition"

    function is_logical_composition (expr) {
        return is_tagged_list(expr, 'logical_composition')
    }
    function logical_composition_operator (expr) {
        return head(tail(expr))
    }

    // conditional expressions are tagged
    // with "conditional_expression"

    function is_conditional_expression (expr) {
        return is_tagged_list(expr, 'conditional_expression')
    }
    function cond_expr_pred (expr) {
        return list_ref(expr, 1)
    }
    function cond_expr_cons (expr) {
        return list_ref(expr, 2)
    }
    function cond_expr_alt (expr) {
        return list_ref(expr, 3)
    }
    function make_conditional_expression (expr1, expr2, expr3) {
        return list('conditional_expression', expr1, expr2, expr3)
    }

    // lambda expressions are tagged with "lambda_expression"
    // have a list of "parameters" and a "body" statement

    function is_lambda_expression (component) {
        return is_tagged_list(component, 'lambda_expression')
    }
    function lambda_parameter_symbols (component) {
        return map(symbol_of_name, head(tail(component)))
    }
    function lambda_body (component) {
        return head(tail(tail(component)))
    }
    function make_lambda_expression (parameters, body) {
        return list('lambda_expression', parameters, body)
    }

    // blocks are tagged with "block"
    // have "body" statement

    function is_block (component) {
        return is_tagged_list(component, 'block')
    }
    function block_body (component) {
        return head(tail(component))
    }

    // function declarations are tagged with "lambda_expression"
    // have a list of "parameters" and a "body" statement

    function is_function_declaration (component) {
        return is_tagged_list(component, 'function_declaration')
    }
    function function_declaration_name (component) {
        return list_ref(component, 1)
    }
    function function_declaration_parameters (component) {
        return list_ref(component, 2)
    }
    function function_declaration_body (component) {
        return list_ref(component, 3)
    }
    function function_decl_to_constant_decl (component) {
        return make_constant_declaration(
            function_declaration_name(component),
            make_lambda_expression(
                function_declaration_parameters(component),
                function_declaration_body(component)
            )
        )
    }

    // sequences of statements are just represented
    // by tagged lists of statements by the parser.

    function is_sequence (stmt) {
        return is_tagged_list(stmt, 'sequence')
    }
    function make_sequence (stmts) {
        return list('sequence', stmts)
    }
    function sequence_statements (stmt) {
        return head(tail(stmt))
    }
    function is_empty_sequence (stmts) {
        return is_null(stmts)
    }
    function is_last_statement (stmts) {
        return is_null(tail(stmts))
    }
    function first_statement (stmts) {
        return head(stmts)
    }
    function rest_statements (stmts) {
        return tail(stmts)
    }

    // functions return the value that results from
    // evaluating their expression

    function is_return_statement (stmt) {
        return is_tagged_list(stmt, 'return_statement')
    }
    function return_statement_expression (stmt) {
        return head(tail(stmt))
    }

    // machine_code is array for machine instructions
    const machine_code = []

    // insert_pointer keeps track of the next free place
    // in machine_code
    let insert_pointer = 0

    // three insert functions (nullary, unary, binary instructions)
    function add_nullary_instruction (op_code) {
        machine_code[insert_pointer] = op_code
        insert_pointer = insert_pointer + 1
    }
    // unary instructions have one argument (constant or address)
    function add_unary_instruction (op_code, arg_1) {
        machine_code[insert_pointer] = op_code
        machine_code[insert_pointer + 1] = arg_1
        insert_pointer = insert_pointer + 2
    }
    // binary instructions have two arguments
    function add_binary_instruction (op_code, arg_1, arg_2) {
        machine_code[insert_pointer] = op_code
        machine_code[insert_pointer + 1] = arg_1
        machine_code[insert_pointer + 2] = arg_2
        insert_pointer = insert_pointer + 3
    }
    // ternary instructions have three arguments
    function add_ternary_instruction (op_code, arg_1, arg_2, arg_3) {
        machine_code[insert_pointer] = op_code
        machine_code[insert_pointer + 1] = arg_1
        machine_code[insert_pointer + 2] = arg_2
        machine_code[insert_pointer + 3] = arg_3
        insert_pointer = insert_pointer + 4
    }

    // to_compile stack keeps track of remaining compiler work:
    // these are function bodies that still need to be compiled
    let to_compile = null
    function no_more_to_compile () {
        return is_null(to_compile)
    }
    function pop_to_compile () {
        const next = head(to_compile)
        to_compile = tail(to_compile)
        return next
    }
    function push_to_compile (task) {
        to_compile = pair(task, to_compile)
    }

    // to compile a function body, we need an index table
    // to get the environment indices for each name
    // (parameters, globals and locals)
    // Each compile function returns the max operand stack
    // size needed for running the code. When compilation of
    // a function body is done, the function continue_to_compile
    // writes the max operand stack size and the address of the
    // function body to the given addresses.

    function make_to_compile_task (
        function_body,
        max_stack_size_address,
        address_address,
        index_table
    ) {
        return list(
            function_body,
            max_stack_size_address,
            address_address,
            index_table
        )
    }
    function to_compile_task_body (to_compile_task) {
        return list_ref(to_compile_task, 0)
    }
    function to_compile_task_max_stack_size_address (to_compile_task) {
        return list_ref(to_compile_task, 1)
    }
    function to_compile_task_address_address (to_compile_task) {
        return list_ref(to_compile_task, 2)
    }
    function to_compile_task_index_table (to_compile_task) {
        return list_ref(to_compile_task, 3)
    }

    // index_table keeps track of environment addresses
    // assigned to names
    function make_empty_index_table () {
        return null
    }
    function extend_index_table (t, s) {
        return is_null(t)
            ? list(pair(s, 0))
            : pair(pair(s, tail(head(t)) + 1), t)
    }
    function index_of (t, s) {
        return is_null(t)
            ? error(s, 'name not found:')
            : head(head(t)) === s
            ? tail(head(t))
            : index_of(tail(t), s)
    }

    // a small complication: the toplevel function
    // needs to return the value of the last statement
    let toplevel = true

    function continue_to_compile () {
        while (!is_null(to_compile)) {
            const next_to_compile = pop_to_compile()
            const address_address = to_compile_task_address_address(
                next_to_compile
            )
            machine_code[address_address] = insert_pointer
            const index_table = to_compile_task_index_table(next_to_compile)
            const max_stack_size_address = to_compile_task_max_stack_size_address(
                next_to_compile
            )
            const body = to_compile_task_body(next_to_compile)
            const max_stack_size = compile(body, index_table, true)
            machine_code[max_stack_size_address] = max_stack_size
            toplevel = false
        }
    }

    function scan_out_declarations (component) {
        return is_sequence(component)
            ? accumulate(
                  append,
                  null,
                  map(scan_out_declarations, sequence_statements(component))
              )
            : is_declaration(component)
            ? list(declaration_symbol(component))
            : null
    }

    // compile_arguments compiles the arguments and
    // computes the maximal stack size needed for
    // computing the arguments. Note that the arguments
    // themselves accumulate on the operand stack, which
    // explains the "i + compile(...)"
    function compile_arguments (exprs, index_table) {
        let i = 0
        let s = length(exprs)
        let max_stack_size = 0
        while (i < s) {
            max_stack_size = math_max(
                i + compile(head(exprs), index_table, false),
                max_stack_size
            )
            i = i + 1
            exprs = tail(exprs)
        }
        return max_stack_size
    }

    function compile_logical_composition (expr, index_table) {
        if (logical_composition_operator(expr) === '&&') {
            return compile(
                make_conditional_expression(
                    first_operand(expr),
                    second_operand(expr),
                    make_literal(false)
                ),
                index_table,
                false
            )
        } else {
            return compile(
                make_conditional_expression(
                    first_operand(expr),
                    make_literal(true),
                    second_operand(expr)
                ),
                index_table,
                false
            )
        }
    }

    function compile_conditional_expression (expr, index_table, insert_flag) {
        const m_1 = compile(cond_expr_pred(expr), index_table, false)
        add_unary_instruction(JOF, NaN)
        const JOF_address_address = insert_pointer - 1
        const m_2 = compile(cond_expr_cons(expr), index_table, insert_flag)
        let GOTO_address_address = NaN
        if (!insert_flag) {
            add_unary_instruction(GOTO, NaN)
            GOTO_address_address = insert_pointer - 1
        } else {
        }
        machine_code[JOF_address_address] = insert_pointer
        const m_3 = compile(cond_expr_alt(expr), index_table, insert_flag)
        if (!insert_flag) {
            machine_code[GOTO_address_address] = insert_pointer
        } else {
        }
        return math_max(m_1, m_2, m_3)
    }

    function compile_operator_combination (expr, index_table) {
        const op = operator_symbol(expr)
        const operand_1 = first_operand(expr)
        if (op === '!') {
            const max_stack_size = compile(operand_1, index_table, false)
            add_nullary_instruction(NOT)
            return max_stack_size
        } else {
            const operand_2 = second_operand(expr)
            const op_code =
                op === '+'
                    ? PLUS
                    : op === '-'
                    ? MINUS
                    : op === '*'
                    ? TIMES
                    : op === '/'
                    ? DIV
                    : op === '==='
                    ? EQUAL
                    : op === '<'
                    ? LESS
                    : op === '<='
                    ? LEQ
                    : op === '>'
                    ? GREATER
                    : op === '>='
                    ? GEQ
                    : error(op, 'unknown operator:')
            const m_1 = compile(operand_1, index_table, false)
            const m_2 = compile(operand_2, index_table, false)
            add_nullary_instruction(op_code)
            return math_max(m_1, 1 + m_2)
        }
    }

    function compile_application (expr, index_table) {
        const max_stack_operator = compile(
            function_expression(expr),
            index_table,
            false
        )
        const max_stack_operands = compile_arguments(
            arg_expressions(expr),
            index_table
        )
        add_unary_instruction(CALL, length(arg_expressions(expr)))
        return math_max(max_stack_operator, max_stack_operands + 1)
    }

    function compile_lambda_expression (expr, index_table) {
        const the_body = lambda_body(expr)
        const body = is_block(the_body) ? block_body(the_body) : the_body
        const locals = scan_out_declarations(body)
        const parameters = lambda_parameter_symbols(expr)
        const extended_index_table = accumulate(
            (s, it) => extend_index_table(it, s),
            index_table,
            append(reverse(locals), reverse(parameters))
        )
        add_ternary_instruction(
            LDF,
            NaN,
            NaN,
            length(parameters) + length(locals)
        )
        const max_stack_size_address = insert_pointer - 3
        const address_address = insert_pointer - 2
        push_to_compile(
            make_to_compile_task(
                body,
                max_stack_size_address,
                address_address,
                extended_index_table
            )
        )
        return 1
    }

    function compile_sequence (expr, index_table, insert_flag) {
        const statements = sequence_statements(expr)
        if (is_empty_sequence(statements)) {
            return 0
        } else if (is_last_statement(statements)) {
            return compile(
                first_statement(statements),
                index_table,
                insert_flag
            )
        } else {
            const m_1 = compile(first_statement(statements), index_table, false)
            add_nullary_instruction(POP)
            const m_2 = compile(
                make_sequence(rest_statements(statements)),
                index_table,
                insert_flag
            )
            return math_max(m_1, m_2)
        }
    }

    function compile_constant_declaration (expr, index_table) {
        const name = declaration_symbol(expr)
        const index = index_of(index_table, name)
        const max_stack_size = compile(
            constant_declaration_value(expr),
            index_table,
            false
        )
        add_unary_instruction(ASSIGN, [index, name])
        add_nullary_instruction(LDCU)
        return max_stack_size
    }

    function compile (expr, index_table, insert_flag) {
        let max_stack_size = 0
        if (is_literal(expr)) {
            if (is_number(literal_value(expr))) {
                add_unary_instruction(LDCN, literal_value(expr))
                max_stack_size = 1
            } else if (is_boolean(literal_value(expr))) {
                add_unary_instruction(LDCB, literal_value(expr))
                max_stack_size = 1
            } else {
                error(expr, 'unknown literal:')
            }
        } else if (is_undefined_expression(expr)) {
            add_nullary_instruction(LDCU)
            max_stack_size = 1
        } else if (is_logical_composition(expr)) {
            max_stack_size = compile_logical_composition(expr, index_table)
        } else if (is_conditional_expression(expr)) {
            max_stack_size = compile_conditional_expression(
                expr,
                index_table,
                insert_flag
            )
            insert_flag = false
        } else if (is_operator_combination(expr)) {
            max_stack_size = compile_operator_combination(expr, index_table)
        } else if (is_application(expr)) {
            max_stack_size = compile_application(expr, index_table)
        } else if (is_lambda_expression(expr)) {
            max_stack_size = compile_lambda_expression(expr, index_table)
        } else if (is_name(expr)) {
            add_unary_instruction(
                LD,
                index_of(index_table, symbol_of_name(expr))
            )
            max_stack_size = 1
        } else if (is_sequence(expr)) {
            max_stack_size = compile_sequence(expr, index_table, insert_flag)
            insert_flag = false
        } else if (is_constant_declaration(expr)) {
            max_stack_size = compile_constant_declaration(expr, index_table)
        } else if (is_function_declaration(expr)) {
            max_stack_size = compile(
                function_decl_to_constant_decl(expr),
                index_table,
                insert_flag
            )
        } else if (is_return_statement(expr)) {
            max_stack_size = compile(
                return_statement_expression(expr),
                index_table,
                false
            )
        } else {
            error(expr, 'unknown expression:')
        }

        // handling of return
        if (insert_flag) {
            if (is_return_statement(expr)) {
                add_nullary_instruction(RTN)
            } else if (
                toplevel &&
                (is_literal(expr) ||
                    is_undefined_expression(expr) ||
                    is_application(expr) ||
                    is_operator_combination(expr) ||
                    is_name(expr))
            ) {
                add_nullary_instruction(RTN)
            } else {
                add_nullary_instruction(LDCU)
                max_stack_size = max_stack_size + 1
                add_nullary_instruction(RTN)
            }
        } else {
        }
        return max_stack_size
    }

    const program = parse(string)
    add_nullary_instruction(START)
    add_ternary_instruction(
        LDF,
        NaN,
        NaN,
        length(scan_out_declarations(program))
    )
    const LDF_max_stack_size_address = insert_pointer - 3
    const LDF_address_address = insert_pointer - 2
    add_unary_instruction(CALL, 0)
    add_nullary_instruction(DONE)

    const locals = reverse(scan_out_declarations(program))
    const program_names_index_table = accumulate(
        (s, it) => extend_index_table(it, s),
        make_empty_index_table(),
        locals
    )

    push_to_compile(
        make_to_compile_task(
            program,
            LDF_max_stack_size_address,
            LDF_address_address,
            program_names_index_table
        )
    )
    continue_to_compile()
    return machine_code
}

function copy_arr (arr) {
    return JSON.parse(JSON.stringify(arr))
}

function copy_map (map) {
    return new Map(copy_arr(Array.from(map)))
}

// CESK STARTS HERE

// "registers" are the global variables of our machine.
// These contain primitive values (numbers or boolean
// values) or arrays of primitive values

// P is an array that contains an SVML machine program:
// the op-codes of instructions and their arguments
let P = []

let initialState = [0, [], new Map(), new Map(), '', '0', 0]

// Transition from one state to array of new states
function transition (state) {
    // PC is program counter: index of the next instruction
    let PC = state[0]
    // OS is operand stack, array where last element is top of stack
    // Stores numbers, bools and closures
    // Closures represented by label, func PC, the addr to ENV, and number to extend by
    let OS = copy_arr(state[1])
    // ENV is a map which maps names to addresses
    let ENV = copy_map(state[2])
    // STORE is a map which maps addresses to values
    let STORE = copy_map(state[3])
    // KONT is an address to the continuation stored in the STORE
    // Continuations stores PC, OS, ENV, previous KONT, TIME and counter
    let KONT = state[4]
    // TIME, concatenated PC of call stack
    let TIME = state[5]
    // counter for assigning the addresses in the current function
    let counter = state[6]

    // Possible next states
    let next_states = []

    let M = [] // Maps opcodes to functions that set next_states

    const UNUM = 'unum' // Unknown number
    const UBOOL = 'ubool' // Unknown bool

    // Adds to M simple instructions (opcode 0-14) that only manipulate OS and PC
    function load_primitives () {
        let MM = []

        MM[LDCN] = () => {
            let val = P[PC + 1]
            if (val < MIN_NUM || val > MAX_NUM) {
                val = UNUM
            }
            OS.push(val)
            PC += 2
        }

        MM[LDCB] = () => {
            OS.push(P[PC + 1]) // value
            PC += 2
        }

        MM[LDCU] = () => {
            OS.push('undef')
            PC += 1
        }

        function applyNumNumBinop (f) {
            let b = OS.pop()
            let a = OS.pop()
            let c = UNUM
            if (a != UNUM && b != UNUM) {
                let r = f(a, b)
                if (r >= MIN_NUM && r <= MAX_NUM) {
                    c = r
                }
            }
            OS.push(c)
            PC += 1
        }

        MM[PLUS] = () => {
            applyNumNumBinop((x, y) => x + y)
        }
        MM[MINUS] = () => {
            applyNumNumBinop((x, y) => x - y)
        }
        MM[TIMES] = () => {
            applyNumNumBinop((x, y) => x * y)
        }
        MM[DIV] = () => {
            applyNumNumBinop((x, y) => x / y)
        }

        function applyNumBoolBinop (f) {
            let b = OS.pop()
            let a = OS.pop()
            let c = UBOOL
            if (a != UNUM && b != UNUM) {
                c = f(a, b)
            }
            OS.push(c)
            PC += 1
        }

        MM[EQUAL] = () => {
            applyNumBoolBinop((x, y) => x == y)
        }
        MM[LESS] = () => {
            applyNumBoolBinop((x, y) => x < y)
        }
        MM[GREATER] = () => {
            applyNumBoolBinop((x, y) => x > y)
        }
        MM[GEQ] = () => {
            applyNumBoolBinop((x, y) => x >= y)
        }
        MM[LEQ] = () => {
            applyNumBoolBinop((x, y) => x <= y)
        }

        MM[NOT] = () => {
            let a = OS.pop()
            let r = UBOOL
            if (a != UBOOL) {
                r = !a
            }
            OS.push(r)
            PC += 1
        }

        MM[START] = () => {
            PC += 1
        }

        MM[POP] = () => {
            OS.pop()
            PC += 1
        }

        // Add functions to M
        MM.forEach((v, index) => {
            M[index] = () => {
                v() // Apply transition
                next_states = [[PC, OS, ENV, STORE, KONT, TIME, counter]] // Save as next state
            }
        })
    }
    load_primitives()

    // Adds value to store
    function set_store (addr, new_val) {
        let new_str = JSON.stringify(new_val)
        if (STORE.has(addr)) {
            let arr = STORE.get(addr)
            for (let v of arr) {
                if (new_str === JSON.stringify(v)) {
                    return // Item already in array
                }
            }
            arr.push(new_val)
        } else {
            STORE.set(addr, [new_val]) // First entry in store
        }
    }

    // Loads array of values from store
    function load_store (addr) {
        return JSON.parse(JSON.stringify(STORE.get(addr)))
    }

    // gives the address
    function alloc () {
        counter += 1
        return TIME + '.v' + counter
    }

    // load a closure into the OS to either CALL or ASSIGN
    // extend the current env by num_consts and store
    M[LDF] = () => {
        const fun_addr = P[PC + 2]
        const num_to_extend = P[PC + 3]
        const env_addr = fun_addr + '.env'
        set_store(env_addr, Array.from(ENV))
        const closure = ['CLOSURE']
        closure[1] = fun_addr
        closure[2] = env_addr
        closure[3] = num_to_extend
        OS.push(closure)
        PC += 4
        next_states = [[PC, OS, ENV, STORE, KONT, TIME, counter]]
    }

    M[CALL] = () => {
        // Get params
        const num_param = P[PC + 1] // Number of parameters
        const params = []
        for (let i = 0; i < num_param; i++) {
            params.push(OS.pop())
        }

        // Get closure
        const closure = OS.pop()
        const new_pc = closure[1]
        const func_env_addr = closure[2]
        const num_to_extend = closure[3]

        // Save current state
        const kont_env = Array.from(ENV)
        const kont_addr = TIME + '.' + PC + '.kont'
        const kont_env_addr = kont_addr + '.env'
        const kont_os_addr = kont_addr + '.os'
        const kont_os = OS
        const kont = [
            PC + 1,
            kont_os_addr,
            kont_env_addr,
            KONT,
            TIME,
            counter + num_to_extend
        ]
        set_store(kont_env_addr, kont_env)
        set_store(kont_os_addr, kont_os)
        set_store(kont_addr, kont)

        function cont (func_env_arr) {
            // Make new env
            const new_env = new Map(func_env_arr)
            const original_size = new_env.size
            // Extend the new_env by num_to_extend (params.length + locals.length)
            for (let i = 0; i < num_to_extend; i++) {
                new_env.set(original_size + i, alloc())
            }
            // Add parameters
            for (let i = 0; i < num_param; i++) {
                let addr = new_env.get(original_size + i)
                set_store(addr, params[params.length - 1 - i])
            }
            // Transition to function
            PC = new_pc
            OS = []
            ENV = new_env
            KONT = kont_addr
            if (TIME.split('.').length < MAX_TIME) {
                TIME = TIME + '.' + PC
            }
            counter = 0
            next_states.push([PC, OS, ENV, STORE, KONT, TIME, counter])
        }
        for (let func_env_arr of load_store(func_env_addr)) {
            const copy = [Array.from(STORE), TIME, counter]
            cont(func_env_arr)
            // Restore state from copy
            STORE = new Map(copy[0])
            TIME = copy[1]
            counter = copy[2]
        }
    }

    M[RTN] = () => {
        const top_val = OS.pop()
        const kont_addr = KONT

        for (let kont of load_store(kont_addr)) {
            const kont_os_addr = kont[1]
            const kont_env_addr = kont[2]
            KONT = kont[3]
            TIME = kont[4]
            counter = kont[5]
            for (let OS of load_store(kont_os_addr)) {
                OS.push(top_val)
                for (let env_arr of load_store(kont_env_addr)) {
                    ENV = new Map(env_arr)
                    PC = kont[0] + 1
                    next_states.push([PC, OS, ENV, STORE, KONT, TIME, counter])
                }
            }
        }
    }

    M[LD] = () => {
        const env_name = P[PC + 1]
        const store_addr = ENV.get(env_name)

        function cont (val, PC, OS) {
            OS.push(val)
            PC += 2
            next_states.push([PC, OS, ENV, STORE, KONT, TIME, counter])
        }

        for (let val of load_store(store_addr)) {
            cont(val, PC, copy_arr(OS))
        }
    }

    M[ASSIGN] = () => {
        const val = OS.pop()
        const env_name = P[PC + 1][0]
        const string_name = P[PC + 1][1]
        const store_addr = ENV.get(env_name)
        set_store(store_addr, val)
        PC += 2
        next_states = [[PC, OS, ENV, STORE, KONT, TIME, counter]]
    }

    M[JOF] = () => {
        const val = OS.pop()
        if (val === true || val === UBOOL) {
            next_states.push([PC + 2, OS, ENV, STORE, KONT, TIME, counter])
        }
        if (val === false || val === UBOOL) {
            next_states.push([P[PC + 1], OS, ENV, STORE, KONT, TIME, counter])
        }
    }

    M[GOTO] = () => {
        next_states = [[P[PC + 1], OS, ENV, STORE, KONT, TIME, counter]]
    }

    M[DONE] = () => {
        console.log('FINISHED EXECUTION')
        next_states = []
    }

    if (M[P[PC]] == undefined) {
        error('undefined instruction')
        return []
    } else {
        M[P[PC]]()
    }

    return next_states
}

function cesk_run () {
    function stringify_state (state) {
        let copy = [...state] // Shallow copy
        copy[2] = Array.from(state[2]) // ENV
        copy[3] = Array.from(state[3]) // STORE
        return JSON.stringify(copy)
    }

    let nextStates = [initialState] // Stack of states to DFS

    let nodes = [] // contains [state,children] of visited nodes
    let strToIndex = new Map() // Maps stringified state to index in nodes

    while (nextStates.length > 0) {
        let cur = nextStates.pop()
        if (strToIndex.has(stringify_state(cur))) {
            console.log('DUPE')
            //display_STATE(cur)
            continue // If state has been visited
        }
        // Transition current state
        display_STATE(cur)
        let children = transition(cur)
        console.log('CHIDREN: ' + children.length)
        // Add state to visited nodes
        nodes.push([cur, children])
        strToIndex.set(stringify_state(cur), nodes.length - 1)
        // Add children to stack
        nextStates.push(...[...children].reverse()) // shallow copy, reverse and append
        // Bound number of states visited
        if (nodes.length == MAX_COUNT) {
            console.log('BROKE')
            break
        }
    }
}

function display_STATE (state) {
    function display_PC (pc) {
        const op = P[pc]
        let s = get_name(P[pc])
        if (
            op === LDCN ||
            op === LDCB ||
            op === GOTO ||
            op === JOF ||
            op === ASSIGN ||
            op === LDF ||
            op === LD ||
            op === CALL
        ) {
            s = s + ' ' + stringify(P[pc + 1])
        } else if (op === LDF) {
            s = s + ' ' + stringify(P[pc + 1]) + ' ' + stringify(P[pc + 2])
        }
        return s
    }

    function display_ENV (env) {
        function log_map (v, k, m) {
            console.log(k + '->' + v)
        }
        console.log('ENV: ')
        env.forEach(log_map)
        console.log('')
    }

    function display_STORE (store) {
        function log_map (v, k, m) {
            function stringify_entry (arr) {
                return arr.map(JSON.stringify).join(' || ')
            }
            console.log(k + '-> ' + stringify_entry(v))
        }
        console.log('STORE:')
        store.forEach(log_map)
        console.log('')
    }

    let [PC, OS, ENV, STORE, KONT, TIME, counter] = state
    console.log('----------------------------------')
    console.log('OS: ')
    console.log(OS)
    display_ENV(ENV)
    display_STORE(STORE)
    console.log('TIME: ' + TIME + '\n')
    console.log('KONT*: ' + KONT + '\n')
    console.log('PC: ' + PC + '\t' + display_PC(PC) + '\n')
    console.log('----------------------------------')
}

P = parse_and_compile(`
    function f(x) {
        function g(){
            return x;
        }
        return g;
    }
    f(7)();
    f(8)();
`)
P = parse_and_compile(`
function f(x, y) {
    return x + y;
    }
    function xyz() {
    return 2;
    }
    f(3, 4);
    f(3,4);
    xyz();
`)


P = parse_and_compile(`
    function f(x) {
        return x===1 ? 1 :f(x-1);
    }
    f(3);
`)

P = parse_and_compile(`
    const z = 3;
    function f(x) {
        return (y) => x + y;
    }
    f(1)(50);

    f(2)(52);
`)
// P = parse_and_compile(`
//     const z = 3;
//     const y = 4;
//     function f(x) {
//         return x + z + y;
//     }
//     f(1);
// `)

const MAX_NUM = 10
const MIN_NUM = -10
let MAX_TIME = 2 // Maximum length of TIME, will be truncated if exceeding
let MAX_COUNT = -1 // Number of iterations to run
cesk_run()
print_program(P)
