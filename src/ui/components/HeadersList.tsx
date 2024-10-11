import React from "react";

interface HeadersListProps {
    headers: HttpHeaders;
};

export default function HeadersList({ headers }: HeadersListProps) {
    return (
        <div className="w-full">
            {
                Object.getOwnPropertyNames(headers).map((headerName, index) => {
                    return (
                        <div key={index} className="w-full flex items-center border border-b-0">
                            <div className="w-1/3 px-4 py-2 border-r h-full">{headerName}</div>
                            <div className="w-2/3 px-4 py-2 h-full">{headers[headerName]}</div>
                        </div>
                    )
                })
            }
        </div>
    )
}