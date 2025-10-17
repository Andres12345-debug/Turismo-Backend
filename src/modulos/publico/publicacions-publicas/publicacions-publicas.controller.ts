import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { PublicacionsPublicasService } from './publicacions-publicas.service';

@Controller('publicacions-publicas')
export class PublicacionsPublicasController {
  constructor(
    private readonly publicacionListarService: PublicacionsPublicasService,
  ) { }

  @Get('/publico')
  public listarTodas(): any {
    return this.publicacionListarService.consultar();
  }
  @Get('/one/:cod_publicacion')
  public consultarUnProducto(@Param() parametro: any): any {
    const codigoCate: number = Number(parametro.cod_publicacion);
    if (!isNaN(codigoCate)) {
      return this.publicacionListarService.consultarUno(codigoCate);
    } else {
      return new HttpException(
        'El código de la publicación no es válido',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
  @Get('/buscar/:titulo')
  public buscarPorTitulo(@Param('titulo') titulo: string): any {
    return this.publicacionListarService.buscarPorTitulo(titulo);
  }



}
