// DEPRECATED: este helper se utilizaba para subir imágenes a AWS S3.
// Las plantillas de correo ahora usan el endpoint /apiv3/emailTemplates/upload
// para subir y servir imágenes desde el backend.
const AWS = require('aws-sdk')
import store from "../store"

export const servicecAWS = {
  uploadToS3
}

async function uploadToS3(fileItem, nameFile) {
  console.group('Inicio cargado AWS',fileItem,nameFile)


  const credentials = new AWS.Credentials('AKIA4UL5BS455UXSIPRO', '1reT5pqpYsi/3RmM2Zf++d8NHofWWTW6Q+zUjKQp')
  //const credentials = new AWS.Credentials('AKIAQCQRB7JT2PCRY4SH', 'SQybrpqz8Xw+PbckbOe03nA+2nSYRElqAVgKhsgU')

  const S3 = new AWS.S3({credentials})
  console.log('Credential Ok !',)

  const fileType = "image/"+ fileItem.name.split('.').pop()
  const bucket = nameFile.includes('a54_cfne') ? 'a54-choferes-fotos-no-entregado' : 'a54-choferes-fotos-documentacion-entrega'

  const params = {
    //Bucket: 'ludiica-dd-profesionales',
    Bucket: bucket,
    Key: nameFile,
    Body:fileItem,
    ContentType: fileType

  }
  console.log('Parametros ')

    return new Promise((resolve, reject )=> {


      store.dispatch("loading/mostrar", "Registrando fotografía")
      S3.putObject( params, (err, data) => {
        store.dispatch("loading/ocultar")
        if (err) reject(err)
        console.info('File uploaded successfully at')
        console.groupEnd()
        data.success = true
        resolve(data)
      })
  })

}
