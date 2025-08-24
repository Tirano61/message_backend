export class JsonToTextTransformer {
	/**
	 * Genera el texto que enviarás a OpenAI para crear embeddings.
	 * Combina campos relevantes en un texto legible y compacto.
	 */
	static toEmbeddingText(json: Record<string, any>): string {
		const parts: string[] = [];

		if (json.title) parts.push(`Title: ${json.title}. `);
		if (json.productId) parts.push(`Product ID: ${json.productId}. `);
		if (json.materialType) parts.push(`Type: ${json.materialType}. `);
		if (json.description) parts.push(`Description: ${json.description}. `);
		if (Array.isArray(json.tags) && json.tags.length) parts.push(`Tags: ${json.tags.join(', ')}. `);

		// Evitar incluir URLs largas en el texto de embeddings, pero opcionalmente se puede añadir
		if (json.fileUrl) parts.push(`File: ${json.fileUrl}. `);
		if (json.thumbnailUrl) parts.push(`Thumbnail: ${json.thumbnailUrl}. `);

		// Añadir cualquier campo adicional corto que no sea objeto complejo
		for (const [k, v] of Object.entries(json)) {
			if (['title', 'productId', 'materialType', 'description', 'tags', 'fileUrl', 'thumbnailUrl'].includes(k)) continue;
			if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
				parts.push(`${k}: ${v}.`);
			}
		}

		// Unir con doble salto para dar contexto a OpenAI
		return parts.join('\n\n').trim();
	}

	/**
	 * Crea el metadata que se guardará en la columna jsonb.
	 * Devuelve un objeto (no string) listo para persistir.
	 */
	static createMetadata(json: Record<string, any>): Record<string, any> {
		const metadata: Record<string, any> = {
			productId: json.productId ?? null,
			materialType: json.materialType ?? null,
			title: json.title ?? null,
			description: json.description ?? null,
			fileUrl: json.fileUrl ?? null,
			thumbnailUrl: json.thumbnailUrl ?? null,
			tags: Array.isArray(json.tags) ? json.tags : [],
			createdAt: new Date().toISOString(),
			source: 'api', // opcional, ajusta según tu flujo
		};

		// Copiar campos adicionales que no sean null/undefined y no sean ya incluidos
		for (const [k, v] of Object.entries(json)) {
			if (metadata[k] !== undefined) continue;
			if (v !== undefined) metadata[k] = v;
		}

		return metadata;
	}
}