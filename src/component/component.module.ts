import { Module } from '@nestjs/common';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from './entities/component.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [ComponentController],
  providers: [ComponentService],
  imports: [ TypeOrmModule.forFeature([ Component ]), PassportModule.register({ defaultStrategy: 'jwt' }) ],
  exports: [ TypeOrmModule ]
})
export class ComponentModule {}

