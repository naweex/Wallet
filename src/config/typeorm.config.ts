import {TypeOrmModuleOptions} from "@nestjs/typeorm";

export function TypeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "48280535",
    database: "wallet",
    autoLoadEntities: false,
    synchronize: true,
    entities: [
      "dist/**/**/**/*.entity{.ts,.js}",
      "dist/**/**/*.entity{.ts,.js}"
    ]
  }; 
}
 