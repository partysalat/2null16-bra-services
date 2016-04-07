module.exports = {
  bundle:{
    app:"2null16-bra-bundle.js",
    vendor:"2null16-bra-vendor-bundle.js",
    url:"/internal/assets"
  },

  sql: {
    database: {
      $filter: 'env',
      $default: 'bra'
    },
    auth: {
      user: "user",
      pass: "pass"
    },
    settings: {
      host: {
        $filter: "env",
        $default: "localhost"
      },
      logging: false,
      dialect:'sqlite',

      storage: './database.sqlite',
      pool: {
        max: 10,
        min: 5
      }
    }
  },
  logger: {
    config: {
      file: {
        level: 'info',
        filename: './target/2null16-bra.log'
      },
      console: {
        silent: false
      }
    },
    component: '2null16-bra'
  }
};