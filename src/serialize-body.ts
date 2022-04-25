import { TrebleFetch } from './interfaces';

const serializeBody = (body: BodyInit | null | undefined, bodyType?: TrebleFetch.BodyType) => {
    try {
        if (bodyType === 'json') {
            return JSON.stringify(body);
        }
        else if (bodyType === 'text') {
            return body?.toString();
        }
        else if (bodyType === 'urlSearchParams') {
            if (body instanceof FormData) {
                const data = new URLSearchParams();
                for (const pair of body as any) {
                    data.append(pair[0], pair[1]);
                }
                return data.toString();
            }
            else if (body instanceof URLSearchParams) {
                return body?.toString();
            }
            else {
                const qs = new URLSearchParams(body as any);
                return qs?.toString();
            }
        }
        else {
            return body;
        }

    } catch (error) {
        console.error(`Treble Fetch: ${error}`);
        return body;
    }
};

export default serializeBody;