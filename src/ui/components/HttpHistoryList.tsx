import React = require("react");
import { httpMessageProperties } from "../../utils/consts";

interface HttpHistoryListProps {
    httpHistory: HttpMessage[];
    useSelected: [HttpMessage, React.Dispatch<React.SetStateAction<HttpMessage>>];
};

export default function HttpHistoryList({ httpHistory, useSelected }: HttpHistoryListProps) {
    const [selected, setSelected] = useSelected;

    return (
        <div className="relative overflow-x-auto sm:rounded-lg w-full overflow-auto h-1/2">
            <div className="w-full text-xs text-left rtl:text-right text-gray-500 overflow-auto">
                <div className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                    <div className="w-full flex items-center">
                        {
                            httpMessageProperties.map((proprty, index) => {
                                return (
                                    <div key={index} className="flex-1 px-6 py-3">
                                        {proprty}
                                    </div >
                                )
                            })
                        }
                    </div>
                </div>
                <div className="w-full overflow-auto">
                    {
                        httpHistory.map((item: HttpMessage, index: number) => {
                            const isSelected = selected?.id == item.id;

                            return (
                                <div key={index} onClick={() => setSelected(item)} className={`w-full flex items-center border-b cursor-pointer hover:bg-gray-100 duration-300 active:scale-105 select-none ${isSelected ? "bg-gray-100" : "bg-white "}`}>
                                    <div className="flex-1 overflow-hidden text-ellipsis px-6 py-2 font-medium text-gray-900 whitespace-nowrap" title={item.id}>
                                        {/* {index + 1} */}
                                        {item.id}
                                    </div>
                                    <div className="flex-1 overflow-hidden text-ellipsis px-6 py-2" title={item.host}>
                                        {item.host}
                                    </div>
                                    <div className="flex-1 overflow-hidden text-ellipsis px-6 py-2" title={item.request.method}>
                                        {item.request.method}
                                    </div>
                                    <div className="flex-1 overflow-hidden text-ellipsis px-6 py-2" title={item.request.path}>
                                        {item.request.path}
                                    </div>
                                    <div className="flex-1 overflow-hidden text-ellipsis px-6 py-2" title={item.response ? item.response.statusCode.toString() : "loading..."}>
                                        {item.response ? item.response.statusCode : "loading..."}
                                    </div>
                                    <div className="flex-1 overflow-hidden text-ellipsis px-6 py-2" title={item.response ? item.response.headers["content-type"] : "loading..."}>
                                        {item.response ? item.response.headers["content-type"] : "loading..."}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
