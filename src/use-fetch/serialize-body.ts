
const serializeBody = (body: BodyInit | null | undefined, disableBodySerialize?: boolean) => {
    try {
        if (disableBodySerialize) {
            return body;
        } else {
            if (body instanceof FormData) {
                const data = new URLSearchParams();
                for (const pair of body as any) {
                    data.append(pair[0], pair[1]);
                }
                return data;
            }

            else if (body instanceof Blob || body instanceof File) {
                return body;
            }

            else if (typeof body === 'object') {
                return JSON.stringify(body);
            }

            else {
                return body;
            }
        }

    } catch (error) {
        console.error(`Treble Fetch: ${error}`);
        return body;
    }
};

export default serializeBody;