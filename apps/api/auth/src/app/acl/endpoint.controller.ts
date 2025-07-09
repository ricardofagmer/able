import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    ParseIntPipe,
    HttpCode,
    HttpStatus, Patch,
} from '@nestjs/common';
import { EndpointService } from './endpoint.service';
import { CreateEndpointDto, UpdateEndpointDto } from './dto/endpoint.dto';
import { EndpointWeb } from '@able/api-shared';

@Controller('endpoint')
export class EndpointController {
  constructor(private readonly endpointService: EndpointService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEndpointDto: CreateEndpointDto): Promise<EndpointWeb> {
    return this.endpointService.create(createEndpointDto);
  }

  @Get('getAll')
  async findAll(): Promise<EndpointWeb[]> {
    return this.endpointService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<EndpointWeb> {
    return this.endpointService.findOne(id);
  }

  @Patch('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEndpointDto: UpdateEndpointDto,
  ): Promise<EndpointWeb> {
    return this.endpointService.update(id, updateEndpointDto);
  }

  @Delete('remove/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.endpointService.remove(id);
  }

  @Put(':id/activate')
  async activate(@Param('id', ParseIntPipe) id: number): Promise<EndpointWeb> {
    return this.endpointService.activate(id);
  }

  @Put(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number): Promise<EndpointWeb> {
    return this.endpointService.deactivate(id);
  }
}
