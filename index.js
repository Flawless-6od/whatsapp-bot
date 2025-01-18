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
    userStates[userId] = {
        state: 'main_menu',
        messageCount: (userStates[userId]?.messageCount || 0) + 1,
    };
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
const handleUnknownMessage = (userId, message) => {
    if (userStates[userId]?.messageCount >= 2) {
        message.reply(
            `Lo siento, no entendí tu mensaje. Por favor, selecciona una opción válida escribiendo el número correspondiente o escribe 'volver' para regresar al menú principal.`
        );
    }
};

// Responder mensajes
client.on('message', (message) => {
    const userId = message.from;
    const userState = userStates[userId]?.state;

    // Incrementar el contador de mensajes
    if (!userStates[userId]) {
        userStates[userId] = { state: null, messageCount: 0 };
    }
    userStates[userId].messageCount++;

    // Si el usuario escribe "volver", regresarlo al menú principal
    if (message.body.toLowerCase() === 'volver') {
        if (userStates[userId].messageCount >= 2) {
            showMainMenu(userId, message);
        }
        return;
    }

    // Si el usuario es nuevo y no tiene un estado previo, mostrar el menú principal
    if (!userState) {
        showMainMenu(userId, message);
        return;
    }

    // Manejo de opciones del menú principal
    if (userState === 'main_menu') {
        switch (message.body) {
            case '1': // Cursos
                userStates[userId].state = 'cursos_menu';
                message.reply(
                    `📚 *Cursos Personalizados* 📚\n\nSelecciona el nivel que deseas explorar:\n` +
                    `1️⃣ Básico\n` +
                    `2️⃣ Avanzado\n` +
                    `3️⃣ Profesional\n\n` +
                    `Escribe el número de la opción o "volver" para regresar al menú principal.`
                );
                break;
            case '2': // Copy Trading
                userStates[userId].state = 'copytrading_menu';
                message.reply(
                    `🔹 *Copy Trading* 🔹\n\nEl Copy Trading permite replicar operaciones de traders experimentados.\n\n` +
                    `⭐ *Beneficios*:\n- Aprendizaje práctico\n- Diversificación de estrategias\n- Accesibilidad para principiantes\n\n` +
                    `💳 *Inscríbete ya*: https://mpago.li/1AF9dAF\n\n` +
                    `Escribe "volver" para regresar al menú principal.`
                );
                break;
            case '3': // Finanzas Personales
                userStates[userId].state = 'finanzas_menu';
                message.reply(
                    `💡 *Finanzas Personales* 💡\n\nAprende a gestionar tus ingresos y planificar tus objetivos financieros con nuestros expertos.\n\n` +
                    `Escribe "volver" para regresar al menú principal.`
                );
                break;
            case '4': // Grupo de WhatsApp
                userStates[userId].state = 'grupo_menu';
                message.reply(
                    `🔗 *Únete a nuestro grupo gratuito de trading en WhatsApp* 🔗\n\nHaz clic aquí para unirte: https://chat.whatsapp.com/Kh4K80jMMZi06AkXImWNpU\n\n` +
                    `Escribe "volver" para regresar al menú principal.`
                );
                break;
            case '5': // Agendar reunión con un asesor
                userStates[userId].state = 'agenda_menu';
                message.reply(
                    `📅 *Agendar una reunión con un asesor* 📅\n\n` +
                    `Reserva tu sesión aquí: https://calendly.com/tuasesor\n\n` +
                    `Escribe "volver" para regresar al menú principal.`
                );
                break;
            default:
                handleUnknownMessage(userId, message);
        }
    } else {
        // Manejar otros estados si aplica
        handleUnknownMessage(userId, message);
    }
});

// Iniciar cliente
client.initialize();
