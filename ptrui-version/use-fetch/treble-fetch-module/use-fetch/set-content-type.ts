/**Explicitly sets content-type based on bodyType and then sets in headers */

import { TrebleFetch } from "../interfaces";

const setContentType = (headers?: TrebleFetch.Headers, bodyType?: TrebleFetch.BodyType) => {

    if (headers) {
        //below adds the content-type to headers
        if (bodyType === 'json' || bodyType === undefined) {
            return { ...headers, "content-type": "application/json" }
        }
        else if (bodyType === 'text') {
            return { ...headers, "content-type": "text/plain" }
        }
        else if (bodyType === 'formData') {
            return { ...headers, "content-type": "multipart/form-data" }
        }
        else if (bodyType === 'urlSearchParams') {
            return { ...headers, "content-type": "application/x-www-form-urlencoded" }
        }
        else if (bodyType === 'raw') {
            return headers;
        }
        else {
            return headers;
        }
    } else {
        return headers;
    }
};

export default setContentType;