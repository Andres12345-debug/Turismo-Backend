//Midelware
import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class Seguridad implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ respuesta: 'Petición negada. Token requerido.' });
    }

    try {
      // Eliminar el "Bearer " del header
      const token = authHeader.replace('Bearer ', '').trim();

      // Validar el token con tu clave secreta
      const datosSesion = verify(token, 'laClaveSecreta');

      // ✅ Guardar en la request
      (req as any).datosUsuario = datosSesion;

      next();
    } catch (error) {
      return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
  }
}
