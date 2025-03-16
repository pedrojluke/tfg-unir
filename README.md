# 📌 Desarrollo de aplicación para distribución de costaleros usando algoritmos de optimización.

![React Native](https://img.shields.io/badge/React%20Native-0.72-blue.svg)
![Firebase](https://img.shields.io/badge/Firebase-Backend-orange.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

> Este Trabajo Fin de Grado busca optimizar la asignación de costaleros en los pasos de Semana Santa mediante programación lineal y optimización matemática, reduciendo la ineficiencia del método tradicional basado en la experiencia del capataz. El objetivo es minimizar la diferencia de altura entre los costaleros y las trabajaderas, reduciendo el uso de suplementos y mejorando la movilidad dentro del paso. Tras evaluar varios algoritmos, se ha seleccionado Kuhn-Munkres como la mejor solución. La propuesta final es una aplicación multiplataforma en React Native, integrada con Firebase, que permite al capataz gestionar ensayos, pasos y costaleros de manera eficiente, agilizando la reorganización ante imprevistos.

## 🚀 Características

✅ Creación de pasos de Semana Santa\
✅ Mantenimiento de costaleros\
✅ Creación de ensayos\
✅ Asignación de los costaleros a sus respectivas trabajaderas

## 📂 Estructura del Proyecto

```
📦 tfg-unir
├── 📂 src                  # Código fuente
│   ├── 📂 service          # Servicios
│   ├── 📂 asignacion       # Módulo de asignación de costaleros
│   ├── 📂 costalero        # Registro de Costaleros
│   ├── 📂 costaleroDetail  # Detalle de Costalero
│   ├── 📂 ensayo           # Gestión de ensayos
│   ├── 📂 ensayoMenu       # Menú de ensayos
│   ├── 📂 main             # Módulo principal de la aplicación
│   ├── 📂 paso             # Registro de Paso
│   ├── 📂 pasoDetailMenu   # Detalle del paso
│   ├── 📂 utils            # Constantes y otros
├── 📜 .env                 # API keys de Firebase
├── 📜 App.js               # Main del proyecto
├── 📜 README.md            # Documentación principal
└── 📜 package.json         # Configuración del proyecto
```

## 🛠️ Instalación

```bash
# Clonar el repositorio
$ git clone https://github.com/pedrojluke/tfg-unir.git

# Entrar en la carpeta del proyecto
$ cd tfg-unir

# Instalar dependencias
$ npm install

# Crear una nueva aplicación en firebase

# Añadir archivo .env en la raíz del proyecto con los datos
# creados en el paso anterior (ejemplo env.example en el repositorio)
```

## 🚀 Uso

```bash
# Ejecutar el proyecto
$ npm start
```

## 📜 Licencia

Este proyecto está bajo la licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autor

- **Pedro José Luque Ordóñez** - [GitHub](https://github.com/pedrojluke)
