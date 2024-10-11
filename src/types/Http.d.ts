
type HttpMethod = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";

type HttpHeaders = {
    [key in string]: string;
};

interface HttpRequest {
    method: HttpMethod;
    path: string;
    protocolVersion: string;
    body: Buffer;
    headers: HttpHeaders;
    raw: Buffer;
};

interface HttpResponse {
    statusCode: number;
    statusText: string;
    protocolVersion: string;
    headers: HttpHeaders;
    body: Buffer;
    raw: Buffer;
};

type HttpMessageTab = "raw" | "headers" | "body";
type HttpMessageProperty = "#" | "Host" | "Method" | "Path" | "Status" | "Content Type";

interface HttpMessage {
    id: string;
    request: HttpRequest;
    response: HttpResponse;
    host: string;
};