import * as fs from 'fs'
import * as path from 'path'
import * as rimraf from 'rimraf'

function ignoreModules(modulesList: string[], nodePath?: string): void {
  let rootDir: string | undefined = nodePath ? path.resolve(nodePath, '..') : undefined

  let currentDir: string = __dirname
  let lastDir: string = ''

  while(!rootDir && lastDir !== currentDir) {
    if (fs.existsSync(path.resolve(`${currentDir}/package.json`))) {
      rootDir = currentDir
    }
    lastDir = currentDir
    currentDir = path.resolve(currentDir, '..')
  }

  console.log('rootDir -----');
  console.log(rootDir);
  
  if (rootDir) {
    nodePath = path.resolve(rootDir, 'node_modules')

    const knexPath = path.resolve(nodePath, '')
    for (const module of modulesList) {
      const packageJson = `{\n"name": "${module}",\n"main": "index.js"\n}\n`
      const moduleJsFile = `export default {}\n`

      const modulePath = path.resolve(nodePath, module)

      console.log('\nRecreate directory ------');
      console.log(modulePath);

      rimraf.sync(modulePath)

      fs.mkdirSync(modulePath)

      console.log('Create files ---------');
 
      fs.writeFileSync(path.resolve(modulePath, 'package.json'), packageJson, { encoding: 'utf8' })
      fs.writeFileSync(path.resolve(modulePath, 'index.js'), moduleJsFile, { encoding: 'utf8' })
    }
  } else {
    throw new Error('No package.json was found in any of the parents directories! Make sure you have one in your root project directory! This will determine the path to node_modules.')
  }
}
