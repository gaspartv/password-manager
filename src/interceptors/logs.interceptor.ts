import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Request } from "express";
import { Observable, catchError, tap, throwError } from "rxjs";
import { PrismaService } from "src/services/prisma/service";

const SENSITIVE_KEYS = [
  "password",
  "senha",
  "secret",
  "token",
  "authorization",
  "access_token",
  "refresh_token",
];

function sanitize<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitize(item)) as T;
  }

  if (typeof data === "object") {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      if (SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k))) {
        sanitized[key] = "*******";
      } else {
        sanitized[key] = sanitize(value);
      }
    }

    return sanitized as T;
  }

  return data;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const start = Date.now();

    return next.handle().pipe(
      tap(async (response) => {
        const duration = Date.now() - start;

        await this.prisma.log.create({
          data: {
            method: req.method,
            url: req.originalUrl,
            statusCode: context.switchToHttp().getResponse().statusCode,
            durationMs: duration,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            userId: req.user?.id ?? null,
            request: sanitize({
              headers: req.headers,
              body: req.body,
              query: req.query,
              params: req.params,
            }),
            response: sanitize(response),
          },
        });
      }),
      catchError(async (error) => {
        const duration = Date.now() - start;
        const statusCode =
          error instanceof HttpException ? error.getStatus() : 500;

        await this.prisma.log.create({
          data: {
            method: req.method,
            url: req.originalUrl,
            statusCode,
            durationMs: duration,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            userId: req.user?.id ?? null,
            request: sanitize({
              headers: req.headers,
              body: req.body,
              query: req.query,
              params: req.params,
            }),
            response: Prisma.JsonNull,
            error: error.message ?? String(error),
          },
        });

        return throwError(() => error);
      }),
    );
  }
}
