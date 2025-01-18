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

// Función para mostrar el mensaje de presentación
const showPresentation = (userId, message) => {
    message.reply(
        '¡Hola! Bienvenido/a a *Visongrow*. Por favor, elige una de las siguientes opciones:\n\n' +
        '1️⃣ *Cursos*\n' +
        '2️⃣ *Copy Trading*\n' +
        '3️⃣ *Finanzas Personales*\n' +
        '4️⃣ *Únete a nuestro grupo gratuito de WhatsApp*\n' +
        '5️⃣ *Agenda una reunión con un asesor*\n\n' +
        'Escribe el número de la opción para continuar.'
    );
    userStates[userId] = { step: 'main_menu', messageCount: 1 };
};

// Función para manejar mensajes desconocidos
const handleUnknownMessage = (message, userId) => {
    const userState = userStates[userId];
    if (userState && userState.messageCount >= 2) {
        message.reply(
            'Lo siento, no entendí tu mensaje. Por favor, selecciona una opción válida escribiendo el número correspondiente o escribe "volver" para regresar al menú principal.'
        );
    }
};

// Función para manejar el mensaje "volver"
const handleBackMessage = (message, userId) => {
    const userState = userStates[userId];
    if (userState && userState.messageCount >= 2) {
        showPresentation(userId, message);
    }
};

// Responder mensajes
client.on('message', (message) => {
    const userId = message.from;
    const userState = userStates[userId];

    // Si el usuario es nuevo, mostrar presentación
    if (!userState) {
        showPresentation(userId, message);
        return;
    }

    // Si el usuario ya ha enviado 2 o más mensajes, contar los mensajes
    userState.messageCount = userState.messageCount + 1 || 1;

    // Si el usuario escribe "volver", regresarlo al menú principal
    if (message.body.toLowerCase() === 'volver') {
        handleBackMessage(message, userId);
        return;
    }

    // Manejo de opciones del menú principal
    if (userState.step === 'main_menu') {
        switch (message.body) {
            case '1': // Cursos
                userStates[userId] = { step: 'cursos_menu', messageCount: 1 };
                message.reply(
                    '📚 *Cursos Personalizados* 📚\n\nSelecciona el nivel que deseas explorar:\n' +
                    '1️⃣ Básico\n' +
                    '2️⃣ Avanzado\n' +
                    '3️⃣ Profesional\n\n' +
                    'Escribe el número de la opción o "volver" para regresar al menú principal.'
                );
                break;
            case '2': // Copy Trading
                userStates[userId] = { step: 'copytrading_menu', messageCount: 1 };
                message.reply(
                    '🔹 *Copy Trading* 🔹\n\nEl Copy Trading permite replicar operaciones de traders experimentados.\n\n' +
                    '⭐ *Beneficios*:\n- Aprendizaje práctico\n- Diversificación de estrategias\n- Accesibilidad para principiantes\n\n' +
                    '💳 *Inscríbete ya*: https://mpago.li/1AF9dAF\n\n' +
                    'Escribe "volver" para regresar al menú principal.'
                );
                break;
            case '3': // Finanzas Personales
                userStates[userId] = { step: 'finanzas_menu', messageCount: 1 };
                message.reply(
                    '💡 *Finanzas Personales* 💡\n\nAprende a gestionar tus ingresos y planificar tus objetivos financieros con nuestros expertos.\n\n' +
                    'Escribe "volver" para regresar al menú principal.'
                );
                break;
            case '4': // Grupo de WhatsApp
                userStates[userId] = { step: 'grupo_menu', messageCount: 1 };
                message.reply(
                    '🔗 *Únete a nuestro grupo gratuito de trading en WhatsApp* 🔗\n\nHaz clic aquí para unirte: https://chat.whatsapp.com/Kh4K80jMMZi06AkXImWNpU\n\n' +
                    'Escribe "volver" para regresar al menú principal.'
                );
                break;
            case '5': // Agendar reunión con un asesor
                userStates[userId] = { step: 'agenda_menu', messageCount: 1 };
                message.reply(
                    '📅 *Agendar una reunión con un asesor* 📅\n\n' +
                    'Reserva tu sesión aquí: https://calendly.com/tuasesor\n\n' +
                    'Escribe "volver" para regresar al menú principal.'
                );
                break;
            default:
                handleUnknownMessage(message, userId);
        }
    } 
    // Manejo del submenú de cursos
    else if (userState.step === 'cursos_menu') {
        switch (message.body) {
            case '1': // Curso Básico
                message.reply(
                    '💳 *Enlace para pago del Curso Básico*: https://mpago.li/2tvbtgR\n\n' +
                    '🤝 ¡Gracias por confiar en nosotros! Nuestro equipo te asignará un asesor personalizado.\n\nEscribe "volver" para regresar al menú principal.'
                );
                break;
            case '2': // Curso Avanzado
                message.reply(
                    '💳 *Enlace para pago del Curso Avanzado*: https://mpago.li/21BAA49\n\n' +
                    '🤝 ¡Gracias por confiar en nosotros! Nuestro equipo te asignará un asesor personalizado.\n\nEscribe "volver" para regresar al menú principal.'
                );
                break;
            case '3': // Curso Profesional
                message.reply(
                    '💳 *Enlace para pago del Curso Profesional*: https://mpago.li/2YEAbNn\n\n' +
                    '🤝 ¡Gracias por confiar en nosotros! Nuestro equipo te asignará un asesor personalizado.\n\nEscribe "volver" para regresar al menú principal.'
                );
                break;
            default:
                handleUnknownMessage(message, userId);
        }
    } 
    // Si el estado del usuario no coincide con ninguna categoría, mostrar mensaje desconocido
    else {
        handleUnknownMessage(message, userId);
    }
});

// Iniciar cliente
client.initialize();
