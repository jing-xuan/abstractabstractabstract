const { createContext, runInContext, parseError } = require('./hacked-slang/dist/index');
//const { createContext, runInContext, parseError } = require('js-slang');

const colors = require('colors/safe');
const {readFileSync }= require('fs');
const express = require('express');
const fs = require('fs').promises;

const app = express();

const DEFAULT_CHAPTER = -1
const DEFAULT_VARIANT = 'default'

/**
 * Source Interpreter
 * https://github.com/source-academy/js-slang/blob/master/src/repl/repl.ts#L95-L110
 */
async function interpret (code, chapter, variant) {
  const context = createContext(chapter, variant, undefined, undefined)

  const options = {
    scheduler: 'preemptive',
    executionMethod: ['interpreter', 'non-det'].includes(variant)
      ? 'interpreter'
      : 'native',
    variant: variant,
    useSubst: variant === 'substituter'
  }

  return runInContext(code, context, options).then(preludeResult => {
    if (['finished', 'suspended-non-det'].includes(preludeResult.status)) {
      return preludeResult.value
    } else {
      throw context.errors
    }
  })
}

async function test (chapter, variant, source_code) {
  try {
    test_output = await interpret(source_code, chapter, variant)
    return test_output;
  } catch (error) {
    try {
      console.log(colors.red(parseError(error)))
    } catch (error2) {
      console.log(colors.red(error))
    }
  }
}

async function test_source (usercode) {
  var base_code = await fs.readFile('abstract.js', 'utf-8')
  var test_code = base_code.trim()
  test_code += "\nP = parse_and_compile('" + usercode + "')\n"
  test_code += "print_program(P)\n"
  test_code += "cesk_run()\n"
  var test_output = await test(DEFAULT_CHAPTER, DEFAULT_VARIANT, test_code)
  return test_output;
}

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
})

app.get("/runcode", async function(req, res) {
  const usercode = (req.query.usercode).replace(/(\r\n|\n|\r)/gm, "")
  // console.log(usercode);
  var result = await test_source(usercode);
  // console.log(result);
  res.status(200).send(result);
})

var server = app.listen(8888, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("listening at %s:%s", host, port);
})

// console.log(t);
