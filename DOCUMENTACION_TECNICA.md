# TRABAJO FINAL INTEGRADOR<br>Plataforma online de venta de calzado
<span style="font-size: 16px;">El proyecto tiene como objetivo desarrollar una aplicación web que permita gestionar y 
comercializar calzado en línea. La plataforma contará con un frontend navegable, intuitivo y 
agradable para el usuario final y un backend con API, y base de datos para reservar datos. </span><br>

<span style="font-size: 16px;">El usuario podrá navegar por el sitio web y visualizar el catálogo de calzados con la 
posibilidad de utilizar filtros para facilitar su experiencia a la hora de elegir productos. Esto 
se logrará con React mostrando los productos que se obtendrán desde la base de datos 
MySQL, con la API REST mediante. El filtrado funcionará enviando parámetros a la API, y 
mediante consultas el usuario podrá ver los productos que cumplan con su pedido. <br>

<span style="font-size: 16px;">También tendrá la posibilidad de crearse una cuenta personal en la que posteriormente 
podrá ingresar a su perfil para ver sus datos personales e historial de compras. Se 
implementará un formulario sencillo donde los datos del usuario serán recibidos y 
almacenados en la base de datos. Para ver su información de usuario e historial de 
compras, desde el frontend consultará a la API para recuperar esta información y mostrarla 
en pantalla.<br>

<span style="font-size: 16px;">Si el usuario está decidido a adquirir un producto, va a disponer de un “carrito” donde va a 
ver lo que está por comprar y finalmente generará una orden de compra. El carrito 
almacenará temporalmente los productos deseados por el usuario y si se realiza una 
compra el frontend enviará esta información al backend, el sistema creará el registro del 
pedido en la base de datos y se actualizará el inventario de la tienda. <br>

<span style="font-size: 16px;">El administrador tendrá poder para gestionar productos, pedidos y usuarios. También podrá 
generar reportes si así lo desea. Y tendrá un apartado donde visualizará estadísticas de la 
tienda. Todas las acciones del administrador serán gestionadas por la API, que permitirá 
hacer las operaciones CRUD que involucran al frontend y backend. <br>

## Tecnologías y librerias implementadas
- <span style="font-size: 16px;">**Javascript**, va a ser el lenguaje que se va a utilizar para la realización del proyecto.
- <span style="font-size: 16px;">**Node.js con Express**, será para desarrollar el servidor y la API REST. 
- <span style="font-size: 16px;">**React**, para construir la interfaz de usuario. 
prototipos)
- <span style="font-size: 16px;">**CSS**, para los estilos de la página.
- <span style="font-size: 16px;">**Git/Github**, lo utilizaremos para control de versiones.
- <span style="font-size: 16px;">**ESLint**, para estandarización de código.
- <span style="font-size: 16px;">**Vite**, para levantar el frontend.

## Descripción de la arquitectura y diseño

<span style="font-size: 16px;">La plataforma está desarrollada bajo una arquitectura de tipo **cliente-servidor** dividida en dos grandes módulos: frontend y backend.

- <span style="font-size: 16px;">**Frontend:** Construido con React, se encarga de la interfaz de usuario y la interacción con el usuario final.<br>
- <span style="font-size: 16px;">**Backend:** Desarrollado con Node.js y Express, gestiona la lógica de negocio, la autenticación, el procesamiento de pedidos y la administración de usuarios y productos.<br>

## Consideraciones finales y limitaciones
- <span style="font-size: 16px;">Los prototipos son navegables, pero no funcionales.
- <span style="font-size: 16px;">La lógica del backend no incluye validaciones complejas ya que para este prototipo se utilizan mocks.

## Integrantes del proyecto
- <span style="font-size: 16px;">Bucci, Simón
- <span style="font-size: 16px;">Sisko, Rodrigo
- <span style="font-size: 16px;">Zanconi, Gianluca