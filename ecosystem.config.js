module.exports = {
  apps : [{
    name: 'Cutie',
		script: 'index.js',
    watch: 'false',
		error_file: 'err.log',
		time: true,
		exp_backoff_restart_delay: 100
  }],
}
