#!/usr/bin/env bun

/**
 * Validate JSON Resume files with the `resumed` cli, which only accepts one file at a time.
 * Usage : bun src/bin/json-resume-resumed.cli.ts [glob]
 */

import { spawnSync } from 'node:child_process'
import { globSync } from 'node:fs'
import path from 'node:path'
import { argv, exit, stdout } from 'node:process'

const cliArgvOffset = 2
const defaultPattern = 'data/*JsonResume*.json'

/**
 * Run `resumed validate` on one file
 * @param file the resume file to validate
 * @returns true when resumed validated the file
 */
export function validateFile(file: string) {
  return spawnSync('bun', ['x', 'resumed', 'validate', file], { stdio: 'inherit' }).status === 0
}

/**
 * Validate every file matching a glob, stopping at the first invalid one
 * @param pattern the glob of the resume files to validate
 * @param validate the function validating one file
 * @returns the process exit code, 0 on success
 */
export function validateAll(pattern = defaultPattern, validate = validateFile) {
  const files = globSync(pattern)
  if (files.length === 0) {
    stdout.write(`No file matches "${pattern}"\n`)
    return 1
  }
  if (!files.every(file => validate(file))) return 1
  stdout.write('resumed check success\n')
  return 0
}

/** only run when invoked as a CLI, so tests can import the helpers above */
/* v8 ignore next -- the entrypoint itself only runs in a subprocess, see src/tests/cli-e2e.test.ts */
if (argv[1] !== undefined && path.resolve(argv[1]) === import.meta.filename) exit(validateAll(argv[cliArgvOffset]))
