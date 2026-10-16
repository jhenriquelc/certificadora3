import type { APIError } from 'better-auth/api';

const authErrorMessages: Readonly<Record<string, string>> = {
	INVALID_EMAIL: 'E-mail inválido',
	INVALID_EMAIL_OR_PASSWORD: 'E-mail ou senha incorretos',
	USER_ALREADY_EXISTS: 'Já existe uma conta com este e-mail',
	PASSWORD_TOO_SHORT: 'A senha é muito curta',
	PASSWORD_TOO_LONG: 'A senha é muito longa',
	EMAIL_NOT_VERIFIED: 'Confirme seu e-mail antes de entrar'
};

export function translateAuthError(error: APIError, fallback: string): string {
	const code = error.body?.code;

	return (code && authErrorMessages[code]) || fallback;
}
