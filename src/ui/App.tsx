import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Response from "./components/Response";
import Request from "./components/Request";
import HttpHistoryList from "./components/HttpHistoryList";

export default function App() {
    const [selected, setSelected] = useState<HttpMessage>(undefined);
    const [httpHistory, setHttpHistory] = useState<HttpMessage[]>([]);

    useEffect(() => {
        // @ts-ignore
        window.electron.ipcRenderer.on("http_response", (data) => {
            console.log("http_response", data);
            setHttpHistory(state => {
                const httpMessage: HttpMessage = data;

                if (httpMessage.response != undefined) {
                    const copyState = [...state];
                    const index = copyState.findIndex(value => value.id == httpMessage.id);
                    if (index > 0) {
                        copyState[index].response = httpMessage.response;
                        return copyState;
                    }
                }

                return state;
            });
        });

        // @ts-ignore
        window.electron.ipcRenderer.on("http_request", (data) => {
            console.log("http_request", data);
            setHttpHistory(state => {
                const httpMessage: HttpMessage = data;
                if (httpMessage.request != undefined) {
                    return [...state, httpMessage];
                }

                return state;
            });
        });
    }, []);

    return (
        <div className="w-full h-screen overflow-auto bg-white flex flex-col">
            <Header />
            <div className="w-full flex-grow flex flex-col items-center px-4 overflow-auto">
                <div className="w-full flex-grow flex flex-col border rounded-lg my-4 overflow-auto">
                    <HttpHistoryList useSelected={[selected, setSelected]} httpHistory={httpHistory} />
                    <div className="w-full h-1/2 flex mt-8 border-t overflow-auto">
                        {selected?.request && (<Request httpRequest={selected.request} />)}
                        {selected?.response && (<Response httpResponse={selected.response} />)}
                    </div>
                </div>
            </div>
        </div>
    )
}