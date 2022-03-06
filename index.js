const { createContext, runInContext, parseError } = require('./hacked-slang/dist/index');
//const { createContext, runInContext, parseError } = require('js-slang');

const colors = require('colors/safe');
const {readFileSync }= require('fs');

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
    console.log(test_output)
  } catch (error) {
    try {
      console.log(colors.red(parseError(error)))
    } catch (error2) {
      console.log(colors.red(error))
    }
  }
}

async function test_source () {
  const test_case = readFileSync('test.js', { encoding: 'utf-8' }).trim()

  return await test(DEFAULT_CHAPTER, DEFAULT_VARIANT, test_case)
}

test_source()
