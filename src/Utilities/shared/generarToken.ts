import { sign } from "jsonwebtoken";

class GenerarToken{
    public static procesarRespuesta(datosSesion: any): string{
        let token: string="";
        console.log(datosSesion);
        
        token = sign({
            id:datosSesion.cod_usuario,
            nombre: datosSesion.nombre_usuario,
            rol: datosSesion.nombre_rol,
            telefono: datosSesion.telefono_usuario,
            access: datosSesion.nombre_acceso

        },"laClaveSecreta", {expiresIn: "8h"});
    
        return token;

    }
}

export default GenerarToken;