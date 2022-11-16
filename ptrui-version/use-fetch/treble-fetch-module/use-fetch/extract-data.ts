import { TrebleFetch } from "../interfaces";
const extractData = async (res: Response, responseType?: TrebleFetch.ResponseType) => {
    const fallbackRes = res.clone();
    try {
        if (responseType) {

            if (responseType === 'json') {
                try {
                    const parsedRes = await res.json();
                    return parsedRes;
                } catch (error) {
                    console.error(`Treble Fetch: ${error}`);
                    return fallbackRes;
                };
            }
            else if (responseType === 'text') {
                try {
                    const parsedRes = await res.text();
                    return parsedRes;
                } catch (error) {
                    console.error(`Treble Fetch: ${error}`);
                    return fallbackRes;
                };
            }
            else if (responseType === 'formData') {
                try {
                    const parsedRes = await res.formData();
                    return parsedRes;
                } catch (error) {
                    console.error(`Treble Fetch: ${error}`);
                    return fallbackRes;
                };
            }
            else if (responseType === 'blob') {
                try {
                    const parsedRes = await res.blob();
                    return parsedRes;
                } catch (error) {
                    console.error(`Treble Fetch: ${error}`);
                    return fallbackRes;
                };
            }
            else if (responseType === 'arrayBuffer') {
                try {
                    const parsedRes = await res.arrayBuffer();
                    return parsedRes;
                } catch (error) {
                    console.error(`Treble Fetch: ${error}`);
                    return fallbackRes;
                };
            }
            else if (responseType === 'raw') {

                return fallbackRes;
            }
        } else {
            const contentType = res.headers.get('content-type') || res.headers.get('Content-Type');

            if (contentType?.startsWith('application/json')) {
                return res.json();
            }
            else if (contentType?.startsWith('text/')) {
                return res.text();
            }
            else if (contentType?.startsWith('multipart/form-data')) {
                return res.formData();
            }
            else if (contentType?.startsWith('application/x-www-form-urlencoded')) {
                return res.formData();
            }
            else {
                return fallbackRes;
            }

        }

    } catch (error) {
        console.error(`Treble Fetch: ${error}`);
        return fallbackRes;
    }

}

export default extractData;