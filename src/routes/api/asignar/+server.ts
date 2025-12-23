import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

export async function POST({ request, platform }) {
	const { token } = await request.json();
	const DB = platform?.env.sorteo_db;

	// 1. Intentar recuperar registro si el token existe
	if (token) {
		const registro = await DB.prepare(
			"SELECT de_numero, para_numero FROM regalos WHERE asignado_a = ?"
		).bind(token).first();

		if (registro) return json(registro);
	}

	// 2. Si no hay token o no es válido, asignar uno nuevo
	const nuevoToken = uuidv4();

	// Buscamos una fila libre y la actualizamos en una sola transacción/paso
	// Usamos LIMIT 1 para tomar solo el primer cupo disponible
	const regaloLibre = await DB.prepare(
		"SELECT id FROM regalos WHERE asignado_a IS NULL LIMIT 1"
	).first();

	if (!regaloLibre) {
		return json({ error: "¡Vaya! Ya no quedan números disponibles." }, { status: 400 });
	}

	await DB.prepare(
		"UPDATE regalos SET asignado_a = ? WHERE id = ?"
	).bind(nuevoToken, regaloLibre.id).run();

	// Obtener los datos finales para el usuario
	const asignado = await DB.prepare(
		"SELECT de_numero, para_numero FROM regalos WHERE id = ?"
	).bind(regaloLibre.id).first();

	return json({ ...asignado, nuevoToken });
}