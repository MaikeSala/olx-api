import { checkSchema } from 'express-validator';

export const signup = checkSchema({
    name: {
        trim: true,
        notEmpty: true,
        isLength: {
            options: { min: 2}
        },
        errorMessage: 'Nome precisa tem pelo menos 2 caracteres'
    },
    email: {
        isEmail: true,
        normalizeEmail: true,
        errorMessage: 'E-mail inválido'
    },
    password: {
        isLength: {
            options: { min: 2 }
        },
        errorMessage: 'Senha precisa ter pelo menos 2 caracteres'
    },
    /* state: {
        notEmpty: true,
        errorMessage: 'Estado não preenchido'
    } */
});

export const signin = checkSchema({
    email: {
        isEmail: true,
        normalizeEmail: true,
        errorMessage: 'E-mail inválido'
    },
    password: {
        isLength: {
            options: { min: 2 }
        },
        errorMessage: 'Senha precisa ter pelo menos 2 caracteres'
    },
});