import { Injectable, Logger } from "@nestjs/common";
import nodemailer, { Transporter } from "nodemailer";
import { env } from "src/env.config";

@Injectable()
export class NodemailerService {
  private readonly logger = new Logger(NodemailerService.name);
  private transporter: Transporter;

  constructor() {
    let secure = env.SMTP_SECURE || env.SMTP_PORT === 465;
    let requireTLS = env.SMTP_REQUIRE_TLS;

    if (env.SMTP_PORT === 587 && secure) {
      this.logger.warn(
        "SMTP: secure=true com porta 587 detectado. Ajustando para secure=false e requireTLS=true (STARTTLS).",
      );
      secure = false;
      requireTLS = true;
    }

    if (env.SMTP_PORT === 465 && !secure) {
      this.logger.warn(
        "SMTP: secure=false com porta 465 detectado. Ajustando para secure=true (SSL).",
      );
      secure = true;
    }

    this.logger.log(
      `SMTP config: host=${env.SMTP_HOST} port=${env.SMTP_PORT} secure=${secure} requireTLS=${requireTLS} debug=${env.SMTP_DEBUG}`,
    );

    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      requireTLS,
      tls: { rejectUnauthorized: env.SMTP_TLS_REJECT_UNAUTHORIZED },
      logger: env.SMTP_DEBUG,
      debug: env.SMTP_DEBUG,
    });

    if (env.SMTP_VERIFY_ON_BOOT) {
      this.transporter
        .verify()
        .then(() => this.logger.log("SMTP transporter verificado com sucesso"))
        .catch((err) =>
          this.logger.error(
            "Falha ao verificar SMTP transporter",
            err?.message,
          ),
        );
    }
  }

  async sendMail(options: {
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
    attachments?: Array<{
      filename: string;
      content?: any;
      path?: string;
      contentType?: string;
    }>;
  }): Promise<void> {
    const fromName = env.MAIL_FROM_NAME ?? env.API_NAME;
    const from = `${fromName} <${env.MAIL_FROM_ADDRESS ?? env.SMTP_USER}>`;

    await this.transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      attachments: options.attachments,
    });
  }
}
