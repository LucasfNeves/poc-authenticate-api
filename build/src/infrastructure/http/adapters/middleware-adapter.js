var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function middlewareAdapter(middleware) {
    return (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield middleware.handle({
            headers: request.headers,
        });
        if ('statusCode' in result) {
            return response.status(result.statusCode).json(result.body);
        }
        if ('data' in result) {
            request.metadata = Object.assign(Object.assign({}, request.metadata), result.data);
        }
        next();
    });
}
