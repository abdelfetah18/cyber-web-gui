export default class HttpParser {
    input: Buffer;
    pos: number;


    constructor(input: Buffer) {
        this.input = input;
        this.pos = 0;
    }

    getCurrentAsString(): string {
        return String.fromCharCode(this.input[this.pos])
    }

    getCurrentAsByte(): number {
        return this.input[this.pos];
    }

    matchString(str: string): boolean {
        return str == Buffer.from(this.input.buffer.slice(this.pos, this.pos + str.length)).toString();
    }

    consume(num: number = 1): void {
        this.pos += num;
    }

    isEOF(): boolean {
        return this.pos >= this.input.length;
    }

    skipWhiteSpace(): void {
        while (!this.isEOF() && this.getCurrentAsString() == " ") {
            this.consume();
        }
    }

    isCRLF() {
        return this.matchString("\r\n");
    }

    consumeCRLF() {
        if (this.getCurrentAsString() == "\r") {
            this.consume();
            if (this.getCurrentAsString() == "\n") {
                this.consume();
            }
        }
    }

    isHttpRequest(): boolean {
        return (
            this.matchString("GET") ||
            this.matchString("HEAD") ||
            this.matchString("POST") ||
            this.matchString("PUT") ||
            this.matchString("DELETE") ||
            this.matchString("CONNECT") ||
            this.matchString("OPTIONS") ||
            this.matchString("TRACE") ||
            this.matchString("PATCH")
        );
    }

    parseProtocolVersion(): string {
        if (this.matchString("HTTP/1.1")) {
            this.consume("HTTP/1.1".length);
            return "HTTP/1.1";
        }

        return "";
    }

    isControlCharacter(): boolean {
        const char = this.getCurrentAsString();
        const asciiCode = char.charCodeAt(0);
        return (asciiCode >= 0 && asciiCode <= 31) || asciiCode === 127;  // ASCII control characters range (0x00-0x1F, 0x7F)
    }

    parseFieldName(): string {
        let fieldName = "";
        while (
            !this.isEOF() &&
            !this.isControlCharacter() &&
            this.getCurrentAsString() != " " &&
            this.getCurrentAsString() != ":"
        ) {
            fieldName += this.getCurrentAsString();
            this.consume();
        }
        return fieldName;
    }

    parseFieldValue(): string {
        let fieldValue = "";

        while (!this.isEOF() && !this.isCRLF()) {
            fieldValue += this.getCurrentAsString();
            this.consume();
        }

        return fieldValue;
    }

    parseHeaders(): HttpHeaders {
        const headers: HttpHeaders = {};

        while (!this.isEOF() && !this.isCRLF()) {
            const fieldName = this.parseFieldName();
            this.skipWhiteSpace();
            if (this.matchString(":")) {
                this.consume();
            } else {
                throw new Error("Expect semicolon ':'");
            }
            this.skipWhiteSpace();
            headers[fieldName] = this.parseFieldValue();
            this.consumeCRLF();
        }

        this.consumeCRLF();

        return headers;
    }

    parseChunkSize(): number {
        let size = "";
        while (!this.isEOF() && this.getCurrentAsString().match(/[0-9a-fA-F]/g)) {
            size += this.getCurrentAsString();
            this.consume();
        }
        this.consumeCRLF();
        return parseInt(size, 16);
    }

    parseChunkedBody(): Buffer {
        const chunkSize = this.parseChunkSize();
        const buffer = Buffer.from(this.input.buffer.slice(this.pos, this.pos + chunkSize));
        this.consume(chunkSize);
        this.consumeCRLF();
        return buffer;
    }

    parseHttpRequest(): HttpRequest {
        const httpRequest: HttpRequest = {
            body: Buffer.from(""),
            headers: {},
            method: "GET",
            path: "",
            protocolVersion: "",
            raw: this.input,
        };

        httpRequest.method = this.parseHttpMethod();
        this.skipWhiteSpace();
        httpRequest.path = this.parsePath();
        this.skipWhiteSpace();
        httpRequest.protocolVersion = this.parseProtocolVersion();
        this.consumeCRLF();
        httpRequest.headers = this.parseHeaders();

        const contentLength = httpRequest.headers["Content-Length"] || httpRequest.headers["content-length"];
        const transferEncoding = httpRequest.headers["Transfer-Encoding"] || httpRequest.headers["transfer-encoding"];

        if (transferEncoding == "chunked") {
            while (!this.isEOF() && !this.isCRLF()) {
                httpRequest.body = Buffer.concat([httpRequest.body, this.parseChunkedBody()]);
            }
        } else {
            httpRequest.body = Buffer.from(this.input.buffer.slice(this.pos, this.pos + parseInt(contentLength)));
        }

        this.consumeCRLF();
        return httpRequest;
    }

    parseStatusCode(): number {
        let statusCode = "";

        while (!this.isEOF() && this.getCurrentAsString().match(/[0-9]/g)) {
            statusCode += this.getCurrentAsString();
            this.consume();
        }

        return parseInt(statusCode);
    }

    parseStatusText(): string {
        let statusText = "";

        while (!this.isEOF() && !this.isCRLF()) {
            statusText += this.getCurrentAsString();
            this.consume();
        }

        statusText

        return statusText;
    }

    parseHttpResponse(): HttpResponse {
        const httpResponse: HttpResponse = {
            body: Buffer.from(""),
            headers: {},
            protocolVersion: "",
            statusCode: 0,
            statusText: "",
            raw: this.input,
        };

        httpResponse.protocolVersion = this.parseProtocolVersion();
        this.skipWhiteSpace();
        httpResponse.statusCode = this.parseStatusCode();
        this.skipWhiteSpace();
        httpResponse.statusText = this.parseStatusText();
        this.consumeCRLF();

        httpResponse.headers = this.parseHeaders();
        const contentLength = httpResponse.headers["Content-Length"] || httpResponse.headers["content-length"];
        const transferEncoding = httpResponse.headers["Transfer-Encoding"] || httpResponse.headers["transfer-encoding"];

        if (transferEncoding == "chunked") {
            while (!this.isEOF() && !this.isCRLF()) {
                httpResponse.body = Buffer.concat([httpResponse.body, this.parseChunkedBody()]);
            }
        } else {
            httpResponse.body = Buffer.from(this.input.buffer.slice(this.pos, parseInt(contentLength)));
        }

        this.consumeCRLF();
        return httpResponse;
    }

    parseHttpMethod(): HttpMethod {
        if (this.matchString("GET")) {
            this.consume("GET".length);
            return "GET";
        }

        if (this.matchString("HEAD")) {
            this.consume("HEAD".length);
            return "HEAD";
        }

        if (this.matchString("POST")) {
            this.consume("POST".length);
            return "POST";
        }

        if (this.matchString("PUT")) {
            this.consume("PUT".length);
            return "PUT";
        }

        if (this.matchString("DELETE")) {
            this.consume("DELETE".length);
            return "DELETE";
        }

        if (this.matchString("CONNECT")) {
            this.consume("CONNECT".length);
            return "CONNECT";
        }

        if (this.matchString("OPTIONS")) {
            this.consume("OPTIONS".length);
            return "OPTIONS";
        }

        if (this.matchString("TRACE")) {
            this.consume("TRACE".length);
            return "TRACE";
        }

        if (this.matchString("PATCH")) {
            this.consume("PATCH".length);
            return "PATCH";
        }
    }

    parsePath(): string {
        let path = "";
        while (!this.isEOF() && this.getCurrentAsString() != " ") {
            path += this.getCurrentAsString();
            this.consume();
        }
        return path;
    }

    parse(id: string): HttpMessage {
        const httpMessage: HttpMessage = {
            id,
            host: "",
            request: undefined,
            response: undefined,
        };

        if (this.isHttpRequest()) {
            httpMessage.request = this.parseHttpRequest();
            const host = httpMessage.request.headers["host"] || httpMessage.request.headers["Host"];
            if (host) {
                httpMessage.host = host;
            }
        } else {
            httpMessage.response = this.parseHttpResponse();
            const host = httpMessage.response.headers["host"] || httpMessage.response.headers["Host"];
            if (host) {
                httpMessage.host = host;
            }
        }

        return httpMessage;
    }
}