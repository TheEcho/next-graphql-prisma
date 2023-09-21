import { mkdir, writeFile } from 'fs/promises'
import { print } from 'graphql'
import { noop } from 'lodash'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'

const argv = yargs(hideBin(process.argv))
  .options('output', {
    alias: 'o',
    type: 'string',
    description: 'Full output path (including filename)',
    demandOption: true,
  })
  .help()
  .parseSync()

const outputPath = argv.output

async function main(): Promise<void> {
  // Create final merged .graphql schema, use load synchronously to make it reproducible
  const loadedFiles = loadFilesSync(`${import.meta.dir}/../src/schema/**/*.graphql`)

  const typeDefs = mergeTypeDefs(loadedFiles)
  const printedTypeDefs = print(typeDefs)

  // Create output folder if it does not exist
  const arrayPath = outputPath.split('/')
  arrayPath.pop()
  const folderPath = arrayPath.join('/')
  await mkdir(folderPath, { recursive: true })
    // We don't care if this fails, it probably means that it exists already.
    .catch(noop)

  // Write to final file
  await writeFile(outputPath, printedTypeDefs)
}

main()
