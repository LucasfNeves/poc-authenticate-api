export const badRequest = (body) => {
    return {
        statusCode: 400,
        body,
    };
};
export const conflict = (body) => {
    return {
        statusCode: 409,
        body,
    };
};
export const unauthorized = (body) => {
    return {
        statusCode: 401,
        body,
    };
};
export const userNotFound = ({ errorMessage, }) => {
    return {
        statusCode: 404,
        body: { errorMessage },
    };
};
export const notFoundError = ({ errorMessage, }) => {
    return {
        statusCode: 404,
        body: { errorMessage },
    };
};
export const created = (body) => {
    return {
        statusCode: 200,
        body,
    };
};
export const serverError = () => {
    return {
        statusCode: 500,
        body: {
            errorMessage: 'Internal server error',
        },
    };
};
export const ok = (body) => {
    return {
        statusCode: 200,
        body: body,
    };
};
