import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEndpointDto, UpdateEndpointDto } from './dto/endpoint.dto';
import {EndpointWeb} from "@able/api-shared";

@Injectable()
export class EndpointService {
  constructor(
    @InjectRepository(EndpointWeb)
    private endpointRepository: Repository<EndpointWeb>,
  ) {}

  async create(createEndpointDto: CreateEndpointDto): Promise<EndpointWeb> {
    // Check if endpoint- with same name or value already exists
    const existingEndpoint = await this.endpointRepository.findOne({
      where: [
        { name: createEndpointDto.name },
        { value: createEndpointDto.value },
      ],
    });

    if (existingEndpoint) {
      throw new ConflictException(
        'Endpoint with this name or value already exists',
      );
    }

    const endpoint = this.endpointRepository.create(createEndpointDto);
    return this.endpointRepository.save(endpoint);
  }

  async findAll(): Promise<EndpointWeb[]> {
    return this.endpointRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<EndpointWeb> {
    const endpoint = await this.endpointRepository.findOne({
      where: { id },
    });

    if (!endpoint) {
      throw new NotFoundException(`Endpoint with ID ${id} not found`);
    }

    return endpoint;
  }

  async update(id: number, updateEndpointDto: UpdateEndpointDto): Promise<EndpointWeb> {
    const endpoint = await this.findOne(id);

    // Check if another endpoint- with same name or value exists (excluding current one)
    if (updateEndpointDto.name || updateEndpointDto.value) {
      const existingEndpoint = await this.endpointRepository.findOne({
        where: [
          { name: updateEndpointDto.name },
          { value: updateEndpointDto.value },
        ],
      });

      if (existingEndpoint && existingEndpoint.id !== id) {
        throw new ConflictException(
          'Another endpoint- with this name or value already exists',
        );
      }
    }

    Object.assign(endpoint, updateEndpointDto);
    return this.endpointRepository.save(endpoint);
  }

  async remove(id: number): Promise<void> {
    const endpoint = await this.findOne(id);
    await this.endpointRepository.remove(endpoint);
  }

  async activate(id: number): Promise<EndpointWeb> {
    const endpoint = await this.findOne(id);
    endpoint.deactivatedAt = null;
    return this.endpointRepository.save(endpoint);
  }

  async deactivate(id: number): Promise<EndpointWeb> {
    const endpoint = await this.findOne(id);
    endpoint.deactivatedAt = new Date();
    return this.endpointRepository.save(endpoint);
  }
}
