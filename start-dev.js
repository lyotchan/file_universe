const { spawn } = require('child_process')
const { config } = require('dotenv')

config({ path: './.env.local' })
const port = process.env.DEV_PORT || 3000
const dev = spawn('pnpm', ['dev', '-p', port], {
  stdio: 'inherit',
  shell: true
})

dev.on('exit', code => {
  process.exit(code)
})
