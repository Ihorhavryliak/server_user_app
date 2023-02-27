import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function start() {
  //Set the port for the application to listen on
  const PORT = process.env.PORT || 5000;

  //Create the Nest Application and pass it App Module
  const app = await NestFactory.create(AppModule);

  //Set up the configuration for the Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle("Tiny server")
    .setDescription("Documentation REST API")
    .setVersion("1.0.0")
    .build();

  //Create the swagger documents passing in the app and configuration
  const document = SwaggerModule.createDocument(app, config);

  //Set up the Swagger Module for a '/docs' endpoint
  SwaggerModule.setup("/", app, document);

  //Listen on the allocated port
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

start();
