module.exports = {
  apps: [
    {
      name: "prod:password-manager", // Nome do processo
      script: "dist/src/main.js", // Caminho do arquivo principal (ajuste conforme seu build)
      instances: 1, // Socket.IO requer 1 instância ou sticky sessions
      exec_mode: "fork", // Fork mode para Socket.IO funcionar corretamente
      watch: false, // Desative em produção
      max_memory_restart: "300M", // Reinicia se passar desse limite
      env_production: {
        NODE_ENV: "production",
        PORT: 3801,
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      autorestart: true,
      restart_delay: 5000, // Espera 5s antes de tentar reiniciar
    },
  ],
};
