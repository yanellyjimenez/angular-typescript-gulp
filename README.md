# angular-typescript-gulp


Como usuario root ejecutamos:

  sudo apt-get install npm
  npm install -g gulp

Como usuario local dentro del folder de la app ejecutamos:

  /src/main/webapp/resources/js/app$ npm install

El archivo de configuración de gulp hace referencia a gulconfig.json, éste únicamente contiene las rutas destino y origen, 
y demás información relativa a nuestro ambiente local de desarrollo, puedes visitar el enlace de abajo para mayor referencia
del cómo configurar tu propio gulpconfig.

https://yanellyjm.wordpress.com/js

Ejecutamos el comando que habilita la tarea de compilación y despliegue, la cual es la tarea por default que se configuró.

  /src/main/webapp/resources/js/app$ gulp

Finalmente habilitamos el modo de Desarrollo, con esto no será necesario estar regenerando la app cada vez que realicemos un cambio.

  /src/main/webapp/resources/js/app$ gulp watch


REFERENCIAS

https://angular.io/docs/js/latest/quickstart.html
https://www.npmjs.com/package/gulp
