import yaml from 'js-yaml'
import fs from 'fs'

class Config {
  constructor( file ) {
    console.log("Config " + file)

    this.config = yaml.safeLoad( fs.readFileSync( file, 'utf8' ) )
  }
}

export default Config
