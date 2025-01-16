const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Inicializar cliente con autenticación local
const client = new Client({
    authStrategy: new LocalAuth()
});

// Generar QR para iniciar sesión
client.on('qr', (qr) => {
    console.log('Escanea este código QR con tu teléfono:');
    qrcode.generate(qr, { small: true });
});

// Confirmar conexión
client.on('ready', () => {
    console.log('El bot está listo y conectado a WhatsApp.');
});

// Manejo de estados del usuario
const userStates = {};

// Función para mostrar el menú principal
const showMainMenu = (userId, message) => {
    userStates[userId] = 'main_menu';
    message.reply(
        `¡Hola! Bienvenido/a a *Visongrow*. Por favor, elige una de las siguientes opciones:\n\n` +
        `1️⃣ *Cursos*\n` +
        `2️⃣ *Copy Trading*\n` +
        `3️⃣ *Finanzas Personales*\n` +
        `4️⃣ *Únete a nuestro grupo gratuito de WhatsApp*\n` +
        `5️⃣ *Agenda una reunión con un asesor*\n\n` +
        `Escribe el número de la opción para continuar.`
    );
};

// Función para manejar mensajes desconocidos
const handleUnknownMessage = (message) => {
    message.reply(
        `Lo siento, no entendí tu mensaje. Por favor selecciona una opción válida escribiendo el número correspondiente o escribe 'volver' para regresar al menú principal.`
    );
};

// Responder mensajes
client.on('message', (message) => {
    const userId = message.from;
    const userState = userStates[userId];

    // Si el usuario escribe 'volver', lo redirigimos al menú principal
    if (message.body.toLowerCase() === 'volver') {
        showMainMenu(userId, message);
        return;
    }

    // Si el usuario no tiene estado, es su primera interacción, mostramos el menú principal
    if (!userState) {
        showMainMenu(userId, message);
        return;
    }

    // Si el usuario ya está interactuando, seguimos con la lógica normal
    if (userState === 'main_menu') {
        switch (message.body) {
            case '1': // Cursos
                userStates[userId] = 'cursos_menu';
                message.reply(
                    `📚 *Cursos Personalizados* 📚\n\nSelecciona el nivel que deseas explorar:\n` +
                    `1️⃣ Básico\n` +
                    `2️⃣ Intermedio\n` +
                    `3️⃣ Avanzado\n` +
                    `4️⃣ Profesional\n\n` +
                    `Escribe el número de la opción o "volver" para regresar al menú principal.`
                );
                break;
            case '2': // Copy Trading
                userStates[userId] = 'copytrading_menu';
                message.reply(
                    `🔹 *Copy Trading* 🔹\n\nEl Copy Trading permite replicar operaciones de traders experimentados.\n\n` +
                    `⭐ *Beneficios*:\n- Aprendizaje práctico\n- Diversificación de estrategias\n- Accesibilidad para principiantes\n\n` +
                    `💳 *Inscríbete ya*: [https://pago-plataforma.com](https://pago-plataforma.com)\n\n` +
                    `Escribe "volver" para regresar al menú principal.`
                );
                break;
            case '3': // Finanzas Personales
                userStates[userId] = 'finanzas_menu';
                message.reply(
                    `💡 *Finanzas Personales* 💡\n\nAprende a gestionar tus ingresos y planificar tus objetivos financieros con nuestros expertos.\n\n` +
                    `Escribe "volver" para regresar al menú principal.`
                );
                break;
            case '4': // Grupo de WhatsApp
                userStates[userId] = 'grupo_menu';
                message.reply(
                    `🔗 *Únete a nuestro grupo gratuito de trading en WhatsApp* 🔗\n\nHaz clic aquí para unirte: [https://wa.me/grupo_ejemplo](https://wa.me/grupo_ejemplo)\n\n` +
                    `Escribe "volver" para regresar al menú principal.`
                );
                break;
            case '5': // Agendar reunión
                userStates[userId] = 'agendar_menu';
                message.reply(
                    `📅 *Agenda una reunión con un asesor* 📅\n\nReserva tu espacio: [https://calendly.com/asesoramiento](https://calendly.com/asesoramiento)\n\n` +
                    `Escribe "volver" para regresar al menú principal.`
                );
                break;
            default:
                handleUnknownMessage(message);
        }
    } else if (userState === 'cursos_menu') {
        if (['1', '2', '3', '4'].includes(message.body)) {
            message.reply(
                `💳 *Enlace para pago del curso seleccionado*: [https://pago-plataforma.com](https://pago-plataforma.com)\n\n` +
                `🤝 ¡Gracias por confiar en nosotros! Nuestro equipo te asignará un asesor personalizado.\n\nEscribe "volver" para regresar al menú principal.`
            );
        } else {
            handleUnknownMessage(message);
        }
    } else {
        handleUnknownMessage(message);
    }
});

// Iniciar cliente
client.initialize();
